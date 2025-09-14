// Heuristics analysis service
import { URL } from "url";
import * as tldts from 'tldts'
import { rulesData } from '../config/rules'
import { AppError } from "../utils/errors";
import { HeuristicResult } from "../types";
import { Rules } from "../types/rules";
import { applyRule, normalizeUrl } from "../utils/applyRule";

const rules: Rules = {
    ...rulesData,
    classification: {
        benign: rulesData.classification.benign as [number, number],
        suspicious: rulesData.classification.suspicious as [number, number],
        phishing: rulesData.classification.phishing as [number, number],
    }
}

/**
 * Analyzes a URL and returns a risk score, reasons, and verdict
 * Throws AppError for invalid input or URL format
 * @param input - The URL string to analyze
 * @returns HeuristicResult
 */
export const analyzeUrl = (input: string): HeuristicResult => {
    // Validate input
    if (!input || typeof input !== "string") {
        throw new AppError("Input must be a non-empty string", 400, "INVALID_INPUT");
    }

    // Use an object to allow score mutation by reference
    let score = { value: 0 };
    let reasons: string[] = [];
    let criticalHit = { value: false };
    
    // Normalize the input to ensure it parses
    const normalized = normalizeUrl(input);

    try {
        const parsed = new URL(normalized);
        const domain = tldts.getDomain(normalized);
        const subdomain = tldts.getSubdomain(normalized);

        // Rules 
        applyRule(parsed.protocol !== "https:", rules.url.http_instead_https, reasons, criticalHit, score);
        applyRule(!!(subdomain && /(login|secure|account|verify)/i.test(subdomain)), rules.url.suspicious_subdomain, reasons, criticalHit, score);
        applyRule(!!(domain && /\d/.test(domain)), rules.url.lookalike_domain, reasons, criticalHit, score);
        applyRule(/(password|bank|signin)/i.test(parsed.pathname), rules.url.path_keywords, reasons, criticalHit, score);
        applyRule(!!(domain && domain.length > 25), rules.url.long_domain, reasons, criticalHit, score);
        applyRule(!!(subdomain && subdomain.split(".").length > 2), rules.url.too_many_subdomains, reasons, criticalHit, score);
        applyRule(!!(domain && [".ru", ".cn", ".tk", ".xyz", ".top"].some(tld => domain.endsWith(tld))), rules.url.suspicious_tld, reasons, criticalHit, score);
        applyRule(input.length > 75, rules.url.long_url, reasons, criticalHit, score);
        applyRule(input.includes("@"), rules.url.at_symbol, reasons, criticalHit, score);
        applyRule(!!(domain && domain.includes("-")), rules.url.hyphenated_domain, reasons, criticalHit, score);
        applyRule(!!(parsed.hostname && parsed.hostname.startsWith("xn--")), rules.url.unicode_homoglyph, reasons, criticalHit, score);

        // Clamp score
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
            url: input,
            domain,
            riskScore: finalScore,
            reasons,
            verdict,
        };
    } catch (error: any) {
        throw new AppError("Invalid URL format", 400, "INVALID_URL");
    }
};
