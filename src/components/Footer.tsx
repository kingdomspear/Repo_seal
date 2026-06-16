import type { JSX } from "react";
import { Github, ShieldCheck } from "lucide-react";
import type { AppCopy } from "../data/translations";

interface FooterProps {
  copy: AppCopy["footer"];
}

export function Footer({ copy }: FooterProps): JSX.Element {
  return (
    <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white">
            <ShieldCheck size={18} />
          </span>
          <div>
            <p className="font-black text-white">RepoSeal</p>
            <p>{copy.tagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span>{copy.license}</span>
          <span>{copy.tool}</span>
          <a href="https://github.com" className="inline-flex items-center gap-2 transition hover:text-white">
            <Github size={16} />
            {copy.github}
          </a>
        </div>
      </div>
    </footer>
  );
}
