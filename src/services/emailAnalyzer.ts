import { rulesData } from "../config/rules";
import { EmailInput, Rules } from "../types/rules";
import { applyRule } from "../utils/applyRule";
import { AppError } from "../utils/errors";
import { analyzeUrl } from "./urlAnalyzer";

const rules: Rules = {
    ...rulesData,
    classification: {
        benign: rulesData.classification.benign as [number, number],
        suspicious: rulesData.classification.suspicious as [number, number],
        phishing: rulesData.classification.phishing as [number, number],
    }
}

export const analyzeEmail = (email: EmailInput) => {
    if (!email.subject && !email.body) {
        throw new AppError("Email must have subject or body", 400, "INVALID_EMAIL");
    }

    let score = { value: 0 };
    let reasons: string[] = [];
    let criticalHit = { value: false };

    try {
        // 1. Content checks
        applyRule(/urgent|verify now|account locked|password reset/i.test(email.subject + email.body), rules.email.urgency, reasons, criticalHit, score);
        applyRule(/plese|acount|pasword/i.test(email.body), rules.email.bad_grammar, reasons, criticalHit, score);

        // 2. Header checks
        applyRule(!!(email.from && email.replyTo && email.from !== email.replyTo), rules.email.replyto_mismatch, reasons, criticalHit, score);
        applyRule(email.authFailed === true, rules.email.auth_fail, reasons, criticalHit, score);

        // 3. Attachment checks
        if (email.attachments) {
            email.attachments.forEach(file => {
                applyRule(/\.(exe|js|scr|hta)$/i.test(file), rules.email.attachment_exe, reasons, criticalHit, score);
                applyRule(/\.(docm|xlsm)$/i.test(file), rules.email.attachment_macro, reasons, criticalHit, score);
                applyRule(/\.(zip|rar)$/i.test(file), rules.email.attachment_archive, reasons, criticalHit, score);
            });
        }

        // 4. Embedded URLs (reuse URL analyzer)
        if (email.urls) {
            email.urls.forEach(url => {
            const result = analyzeUrl(url);
                score.value += Math.floor(result.riskScore / 2); // weighted merge
                reasons.push(...result.reasons.map(r => `[URL] ${r}`));
            });
        }
        
                
        const finalScore = Math.min(score.value, 100);

        // Verdict
        let verdict = "Unknown";

        if (criticalHit.value) {
            verdict = "Phishing"; // override
            
        } else {
            for (const [label, [min, max]] of Object.entries(rules.classification)) {
                if (finalScore >= min && finalScore <= max) {
                    verdict = label.charAt(0).toUpperCase() + label.slice(1);
                    break;
                }
            }
        }

        // Return the analysis result
        return {
            subject: email.subject,
            from: email.from,
            urls: email.urls,
            riskScore: finalScore,
            reasons,
            verdict,
        };

    } catch (error) {
        throw new AppError("Failed to analyze email", 500, "EMAIL_ANALYSIS_ERROR")
    }
}