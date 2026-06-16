# RepoSeal

RepoSeal is an open-source web service concept for checking GitHub repositories before they become public. It scans for exposed secrets, risky configuration files, README quality issues, missing licenses, and deployment risks, then presents a public-ready safety report.

This repository currently contains a frontend MVP built with mock scan data. No GitHub API or backend scanner is connected yet.

## Features

- GitHub repository URL input with basic validation
- English and Korean language toggle
- Demo scan flow with loading state and automatic result scrolling
- Public Safety Score and release risk summary
- Severity-tagged issues for secrets, configs, documentation, license, CORS, and Docker exposure
- Feature cards for secret detection, risky config scanning, README checks, deployment review, public-ready checklist, and auto fix guidance
- Responsive dark glassmorphism UI inspired by modern developer tooling

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
