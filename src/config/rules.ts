export const rulesData = {
    "url": {
        "http_instead_https": { "score": 10, "severity": "low", "message": "Uses insecure HTTP protocol" },
        "lookalike_domain": { "score": 25, "severity": "high", "message": "Domain looks like a popular brand (typosquatting)" },
        "ip_address_domain": { "score": 15, "severity": "high", "message": "Uses IP address instead of domain" },
        "suspicious_tld": { "score": 20, "severity": "high", "message": "Suspicious top-level domain (e.g., .ru, .cn, .xyz, .tk)" },
        "suspicious_subdomain": { "score": 20, "severity": "medium", "message": "Suspicious subdomain keywords (login, secure, account, verify)" },
        "path_keywords": { "score": 20, "severity": "medium", "message": "Sensitive keywords found in URL path (password, bank, signin)" },
        "long_domain": { "score": 15, "severity": "low", "message": "Domain unusually long" },
        "too_many_subdomains": { "score": 10, "severity": "low", "message": "Too many nested subdomains" },
        "long_url": { "score": 10, "severity": "low", "message": "Excessively long URL" },
        "at_symbol": { "score": 25, "severity": "high", "message": "URL contains @ symbol" },
        "hyphenated_domain": { "score": 15, "severity": "medium", "message": "Hyphenated domain (possible impersonation)" },
        "unicode_homoglyph": { "score": 100, "severity": "critical", "message": "Unicode homoglyphs detected (lookalike characters)" }
    },
    "attachment": {
        "executable": { "score": 30, "message": "Attachment is executable (.exe, .js, .scr, .hta)" },
        "macro_file": { "score": 25, "message": "Macro-enabled Office file detected (.docm, .xlsm)" },
        "archive": { "score": 20, "message": "Archive may contain executables" }
    },
    "text": {
        "urgency": { "score": 20, "message": "Urgent or threatening language in subject/body" },
        "bad_grammar": { "score": 10, "message": "Poor grammar/spelling detected" },
        "phishing_keywords": { "score": 15, "message": "Suspicious keywords detected (verify, locked, password)" }
    },
    "email": {
        "urgency": { "score": 20, "message": "Urgent or threatening language" },
        "bad_grammar": { "score": 10, "message": "Poor grammar/spelling" },
        "attachment_exe": { "score": 30, "message": "Executable attachment detected (.exe, .js, .scr)" },
        "attachment_macro": { "score": 20, "message": "Macro-enabled Office file detected (.docm, .xlsm)" },
        "attachment_archive": { "score": 20, "message": "Archive contains executables" },
        "sender_spoof": { "score": 20, "message": "Sender display name spoofing" },
        "replyto_mismatch": { "score": 15, "message": "From vs Reply-To mismatch" },
        "auth_fail": { "score": 25, "message": "SPF/DKIM/DMARC authentication failed" }
    },
    "qr": {
        "http_instead_https": { "score": 10, "message": "QR link uses insecure HTTP" },
        "lookalike_domain": { "score": 25, "message": "QR leads to lookalike domain" },
        "suspicious_tld": { "score": 15, "message": "Suspicious QR domain TLD" },
        "ip_address_domain": { "score": 15, "message": "QR links to IP address instead of domain" },
        "multiple_redirects": { "score": 20, "message": "QR contains multiple redirects" },
        "context_mismatch": { "score": 30, "message": "QR code destination mismatches context (e.g., DHL → random site)" }
    },
    "ocr": {
        "urgent_text": { "score": 20, "message": "Urgent text inside image (verify now, reset password)" },
        "suspicious_url_text": { "score": 25, "message": "Suspicious URL found in image text" },
        "logo_mismatch": { "score": 30, "message": "Logo mismatch with domain" },
        "hidden_links": { "score": 20, "message": "Image metadata contains hidden links/scripts" },
        "steganography": { "score": 15, "message": "Possible steganography in image (altered hashes)" }
    },
    "classification": {
        "benign": [0, 39],
        "suspicious": [40, 69],
        "phishing": [70, 100]
    }
} as const
