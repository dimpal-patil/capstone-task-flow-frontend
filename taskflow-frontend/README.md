# TaskFlow Frontend

A task/project management web app built with React, TypeScript, Vite, and Tailwind CSS. Users can register, log in, manage projects, and track tasks within each project (status, priority, filtering, and progress).

## Features

- User authentication (register / login / logout) with protected routes
- Create, edit, archive/restore, delete, and search projects
- Per-project task management: create, edit, delete tasks
- Task filtering by status (To Do / In Progress / Done) and priority (Low / Medium / High)
- Project progress bar with completion percentage
- Light/dark mode toggle (persisted to localStorage, follows system preference by default)
- Responsive, Tailwind-styled UI with violet/indigo design tokens

## Tech Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 3.4
- ESLint 10 + Prettier

## Project Structure

```
src/
  components/       # Navbar, ProjectForm, TaskForm
    ui/             # primitives (Button, Input, Select, Badge, Alerts...), ThemeToggle
  context/          # AuthContext (token, login, logout)
  pages/            # Login, Register, Dashboard, ProjectDetails
  routes/           # ProtectedRoute
  services/         # api.ts (auth), projectApi.ts, taskApi.ts
  types/            # shared TypeScript types
  App.tsx           # routes
  main.tsx          # entry point
```

## Getting Started

```bash
npm install
npm run dev
```

The app expects the backend API at `http://localhost:3000/api` (see `src/services/api.ts`).

## Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start the dev server          |
| `npm run build`   | Type-check + production build |
| `npm run lint`    | Run ESLint                    |
| `npm run preview` | Preview the production build  |

## Styling

Tailwind CSS with a custom `brand` (violet) color scale in `tailwind.config.js`. Dark mode uses the `class` strategy; the toggle lives in the navbar and on the auth pages.
