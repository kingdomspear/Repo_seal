import type { Language } from "../types/language";

export const translations = {
  en: {
    header: {
      homeLabel: "RepoSeal home",
      githubLabel: "View RepoSeal on GitHub",
      startScan: "Start Scan",
      languageLabel: "Change language",
      nav: [
        { label: "GitHub", href: "https://github.com" },
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Open Source", href: "#open-source" },
      ],
    },
    hero: {
      eyebrow: "Public-ready security checks for GitHub repositories",
      title: "Seal your repository before it goes public.",
      subtitle:
        "RepoSeal scans your GitHub repository for exposed secrets, risky configs, README issues, license problems, and deployment risks before you make it public.",
      startScan: "Start Repository Scan",
      viewGithub: "View on GitHub",
      terminalFile: "reposeal-report.sh",
      terminalLines: [
        "$ reposeal scan github.com/user/project",
        "✓ Checking exposed secrets",
        "✓ Scanning risky config files",
        "✓ Reviewing README quality",
        "✓ Checking license",
        "✓ Generating public-ready report",
      ],
      scoreLabel: "Public Safety Score",
    },
    scanner: {
      eyebrow: "Repository scanner",
      title: "Paste a GitHub URL and get a public-release risk snapshot.",
      description:
        "RepoSeal reads public GitHub repositories in your browser, scans selected files, and generates a rule-based safety report.",
      cardTitle: "Analyze Repository",
      cardSubtitle: "Public repo scan · GitHub API",
      inputLabel: "GitHub Repository URL",
      placeholder: "https://github.com/user/repository",
      analyze: "Analyze Repository",
      analyzing: "Analyzing Repository",
      validation: {
        empty: "Enter a GitHub repository URL before starting the scan.",
        domain: "RepoSeal accepts github.com repository URLs or GitHub Pages project URLs in this MVP.",
        repository: "Use a full repository URL like https://github.com/user/repository.",
        invalid: "Use a valid URL like https://github.com/user/repository.",
      },
    },
    scanResult: {
      eyebrow: "Scan result dashboard",
      title: "Public Safety Report",
      score: "Public Safety Score",
      riskLevel: "Risk Level",
      criticalIssues: "Critical Issues",
      highIssues: "High Issues",
      recommendedFixes: "Recommended Fixes",
      foundIssues: "Found Issues",
      noIssues: "No issues found with the current scan rules.",
      severityLabels: {
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
      },
    },
    features: {
      eyebrow: "Security checks",
      title: "Everything a repository should pass before it becomes public.",
      cards: [
        {
          title: "Secret Detection",
          description:
            "Detect API keys, database passwords, JWT secrets, GitHub tokens, and similar patterns.",
        },
        {
          title: "Risky Config Scan",
          description:
            "Flag .env, .npmrc, .pypirc, docker-compose.yml, *.pem, and other risky files.",
        },
        {
          title: "README Quality Check",
          description:
            "Review installation steps, run commands, environment variable docs, and license notes.",
        },
        {
          title: "Deployment Risk Review",
          description: "Find wildcard CORS, debug mode, exposed ports, and risky deployment defaults.",
        },
        {
          title: "Public-Ready Checklist",
          description:
            "Generate a final release checklist before switching a repository from private to public.",
        },
        {
          title: "Auto Fix Guide",
          description: "Guide .gitignore, .env.example, README template, and config hardening updates.",
        },
      ],
    },
    howItWorks: {
      eyebrow: "How it works",
      title: "Three steps from repository URL to release confidence.",
      steps: [
        {
          title: "Paste your GitHub repository URL",
          description: "Start with a public or private repository URL format.",
        },
        {
          title: "RepoSeal scans files, configs, docs, and deployment settings",
          description: "The scanner groups findings by severity and release impact.",
        },
        {
          title: "Get a public-ready safety report with fix guides",
          description: "Use the report to remove blockers before publishing.",
        },
      ],
    },
    openSource: {
      eyebrow: "Open Source",
      title: "Built to be inspected, forked, and improved.",
      description:
        "RepoSeal is designed to be open, transparent, and developer-friendly. Run it locally, inspect the source code, and improve it with the community.",
      star: "Star on GitHub",
      contribute: "Contribute",
      checklist: [
        "MIT License",
        "Local-first roadmap",
        "Transparent scan rules",
        "Developer-friendly reports",
      ],
    },
    footer: {
      tagline: "Made for developers who ship safely",
      license: "MIT License",
      tool: "Open Source Security Tool",
      github: "GitHub Repository",
    },
  },
  ko: {
    header: {
      homeLabel: "RepoSeal 홈",
      githubLabel: "GitHub에서 RepoSeal 보기",
      startScan: "스캔 시작",
      languageLabel: "언어 변경",
      nav: [
        { label: "GitHub", href: "https://github.com" },
        { label: "기능", href: "#features" },
        { label: "작동 방식", href: "#how-it-works" },
        { label: "오픈소스", href: "#open-source" },
      ],
    },
    hero: {
      eyebrow: "GitHub 저장소 공개 전 보안 점검",
      title: "저장소를 공개하기 전에 안전하게 봉인하세요.",
      subtitle:
        "RepoSeal은 GitHub 저장소를 공개하기 전에 노출된 시크릿, 위험한 설정, README 품질, 라이선스 누락, 배포 위험 요소를 점검합니다.",
      startScan: "저장소 스캔 시작",
      viewGithub: "GitHub 보기",
      terminalFile: "reposeal-report.sh",
      terminalLines: [
        "$ reposeal scan github.com/user/project",
        "✓ 노출된 시크릿 점검",
        "✓ 위험 설정 파일 스캔",
        "✓ README 품질 검토",
        "✓ 라이선스 확인",
        "✓ 공개 준비 리포트 생성",
      ],
      scoreLabel: "공개 안전 점수",
    },
    scanner: {
      eyebrow: "저장소 스캐너",
      title: "GitHub URL을 붙여넣고 공개 전 위험 스냅샷을 확인하세요.",
      description:
        "RepoSeal은 브라우저에서 공개 GitHub 저장소를 읽고 선택된 파일을 실제 규칙 기반으로 스캔해 안전 리포트를 생성합니다.",
      cardTitle: "저장소 분석",
      cardSubtitle: "공개 저장소 스캔 · GitHub API",
      inputLabel: "GitHub 저장소 URL",
      placeholder: "https://github.com/user/repository",
      analyze: "저장소 분석",
      analyzing: "저장소 분석 중",
      validation: {
        empty: "스캔을 시작하려면 GitHub 저장소 URL을 입력하세요.",
        domain: "현재 MVP에서는 github.com 저장소 URL 또는 GitHub Pages 프로젝트 URL을 사용할 수 있습니다.",
        repository: "https://github.com/user/repository 형식의 전체 저장소 URL을 입력하세요.",
        invalid: "https://github.com/user/repository 형식의 올바른 URL을 입력하세요.",
      },
    },
    scanResult: {
      eyebrow: "스캔 결과 대시보드",
      title: "공개 안전 리포트",
      score: "공개 안전 점수",
      riskLevel: "위험 등급",
      criticalIssues: "치명 이슈",
      highIssues: "높음 이슈",
      recommendedFixes: "권장 수정",
      foundIssues: "발견된 이슈",
      noIssues: "현재 스캔 규칙 기준으로 발견된 이슈가 없습니다.",
      severityLabels: {
        critical: "치명",
        high: "높음",
        medium: "중간",
        low: "낮음",
      },
    },
    features: {
      eyebrow: "보안 점검",
      title: "저장소 공개 전에 반드시 통과해야 할 핵심 체크입니다.",
      cards: [
        {
          title: "시크릿 탐지",
          description:
            "API 키, DB 비밀번호, JWT 시크릿, GitHub 토큰과 유사한 민감정보 패턴을 탐지합니다.",
        },
        {
          title: "위험 설정 스캔",
          description:
            ".env, .npmrc, .pypirc, docker-compose.yml, *.pem 등 위험 파일을 표시합니다.",
        },
        {
          title: "README 품질 점검",
          description:
            "설치 방법, 실행 명령어, 환경변수 설명, 라이선스 안내가 충분한지 검토합니다.",
        },
        {
          title: "배포 위험 검토",
          description: "전체 허용 CORS, debug 모드, 노출된 포트, 위험한 배포 기본값을 찾습니다.",
        },
        {
          title: "공개 준비 체크리스트",
          description: "저장소를 private에서 public으로 전환하기 전 최종 체크리스트를 제공합니다.",
        },
        {
          title: "자동 수정 가이드",
          description: ".gitignore, .env.example, README 템플릿, 설정 강화 가이드를 제공합니다.",
        },
      ],
    },
    howItWorks: {
      eyebrow: "작동 방식",
      title: "저장소 URL에서 공개 준비 리포트까지 세 단계로 끝냅니다.",
      steps: [
        {
          title: "GitHub 저장소 URL 붙여넣기",
          description: "공개 또는 비공개 저장소 URL 형식으로 시작합니다.",
        },
        {
          title: "파일, 설정, 문서, 배포 설정 스캔",
          description: "스캐너가 심각도와 공개 영향도 기준으로 발견 항목을 분류합니다.",
        },
        {
          title: "수정 가이드가 포함된 공개 안전 리포트 받기",
          description: "공개 전 차단 이슈를 제거하는 데 리포트를 활용합니다.",
        },
      ],
    },
    openSource: {
      eyebrow: "오픈소스",
      title: "검토하고, 포크하고, 함께 개선할 수 있도록 설계했습니다.",
      description:
        "RepoSeal은 개방적이고 투명하며 개발자 친화적인 도구를 목표로 합니다. 로컬에서 실행하고, 소스 코드를 확인하고, 커뮤니티와 함께 개선하세요.",
      star: "GitHub 스타",
      contribute: "기여하기",
      checklist: ["MIT License", "로컬 우선 로드맵", "투명한 스캔 규칙", "개발자 친화 리포트"],
    },
    footer: {
      tagline: "안전하게 배포하는 개발자를 위해 만들었습니다",
      license: "MIT License",
      tool: "오픈소스 보안 도구",
      github: "GitHub 저장소",
    },
  },
} satisfies Record<Language, object>;

export type AppCopy = (typeof translations)[Language];
