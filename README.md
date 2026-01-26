# letsplay

A full-stack application for booking sports grounds, built with **Spring Boot**, **React**, and **Temporal**.

## Project Structure
- `backend/`: Spring Boot Application (API + Temporal Worker)
- `frontend/`: React + Tailwind CSS (Vite)
- `infra/`: Docker Compose for PostgreSQL + Temporal

## Quick Start

### 1. Start Infrastructure
```bash
cd infra
docker compose up -d
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```
*API runs on port 8082.*

### 3. Start Frontend
```bash
cd frontend
npm install && npm run dev
```
*Frontend runs on http://localhost:5173.*

## Verification
Run the included E2E test script to verify the system health and booking flow:
```bash
./test_e2e_flow.sh
```

## Documentation
- [Walkthrough & Screenshots](file:///Users/chandramouli/.gemini/antigravity/brain/dce147b5-65fc-4988-9f2a-dee3e985cdec/walkthrough.md)
- [Architecture Overview](file:///Users/chandramouli/.gemini/antigravity/brain/dce147b5-65fc-4988-9f2a-dee3e985cdec/architecture_overview.md)
- [Implementation Plan](file:///Users/chandramouli/.gemini/antigravity/brain/dce147b5-65fc-4988-9f2a-dee3e985cdec/implementation_plan.md)
