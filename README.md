# Intro Cognitive Psychology Study App

Local-first web application / PWA for studying the two repository PDFs more effectively.

## Current MVP

- 16 chapter summaries, learning objectives and key terms.
- 100 interactive flashcards with self-rating `0 / 1 / 2`.
- Local spaced-repetition schedule.
- Due-review queue.
- Ten-question quizzes.
- Local progress dashboard.
- JSON backup and restore.
- Offline-ready PWA, without accounts or backend.

## Technology

React, TypeScript, Vite, `vite-plugin-pwa`, Dexie and IndexedDB.

## Development

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

## Data and privacy

The educational content is derived from the two PDFs stored in this repository. Study progress remains in the browser's IndexedDB unless the user exports a backup file.

## Project rules

Development follows [`GENERAL_SOFTWARE_PROJECT_GUIDE.md`](./GENERAL_SOFTWARE_PROJECT_GUIDE.md): small files, clear responsibilities, feature-based organisation, low coupling, tests and controlled changes.
