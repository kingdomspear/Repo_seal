import type { JSX } from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <article className="group rounded-lg border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.075]">
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-violetSeal/80 to-ember/80 text-white shadow-lg shadow-violet-950/30 transition group-hover:scale-105">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </article>
  );
}
