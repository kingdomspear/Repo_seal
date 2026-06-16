import type { JSX } from "react";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  Download,
  FileWarning,
  Info,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import type { AppCopy } from "../data/translations";
import type { ScanIssue, ScanResult as ScanResultType, Severity } from "../types/scan";

interface ScanResultProps {
  result: ScanResultType;
  copy: AppCopy["scanResult"];
}

const severityStyles: Record<Severity, string> = {
  critical: "border-red-400/40 bg-red-500/15 text-red-100",
  high: "border-orange-400/40 bg-orange-500/15 text-orange-100",
  medium: "border-amber-300/40 bg-amber-400/15 text-amber-100",
  low: "border-sky-300/40 bg-sky-400/15 text-sky-100",
};

function issueIcon(severity: Severity): JSX.Element {
  if (severity === "critical") {
    return <ShieldAlert size={18} className="text-red-200" />;
  }

  if (severity === "high") {
    return <AlertTriangle size={18} className="text-orange-200" />;
  }

  return <FileWarning size={18} className="text-violet-100" />;
}

function repositorySlug(repositoryUrl: string): string {
  return repositoryUrl.replace(/^https:\/\/github\.com\//, "").replace(/[^\w.-]+/g, "-");
}

function markdownReport(result: ScanResultType, copy: AppCopy["scanResult"]): string {
  const issueLines =
    result.issues.length > 0
      ? result.issues
          .map(
            (issue, index) => `### ${index + 1}. ${issue.title}

- Severity: ${copy.severityLabels[issue.severity]}
- File: \`${issue.file}\`
- Description: ${issue.description}
- Recommendation: ${issue.recommendation}`,
          )
          .join("\n\n")
      : copy.noIssues;

  const actionLines =
    result.issues.length > 0
      ? result.issues.map((issue, index) => `${index + 1}. ${issue.recommendation}`).join("\n")
      : `1. ${copy.noActionItems}`;

  return `# RepoSeal Report

- Repository: ${result.repositoryUrl}
- Public Safety Score: ${result.score} / 100
- Risk Level: ${result.riskLevel}

## Summary

${result.summary}

> ${copy.disclaimerBody}

## Found Issues

${issueLines}

## ${copy.actionPlan}

${actionLines}
`;
}

function IssueRow({
  issue,
  severityLabels,
}: {
  issue: ScanIssue;
  severityLabels: AppCopy["scanResult"]["severityLabels"];
}): JSX.Element {
  return (
    <li className="rounded-lg border border-white/10 bg-white/[0.045] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="mt-1 grid h-9 w-9 flex-none place-items-center rounded-lg bg-white/10">
            {issueIcon(issue.severity)}
          </span>
          <div>
            <h4 className="font-bold text-white">{issue.title}</h4>
            <p className="mt-1 text-sm leading-6 text-slate-300">{issue.description}</p>
            <p className="mt-2 font-mono text-xs text-violet-200">{issue.file}</p>
          </div>
        </div>
        <span
          className={`w-fit rounded-lg border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${severityStyles[issue.severity]}`}
        >
          {severityLabels[issue.severity]}
        </span>
      </div>
      <div className="mt-4 flex gap-3 rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-slate-300">
        <Wrench size={16} className="mt-1 flex-none text-ember" />
        <span>{issue.recommendation}</span>
      </div>
    </li>
  );
}

export function ScanResult({ result, copy }: ScanResultProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const criticalCount = result.issues.filter((issue) => issue.severity === "critical").length;
  const highCount = result.issues.filter((issue) => issue.severity === "high").length;
  const recommendedFixes = result.issues.length;
  const reportMarkdown = markdownReport(result, copy);

  async function handleCopyReport(): Promise<void> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(reportMarkdown);
        setCopied(true);
        return;
      }
    } catch {
      // Fall back to a temporary textarea when clipboard permissions are unavailable.
    }

    const textarea = document.createElement("textarea");

    textarea.value = reportMarkdown;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setCopied(true);
  }

  function handleDownloadReport(): void {
    const blob = new Blob([reportMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `reposeal-${repositorySlug(result.repositoryUrl)}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-200">
            {copy.eyebrow}
          </p>
          <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">{copy.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{result.summary}</p>
          <p className="mt-3 break-all font-mono text-xs text-slate-400">{result.repositoryUrl}</p>
          <div className="mt-4 flex max-w-3xl gap-3 rounded-lg border border-violet-300/20 bg-violet-500/10 p-4 text-sm leading-6 text-violet-50/85">
            <Info size={18} className="mt-1 flex-none text-violet-100" />
            <div>
              <p className="font-black text-violet-50">{copy.disclaimerTitle}</p>
              <p className="mt-1">{copy.disclaimerBody}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white/30"
            >
              <ClipboardCopy size={17} />
              {copied ? copy.copiedReport : copy.copyReport}
            </button>
            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white/30"
            >
              <Download size={17} />
              {copy.downloadReport}
            </button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              {copy.score}
            </p>
            <p className="mt-2 text-4xl font-black text-white">{result.score} / 100</p>
          </div>
          <div className="rounded-lg border border-orange-300/20 bg-orange-500/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-100">
              {copy.riskLevel}
            </p>
            <p className="mt-2 text-lg font-black text-white">{result.riskLevel}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-red-300/20 bg-red-500/10 p-4">
          <p className="text-sm text-slate-300">{copy.criticalIssues}</p>
          <p className="mt-1 text-3xl font-black text-red-100">{criticalCount}</p>
        </div>
        <div className="rounded-lg border border-orange-300/20 bg-orange-500/10 p-4">
          <p className="text-sm text-slate-300">{copy.highIssues}</p>
          <p className="mt-1 text-3xl font-black text-orange-100">{highCount}</p>
        </div>
        <div className="rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-4">
          <p className="text-sm text-slate-300">{copy.recommendedFixes}</p>
          <p className="mt-1 flex items-center gap-2 text-3xl font-black text-emerald-100">
            {recommendedFixes}
            <CheckCircle2 size={22} />
          </p>
        </div>
      </div>

      <div className="mt-7">
        <h4 className="text-lg font-black text-white">{copy.foundIssues}</h4>
        {result.issues.length > 0 ? (
          <ul className="mt-4 grid gap-3">
            {result.issues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} severityLabels={copy.severityLabels} />
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-100">
            <CheckCircle2 size={20} className="flex-none" />
            {copy.noIssues}
          </div>
        )}
      </div>

      <div className="mt-7">
        <h4 className="text-lg font-black text-white">{copy.actionPlan}</h4>
        {result.issues.length > 0 ? (
          <ol className="mt-4 grid gap-3">
            {result.issues.map((issue) => (
              <li
                key={`action-${issue.id}`}
                className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300"
              >
                <p className="font-bold text-white">{issue.title}</p>
                <p className="mt-2">{issue.recommendation}</p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
            {copy.noActionItems}
          </div>
        )}
      </div>
    </section>
  );
}
