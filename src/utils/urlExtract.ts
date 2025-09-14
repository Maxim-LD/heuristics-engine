import { JSDOM } from 'jsdom'

/** Helper: extract URLs (from text and HTML) */
export const extractUrlsFromText = (text: string): string[] => {
    if (!text) return []

    // crude URL regex (good for demo). You may replace with a more robust extractor.
    const urlRegex = /https?:\/\/[^\s"'<>]+|www\.[^\s"'<>]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s"'<>\)]*)?/ig;
    const matches = text.match(urlRegex) || [];

    // normalize simple www/host matches to include scheme
    const normalized = matches.map(u => {
        if (/^www\./i.test(u)) return "https://" + u;
        if (!/^https?:\/\//i.test(u)) return "https://" + u;
        return u;
    });

    return Array.from(new Set(normalized));
}

/** Helper: extract URLs from HTML using DOM */
export const extractUrlsFromHtml = (html?: string): string[] => {
    if (!html) return [];
    const dom = new JSDOM(html);
    const anchors = Array.from(dom.window.document.querySelectorAll("a"));
    const urls = anchors.map(a => a.getAttribute("href")).filter(Boolean) as string[];
    return extractUrlsFromText(urls.join(" "));
}
