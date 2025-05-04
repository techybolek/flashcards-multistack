Okay, let's break down the project and build a comprehensive test plan.

<test_plan_analysis>
1. Key Components and Features:

Core Feature: AI Flashcard Generation from text input.

Input: Text area (1000-10000 chars).

Process: API call (/api/generations) to OpenRouter service.

Output: List of flashcard proposals (FlashcardProposalDTO).

UI Interaction: Accept, Edit (inline validation: front <= 200, back <= 500), Reject proposals. Save Accepted/All (/api/flashcards/bulk).

Authentication: User registration, login, password recovery (using Supabase Auth).

Pages: login.astro, register.astro, recover.astro.

Components: LoginForm.tsx, RegisterForm.tsx, RecoverForm.tsx.

API: /api/auth/login.ts, /api/auth/register.ts, /api/auth/callback.ts.

Middleware: src/middleware/index.ts likely for session handling/auth checks.

Flashcard Management (API Level):

CRUD operations on /api/flashcards and /api/flashcards/[id].

Bulk creation on /api/flashcards/bulk.

UI Components:

Shadcn/UI based components (src/components/ui).

Specific feature components (src/components/flashcard-generation, src/components/auth).

Layouts (src/layouts).

Backend Services:

Supabase Client (src/db/supabase.client.ts) for DB interaction.

OpenRouter Service (src/lib/openrouter) encapsulating client, cache, rate limiter, circuit breaker.

Database: PostgreSQL via Supabase.

Tables: flashcards, generations, generation_error_logs.

Migrations: supabase/migrations.

Row Level Security (RLS) enabled and configured in migrations.

Testing Framework:

API Tests: Mocha/Chai (tests/api/*.test.js).

Scripts: test:openrouter, cleandb.

2. Technology Stack Considerations & Challenges:

Astro + React: Hybrid approach. Need to test both static Astro parts and dynamic React islands (client:load). Testing hydration and client-side interaction is key.

Supabase: RLS is critical for security and needs thorough testing. Potential vendor lock-in or reliance on Supabase-specific features. Need to test against Supabase limitations (e.g., query performance, connection limits). Local Supabase setup (supabase/config.toml) vs cloud requires environment consistency.

OpenRouter.ai: External dependency. Need to handle API errors, rate limits, model changes, and costs. The custom OpenRouter library adds complexity (cache, rate limiter, circuit breaker) that needs testing, potentially with mocks. API key management is crucial.

TypeScript: Leverages static typing, which helps, but runtime validation (e.g., with Zod in API routes) is still essential.

Asynchronous Operations: AI generation and API calls are async. Need to test loading states, error handling, and race conditions.

State Management (Frontend): Primarily React hooks (useFlashcardGeneration.ts). Complex state interactions in the generation view need careful testing.

3. Testing Types Brainstorm:

Unit Testing:

Utility functions (src/lib/utils.ts).

OpenRouter library components (Client, Cache, RateLimiter, CircuitBreaker - potentially mocking external calls).

React component logic (validation, state changes) using Vitest/React Testing Library.

Validation logic within API routes (Zod schemas).

Integration Testing:

API routes interacting with Supabase (mocking Supabase or using a test DB).

API routes interacting with the OpenRouter service (mocking the service).

useFlashcardGeneration hook integrating its various state updates and API calls.

React components interacting with each other within the FlashcardGenerationView.

API Testing:

Directly hitting endpoints (/api/auth, /api/flashcards, /api/generations).

Covering all methods (GET, POST, PUT, DELETE).

Testing request/response schemas, status codes.

Testing validation rules (input length, formats, enums).

Testing authentication/authorization (JWT, RLS).

Testing error handling and logging (generation_error_logs).

Building upon existing Mocha/Chai tests.

End-to-End (E2E) Testing:

Simulate full user flows (Register -> Login -> Generate -> Review -> Save).

Tools: Playwright or Cypress.

Verify UI elements, interactions, and data persistence.

Component Testing (UI):

Visual regression testing (optional, e.g., using Storybook + Chromatic).

Interaction testing of individual UI components (Button, Input, FlashcardContent, EditForm).

Security Testing:

RLS policy verification (critical).

Authentication bypass attempts.

Input sanitization/validation testing (prevent XSS, SQLi - though ORM helps).

API key exposure checks.

Performance Testing:

API endpoint response times under load (k6, Artillery).

AI generation latency measurement.

Frontend load time and responsiveness.

Usability Testing: Manual review of the generation flow for clarity and ease of use.

Compatibility Testing: Test on major browsers (Chrome, Firefox, Safari, Edge).

4. Potential Risks & Special Attention Areas:

RLS Misconfiguration: A critical risk leading to data leaks. Needs dedicated testing.

External API Failures (OpenRouter): The core feature depends on this. Need robust error handling, circuit breaking, and potentially fallbacks or clear user messaging. Rate limiting and cost control are also concerns.

AI Model Output Variance: AI models can return unexpected formats or quality. Parsing and validation of AI responses need to be robust.

State Management Complexity: The FlashcardGenerationView manages a lot of state (text, proposals, statuses, edits). Prone to bugs if not handled carefully.

Data Integrity: Ensuring relationships (generation_id) and constraints (enum values, lengths) are maintained.

Security: Authentication flow, session management, and RLS are paramount.

Performance: AI generation can be slow; frontend needs good loading indicators and feedback.

5. Impact of Codebase Structure:

Clear separation of concerns (pages, components, lib, db) makes testing easier to organize.

TypeScript types (src/types.ts, src/db/database.types.ts) aid in writing tests and understanding contracts.

API routes in src/pages/api are easily identifiable for API testing.

React components in src/components allow for isolated component testing.

The .ai directory provides valuable context (PRD, plans) for defining test cases based on requirements.

Existing tests in tests/ provide a foundation to build upon.

</test_plan_analysis>

Test Plan: 10x Cards - Flashcard Generation App
1. Introduction
1.1 Purpose

This document outlines the test plan for the 10x Cards application. Its primary goal is to ensure the quality, functionality, security, and performance of the application, focusing on the core features of AI-driven flashcard generation, user authentication, and flashcard management.

1.2 Project Overview

10x Cards is a web application built with Astro, React, TypeScript, and Supabase. It allows users to generate flashcards from text using AI (via OpenRouter.ai), manage these flashcards, and (implicitly through the planned architecture) eventually use them for study. This plan covers testing strategies for the Minimum Viable Product (MVP) features identified in the codebase and planning documents.

2. Scope
2.1 In Scope

User Authentication: Registration, Login, Password Recovery flows, session management, API protection.

AI Flashcard Generation:

Text input validation (length constraints).

API endpoint (/api/generations) functionality, including interaction with OpenRouter service and database logging (generations, generation_error_logs).

Frontend UI (FlashcardGenerationView and its sub-components) for input, displaying proposals, status updates, and user interactions (accept, edit, reject).

Saving generated/edited flashcards (/api/flashcards/bulk).

Flashcard API: CRUD and Bulk operations for flashcards (/api/flashcards/...).

Database: Schema integrity, migrations, RLS policies, data validation constraints.

Core UI Components: Shadcn/UI components used within features, layout consistency.

Security: RLS enforcement, authentication checks, basic input validation.

Error Handling: Handling of API errors (Supabase, OpenRouter), validation errors, and network issues.

2.2 Out of Scope

Advanced Spaced Repetition Algorithm UI/features (beyond basic data storage if applicable).

Mobile application testing.

Import/Export features (unless explicitly found in code/docs).

Public API testing (if intended only for internal frontend use).

Advanced Gamification features.

Browser extension testing.

Load testing beyond basic API performance checks.

Formal Usability studies (initial checks will be manual).

Third-party integrations beyond Supabase and OpenRouter.ai.

3. Test Strategy

This project will employ a multi-layered testing strategy combining automated and manual testing techniques.

3.1 Testing Levels

Unit Testing: Focus on isolating and verifying individual functions, classes, and component logic.

Tools: Vitest (preferred for Astro/Vite ecosystem) or Jest, React Testing Library.

Coverage: Utility functions, OpenRouter library modules (mocking external calls), React component logic (validation, state transitions), Zod schemas in API routes.

Integration Testing: Verify interactions between different modules and services.

Tools: Vitest/Jest, Supertest (for API route integration), potentially mocking libraries (e.g., msw, jest-mock-extended).

Coverage: API routes interacting with mocked Supabase/OpenRouter, useFlashcardGeneration hook logic, component compositions.

API Testing: Test REST endpoints directly for contract adherence, functionality, and error handling.

Tools: Mocha/Chai (existing), Postman/Insomnia (manual exploration), potentially extend automated tests using Supertest or dedicated API testing frameworks.

Coverage: All endpoints in /api/auth, /api/flashcards, /api/generations. Test all HTTP methods, parameters, request/response bodies, status codes, validation, and authentication.

End-to-End (E2E) Testing: Simulate real user scenarios from the browser.

Tools: Playwright or Cypress.

Coverage: Critical user flows: Registration -> Login -> Generate Flashcards -> Review Proposals -> Save Accepted -> Verify Saved (via API or subsequent UI).

3.2 Testing Types

Functional Testing: Verify that features meet the requirements specified in the PRD and inferred from the codebase. Executed across all testing levels.

Security Testing:

Verify Supabase RLS policies rigorously through targeted API tests (attempting cross-user access).

Test authentication flows, token handling, and session expiry.

Manual checks for potential vulnerabilities (e.g., input validation).

Performance Testing:

Basic API load testing on critical endpoints (e.g., /api/generations, /api/flashcards/bulk) using tools like k6 or Artillery.

Monitor AI generation response times.

Frontend performance checks using browser developer tools (Lighthouse).

UI/Component Testing:

Verify rendering and basic interactions of core React components.

Check responsiveness across common viewport sizes (manual + automated E2E checks).

Error Handling Testing: Intentionally trigger errors (invalid input, simulated API failures) to verify graceful degradation and user feedback. Check generation_error_logs population.

Compatibility Testing: Manual testing on the latest versions of major browsers (Chrome, Firefox, Safari, Edge).

3.3 Automation Approach

High Automation: Unit, Integration, and API tests should be heavily automated and run frequently (e.g., on pre-commit hooks, in CI).

Selective Automation: E2E tests for critical user flows should be automated.

Manual Testing: Used for exploratory testing, usability checks, compatibility testing, and complex scenarios difficult to automate.

4. Test Environment

Local Development: Developers run unit/integration tests locally. Supabase local dev environment (supabase start). .env file for secrets (OpenRouter key needs care).

CI Environment: Github Actions (as per .ai/tech-stack.md). Run unit, integration, and API tests on each push/PR. Requires secure handling of secrets.

Staging Environment: A dedicated deployment (e.g., on DigitalOcean) mirroring production. Connected to a staging Supabase project and potentially a rate-limited/test OpenRouter key. Used for E2E testing and manual verification before release.

Tools:

Node.js / npm

Testing Frameworks: Mocha/Chai (existing), Vitest/Jest, Playwright/Cypress

API Client: Postman / Insomnia

Browsers: Chrome, Firefox, Safari, Edge

Supabase CLI

Docker (for deployment consistency, as per tech stack)

Test Data:

Sample text inputs of varying lengths (min, max, average) for generation.

Predefined user accounts for testing auth and RLS.

Script (cleandb.mts) to reset the test database state.

5. Test Cases

(High-level categories; detailed cases would be in a separate test case management system)

5.1 Authentication

TC-AUTH-001: Successful user registration.

TC-AUTH-002: Failed registration (email already exists).

TC-AUTH-003: Failed registration (password too short).

TC-AUTH-004: Failed registration (passwords don't match - UI).

TC-AUTH-005: Successful user login.

TC-AUTH-006: Failed login (invalid credentials).

TC-AUTH-007: Login attempt with unconfirmed email (if applicable).

TC-AUTH-008: Password recovery request flow (UI).

TC-AUTH-009: Email verification callback (/auth/callback).

TC-AUTH-010: Accessing protected API routes without token returns 401.

TC-AUTH-011: Accessing protected API routes with invalid/expired token returns 401.

TC-AUTH-012: Middleware correctly identifies authenticated user.

5.2 Flashcard Generation (UI & API)

TC-GEN-001: Successful flashcard generation with valid text (1000-10000 chars).

TC-GEN-002: Generation API returns 201 and correct GenerationResultDTO.

TC-GEN-003: Generation record saved correctly in generations table.

TC-GEN-004: UI displays loading state during generation.

TC-GEN-005: UI displays proposals correctly after generation.

TC-GEN-006: UI handles generation API error (e.g., OpenRouter failure) gracefully.

TC-GEN-007: Generation error logged in generation_error_logs on failure.

TC-GEN-008: Failed generation with text < 1000 chars (API validation).

TC-GEN-009: Failed generation with text > 10000 chars (API validation).

TC-GEN-010: UI prevents generation submission if text length is invalid.

TC-GEN-011: UI Character counter updates correctly and shows validation state.

TC-GEN-012: Accept proposal updates UI state.

TC-GEN-013: Reject proposal updates UI state.

TC-GEN-014: Edit proposal enables EditForm.

TC-GEN-015: EditForm validates input length (front <= 200, back <= 500).

TC-GEN-016: Save edited proposal updates UI state (status 'edited').

TC-GEN-017: Cancel edit reverts changes.

TC-GEN-018: "Save Accepted" button enabled only when proposals are accepted.

TC-GEN-019: "Save All" button enabled only when proposals exist.

TC-GEN-020: Successful "Save Accepted" calls bulk API with correct data (source: 'ai-full' or 'ai-edited').

TC-GEN-021: Successful "Save All" calls bulk API with correct data.

TC-GEN-022: UI clears proposals after successful save.

TC-GEN-023: Test OpenRouter service cache (if enabled).

TC-GEN-024: Test OpenRouter service rate limiter (requires specific setup/mocking).

TC-GEN-025: Test OpenRouter service circuit breaker (requires specific setup/mocking).

5.3 Flashcard API (/api/flashcards)

TC-API-FC-001: GET /api/flashcards returns list of user's flashcards (respects RLS).

TC-API-FC-002: GET /api/flashcards respects pagination (page, limit).

TC-API-FC-003: GET /api/flashcards respects source filter.

TC-API-FC-004: GET /api/flashcards/{id} returns specific flashcard (if owned by user).

TC-API-FC-005: GET /api/flashcards/{id} returns 404 for non-existent ID.

TC-API-FC-006: GET /api/flashcards/{id} returns 403/404 if flashcard not owned by user (RLS test).

TC-API-FC-007: POST /api/flashcards creates a new flashcard (source: 'manual').

TC-API-FC-008: POST /api/flashcards returns 201 and created flashcard data.

TC-API-FC-009: POST /api/flashcards fails (400) with missing fields.

TC-API-FC-010: POST /api/flashcards fails (500/DB error) with invalid source enum.

TC-API-FC-011: PUT /api/flashcards/{id} updates an existing flashcard.

TC-API-FC-012: PUT /api/flashcards/{id} only allows source: 'manual' or 'ai-edited'.

TC-API-FC-013: PUT /api/flashcards/{id} fails if flashcard not owned by user (RLS test).

TC-API-FC-014: DELETE /api/flashcards/{id} deletes an existing flashcard.

TC-API-FC-015: DELETE /api/flashcards/{id} returns 204 on success.

TC-API-FC-016: DELETE /api/flashcards/{id} fails if flashcard not owned by user (RLS test).

TC-API-FC-017: POST /api/flashcards/bulk creates multiple flashcards.

TC-API-FC-018: POST /api/flashcards/bulk accepts different sources (manual, ai-full, ai-edited) and generation_id.

TC-API-FC-019: POST /api/flashcards/bulk fails (400) if input is not an array or items are invalid.

TC-API-FC-020: All flashcard API endpoints require authentication.

5.4 Database & RLS

TC-DB-001: Verify database schema matches migrations.

TC-DB-002: Verify constraints (NOT NULL, CHECK, FKs).

TC-DB-003: (RLS) User A cannot SELECT flashcards belonging to User B.

TC-DB-004: (RLS) User A cannot INSERT flashcards with User B's user_id.

TC-DB-005: (RLS) User A cannot UPDATE flashcards belonging to User B.

TC-DB-006: (RLS) User A cannot DELETE flashcards belonging to User B.

TC-DB-007: (RLS) Repeat RLS checks for generations and generation_error_logs tables.

TC-DB-008: Verify updated_at triggers function correctly.

5.5 Non-Functional

TC-PERF-001: Measure average/p95 response time for /api/generations under light load.

TC-PERF-002: Measure average/p95 response time for /api/flashcards (list) under light load.

TC-SEC-001: Attempt to access user B's data while logged in as user A via all relevant API endpoints.

TC-SEC-002: Review code for hardcoded secrets or API key exposure.

TC-UI-001: Verify UI responsiveness on mobile, tablet, and desktop viewports.

TC-ERR-001: Simulate OpenRouter API timeout/error and verify UI feedback.

TC-ERR-002: Simulate Supabase DB error and verify API/UI response.

6. Test Schedule (Example Phases)

Sprint/Iteration Testing: Unit and integration tests run continuously during development. API tests updated as endpoints are built/modified.

Feature Complete Testing: Focused E2E and manual exploratory testing once a major feature (e.g., Generation UI) is complete.

Pre-Release/Regression Testing: Execute full suite of automated tests (Unit, Integration, API, E2E) and key manual test cases before deploying to production. Perform RLS checks.

Post-Deployment Testing: Sanity checks on the production environment for critical flows.

7. Risks and Mitigation
Risk ID	Risk Description	Likelihood	Impact	Mitigation Strategy
R-01	Supabase RLS misconfiguration leads to data exposure	Medium	High	Dedicated RLS test cases for all tables/operations. Manual verification. Code reviews focused on RLS policies.
R-02	OpenRouter API unavailability/errors break core feature	Medium	High	Implement robust error handling, circuit breaker (present in lib), clear user feedback. Monitor OpenRouter status.
R-03	Inconsistent/Invalid AI model response format breaks UI	Medium	Medium	Implement defensive parsing and validation of AI responses. Log unexpected formats.
R-04	Performance issues with AI generation	Medium	Medium	Monitor generation times. Optimize prompts. Provide clear loading indicators. Consider async processing if needed.
R-05	Complex state management in Generation UI leads to bugs	High	Medium	Refactor state logic into custom hooks (useFlashcardGeneration). Add unit/integration tests for the hook.
R-06	Security vulnerabilities in Auth flow	Low	High	Rely on Supabase Auth's proven implementation. Test common auth vulnerabilities (e.g., token handling).
R-07	Database constraint violations	Low	Medium	Ensure API validation aligns with DB constraints. Test edge cases for constraints.
R-08	Inconsistent test environments	Medium	Medium	Use Supabase local dev environment. Script database resets (cleandb.mts). Use Docker for deployment consistency.