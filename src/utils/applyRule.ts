import { HeuristicResult } from "../types";
import { Rule } from "../types/rules";

export function applyRule(
    condition: boolean,
    rule: Rule,
    reasons: string[],
    criticalHit: { value: boolean },
    score: { value: number }
) {
    if (condition) {
        if (rule.severity === "critical") {
            criticalHit.value = true;
        } else {            
            score.value += rule.score;
        }
        reasons.push(rule.message);
    }
}

export function normalizeUrl(input: string): string {
    // If it already starts with http:// or https://, leave it
    if (/^https?:\/\//i.test(input)) {
        return input;
    }
    // Otherwise, prepend https:// by default
    return "https://" + input;
}

