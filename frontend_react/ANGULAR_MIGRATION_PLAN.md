# Angular Migration Plan for 10x-cards-frontend

This document outlines the plan to migrate the existing `10x-cards-frontend` application from React to Angular.

## 1. Project Setup & Configuration

- **Initialize Angular Project:** Use the Angular CLI to create a new project.
  ```bash
  ng new 10x-cards-angular --style=scss --routing=true --standalone=false
  ```
  We'll start with a standard, non-standalone component structure for clarity and then refactor to standalone components if desired.

- **Integrate Tailwind CSS:** Follow the official Angular guide to set up Tailwind CSS.
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```
  Configure `tailwind.config.js` and `postcss.config.js`, and include Tailwind directives in `src/styles.scss`.

- **Setup Linting:** The Angular CLI sets up ESLint by default. We will ensure it's configured for our needs.

## 2. Project Structure

The new Angular project will follow a standard, feature-driven structure:

```
/
├───src/
│   ├───app/
│   │   ├───core/                 # Core services (auth, api), guards, and interceptors
│   │   │   ├───guards/
│   │   │   ├───interceptors/
│   │   │   └───services/
│   │   ├───features/             # Feature modules (e.g., dashboard, generation)
│   │   │   ├───auth/
│   │   │   ├───dashboard/
│   │   │   └───generation/
│   │   ├───shared/               # Shared components, directives, pipes, and models
│   │   │   ├───components/
│   │   │   └───models/
│   │   ├───app-routing.module.ts
│   │   ├───app.component.html
│   │   ├───app.component.scss
│   │   ├───app.component.ts
│   │   └───app.module.ts
│   ├───assets/                 # Static assets (images, etc.)
│   ├───environments/           # Environment-specific configuration
│   ├───main.ts
│   ├───styles.scss
│   └───index.html
├───angular.json                # Angular workspace configuration
├───package.json
└───tsconfig.json
```

## 3. Migration Strategy

### 3.1. Core Functionality

- **Authentication:**
  - Create an `AuthService` in `src/app/core/services/` to manage user authentication state (e.g., storing tokens, user info). This will replace the `useAuth` hook and `AuthProvider`.
  - Implement `AuthGuard` in `src/app/core/guards/` to protect routes, replacing the `ProtectedRoute` component.
  - Use an `HttpInterceptor` to attach auth tokens to outgoing requests.

- **API Layer:**
  - Create an `ApiService` in `src/app/core/services/` to handle all HTTP communication with the backend. This will centralize the logic from `src/lib/api.ts`.

### 3.2. Component Migration

We will migrate components on a page-by-page basis, starting with shared components.

- **UI Components (`src/components/ui`):**
  - The existing UI components built with Radix UI will be replaced with either custom-built Angular components or a suitable Angular component library like Angular Material or PrimeNG. Given the Tailwind CSS usage, we will likely create our own simple, styled components.
  - We will create a `SharedModule` to declare and export these common components.

- **Feature Components (`src/components/generation`, etc.):**
  - These will be converted into Angular components within their respective feature modules. For example, `FlashcardList.tsx` will become `flashcard-list.component.ts` inside the `generation` feature module.

### 3.3. Page Migration

- **Routing:**
  - The routes defined in `App.tsx` will be translated to the `AppRoutingModule`.
  - Lazy loading will be configured for feature modules to improve initial load time.

- **Pages (`src/pages`):**
  - Each React page will become an Angular component, acting as the main view for a feature module.
  - `HomePage.tsx` -> `home.component.ts` (likely in the root or a `home` module).
  - `DashboardPage.tsx` -> `dashboard.component.ts` (in the `dashboard` feature module).
  - `GeneratePage.tsx` -> `generate.component.ts` (in the `generation` feature module).

### 3.4. Forms

- **React Hook Form to Angular Reactive Forms:**
  - All forms will be rebuilt using Angular's `ReactiveFormsModule`.
  - This provides robust type-safety and validation capabilities out of the box.

### 3.5. State Management

- **React Hooks/Context to RxJS-based Services:**
  - For most state management needs, we will use Angular services with RxJS `BehaviorSubject` or `Subject` to manage and stream state. This is a lightweight and powerful approach suitable for this application's scale.
  - For more complex, application-wide state, we can consider introducing a library like NgRx if needed, but we will start with services.

## 4. Step-by-Step Plan

1.  **Phase 1: Setup and Core.**
    - Initialize the new Angular project.
    - Integrate Tailwind CSS.
    - Create the core `AuthService`, `ApiService`, `AuthGuard`, and `HttpInterceptor`.
    - Set up the main `AppRoutingModule` with basic routes.

2.  **Phase 2: Shared Components & Layout.**
    - Re-create the shared UI components (Button, Card, Input, etc.) in the `SharedModule`.
    - Re-create the main `LayoutComponent`.

3.  **Phase 3: Authentication Feature.**
    - Build the `auth` feature module.
    - Create the `LoginPage`, `RegisterPage`, and `RecoverPage` components and their corresponding forms using Reactive Forms.
    - Wire them up to the `AuthService`.

4.  **Phase 4: Dashboard & Generations Features.**
    - Build the `dashboard` feature module and `DashboardPage` component.
    - Build the `generation` feature module, including the `GeneratePage` and `GenerationDetailPage`.
    - Migrate all related components (`GenerationsTable`, `FlashcardList`, etc.).
    - Connect them to the `ApiService` to fetch and display data.

5.  **Phase 5: Testing & Finalization.**
    - Write unit tests for services and components using Jasmine and Karma (or Jest).
    - Write end-to-end tests with a framework like Cypress or Playwright.
    - Review and refactor the codebase for any remaining issues.
    - Build the application for production and verify its functionality.

Please review this plan. Once approved, I will begin with Phase 1.
