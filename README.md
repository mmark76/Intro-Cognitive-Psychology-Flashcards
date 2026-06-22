# Intro Cognitive Psychology Study App

Local-first web application / PWA for studying cognitive psychology chapters and flashcards.

## Current MVP

- 16 chapter summaries, learning objectives and key terms.
- 100 interactive flashcards with self-rating `0 / 1 / 2`.
- Local spaced-repetition schedule.
- Due-review queue.
- Ten-question quizzes.
- Local progress dashboard.
- Validated JSON backup and restore.
- Offline-ready PWA, without accounts or backend.

## Technology

React, TypeScript, Vite, `vite-plugin-pwa`, Dexie and IndexedDB.

## Development

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

## Data and privacy

Study progress remains in the browser's IndexedDB unless the user exports a backup file. Imported backups are validated before any local data is replaced.

## Deployment

The production build is configured for GitHub Pages at:

```text
https://mmark76.github.io/Intro-Cognitive-Psychology-Flashcards/
```

Deployment occurs from `main` through the GitHub Pages workflow after verification succeeds.

## Project rules

Development follows [`GENERAL_SOFTWARE_PROJECT_GUIDE.md`](./GENERAL_SOFTWARE_PROJECT_GUIDE.md): small files, clear responsibilities, feature-based organisation, low coupling, tests and controlled changes.
