import type { JSX } from "react";
import {
  BookOpenCheck,
  ClipboardCheck,
  FileLock2,
  KeyRound,
  Rocket,
  Settings2,
} from "lucide-react";
import type { AppCopy } from "../data/translations";
import { FeatureCard } from "./FeatureCard";

interface FeaturesProps {
  copy: AppCopy["features"];
}

const featureIcons = [
  KeyRound,
  FileLock2,
  BookOpenCheck,
  Rocket,
  ClipboardCheck,
  Settings2,
];

export function Features({ copy }: FeaturesProps): JSX.Element {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-violet-200">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 text-2xl font-black !leading-[1.32] text-white sm:text-3xl lg:text-4xl">
            {copy.title}
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copy.cards.map((feature, index) => (
            <FeatureCard key={feature.title} icon={featureIcons[index]} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
