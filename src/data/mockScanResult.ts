import type { ScanResult } from "../types/scan";
import type { Language } from "../types/language";

const scanResults: Record<Language, Omit<ScanResult, "repositoryUrl">> = {
  en: {
    score: 72,
    riskLevel: "Needs Fix Before Public Release",
    summary:
      "RepoSeal found several public-release blockers across secrets, configuration, documentation, and deployment settings.",
    issues: [
      {
        id: "env-file",
        title: ".env file detected",
        description:
          "A local environment file appears to be committed and may contain secrets or machine-specific values.",
        file: ".env",
        severity: "critical",
        recommendation:
          "Remove the file from Git history, rotate any exposed credentials, and commit a safe .env.example instead.",
      },
      {
        id: "openai-key",
        title: "Possible OpenAI API key pattern found",
        description:
          "A string matching an API key pattern was found in source-controlled application code.",
        file: "src/server/client.ts",
        severity: "critical",
        recommendation:
          "Move the key into a server-side environment variable and rotate the leaked value before publishing.",
      },
      {
        id: "readme-install",
        title: "README missing installation section",
        description:
          "The README does not explain how contributors can install dependencies and run the project locally.",
        file: "README.md",
        severity: "medium",
        recommendation:
          "Add installation, development, and environment setup sections with exact commands.",
      },
      {
        id: "license-missing",
        title: "LICENSE file not found",
        description:
          "No repository license was detected, which makes reuse rights unclear for open-source users.",
        file: "LICENSE",
        severity: "low",
        recommendation:
          "Add an MIT, Apache-2.0, GPL, or other appropriate license file before opening the repository.",
      },
      {
        id: "cors-wildcard",
        title: "CORS wildcard origin detected",
        description:
          "The application appears to allow requests from every origin in a deployment-facing route.",
        file: "src/api/server.ts",
        severity: "high",
        recommendation: "Restrict allowed origins to trusted production and preview domains.",
      },
      {
        id: "db-port",
        title: "Database port exposed in docker-compose.yml",
        description:
          "The database service publishes its port to the host, which can expose local data during demos or deployments.",
        file: "docker-compose.yml",
        severity: "high",
        recommendation: "Remove the public port mapping or bind it to localhost only for development.",
      },
    ],
  },
  ko: {
    score: 72,
    riskLevel: "공개 전 수정 필요",
    summary:
      "RepoSeal이 시크릿, 설정, 문서, 배포 항목에서 공개 전 해결해야 할 위험 요소를 발견했습니다.",
    issues: [
      {
        id: "env-file",
        title: ".env 파일 감지",
        description:
          "로컬 환경 파일이 저장소에 커밋된 것으로 보이며 시크릿이나 개인 환경값을 포함할 수 있습니다.",
        file: ".env",
        severity: "critical",
        recommendation:
          "Git 기록에서 파일을 제거하고 노출 가능성이 있는 자격 증명을 교체한 뒤 안전한 .env.example을 커밋하세요.",
      },
      {
        id: "openai-key",
        title: "OpenAI API 키 패턴 의심 항목 발견",
        description: "소스 코드에서 API 키 패턴과 일치하는 문자열이 발견되었습니다.",
        file: "src/server/client.ts",
        severity: "critical",
        recommendation:
          "키를 서버 환경변수로 이동하고 공개 전에 노출된 값을 반드시 교체하세요.",
      },
      {
        id: "readme-install",
        title: "README 설치 섹션 누락",
        description:
          "README에 의존성 설치와 로컬 실행 방법이 충분히 설명되어 있지 않습니다.",
        file: "README.md",
        severity: "medium",
        recommendation:
          "설치, 개발 실행, 환경 설정 섹션을 추가하고 실제 명령어를 명확히 적으세요.",
      },
      {
        id: "license-missing",
        title: "LICENSE 파일 없음",
        description:
          "저장소 라이선스가 감지되지 않아 오픈소스 사용 권한이 불명확합니다.",
        file: "LICENSE",
        severity: "low",
        recommendation:
          "공개 전에 MIT, Apache-2.0, GPL 등 프로젝트에 맞는 라이선스 파일을 추가하세요.",
      },
      {
        id: "cors-wildcard",
        title: "CORS 전체 허용 감지",
        description:
          "배포 대상 라우트에서 모든 origin의 요청을 허용하는 설정이 있는 것으로 보입니다.",
        file: "src/api/server.ts",
        severity: "high",
        recommendation: "허용 origin을 신뢰할 수 있는 production 및 preview 도메인으로 제한하세요.",
      },
      {
        id: "db-port",
        title: "docker-compose.yml에서 데이터베이스 포트 노출",
        description:
          "데이터베이스 서비스 포트가 호스트에 공개되어 데모나 배포 과정에서 데이터가 노출될 수 있습니다.",
        file: "docker-compose.yml",
        severity: "high",
        recommendation:
          "공개 포트 매핑을 제거하거나 개발 환경에서만 localhost에 바인딩하세요.",
      },
    ],
  },
};

export const mockScanResult: ScanResult = {
  repositoryUrl: "https://github.com/user/repository",
  ...scanResults.en,
};

export function createMockScanResult(repositoryUrl: string, language: Language): ScanResult {
  return {
    ...scanResults[language],
    repositoryUrl,
  };
}
