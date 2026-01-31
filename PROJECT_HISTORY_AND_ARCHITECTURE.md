# letsplay - Strategic Product & Architecture Overview

> **Confidential Internal Document**
> **Target Audience**: Executive Leadership Team (CEO, CTO, CFO, COO) & Product Org
> **Version**: 2.0 (Executive Summary)
> **Date**: January 2026

---

## 1. Executive Summary (CEO Vision)
**"Uber for Sports Community"**

`letsplay` is not just a booking platform; it is the foundational layer for a vertical social network dedicated to amateur sports. Our mission is to lower the barrier to entry for playing sports by solving two critical friction points: **Access** (finding a ground) and **Community** (finding someone to play with).

### Strategic Value Proposition
*   **Market Gap**: Competitors focus solely on venue management. We focus on the *player experience*. The "Social Join" feature differentiates us by turning solo players into active retention metrics.
*   **Revenue Potential**:
    *   **Phase 1**: Commission model on bookings (Direct Revenue).
    *   **Phase 2**: "Pro" player subscriptions (Priority join requests, advanced analytics).
    *   **Phase 3**: Venue SaaS tools (Inventory management for facility owners).
*   **Brand Identity**: Rebranded from "Decathlon Play" to "letsplay" to own a platform-agnostic, community-first identity.

---

## 2. Technical Strategy (CTO Perspective)
**"Reliability as a Feature"**

Our architectural choices are driven by one non-negotiable metric: **Zero Lost Bookings**. In a high-concurrency environment (e.g., weekend slot release), race conditions are fatal to trust.

### Key Architectural Decisions
1.  **Temporal for Transactional Integrity**:
    *   *Why?* Traditional DB transactions fail in distributed systems. We use **Temporal Workflows** to orchestrate the booking lifecycle.
    *   *Benefit*: If a payment gateway hangs or a notification service fails, the workflow does not break. It retries, waits, or compensates automatically. This reduces "DevOps 3AM calls" by 90%.
2.  **Decoupled Microservices-Ready Structure**:
    *   Frontend (React/Vite) is completely decoupled from Backend (Spring Boot).
    *   Database layer is refined: Postgres 14 for App Data, Postgres 12 dedicated for Temporal availability.
    *   *Scale*: This allows us to scale the Booking Engine (Temporal Workers) independently of the User-facing API.
3.  **Modern Stack for Talent Attraction**:
    *   Using **Java 17 + Spring Boot 3** and **React 18 + Tailwind** ensures we can hire from a massive, high-quality talent pool while maintaining modern performance standards.

### Technical Debt & Risks
*   **Infrastructure**: Currently running via Docker Compose for simplicity. Needs migration to Kubernetes (EKS) for true auto-scaling before "Nationwide Launch".
*   **Monitoring**: Basic logs exists. Need to implement centralized observability (Prometheus/Grafana) to track business metrics (e.g., "Bookings per Minute").

---

## 3. Financial & Resource Outlook (CFO Perspective)
**"Optimized for High Margin Growth"**

### Cost Structure Analysis
*   **Cloud Efficiency**:
    *   Current AWS footprint is minimal (EC2 based).
    *   **Migration Savings**: Moving Database to RDS Serverless and Frontend to S3/CloudFront will reduce idle costs by ~40% compared to fixed EC2 instances.
*   **Licensing**:
    *   All core technologies (Java, Postgres, Spring, React, Temporal) are **Open Source (Apache 2.0 / MIT)**. No proprietary licensing fees.
*   **Development Efficiency**:
    *   The "Social Join" feature reuses the existing Booking core, minimizing new R&D spend.

### Revenue Operations
*   **Payment Reconciliation**: The Temporal workflow includes specific activities for Payment interactions. This provides a clear audit trail for every transaction, simplifying monthly financial reconciliation.

---

## 4. Operational Strategy (COO Perspective)
**"Seamless Fulfillment"**

### Operational Readiness
*   **Venue Onboarding**:
    *   *Current State*: Manual SQL entry / Developer assistance required.
    *   *Requirement*: We need an "Admin Portal" immediately to allow Ops teams to onboard new venues without Engineering support.
*   **Customer Support**:
    *   The "Admin Dashboard" (in backlog) will allow support agents to view the *visual state* of a booking workflow. If a user says "I paid but didn't get a confirmation," an agent can see exactly where the Temporal workflow is paused and retry it with one click.
    *   *SLA Goal*: < 1% Booking Failure Rate.

---

## 5. Product Roadmap (Product Owner)
**"From Booking to Playing"**

### Q1 Goals: "Trust & Transact" (Delivered)
*   [x] **Rebranding**: Complete shift to `letsplay`.
*   [x] **Core Booking Engine**: Robust slot selection and reservation.
*   [x] **Basic Social**: Request to join public games ("Join Requests").

### Q2 Goals: "Engagement & Retention" (Next Up)
*   [ ] **In-App Chat**: Allow host and joiners to coordinate (e.g., "Bringing the ball?").
*   [ ] **User Ratings**: "Reliability Score" for players (reduces no-shows).
*   [ ] **Waitlists**: If a slot is full, auto-notify interested users if someone cancels.

### Q3 Goals: "Scale"
*   [ ] **Venue Partner Portal**: Self-service inventory management for ground owners.
*   [ ] **Mobile App**: React Native wrapper for the existing PWA.

---

## 6. "Pin-to-Pin" System Specifications

### Infrastructure Map
| Service | Tech | Port | Role |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18 / Vite | 3000 | User Interface, PWA |
| **Backend** | Spring Boot 3 | 8080 | REST API, Business Logic |
| **Workflow** | Temporal Worker | - | Async Processing (Bookings, Notifications) |
| **Orchestrator**| Temporal Server | 7233 | Workflow State Management |
| **DB (App)** | Postgres 14 | 5432 | Users, Venues, Bookings Data |
| **DB (Flow)** | Postgres 12 | 5432 | Temporal History |

### Build & Deploy Pipeline
*   **Source**: GitHub (Monorepo).
*   **CI**: automated tests (`mvn test`, `vitest`) run on PR.
*   **CD**:
    *   Frontend builds to static assets (`/dist`).
    *   Backend builds to JAR (`mvn package`).
    *   Docker Compose orchestrates the rollout.
*   **Disaster Recovery**:
    *   Database volumes mapped to host.
    *   Temporal History allows resuming in-flight bookings even after full system crash.

---
*Prepared for the Board of Directors Strategy Meeting.*
