# TalentFlow — Hiring workflow demo (React + Vite)

This repository is a small, single-page hiring-management demo built with React + Vite. It demonstrates an in-browser persistence layer (IndexedDB via `idb`), a compact UI for jobs, candidates and assessments, and responsive/mobile-friendly navigation patterns.

This README documents how the platform is organized, how data flows, the important routes/pages/components, and how to run and troubleshoot the app locally.

---

## Quick start

Requirements: Node.js (16+ recommended), npm

1. Install dependencies

```powershell
cd C:\Users\indra\Desktop\Talentflow
npm install
```

2. Run the dev server

```powershell
npm run dev
```

3. Open the app in your browser (Vite prints the local URL, typically http://localhost:5173)

4. On first run the app seeds the database with mock jobs, candidates and assessments. To re-seed later delete the `talentFlowDB` entry from DevTools → Application → IndexedDB and refresh the app.

## What this app does (at a glance)

- Jobs Board: list, create, edit, reorder and delete jobs. Jobs have a `status` (active/archived), `tags`, `order`, and free-text details.
- Candidates: per-job candidates with simple pipeline stages (applied, screen, tech, offer, hired, rejected).
- Assessment Builder: create per-job assessments made of sections and questions. Preview/simulate taking an assessment. File-upload question type reads files into memory as data URLs for preview and download.
- Persistence: all data is stored in IndexedDB using `idb`. Initial dataset is seeded on first run.
- Mobile UX: responsive layout with a top-right mobile FAB that opens quick navigation (Dashboard, Jobs, Candidates, Assessments).

## Tech & dependencies

Core dependencies (as listed in `package.json`):

- react, react-dom — UI library
- vite — dev server and build tool
- idb — a tiny IndexedDB wrapper used for on-device persistence
- dexie — included in `package.json` but the current persistence implementation uses `idb`
- lucide-react — icons
- tailwindcss / @tailwindcss/vite — styling utility (used via classes in JSX)
- react-router-dom — present in `package.json` but the app uses an internal `navigate(page, id)` function instead of router-based URLs

Dev dependencies include Vite plugins and ESLint configuration used for local development.

## High-level architecture

- Single-page React app (no server required).
- Data source: IndexedDB (`src/lib/indexedDB.js`) using `idb`.
  - On first run the app seeds data from `src/data/seed.js`.
  - `src/lib/dataPersistence.js` provides `loadData()` and `saveData()` wrappers that the app uses to persist changes.
- UI state is lifted to `App.jsx` in the top-level `data` state object and passed down to pages/components.
  - `App.jsx` also contains handlers for updates (create/edit job, reorder, delete, candidate updates, assessments save) and calls `saveData()` to persist changes.
- Simulated API latency: `src/hooks/useSimulatedApi.js` wraps UI updates and simulates success/failure latencies for optimistic UI patterns.

## Navigation & routes (logical pages)

The app uses a simple `navigate(page, id)` approach (emulating routes). Supported logical pages:

- `dashboard` — DashboardPage (overview)
- `jobs` — JobsBoard (grid/list of jobs)
- `jobs/:id` — JobDetail (job detail/edit view; navigate('jobs/:id', jobId) )
- `candidates` — CandidatesBoard (pipeline Kanban-like columns)
- `candidates/:id` — CandidateProfile (profile view)
- `assessments` — AssessmentsBuilder (builder + preview)

The mobile FAB (top-right) offers quick navigation to Dashboard / Jobs / Candidates / Assessments on small screens.

## Data models (shapes)

Primary shapes used by the app:

- Job

```js
{
  id: string,
  title: string,
  slug: string,
  status: 'active' | 'archived',
  tags: string[],
  order: number,
  description: string,
  createdAt: ISOString
}
```

- Candidate

```js
{
  id: string,
  name: string,
  email: string,
  jobId: string,
  stage: string, // applied, screen, tech, offer, hired, rejected
  appliedDate: ISOString,
  timeline: [{ status, timestamp }],
  notes: string[]
}
```

- Assessment

```js
{
  jobId: string, // key for assessments store
  title: string,
  sections: [
    {
      id: string,
      title: string,
      questions: [ { id, type, label, required, options?, ... } ]
    }
  ]
}
```

File uploads (preview only):

```js
{ name: string, type: string, size: number, dataUrl: string }
```

## Important behaviors

- Seeding: `indexedDB.js` seeds the DB on first run using `seedData()`.
- Load/save: `dataPersistence.loadData()` reads from IndexedDB; `saveData()` writes back. `App.jsx` calls these on mount and on data change.
- Optimistic updates: editing, reordering, deletions are applied locally first; `useSimulatedApi` may simulate failure and the app will rollback the change.
- Deleting a job: removes the job and associated candidates and assessments (optimistic; rollback on failure).
- Assessments: saving writes to IndexedDB keyed by `jobId`. File-upload questions create a Data URL in memory for preview/download; no server upload implemented.

## Files to inspect (quick references)

- `src/App.jsx` — main state and handlers
- `src/lib/indexedDB.js` and `src/lib/dataPersistence.js` — persistence
- `src/pages/JobsBoard.jsx`, `src/components/Jobs/JobCard.jsx`, `src/components/Jobs/JobModal.jsx` — job flows
- `src/pages/AssessmentsBuilder.jsx`, `src/components/Assessments/*` — assessment builder and preview
- `src/hooks/useSimulatedApi.js` — simulated API wrapper

## Troubleshooting

- If UI shows stale values after code changes, stop and restart the dev server. Also clear HMR overlay errors and check the browser console.
- If seeded data needs to be regenerated, remove the `talentFlowDB` IndexedDB entry in DevTools → Application and refresh the app. 
- If you previously used MSW/service worker, unregister any service worker in DevTools → Application and reload.

---

If you'd like I can also:
- Add a short API reference section documenting `dbOperations` and `dataPersistence` functions.
- Wire file uploads into IndexedDB or to a mock server.

Tell me what you'd like next.
