import type { JSX } from "react";
import { ClipboardPaste, FileSearch, ShieldCheck } from "lucide-react";
import type { AppCopy } from "../data/translations";

interface HowItWorksProps {
  copy: AppCopy["howItWorks"];
}

const stepIcons = [ClipboardPaste, FileSearch, ShieldCheck];

export function HowItWorks({ copy }: HowItWorksProps): JSX.Element {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-ember">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 text-2xl font-black !leading-[1.32] text-white sm:text-3xl lg:text-4xl">
            {copy.title}
          </h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {copy.steps.map((step, index) => {
            const Icon = stepIcons[index];

            return (
              <article
                key={step.title}
                className="rounded-lg border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.075]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-4xl font-black text-white/15">
                    0{index + 1}
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10 text-orange-100">
                    <Icon size={22} />
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
