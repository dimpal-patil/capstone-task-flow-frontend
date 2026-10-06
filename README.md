# TaskFlow – Frontend

TaskFlow is a full-stack project and task management application built with **React, TypeScript, Vite, and Tailwind CSS**.

The frontend provides an interface for users to create and manage projects, organize tasks, track task status and priority, search projects, filter projects and tasks, and archive projects that are no longer active.

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Logout functionality
* Authentication token stored in `localStorage`

### Project Management

Authenticated users can:

* Create projects
* View their projects
* Search projects by name or description
* View project details
* Update project name and description
* Delete projects
* Archive active projects
* Restore archived projects
* Filter projects by:

  * Active
  * Archived
  * All

### Task Management

Within each project, users can:

* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Set task status:

  * To Do
  * In Progress
  * Done
* Set task priority:

  * Low
  * Medium
  * High
* Filter tasks by status
* Filter tasks by priority
* Clear task filters

### User Interface

* Responsive design
* Navigation bar
* Protected dashboard
* Clickable project cards
* Project status badges
* Task status badges
* Task priority badges
* Empty states
* Loading states
* Error messages
* Delete confirmation
* Clean and responsive Tailwind CSS styling

---

## Technologies

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **Tailwind CSS**
* **Fetch API**
* **JWT Authentication**

---

## Project Structure

```text
taskflow-front-end/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── NavBar.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── TaskForm.tsx
│   │   └── ui/
│   │       ├── primitives.tsx
│   │       └── ThemeToggle.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── ProjectDetails.tsx
│   │
│   ├── routes/
│   │   └── ProtectedRoute.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── projectApi.ts
│   │   └── taskApi.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── project.ts
│   │   └── task.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

---

## Application Routes

| Route                  | Description                   | Authentication |
| ---------------------- | ----------------------------- | -------------- |
| `/`                    | Redirects to Login            | No             |
| `/login`               | User login                    | No             |
| `/register`            | Create an account             | No             |
| `/dashboard`           | View and manage projects      | Yes            |
| `/projects/:projectId` | View and manage project tasks | Yes            |

---

## Application Flow

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Create / Search Projects
   ↓
Open Project
   ↓
Create Tasks
   ↓
Manage Tasks
   ↓
Update / Delete Tasks
   ↓
Archive Project
```

Archived projects can be viewed using the **Archived Projects** filter and restored when needed.

---

## Authentication

TaskFlow uses **JWT authentication**.

After a successful login, the frontend stores the JWT token in browser `localStorage`.

```text
localStorage
└── token
```

Authenticated API requests include the token using the following header:

```http
Authorization: Bearer <token>
```

The authentication state is managed through `AuthContext`.

### Protected Routes

The following pages require authentication:

* Dashboard
* Project Details

If a user is not authenticated, they are redirected to:

```text
/login
```

---

# API Integration

The frontend communicates with the TaskFlow backend through REST APIs.

During development, the backend runs on:

```text
http://localhost:3000
```

The API base URL is:

```text
http://localhost:3000/api
```

---

## Authentication API

### Register

```http
POST /api/auth/register
```

Example request:

```json
{
  "username": "example",
  "email": "example@email.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "example@email.com",
  "password": "password123"
}
```

---

# Project API

### Get Projects

```http
GET /api/projects
```

### Search Projects

```http
GET /api/projects?search=project
```

The backend searches project names and descriptions.

### Create Project

```http
POST /api/projects
```

Example:

```json
{
  "name": "My Project",
  "description": "Project description"
}
```

### Get Project

```http
GET /api/projects/:id
```

### Update Project

```http
PUT /api/projects/:id
```

Example:

```json
{
  "name": "Updated Project",
  "description": "Updated description",
  "status": "Active"
}
```

Supported project statuses:

```text
Active
Archived
```

### Delete Project

```http
DELETE /api/projects/:id
```

---

# Task API

### Get Tasks

```http
GET /api/projects/:projectId/tasks
```

### Create Task

```http
POST /api/projects/:projectId/tasks
```

Example:

```json
{
  "title": "Complete frontend",
  "description": "Finish the TaskFlow frontend",
  "status": "To Do",
  "priority": "High"
}
```

### Update Task

```http
PUT /api/tasks/:taskId
```

Example:

```json
{
  "title": "Complete frontend",
  "description": "Finish the TaskFlow frontend",
  "status": "In Progress",
  "priority": "High"
}
```

### Delete Task

```http
DELETE /api/tasks/:taskId
```

---

# Project Status

Projects have two possible statuses:

```text
Active
Archived
```

The Dashboard displays **Active Projects** by default.

Users can change the project filter to:

* Active Projects
* Archived Projects
* All Projects

### Archive

When an active project is archived:

* Its status changes to `Archived`
* It no longer appears under Active Projects
* It remains available under Archived Projects

### Restore

An archived project can be restored:

* Its status changes back to `Active`
* It appears again under Active Projects

---

# Task Status

Tasks can have one of three statuses:

```text
To Do
In Progress
Done
```

The task status is displayed using a status badge.

---

# Task Priority

Tasks can have one of three priority levels:

```text
Low
Medium
High
```

The task priority is displayed using a priority badge.

---

# Search and Filtering

## Project Search

Users can search projects by:

* Project name
* Project description

Example:

```text
Search projects...
```

## Project Filtering

Projects can be filtered by:

```text
Active Projects
Archived Projects
All Projects
```

## Task Filtering

Tasks can be filtered by:

```text
Status
Priority
```

The **Clear Filters** button resets the task filters.

---

# Frontend Architecture

The application separates UI, API communication, authentication, routing, and data types.

### Pages

Pages represent the main screens:

* `Login.tsx`
* `Register.tsx`
* `Dashboard.tsx`
* `ProjectDetails.tsx`

### Components

Reusable UI components include:

* `NavBar.tsx`
* `ProjectForm.tsx`
* `TaskForm.tsx`
* UI components

### Services

API requests are organized inside:

```text
src/services/
```

#### `api.ts`

Handles authentication API requests.

#### `projectApi.ts`

Handles project-related API requests.

#### `taskApi.ts`

Handles task-related API requests.

### Context

`AuthContext.tsx` manages authentication state and provides:

* Login
* Logout
* JWT token
* Authentication state

### Routes

`ProtectedRoute.tsx` protects pages that require authentication.

### Types

TypeScript interfaces are organized inside:

```text
src/types/
```

including:

* Authentication types
* Project types
* Task types

---

# Installation

## 1. Clone the Repository

```bash
git clone <your-frontend-repository-url>
```

## 2. Navigate to the Project

```bash
cd taskflow-front-end
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start the Development Server

```bash
npm run dev
```

Vite will display the local development URL, typically:

```text
http://localhost:5173
```

---

# Backend Requirement

The frontend requires the TaskFlow backend to be running.

The backend should run separately on:

```text
http://localhost:3000
```

The development architecture is:

```text
                 Browser
                    │
                    ▼
          React + TypeScript
             Vite Frontend
          localhost:5173
                    │
                    │ REST API
                    ▼
            Node + Express
             Backend API
          localhost:3000
                    │
                    ▼
                MongoDB
```

# Author

**Dimpal Patil**

TaskFlow was developed as a full-stack software development capstone project.
