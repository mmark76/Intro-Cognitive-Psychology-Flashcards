# Stabilisation Verification Report

## Baseline

- Repository: `mmark76/Intro-Cognitive-Psychology-Flashcards`
- Base branch: `main`
- Baseline commit: `f4fda6ebb7dfe236da1970fc8195bbd48338a738`
- Working branch: `stabilize-and-deploy`
- Main branch modified: No

## Verified changes

- Removed temporary write-enabled patch workflows.
- Removed encoded correction and fix payload chunks.
- Removed stray `NO3` file.
- Added a generated npm lockfile for reproducible installs.
- Added read-only CI for type checking, tests, production build and production dependency audit.
- Added GitHub Pages build and deployment workflow, restricted to `main`.
- Configured the Vite and PWA base path for the repository Pages URL.
- Added strict backup validation before replacing IndexedDB data.
- Added interaction locks to prevent duplicate flashcard and quiz persistence.
- Added backup-validation unit tests.
- Expanded generated-artifact ignore rules.

## Automated verification performed on the branch

The finalisation workflow completed these commands successfully before committing the clean tree:

```text
npm ci
npm run typecheck
npm test
npm run build
```

The permanent CI workflow repeats those checks and also runs:

```text
npm audit --omit=dev --audit-level=high
```

## Deployment boundary

The Pages deployment workflow runs only after a push to `main` or a manual workflow dispatch. This branch has not been merged, so `main` and the production deployment remain unchanged.

## Remaining actions

1. Review and merge the Pull Request only after CI succeeds.
2. In repository Settings → Pages, select GitHub Actions as the Pages source if it is not already selected.
3. Confirm the deployed URL and perform a browser/PWA smoke test.
4. Delete obsolete historical branches only after production verification.
