import type { JSX } from "react";
import { ArrowRight, Github, ShieldCheck, Sparkles } from "lucide-react";
import type { AppCopy } from "../data/translations";

interface HeroProps {
  copy: AppCopy["hero"];
}

export function Hero({ copy }: HeroProps): JSX.Element {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-violet-100 backdrop-blur">
            <Sparkles size={16} className="text-ember" />
            {copy.eyebrow}
          </div>
          <h1 className="max-w-5xl text-3xl font-black !leading-[1.28] tracking-normal text-white sm:text-4xl lg:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">{copy.subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#scanner"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violetSeal via-roseSeal to-ember px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5"
            >
              {copy.startScan}
              <ArrowRight size={18} />
            </a>
            <a
              href="https://github.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
            >
              <Github size={18} />
              {copy.viewGithub}
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-lg bg-gradient-to-tr from-violetSeal/35 via-roseSeal/15 to-ember/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-lg border border-white/15 bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-300" />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <ShieldCheck size={14} />
                {copy.terminalFile}
              </div>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-8 text-slate-200 sm:p-8">
              {copy.terminalLines.map((line, index) => (
                <code
                  key={line}
                  className={index === 0 ? "block text-orange-200" : "block text-emerald-200"}
                >
                  {line}
                </code>
              ))}
            </pre>
            <div className="border-t border-white/10 bg-gradient-to-r from-violetSeal/15 via-transparent to-ember/15 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {copy.scoreLabel} · 72 / 100
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
