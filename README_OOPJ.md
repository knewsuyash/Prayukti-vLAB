# OOPJ Module (Object Oriented Programming using Java)

This module adds Java programming capabilities to Prayukti vLAB.

## Features
- **Server-Side Execution**: Runs Java code in a sandboxed process.
- **Automated Testing**: Validates student code against defined test cases.
- **Modular Design**: Fully isolated in `backend/modules/oopj` and `frontend/app/subjects/oopj`.

## Directory Structure

### Backend (`/backend/src/modules/oopj/`)
- `compiler/javaRunner.ts`: wrapper around `javac` and `java`.
- `model.ts`: Mongoose schemas for experiments and submissions.
- `service.ts`: Business logic (scoring, submission handling).
- `controller.ts`: API Request handlers.
- `routes.ts`: Express router definitions.

### Frontend (`/frontend/app/subjects/oopj/`)
- `page.tsx`: Subject Dashboard.
- `experiments/experiment-1/`:
  - `page.tsx`: Main Layout.
  - `editor.tsx`: Code editor with Run/Submit buttons.
  - `theory.tsx`: Static educational content.
  - `problem.tsx`: Problem description.

## Setup Instructions

1. **Install Dependencies**:
   the backend requires `uuid` and its types.
   ```bash
   cd backend
   npm install uuid @types/uuid
   ```

2. **Seed Database**:
   Populate the initial experiment data.
   ```bash
   cd backend
   npx tsx scripts/seed-oopj.ts
   ```

3. **Java Requirement**:
   Ensure `javac` and `java` are in the system PATH where the backend runs.

## API Endpoints
- `GET /api/v1/oopj/experiments`: List all experiments.
- `POST /api/v1/oopj/run`: Compile and Run code.
- `POST /api/v1/oopj/submit`: Run against test cases and save result.
