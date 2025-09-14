export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: string,
        stack?: string 
    };
}

// Result of URL heuristics analysis
export interface HeuristicResult {
    url: string // The original URL analyzed 
    domain: string | null // The main domain extracted from the URL
    riskScore: number // Calculated risk score (0-100)
    reasons: string[] // List of reasons contributing to the risk score
    verdict: string  // Final verdict (benign, suspicious, phishing)
}

