import type { JSX } from "react";
import { Github, Languages, ShieldCheck } from "lucide-react";
import type { AppCopy } from "../data/translations";
import type { Language } from "../types/language";

interface HeaderProps {
  copy: AppCopy["header"];
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const languageOptions: Array<{ label: string; value: Language }> = [
  { label: "EN", value: "en" },
  { label: "한글", value: "ko" },
];

export function Header({ copy, language, onLanguageChange }: HeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="group flex items-center gap-3" aria-label={copy.homeLabel}>
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/10 text-white shadow-glow transition group-hover:border-ember/60">
            <ShieldCheck size={21} />
          </span>
          <span className="text-lg font-black tracking-normal text-white">RepoSeal</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
          {copy.nav.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            aria-label={copy.githubLabel}
            className="hidden h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/25 hover:text-white sm:grid"
          >
            <Github size={18} />
          </a>
          <div
            className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 text-xs font-black text-slate-300 sm:flex"
            aria-label={copy.languageLabel}
          >
            <Languages size={15} className="mx-1 text-violet-100" />
            {languageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onLanguageChange(option.value)}
                className={`h-8 min-w-11 rounded-md px-2 transition ${
                  language === option.value
                    ? "bg-gradient-to-r from-violetSeal to-ember text-white"
                    : "hover:bg-white/10 hover:text-white"
                }`}
                aria-pressed={language === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onLanguageChange(language === "en" ? "ko" : "en")}
            className="inline-flex h-10 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-black text-slate-200 transition hover:border-white/25 hover:text-white sm:hidden"
            aria-label={copy.languageLabel}
          >
            {language === "en" ? "KO" : "EN"}
          </button>
          <a
            href="#scanner"
            className="rounded-lg bg-gradient-to-r from-violetSeal via-roseSeal to-ember px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:shadow-ember/20"
          >
            {copy.startScan}
          </a>
        </div>
      </div>
    </header>
  );
}
