# Study App Architecture

## Scope

The first release is a local-first PWA. It has no authentication, remote database or backend API.

## Boundaries

- `src/app`: application bootstrap and routing.
- `src/features`: user-facing capabilities organised by feature.
- `src/data`: immutable educational content extracted from the two source PDFs.
- `src/infrastructure/database`: Dexie / IndexedDB persistence.
- `src/shared`: reusable components, styles, types and utilities.

## Data ownership

Chapter and flashcard content is bundled with the app and treated as read-only. Progress, sessions and settings are user data and remain in IndexedDB.

## Spaced repetition

The algorithm intentionally starts simple and deterministic:

- `0`: retry after ten minutes and count a lapse.
- `1`: first interval one day; subsequent intervals grow by `1.8`.
- `2`: first intervals three and seven days; subsequent intervals grow by `2.5`.
- Intervals are capped at 180 days.

The algorithm is isolated in `features/review/spacedRepetition.ts` so it can be replaced without changing UI or storage code.
