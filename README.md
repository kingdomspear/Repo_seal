# RepoSeal

RepoSeal is an open-source web service for checking GitHub repositories before they become public. It scans exposed secrets, risky configuration files, README quality issues, missing licenses, deployment risks, and public-ready checklist gaps, then presents a safety report with fix guidance.

The current version runs as a static frontend and scans public GitHub repositories directly from the browser with the GitHub API. Private repositories and authenticated high-volume scans require a backend integration in a future release.

## Features

- GitHub repository URL and GitHub Pages project URL input with validation
- English and Korean language toggle
- Real public repository scan flow with loading state and automatic result scrolling
- Public Safety Score and release risk summary
- Severity-tagged issues for secrets, risky files, documentation, license, CORS, debug mode, and Docker exposure
- Feature cards for secret detection, risky config scanning, README checks, deployment review, public-ready checklist, and auto fix guidance
- Responsive dark glassmorphism UI inspired by modern developer tooling

## Scanner Rules

- Secret detection: OpenAI keys, GitHub tokens, AWS access keys, Google API keys, Slack tokens, private key blocks, JWT-like tokens, and generic secret assignments
- Risky config scan: `.env`, `.npmrc`, `.pypirc`, `.netrc`, private key files, certificate/key bundles, and SSH private keys
- README quality check: missing README, missing installation steps, missing usage/run instructions, and missing environment variable documentation
- License check: missing GitHub license metadata or common license files
- Deployment risk review: wildcard CORS, enabled debug mode, and exposed database ports in Docker/container configuration
- Public-ready checklist and auto fix guide: missing `.gitignore`, missing `.env.example`, and fix recommendations for every issue

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Build

```bash
npm run build
```

## GitHub Pages Deployment

This project is configured for the repository URL `https://kingdomspear.github.io/Repo_seal/`.

Deployment runs through GitHub Actions in `.github/workflows/deploy.yml`. In the repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**, then push to `main`.

If the live site tries to load `/src/main.tsx`, GitHub Pages is serving the repository root instead of the built `dist` artifact. Re-run the Pages workflow after switching the source to **GitHub Actions**.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons

## Roadmap

- Connect a backend scanner to the GitHub API
- Add rule-based secret and config detection
- Generate `.gitignore`, `.env.example`, and README fix suggestions
- Add repository history checks for leaked secrets
- Export scan reports as Markdown or JSON
- Add CI workflow integration for pull requests

## License

MIT License. See [LICENSE](./LICENSE).
