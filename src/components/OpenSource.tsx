import type { JSX } from "react";
import { Code2, GitFork, Star } from "lucide-react";
import type { AppCopy } from "../data/translations";

interface OpenSourceProps {
  copy: AppCopy["openSource"];
}

export function OpenSource({ copy }: OpenSourceProps): JSX.Element {
  return (
    <section id="open-source" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.8fr] lg:p-10">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-violet-100">
              <Code2 size={16} className="text-ember" />
              {copy.eyebrow}
            </div>
            <h2 className="text-2xl font-black !leading-[1.32] text-white sm:text-3xl lg:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">{copy.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://github.com"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violetSeal via-roseSeal to-ember px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                <Star size={18} />
                {copy.star}
              </a>
              <a
                href="https://github.com"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white/30"
              >
                <GitFork size={18} />
                {copy.contribute}
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/70 p-5 font-mono text-sm text-slate-300">
            <p className="text-violet-200">reposeal/community</p>
            <div className="mt-5 space-y-3">
              {copy.checklist.map((item) => (
                <p key={item}>
                  <span className="text-emerald-200">✓</span> {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
