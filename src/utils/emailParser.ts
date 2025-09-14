import fs from 'fs';
import { JSDOM } from 'jsdom'
import { Attachment, ParsedMail, simpleParser } from 'mailparser'
import { extractUrlsFromHtml, extractUrlsFromText } from './urlExtract';

/** Read .eml file and parse to analyzer JSON */
export const parseEmlToJson = async (emlPath: string) => {
    const raw = fs.readFileSync(emlPath)
    const parsed: ParsedMail = await simpleParser(raw)

     // Basic headers
    const subject = parsed.subject || "";
    const from = parsed.from?.value?.[0]?.address 
        ?? parsed.from?.text 
        ?? "";
    const replyTo = parsed.replyTo?.value?.[0]?.address
        ?? (parsed.headers.get("reply-to") as string | undefined)
        ?? "";

    // Body: prefer text, fallback to stripped HTML
    const bodyText = parsed.text || (parsed.html ? (new JSDOM(parsed.html).window.document.body.textContent || "") : "");
    const urls = [
        ...extractUrlsFromHtml(parsed.html || ""),
        ...extractUrlsFromText(bodyText),
    ].filter(Boolean);

    // Attachments: list filename + contentType; optionally save to temp dir
    const attachments = (parsed.attachments || [])
        .map((att: Attachment) => att.filename)   // could be string | undefined
        .filter((name): name is string => Boolean(name)); // narrow to string[]
        
        // You can save buffer to disk if needed:
        // const savePath = path.join("tmp", att.filename || `att-${Date.now()}`);
        // fs.writeFileSync(savePath, att.content);    ;

    // Auth checks: read Authentication-Results header if present
    // Example header: Authentication-Results: mx.google.com; spf=pass smtp.mailfrom=example.com; dkim=pass ...
    const authHeader = parsed.headers.get("authentication-results") || parsed.headers.get("Authentication-Results") || "";
    // simple rule: if header exists and contains 'fail' or 'permerror' then authFailed=true
    const authFailed = /fail|permerror/i.test(String(authHeader));

    const json = {
        subject,
        body: bodyText,
        from,
        replyTo,
        attachments: attachments,
        urls,
        authFailed
    };

    return json;
}