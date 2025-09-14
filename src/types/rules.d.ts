export type Severity = "low" | "medium" | "high" | "critical";

export interface Rule {
    score: number,
    severity?: Severity
    message: string
}

export interface UrlRules {
    http_instead_https: Rule;
    lookalike_domain: Rule;
    ip_address_domain: Rule;
    suspicious_tld: Rule;
    suspicious_subdomain: Rule;
    path_keywords: Rule;
    long_domain: Rule
    too_many_subdomains
    long_url: Rule
    at_symbol: Rule
    hyphenated_domain: Rule
    unicode_homoglyph: Rule
}

export interface EmailRules {
    urgency: Rule;
    bad_grammar: Rule;
    attachment_exe: Rule;
    attachment_macro: Rule;
    attachment_archive: Rule;
    sender_spoof: Rule;
    replyto_mismatch: Rule
    auth_fail
}

export interface Classification {
    benign: [number, number];
    suspicious: [number, number];
    phishing: [number, number];
}

export interface Rules {
    url: UrlRules;
    email: EmailRules
    classification: Classification;
}
export interface EmailInput {
    subject: string;
    body: string;
    from: string;
    replyTo?: string;
    attachments?: string[];
    urls?: string[];
    authFailed?: boolean;
}