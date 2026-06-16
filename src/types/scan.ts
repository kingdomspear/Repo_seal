export type Severity = "critical" | "high" | "medium" | "low";

export interface ScanIssue {
  id: string;
  title: string;
  description: string;
  file: string;
  severity: Severity;
  recommendation: string;
}

export interface ScanResult {
  repositoryUrl: string;
  score: number;
  riskLevel: string;
  summary: string;
  issues: ScanIssue[];
}
