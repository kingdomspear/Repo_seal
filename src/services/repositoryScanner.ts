import type { Language } from "../types/language";
import type { ScanIssue, ScanResult, Severity } from "../types/scan";

interface RepositoryReference {
  owner: string;
  repo: string;
  repositoryUrl: string;
}

interface GitHubRepository {
  default_branch: string;
  license: null | {
    key: string;
    name: string;
  };
}

interface GitHubTreeItem {
  path: string;
  size?: number;
  type: "blob" | "tree" | string;
}

interface GitHubTree {
  tree: GitHubTreeItem[];
  truncated: boolean;
}

interface FileContent {
  path: string;
  content: string;
}

interface IssueText {
  title: string;
  description: string;
  recommendation: string;
}

const MAX_FILES_TO_FETCH = 90;
const MAX_FILE_SIZE = 220_000;

const sourceExtensions = new Set([
  ".c",
  ".conf",
  ".config",
  ".cs",
  ".css",
  ".env",
  ".go",
  ".ini",
  ".java",
  ".js",
  ".json",
  ".jsx",
  ".mjs",
  ".php",
  ".py",
  ".rb",
  ".rs",
  ".sh",
  ".toml",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);

const riskyFileRules: Array<{
  match: (path: string) => boolean;
  severity: Severity;
  key: string;
}> = [
  { key: "env", severity: "critical", match: (path) => /^\.env($|\.)/i.test(filename(path)) },
  { key: "npmrc", severity: "high", match: (path) => filename(path).toLowerCase() === ".npmrc" },
  { key: "pypirc", severity: "high", match: (path) => filename(path).toLowerCase() === ".pypirc" },
  { key: "netrc", severity: "high", match: (path) => filename(path).toLowerCase() === ".netrc" },
  { key: "pem", severity: "critical", match: (path) => /\.(pem|p12|pfx|key)$/i.test(path) },
  { key: "ssh", severity: "critical", match: (path) => /^id_(rsa|dsa|ecdsa|ed25519)$/i.test(filename(path)) },
];

const secretPatterns: Array<{
  id: string;
  label: { en: string; ko: string };
  regex: RegExp;
  severity: Severity;
}> = [
  {
    id: "openai",
    label: { en: "OpenAI API key", ko: "OpenAI API 키" },
    regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g,
    severity: "critical",
  },
  {
    id: "github-token",
    label: { en: "GitHub token", ko: "GitHub 토큰" },
    regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b/g,
    severity: "critical",
  },
  {
    id: "aws-access-key",
    label: { en: "AWS access key", ko: "AWS 액세스 키" },
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    severity: "critical",
  },
  {
    id: "google-api-key",
    label: { en: "Google API key", ko: "Google API 키" },
    regex: /\bAIza[0-9A-Za-z_-]{35}\b/g,
    severity: "critical",
  },
  {
    id: "slack-token",
    label: { en: "Slack token", ko: "Slack 토큰" },
    regex: /\bxox[baprs]-[0-9A-Za-z-]{20,}\b/g,
    severity: "critical",
  },
  {
    id: "private-key",
    label: { en: "private key block", ko: "비공개 키 블록" },
    regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
    severity: "critical",
  },
  {
    id: "jwt",
    label: { en: "JWT-like token", ko: "JWT 유사 토큰" },
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
    severity: "high",
  },
  {
    id: "generic-secret",
    label: { en: "generic secret assignment", ko: "일반 시크릿 할당" },
    regex:
      /\b(?:api[_-]?key|secret|password|passwd|token|client[_-]?secret)\b\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{20,}["']?/gi,
    severity: "high",
  },
];

const copy = {
  en: {
    fetchFailed:
      "Could not read this repository. RepoSeal can scan public GitHub repositories without authentication.",
    rateLimited:
      "GitHub API rate limit was reached. Try again later, or add backend authentication in a future release.",
    summaryClean:
      "RepoSeal scanned the repository and did not find public-release blockers with the current rule set.",
    summaryIssues: (count: number, files: number) =>
      `RepoSeal scanned ${files} files and found ${count} public-release issue${count === 1 ? "" : "s"} across secrets, configs, documentation, licensing, and deployment settings.`,
    risk: {
      safe: "Public Ready",
      review: "Review Recommended",
      fix: "Needs Fix Before Public Release",
      block: "Do Not Publish Yet",
    },
    issue: {
      riskyFile: (path: string): IssueText => ({
        title: `Risky file committed: ${path}`,
        description: "A sensitive or machine-specific configuration file is present in the repository.",
        recommendation:
          "Remove the file from Git history if it contains secrets, rotate exposed credentials, and keep a safe example file instead.",
      }),
      secret: (label: string): IssueText => ({
        title: `Possible ${label} found`,
        description: "A known credential or token pattern was detected in source-controlled content.",
        recommendation:
          "Move the value to a secure environment variable, rotate it if it was real, and avoid committing secrets.",
      }),
      noReadme: {
        title: "README file not found",
        description: "The repository does not include a README for users and contributors.",
        recommendation: "Add a README with installation, usage, configuration, license, and deployment notes.",
      },
      readmeInstall: {
        title: "README missing installation section",
        description: "The README does not clearly explain how to install dependencies.",
        recommendation: "Add an installation section with exact package manager commands.",
      },
      readmeUsage: {
        title: "README missing usage or run instructions",
        description: "The README does not clearly explain how to run or use the project.",
        recommendation: "Add usage, development, and production run commands.",
      },
      readmeEnv: {
        title: "README missing environment variable documentation",
        description: "The repository references environment variables but the README does not document them.",
        recommendation: "Document required variables and provide safe example values.",
      },
      noLicense: {
        title: "LICENSE file not found",
        description: "No repository license was detected, which makes open-source reuse rights unclear.",
        recommendation: "Add a LICENSE file before publishing the repository as open source.",
      },
      corsWildcard: {
        title: "CORS wildcard origin detected",
        description: "A deployment-facing configuration appears to allow requests from every origin.",
        recommendation: "Restrict allowed origins to trusted production and preview domains.",
      },
      debugMode: {
        title: "Debug mode appears enabled",
        description: "A server or framework debug setting appears to be enabled in committed code.",
        recommendation: "Disable debug mode by default and control it through environment-specific settings.",
      },
      exposedDatabasePort: {
        title: "Database port exposed in container configuration",
        description: "A common database port is published to the host in a Docker or compose file.",
        recommendation: "Remove public database port mappings or bind them to localhost only for development.",
      },
      missingGitignore: {
        title: ".gitignore file not found",
        description: "The repository does not include a .gitignore file to prevent local artifacts from being committed.",
        recommendation: "Add a .gitignore covering dependencies, build output, logs, local env files, and OS files.",
      },
      missingEnvExample: {
        title: ".env.example file not found",
        description: "Environment variables appear to be used, but there is no safe example env file.",
        recommendation: "Add a .env.example with placeholder values and document each variable in the README.",
      },
      largeTree: {
        title: "Repository tree was truncated by GitHub",
        description: "GitHub did not return the complete recursive file tree, so the scan may be partial.",
        recommendation: "Run RepoSeal with a backend scanner for large repositories or narrow the scan scope.",
      },
    },
  },
  ko: {
    fetchFailed:
      "저장소를 읽을 수 없습니다. RepoSeal은 인증 없이 공개 GitHub 저장소를 스캔할 수 있습니다.",
    rateLimited:
      "GitHub API 요청 한도에 도달했습니다. 나중에 다시 시도하거나 향후 백엔드 인증을 추가해야 합니다.",
    summaryClean: "현재 규칙 기준으로 공개 전 차단 이슈가 발견되지 않았습니다.",
    summaryIssues: (count: number, files: number) =>
      `RepoSeal이 ${files}개 파일을 스캔했고 시크릿, 설정, 문서, 라이선스, 배포 항목에서 공개 전 이슈 ${count}개를 발견했습니다.`,
    risk: {
      safe: "공개 준비 완료",
      review: "검토 권장",
      fix: "공개 전 수정 필요",
      block: "아직 공개 금지",
    },
    issue: {
      riskyFile: (path: string): IssueText => ({
        title: `위험 파일 커밋 감지: ${path}`,
        description: "민감정보나 로컬 환경값을 포함할 수 있는 설정 파일이 저장소에 있습니다.",
        recommendation:
          "시크릿이 포함된 경우 Git 기록에서 제거하고 노출된 자격 증명을 교체한 뒤 안전한 예시 파일만 유지하세요.",
      }),
      secret: (label: string): IssueText => ({
        title: `${label} 패턴 의심 항목 발견`,
        description: "소스 관리 대상 파일에서 알려진 자격 증명 또는 토큰 패턴이 감지되었습니다.",
        recommendation: "값을 안전한 환경변수로 이동하고 실제 값이었다면 즉시 교체한 뒤 시크릿을 커밋하지 마세요.",
      }),
      noReadme: {
        title: "README 파일 없음",
        description: "사용자와 기여자를 위한 README가 저장소에 없습니다.",
        recommendation: "설치, 사용법, 설정, 라이선스, 배포 안내를 포함한 README를 추가하세요.",
      },
      readmeInstall: {
        title: "README 설치 섹션 누락",
        description: "README가 의존성 설치 방법을 명확히 설명하지 않습니다.",
        recommendation: "패키지 매니저별 정확한 설치 명령어를 포함한 설치 섹션을 추가하세요.",
      },
      readmeUsage: {
        title: "README 사용 또는 실행 방법 누락",
        description: "README가 프로젝트 실행 또는 사용 방법을 명확히 설명하지 않습니다.",
        recommendation: "사용법, 개발 실행, 프로덕션 실행 명령어를 추가하세요.",
      },
      readmeEnv: {
        title: "README 환경변수 설명 누락",
        description: "저장소에서 환경변수를 사용하지만 README에 설명이 없습니다.",
        recommendation: "필수 환경변수와 안전한 예시 값을 README에 문서화하세요.",
      },
      noLicense: {
        title: "LICENSE 파일 없음",
        description: "저장소 라이선스가 감지되지 않아 오픈소스 재사용 권한이 불명확합니다.",
        recommendation: "오픈소스로 공개하기 전에 LICENSE 파일을 추가하세요.",
      },
      corsWildcard: {
        title: "CORS 전체 허용 감지",
        description: "배포 대상 설정에서 모든 origin의 요청을 허용하는 것으로 보입니다.",
        recommendation: "허용 origin을 신뢰할 수 있는 production 및 preview 도메인으로 제한하세요.",
      },
      debugMode: {
        title: "Debug 모드 활성화 의심",
        description: "서버 또는 프레임워크 debug 설정이 커밋된 코드에서 활성화된 것으로 보입니다.",
        recommendation: "기본값에서는 debug 모드를 끄고 환경별 설정으로만 제어하세요.",
      },
      exposedDatabasePort: {
        title: "컨테이너 설정에서 데이터베이스 포트 노출",
        description: "Docker 또는 compose 파일에서 일반적인 데이터베이스 포트가 호스트에 공개되어 있습니다.",
        recommendation: "공개 데이터베이스 포트 매핑을 제거하거나 개발 환경에서만 localhost에 바인딩하세요.",
      },
      missingGitignore: {
        title: ".gitignore 파일 없음",
        description: "로컬 산출물 커밋을 막기 위한 .gitignore 파일이 없습니다.",
        recommendation: "의존성, 빌드 결과, 로그, 로컬 env 파일, OS 파일을 포함하는 .gitignore를 추가하세요.",
      },
      missingEnvExample: {
        title: ".env.example 파일 없음",
        description: "환경변수를 사용하는 것으로 보이지만 안전한 예시 env 파일이 없습니다.",
        recommendation: ".env.example에 placeholder 값을 넣고 README에 각 변수를 설명하세요.",
      },
      largeTree: {
        title: "GitHub가 저장소 파일 트리를 일부만 반환했습니다",
        description: "전체 recursive file tree를 받지 못해 스캔 결과가 부분적일 수 있습니다.",
        recommendation: "큰 저장소는 백엔드 스캐너로 실행하거나 스캔 범위를 줄이세요.",
      },
    },
  },
};

function filename(path: string): string {
  return path.split("/").pop() ?? path;
}

function extension(path: string): string {
  const name = filename(path).toLowerCase();
  const dotIndex = name.lastIndexOf(".");
  return dotIndex >= 0 ? name.slice(dotIndex) : "";
}

function normalizeInput(repositoryUrl: string): RepositoryReference {
  const url = new URL(repositoryUrl);
  const [owner, repo] = url.pathname.split("/").filter(Boolean);

  return {
    owner,
    repo,
    repositoryUrl: `https://github.com/${owner}/${repo}`,
  };
}

async function fetchJson<T>(url: string, signal: AbortSignal, language: Language): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
    signal,
  });

  if (response.status === 403 || response.status === 429) {
    throw new Error(copy[language].rateLimited);
  }

  if (!response.ok) {
    throw new Error(copy[language].fetchFailed);
  }

  return (await response.json()) as T;
}

function rawFileUrl(reference: RepositoryReference, branch: string, path: string): string {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");

  return `https://raw.githubusercontent.com/${reference.owner}/${reference.repo}/${encodeURIComponent(branch)}/${encodedPath}`;
}

async function fetchTextFile(
  reference: RepositoryReference,
  branch: string,
  path: string,
  signal: AbortSignal,
): Promise<FileContent | null> {
  const response = await fetch(rawFileUrl(reference, branch, path), { signal });

  if (!response.ok) {
    return null;
  }

  const content = await response.text();
  return { path, content };
}

function addIssue(
  issues: ScanIssue[],
  seen: Set<string>,
  issue: Omit<ScanIssue, "id"> & { id: string },
): void {
  if (seen.has(issue.id)) {
    return;
  }

  seen.add(issue.id);
  issues.push(issue);
}

function isExampleValue(match: string): boolean {
  return /example|placeholder|changeme|change_me|replace_me|dummy|your_|xxx|test[_-]?key|sample/i.test(match);
}

function hasAnyFile(fileNames: Set<string>, candidates: string[]): boolean {
  return candidates.some((candidate) => fileNames.has(candidate));
}

function buildIssue(id: string, text: IssueText, file: string, severity: Severity): ScanIssue {
  return {
    id,
    file,
    severity,
    title: text.title,
    description: text.description,
    recommendation: text.recommendation,
  };
}

function scanRiskyFiles(
  files: GitHubTreeItem[],
  issues: ScanIssue[],
  seen: Set<string>,
  language: Language,
): void {
  for (const file of files) {
    const lowerPath = file.path.toLowerCase();

    if (/\.env\.(example|sample|template|dist)$/i.test(lowerPath)) {
      continue;
    }

    for (const rule of riskyFileRules) {
      if (!rule.match(file.path)) {
        continue;
      }

      addIssue(
        issues,
        seen,
        buildIssue(
          `risky-file:${rule.key}:${file.path}`,
          copy[language].issue.riskyFile(file.path),
          file.path,
          rule.severity,
        ),
      );
    }
  }
}

function scanSecrets(
  contents: FileContent[],
  issues: ScanIssue[],
  seen: Set<string>,
  language: Language,
): void {
  for (const file of contents) {
    for (const pattern of secretPatterns) {
      pattern.regex.lastIndex = 0;
      const matches = file.content.match(pattern.regex) ?? [];
      const realMatch = matches.find((match) => !isExampleValue(match));

      if (!realMatch) {
        continue;
      }

      addIssue(
        issues,
        seen,
        buildIssue(
          `secret:${pattern.id}:${file.path}`,
          copy[language].issue.secret(pattern.label[language]),
          file.path,
          pattern.severity,
        ),
      );
    }
  }
}

function scanReadme(
  contents: FileContent[],
  files: GitHubTreeItem[],
  issues: ScanIssue[],
  seen: Set<string>,
  language: Language,
): void {
  const readme = contents.find((file) => /^readme(\..+)?$/i.test(filename(file.path)));
  const usesEnv = contents.some((file) =>
    /\b(?:process\.env|import\.meta\.env|Deno\.env|getenv\s*\(|os\.environ|ENV\[|VITE_[A-Z0-9_]+|REACT_APP_[A-Z0-9_]+)/i.test(
      file.content,
    ),
  );
  const hasEnvFile = files.some((file) => /^\.env($|\.)/i.test(filename(file.path)));

  if (!readme) {
    addIssue(issues, seen, buildIssue("readme:missing", copy[language].issue.noReadme, "README.md", "medium"));
    return;
  }

  const text = readme.content.toLowerCase();
  const hasInstall = /(^|\n)#{1,4}\s*(installation|install|setup|getting started|설치|시작)|npm install|pnpm install|yarn install|pip install|composer install|cargo build/i.test(
    readme.content,
  );
  const hasUsage = /(^|\n)#{1,4}\s*(usage|run|development|local|quick start|사용|실행|개발)|npm run|pnpm dev|yarn dev|vite|docker compose/i.test(
    readme.content,
  );
  const documentsEnv = /environment|env var|\.env|환경변수|환경 변수|설정 변수/i.test(readme.content);

  if (!hasInstall) {
    addIssue(issues, seen, buildIssue("readme:install", copy[language].issue.readmeInstall, readme.path, "medium"));
  }

  if (!hasUsage) {
    addIssue(issues, seen, buildIssue("readme:usage", copy[language].issue.readmeUsage, readme.path, "medium"));
  }

  if ((usesEnv || hasEnvFile || text.includes("api key")) && !documentsEnv) {
    addIssue(issues, seen, buildIssue("readme:env", copy[language].issue.readmeEnv, readme.path, "medium"));
  }
}

function scanLicense(
  repository: GitHubRepository,
  fileNames: Set<string>,
  issues: ScanIssue[],
  seen: Set<string>,
  language: Language,
): void {
  const hasLicense = repository.license || hasAnyFile(fileNames, ["license", "license.md", "license.txt", "copying"]);

  if (!hasLicense) {
    addIssue(issues, seen, buildIssue("license:missing", copy[language].issue.noLicense, "LICENSE", "low"));
  }
}

function scanDeploymentRisks(
  contents: FileContent[],
  issues: ScanIssue[],
  seen: Set<string>,
  language: Language,
): void {
  const configFiles = contents.filter((file) => /\.(js|jsx|ts|tsx|py|rb|go|php|json|ya?ml|toml|ini|conf)$/i.test(file.path));

  for (const file of configFiles) {
    if (
      /access-control-allow-origin["']?\s*[:=]\s*["']\*["']|origin\s*[:=]\s*["']\*["']|allow_origins\s*=\s*\[\s*["']\*["']\s*\]/i.test(
        file.content,
      )
    ) {
      addIssue(
        issues,
        seen,
        buildIssue(`deploy:cors:${file.path}`, copy[language].issue.corsWildcard, file.path, "high"),
      );
    }

    if (
      /\bdebug\s*[:=]\s*true\b|\bDEBUG\s*=\s*True\b|app\.run\([^)]*debug\s*=\s*True|NODE_ENV\s*=\s*development/i.test(
        file.content,
      )
    ) {
      addIssue(
        issues,
        seen,
        buildIssue(`deploy:debug:${file.path}`, copy[language].issue.debugMode, file.path, "medium"),
      );
    }

    if (
      /(?:ports:\s*[\s\S]{0,180})["']?(5432|3306|6379|27017|9200):\1["']?|EXPOSE\s+(5432|3306|6379|27017|9200)/i.test(
        file.content,
      )
    ) {
      addIssue(
        issues,
        seen,
        buildIssue(
          `deploy:db-port:${file.path}`,
          copy[language].issue.exposedDatabasePort,
          file.path,
          "high",
        ),
      );
    }
  }
}

function scanPublicReadyChecklist(
  fileNames: Set<string>,
  contents: FileContent[],
  files: GitHubTreeItem[],
  issues: ScanIssue[],
  seen: Set<string>,
  language: Language,
): void {
  if (!fileNames.has(".gitignore")) {
    addIssue(issues, seen, buildIssue("checklist:gitignore", copy[language].issue.missingGitignore, ".gitignore", "low"));
  }

  const usesEnv = contents.some((file) =>
    /\b(?:process\.env|import\.meta\.env|Deno\.env|getenv\s*\(|os\.environ|ENV\[|VITE_[A-Z0-9_]+|REACT_APP_[A-Z0-9_]+)/i.test(
      file.content,
    ),
  );
  const committedEnv = files.some((file) => /^\.env($|\.)/i.test(filename(file.path)));
  const hasEnvExample = Array.from(fileNames).some((name) => /^\.env\.(example|sample|template|dist)$/i.test(name));

  if ((usesEnv || committedEnv) && !hasEnvExample) {
    addIssue(
      issues,
      seen,
      buildIssue("checklist:env-example", copy[language].issue.missingEnvExample, ".env.example", "low"),
    );
  }
}

function shouldFetchFile(file: GitHubTreeItem): boolean {
  if (file.type !== "blob") {
    return false;
  }

  if (file.size && file.size > MAX_FILE_SIZE) {
    return false;
  }

  const name = filename(file.path).toLowerCase();
  const ext = extension(file.path);

  return (
    sourceExtensions.has(ext) ||
    /^readme(\..+)?$/i.test(name) ||
    name === "dockerfile" ||
    name === ".gitignore" ||
    name === ".npmrc" ||
    name === ".pypirc" ||
    /^\.env($|\.)/i.test(name) ||
    riskyFileRules.some((rule) => rule.match(file.path))
  );
}

function scoreIssues(issues: ScanIssue[]): number {
  const weights: Record<Severity, number> = {
    critical: 18,
    high: 10,
    medium: 6,
    low: 3,
  };

  const penalty = issues.reduce((total, issue) => total + weights[issue.severity], 0);
  return Math.max(0, 100 - Math.min(100, penalty));
}

function riskLevel(score: number, issues: ScanIssue[], language: Language): string {
  const hasCritical = issues.some((issue) => issue.severity === "critical");
  const hasHigh = issues.some((issue) => issue.severity === "high");

  if (hasCritical || score < 50) {
    return copy[language].risk.block;
  }

  if (hasHigh || score < 80) {
    return copy[language].risk.fix;
  }

  if (issues.length > 0) {
    return copy[language].risk.review;
  }

  return copy[language].risk.safe;
}

export async function scanGitHubRepository(
  repositoryUrl: string,
  language: Language,
  signal: AbortSignal,
): Promise<ScanResult> {
  const reference = normalizeInput(repositoryUrl);
  const repository = await fetchJson<GitHubRepository>(
    `https://api.github.com/repos/${reference.owner}/${reference.repo}`,
    signal,
    language,
  );
  const tree = await fetchJson<GitHubTree>(
    `https://api.github.com/repos/${reference.owner}/${reference.repo}/git/trees/${encodeURIComponent(repository.default_branch)}?recursive=1`,
    signal,
    language,
  );

  const files = tree.tree.filter((item) => item.type === "blob");
  const fileNames = new Set(files.map((file) => filename(file.path).toLowerCase()));
  const issues: ScanIssue[] = [];
  const seen = new Set<string>();

  const fetchTargets = files
    .filter(shouldFetchFile)
    .sort((a, b) => {
      const aRisk = riskyFileRules.some((rule) => rule.match(a.path)) ? 0 : 1;
      const bRisk = riskyFileRules.some((rule) => rule.match(b.path)) ? 0 : 1;
      return aRisk - bRisk || (a.size ?? 0) - (b.size ?? 0);
    })
    .slice(0, MAX_FILES_TO_FETCH);
  const contents = (
    await Promise.all(
      fetchTargets.map((file) => fetchTextFile(reference, repository.default_branch, file.path, signal)),
    )
  ).filter((file): file is FileContent => Boolean(file));

  scanRiskyFiles(files, issues, seen, language);
  scanSecrets(contents, issues, seen, language);
  scanReadme(contents, files, issues, seen, language);
  scanLicense(repository, fileNames, issues, seen, language);
  scanDeploymentRisks(contents, issues, seen, language);
  scanPublicReadyChecklist(fileNames, contents, files, issues, seen, language);

  if (tree.truncated) {
    addIssue(issues, seen, buildIssue("tree:truncated", copy[language].issue.largeTree, repository.default_branch, "medium"));
  }

  const score = scoreIssues(issues);

  return {
    repositoryUrl: reference.repositoryUrl,
    score,
    riskLevel: riskLevel(score, issues, language),
    summary:
      issues.length === 0 ? copy[language].summaryClean : copy[language].summaryIssues(issues.length, contents.length),
    issues,
  };
}
