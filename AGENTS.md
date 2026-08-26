# Repository Guidelines

## Overview

**edu-sw** is a static-site React app for Vietnamese high-school exam practice. Exam content loads from JSON files in `public/data/` — no backend is required. Deployed via GitHub Pages.

## Project Structure & Module Organization

```
edu-sw/
├── public/data/          # Static exam JSON files + images
│   ├── exams/            # Exam definitions (one .json per exam)
│   └── images/           # Exam-specific images
├── src/
│   ├── api/              # Data-fetching (exam.api.ts)
│   ├── components/       # Reusable UI components
│   ├── hook/             # React hooks
│   ├── layouts/          # Page layout wrappers
│   ├── pages/            # Route-level pages
│   ├── routes/           # React Router definitions
│   ├── type/             # TypeScript types
│   ├── App.tsx           # App shell
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles (Tailwind)
├── template/             # JSON templates for new exams
├── dist/                 # Build output (git-ignored)
└── vite.config.ts
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (HMR, `0.0.0.0`) |
| `npm run build` | Type-check (`tsc -b`) and bundle with Vite |
| `npm run lint` | Static analysis with `oxlint` |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build + publish to GitHub Pages |

## Coding Style & Naming

- **2-space indentation** (oxlint-enforced). **TypeScript** (.ts / .tsx).
- **Components & hooks:** PascalCase (`CardExam`, `useSubmitQuestionAnswer`).
- **Functions & variables:** camelCase (`calculateScore`, `loadExamData`).
- **JSDoc:** bilingual format — English first, Vietnamese second.
- **File structure:** helpers before public exports so dependencies read top-to-bottom.
- **Tailwind:** utility-first classes on JSX elements.

## Testing

No testing framework is configured. When added, follow:

- File naming: `src/<module>/<module>.test.ts`.
- Run with `npm test` (script to be configured).

## Commit & Pull Request Guidelines

- **Commits:** Conventional Commits format — `type: description` (`feat`, `fix`, `chore`, `docs`, `refactor`, `data`). Example: `feat: add field class_exam and updated`.
- **PRs:** one-paragraph summary, linked issues, screenshots for UI changes. Do not commit `dist/` or `package-lock.json` unless the PR intentionally updates dependencies.

## Deployment

`npm run deploy` builds, copies `dist/index.html` → `dist/404.html` for SPA routing, and publishes to the `gh-pages` branch. Ensure `npm run lint` passes before deploying.
