import type { JSX } from "react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, Github, Loader2, Search, ShieldAlert } from "lucide-react";
import type { AppCopy } from "../data/translations";
import { createMockScanResult } from "../data/mockScanResult";
import type { Language } from "../types/language";
import { ScanResult } from "./ScanResult";

interface ScannerProps {
  copy: AppCopy["scanner"];
  resultCopy: AppCopy["scanResult"];
  language: Language;
}

function validateGitHubUrl(value: string, messages: AppCopy["scanner"]["validation"]): string | null {
  if (!value.trim()) {
    return messages.empty;
  }

  try {
    const url = new URL(value.trim());
    const isGitHub = url.hostname === "github.com" || url.hostname === "www.github.com";

    if (!isGitHub) {
      return messages.domain;
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      return messages.repository;
    }

    return null;
  } catch {
    return messages.invalid;
  }
}

export function Scanner({ copy, resultCopy, language }: ScannerProps): JSX.Element {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scannedRepositoryUrl, setScannedRepositoryUrl] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const result = scannedRepositoryUrl ? createMockScanResult(scannedRepositoryUrl, language) : null;

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const validationError = validateGitHubUrl(repositoryUrl, copy.validation);
    if (validationError) {
      setError(validationError);
      setScannedRepositoryUrl(null);
      return;
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    const normalizedUrl = repositoryUrl.trim();
    setError("");
    setScannedRepositoryUrl(null);
    setIsLoading(true);

    timerRef.current = window.setTimeout(() => {
      setScannedRepositoryUrl(normalizedUrl);
      setIsLoading(false);
      window.requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 1000);
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
