#  TalentFlow — A Mini Hiring Platform Demo (React + Vite)

- **Live Demo:** [https://entnt-talentflow-inky.vercel.app/](https://entnt-talentflow-inky.vercel.app/)
- **GitHub Repository:** [https://github.com/indrajeetPanjiyar/ENTNT_Talentflow](https://github.com/indrajeetPanjiyar/ENTNT_Talentflow)

This repository is a comprehensive, single-page application demonstrating a **mini hiring management platform** built with **React** and **Vite**. It was completed as a front-end technical assignment focusing on complex state management, optimistic UI updates, local persistence, and simulated network interactions.

---

## ✨ Features and Core Flows

TalentFlow provides an HR team with tools to manage Jobs, Candidates, and Assessments, all without a real backend server.

### 1. 💼 Jobs Management
* **Jobs Board:** A list view supporting **server-like pagination and filtering** (by title, status, and tags).
* **CRUD Operations:** Create/Edit job details via a modal/route with validation (title required, unique slug).
* **Status Control:** Archive/Unarchive jobs.
* **Reordering:** Implements **drag-and-drop reordering** with **optimistic updates** and **rollback on simulated API failure** (500 error).
* **Deep Linking:** Jobs are accessible directly via a dedicated route: `/jobs/:jobId`.

### 2. 👥 Candidate Pipeline
* **Virtualized List:** Supports 1000+ seeded candidates with efficient **client-side search** (name/email) and **server-like filtering** (current stage).
* **Candidate Profile:** Route `/candidates/:id` shows a **timeline of status changes** and attached notes.
* **Kanban Board:** Move candidates between stages (**applied, screen, tech, offer, hired, rejected**) using an intuitive **drag-and-drop Kanban interface**.
* **Notes:** Functionality to attach notes with basic rendering of **@mentions** (suggestions from a local list).

### 3. 📝 Assessment Builder & Runtime
* **Job-Specific Builder:** Allows HR to create job-specific assessments by adding **sections** and various **question types**:
    * Single/Multi-choice
    * Short/Long Text
    * Numeric (with range)
    * File Upload (stub, reads to Data URL)
* **Live Preview:** A pane that renders the assessment as a **fillable form** instantly as it's being built.
* **Form Runtime:** Supports validation rules (**required, numeric range, max length**) and **conditional questions** (e.g., show Q3 only if Q1 = 'Yes').
* **Persistence:** Both the assessment builder state and candidate responses are stored **locally**.

---

## 🏗️ Technical Decisions & Architecture

This project simulates a full-stack application environment using modern front-end tools.

### 💾 Data & Persistence (The "Backend")
* **Local Persistence:** All application state is persisted locally using **IndexedDB** via the lightweight **`idb`** library.
* **Data Restoration:** The app's state is fully restored from IndexedDB upon page refresh.
* **Seeding:** The database is seeded on the first run with **25 jobs (mixed status), 1,000 candidates**, and **3+ complex assessments**.

### 📡 Simulated API Layer
* **No Real Server:** The application operates entirely without a traditional backend.
* **Latency & Errors:** A custom hook, `useSimulatedApi.js`, wraps all write operations to **inject artificial latency (200–1200ms)** and a **5–10% error rate** on critical endpoints (like reordering). This is crucial for testing the **optimistic UI** pattern and error handling.
* **Write-Through:** Persistence logic handles "writing through" the simulated network layer directly to IndexedDB.

### 🌐 High-Level Architecture
* **App Structure:** A Single-Page Application (SPA) where global state is lifted to `src/App.jsx`.
* **State Management:** Top-level state (`data`) holds all jobs, candidates, and assessments and is passed down to pages/components.
* **Navigation:** Uses a simple internal `Maps(page, id)` function to manage logical routes, providing a seamless SPA experience without full reliance on `react-router-dom` (though it is included in `package.json`).
* **Mobile UX:** Implements a responsive layout with a floating action button (FAB) for quick navigation on small screens.

### Core Technologies

| Technology | Purpose |
| :--- | :--- |
| **React** & **Vite** | Primary UI library and build tool. |
| **idb** | Lightweight wrapper for IndexedDB (core persistence layer). |
| **msw** | For mock request and api calls.|
| **Tailwind CSS** | Utility-first framework for rapid and responsive styling. |
| **lucide-react** | Clean, modern icons. |
| **`useSimulatedApi.js`** | Custom hook for network simulation (latency/errors/rollback). |

---

## 📁 Project Folder Structure
- The project uses a standard **Vite + React** structure with a logical organization based on application domain and type of file, promoting clean separation of concerns and maintainability.
```
├── public/
| ├── mockServiceWorker.js
├── src/
│ ├── components/
│ │ ├── Assessments/
│ │ ├── Candidates/
│ │ ├── Jobs/
│ │ ├── Layout/
│ ├── data/
│ │ └── seed.js
│ │ └── assessmentData.js
│ ├── hooks/
│ │ └── useSimulatedApi.js
│ ├── lib/
│ │ ├── dataPersistence.js
│ │ ├── indexedDB.js
│ ├── mocks/
│ │ ├── browser.js
│ │ ├── handlers.js
│ ├── pages/
│ │ ├── AssessmentsBuilder.jsx
│ │ ├── CandidateProfile.jsx
│ │ ├── CandidatesBoard.jsx
│ │ ├── DashboardPage.jsx
│ │ ├── JobDetail.jsx
│ │ └── JobsBoard.jsx
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ Data Models (Shapes)

The primary data structures persisted in IndexedDB:

### Job
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

### Candidate
```js
{
  id: string,
  name: string,
  email: string,
  jobId: string,
  stage: string, // applied, screen, tech, offer, hired, rejected
  appliedDate: ISOString,
  timeline: [{ status, timestamp }],
  notes: string[] // basic @mention rendering
}
```

### Assessment (Stored per-job)
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

## Getting Started
- Prerequisites
  - Node.js (16+ recommended)
  - npm
 
- Local Setup
  - **Clone the repository and navigate to the project directory:**
  ```
      git clone [https://github.com/indrajeetPanjiyar/ENTNT_Talentflow.git](https://github.com/indrajeetPanjiyar/ENTNT_Talentflow.git)
      cd ENTNT_Talentflow
  ```
  - **Install dependencies:**
  ```
  npm install
  ```
  - **Run the development server:**
  ```
  npm run dev
  ```
  - **Open in Browser:** Vite will print the local URL (typically http://localhost:5173).
  - **Build for Production**
  ```bash
  npm run build
  npm run preview
  ```
 
## Troubleshooting & Resetting Data
- Data Seeding: The app seeds the mock data on first run.
- To Reset Data: If you need to regenerate the initial dataset, open DevTools → Application → IndexedDB, delete the talentFlowDB entry, and refresh the application.
- Stale UI: If the UI appears stale after code changes, stop and restart the dev server

## 🚧 Known Issues

* **Kanban Board Drag-and-Drop Integration**:
    Integrating drag-and-drop functionality for the Kanban board is in progress. While the UI supports moving cards between columns, updating the underlying data state is **not yet fully implemented**. Ensure that state changes are properly handled and persisted when cards are moved. Further enhancements are planned to synchronize UI interactions with the mock data layer.
* **IndexedDB Connection Problem**:
    Occasionally, the application may fail to fully connect or restore state from **IndexedDB** on initial load, especially after a cache clear or browser update. This can result in stale or missing data. If issues persist, try **clearing the `talentFlowDB` entry from DevTools → Application → IndexedDB** and refreshing the app.
* **Mock Data Limitations**:
    The analytics dashboard currently uses static mock data. For dynamic, production-like metrics, the `DatabaseService` mock layer must be extended or replaced with a real data API.

---

## 📈 Future Improvements

* **Implement User Authentication:**
    * Introduce a **Login/Sign-up flow** for secure access.
    * Establish **Role-Based Access Control (RBAC)** with two key roles:
        * **Admin/HR:** Full permissions to **create, update, and manage** jobs, assessments, and candidate data.
        * **Candidate/User:** Limited permissions, primarily allowing them to **view assigned tasks** and **complete assessments**. 
* Integrate the application with a **real backend** (e.g., Node.js/Express) to manage data persistence externally.
* Fully **link candidates to jobs/assessments** to enable more granular, dynamic analytics reporting.
* Add **toast notifications** (e.g., `react-toastify`) for improved user feedback on CRUD operations and errors.
* Improve **accessibility** by conducting detailed ARIA and Lighthouse audits.
* Implement **server-side pagination** for candidates and jobs to handle massive datasets more efficiently.

---
