# p-and-b-new-v013

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Itaib24/p-and-b-new-v013)

## Project purpose

Raeda‑AI is a full stack demo application focused on tracking workout progress, meal plans and user engagement. It includes distinct Admin, Trainer and User views built with React, TypeScript and Tailwind CSS.

### Features

- **Admin view** – manage trainers and clients with analytics dashboards.
- **Trainer view** – create workout templates and meal plans while monitoring client progress.
- **User view** – follow assigned plans, log workouts and view progress roadmaps.
- Built‑in chat components for real‑time messaging.
- Context providers for workout logs, templates, meal plans and progress tracking.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node.js)

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Development

Start the local development server with hot reload:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Plugin architecture

The project uses Vite’s plugin system. Plugins are configured in [`vite.config.ts`](vite.config.ts) inside the `plugins` array. By default it loads the React plugin. Add additional functionality by installing a Vite plugin package and including it in this array. Removing a plugin simply requires deleting it from the array and uninstalling the dependency.

## Linting and tests

Run ESLint to check code quality:

```bash
npm run lint
```

The template does not include automated tests yet, but you can add your own test runner and scripts as needed.
