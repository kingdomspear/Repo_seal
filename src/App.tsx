import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { OpenSource } from "./components/OpenSource";
import { Scanner } from "./components/Scanner";
import { translations } from "./data/translations";
import type { Language } from "./types/language";

function getInitialLanguage(): Language {
  const savedLanguage = window.localStorage.getItem("reposeal-language");

  if (savedLanguage === "en" || savedLanguage === "ko") {
    return savedLanguage;
  }

  return "ko";
}

export function App(): JSX.Element {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const copy = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("reposeal-language", language);
  }, [language]);

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(139,92,246,0.35),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(251,146,60,0.24),transparent_28%),radial-gradient(circle_at_50%_85%,rgba(236,72,153,0.2),transparent_34%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <Header copy={copy.header} language={language} onLanguageChange={setLanguage} />
      <main>
        <Hero copy={copy.hero} />
        <Scanner copy={copy.scanner} resultCopy={copy.scanResult} language={language} />
        <Features copy={copy.features} />
        <HowItWorks copy={copy.howItWorks} />
        <OpenSource copy={copy.openSource} />
      </main>
      <Footer copy={copy.footer} />
    </div>
  );
}
