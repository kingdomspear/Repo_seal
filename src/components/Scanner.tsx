import type { JSX } from "react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, Github, Loader2, Search, ShieldAlert } from "lucide-react";
import type { AppCopy } from "../data/translations";
import type { Language } from "../types/language";
import type { ScanResult as ScanResultType } from "../types/scan";
import { scanGitHubRepository } from "../services/repositoryScanner";
import { ScanResult } from "./ScanResult";

interface ScannerProps {
  copy: AppCopy["scanner"];
  resultCopy: AppCopy["scanResult"];
  language: Language;
}

interface ValidationResult {
  error: string | null;
  repositoryUrl: string;
}

function normalizeRepositoryUrl(value: string, messages: AppCopy["scanner"]["validation"]): ValidationResult {
  if (!value.trim()) {
    return { error: messages.empty, repositoryUrl: "" };
  }

  try {
    const url = new URL(value.trim());
    const isGitHub = url.hostname === "github.com" || url.hostname === "www.github.com";
    const githubPagesMatch = url.hostname.match(/^([a-z0-9-]+)\.github\.io$/i);

    const pathParts = url.pathname
      .split("/")
      .filter(Boolean)
      .map((part) => part.replace(/\.git$/i, ""));

    if (isGitHub) {
      if (pathParts.length < 2) {
        return { error: messages.repository, repositoryUrl: "" };
      }

      return {
        error: null,
        repositoryUrl: `https://github.com/${pathParts[0]}/${pathParts[1]}`,
      };
    }

    if (githubPagesMatch && pathParts.length >= 1) {
      return {
        error: null,
        repositoryUrl: `https://github.com/${githubPagesMatch[1]}/${pathParts[0]}`,
      };
    }

    if (pathParts.length < 2) {
      return { error: messages.repository, repositoryUrl: "" };
    }

    return { error: messages.domain, repositoryUrl: "" };
  } catch {
    return { error: messages.invalid, repositoryUrl: "" };
  }
}

export function Scanner({ copy, resultCopy, language }: ScannerProps): JSX.Element {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResultType | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validationResult = normalizeRepositoryUrl(repositoryUrl, copy.validation);
    if (validationResult.error) {
      setError(validationResult.error);
      setResult(null);
      return;
    }

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const scanResult = await scanGitHubRepository(
        validationResult.repositoryUrl,
        language,
        abortController.signal,
      );

      setResult(scanResult);
      window.requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (scanError) {
      if (abortController.signal.aborted) {
        return;
      }

      setError(scanError instanceof Error ? scanError.message : copy.validation.invalid);
    } finally {
      if (!abortController.signal.aborted) {
        abortControllerRef.current = null;
      }

      setIsLoading(false);
    }
  }

  return (
    <section id="scanner" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-ember">
              {copy.eyebrow}
            </p>
            <h2 className="mt-4 text-2xl font-black !leading-[1.32] tracking-normal text-white sm:text-3xl lg:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">{copy.description}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
            <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-violetSeal to-ember text-white">
                <Search size={19} />
              </span>
              <div>
                <h3 className="font-black text-white">{copy.cardTitle}</h3>
                <p className="text-sm text-slate-400">{copy.cardSubtitle}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="repository-url" className="block text-sm font-bold text-slate-200">
                {copy.inputLabel}
              </label>
              <div className="rounded-lg border border-white/10 bg-slate-950/80 p-3 font-mono shadow-inner shadow-black/30 transition focus-within:border-violet-300/60">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span className="ml-2">scan-input</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github size={18} className="flex-none text-slate-500" />
                  <input
                    id="repository-url"
                    value={repositoryUrl}
                    onChange={(event) => setRepositoryUrl(event.target.value)}
                    placeholder={copy.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "repository-url-error" : undefined}
                  />
                </div>
              </div>

              {error ? (
                <p
                  id="repository-url-error"
                  className="flex items-start gap-2 rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-100"
                >
                  <ShieldAlert size={16} className="mt-0.5 flex-none" />
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violetSeal via-roseSeal to-ember px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {copy.analyzing}
                  </>
                ) : (
                  <>
                    {copy.analyze}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div ref={resultRef} className="mt-10 scroll-mt-28">
          {result ? <ScanResult result={result} copy={resultCopy} /> : null}
        </div>
      </div>
    </section>
  );
}
