# Product Requirements Document: 10x Cards Angular

## 1. Overview

This document outlines the product requirements for the "10x Cards Angular" application. The application is a web-based tool for generating, managing, and studying flashcards. It appears to be a single-page application (SPA) built with Angular. The primary user flow involves registering/logging in, generating sets of flashcards on a specific topic, and then viewing and managing those flashcards.

## 2. Core Features

### 2.1. User Authentication

*   **User Registration:** Users can create a new account by providing their name, email, and password.
*   **User Login:** Registered users can log in using their email and password.
*   **Password Recovery:** Users can request a password reset for their account.
*   **Authentication Guard:** Certain routes (`/dashboard`, `/generate`, `/generations/:id`) are protected and require the user to be authenticated.
*   **Token-based Auth:** The application uses JWT (JSON Web Tokens) for authentication. The token is stored in the browser's `localStorage`.

### 2.2. Flashcard Generation

*   **Generate New Flashcards:** Authenticated users can generate a new set of flashcards by providing:
    *   A topic.
    *   A name for the generation.
    *   The number of flashcards to generate (between 1 and 50).
    *   Optional context to guide the generation process.
*   **Generation API:** The generation process is handled by a backend API.

### 2.3. Dashboard

*   **View Generations:** The dashboard displays a list of all flashcard generations created by the user.
*   **Actions:** From the dashboard, users can:
    *   View the details of a generation.
    *   Delete a generation.

### 2.4. Generation Detail View

*   **View Flashcards:** Users can view the individual flashcards within a generation.
*   **Edit Flashcards:** Users can edit the front and back content of each flashcard.
*   **Add New Flashcards:** Users can manually add new flashcards to a generation.
*   **Delete Flashcards:** Users can delete individual flashcards.
*   **Save Changes:** Users can save all changes made to the flashcards in a generation.

## 3. User Roles & Permissions

The application appears to have a single user role with the following permissions:

*   **Authenticated User:**
    *   Can access all features of the application.
    *   Can only view and manage their own flashcard generations.

## 4. Technical Stack

*   **Frontend Framework:** Angular (~v19.2.0)
*   **Styling:** SCSS and Tailwind CSS
*   **State Management:** RxJS with BehaviorSubjects in services.
*   **HTTP Client:** Angular's `HttpClient` with an `HttpInterceptor` for adding auth tokens.
*   **Forms:** Angular's Reactive Forms.
*   **Routing:** Angular Router.
*   **Package Manager:** npm

## 5. API Endpoints

The application communicates with a backend API at `http://localhost:3001`. The following endpoints are used:

### 5.1. Auth

*   `POST /api/auth/login`
*   `POST /api/auth/register`
*   `POST /api/auth/recover`
*   `POST /api/auth/logout`

### 5.2. Generations

*   `POST /api/generations`
*   `GET /api/generations`
*   `GET /api/generations/:id`
*   `PUT /api/generations/:id`
*   `DELETE /api/generations/:id`

### 5.3. Flashcards

*   `POST /api/flashcards`
*   `PUT /api/flashcards/:id`
*   `DELETE /api/flashcards/:id`

## 6. Recommendations

*   **Environment Variables:** The API URL is hardcoded in `api.service.ts` and `auth.service.ts`. This should be moved to Angular's environment files (e.g., `environment.ts` and `environment.prod.ts`).
*   **JWT Decoding:** The `auth.service.ts` file decodes the JWT token manually using `atob`. This is not a secure practice and a dedicated library like `jwt-decode` should be used.
*   **State Management:** For a larger application, consider a more robust state management solution like NgRx or Elf to handle application state more predictably.
*   **Error Handling:** The error handling is basic. A more centralized error handling strategy could be implemented, perhaps using an `HttpInterceptor`.
*   **Component Organization:** The `app.module.ts` file imports a large number of components directly. Consider creating feature modules to better organize the application and improve lazy loading.
*   **Standalone Components:** The project is configured to use `standalone: false`. Consider migrating to standalone components, which is the default and recommended approach in modern Angular applications.
*   **UI Feedback:** Provide more user feedback for actions like saving changes or deleting items (e.g., toast notifications).
*   **Testing:** The project has a testing setup with Karma and Jasmine, but it's unclear how comprehensive the test coverage is. It would be beneficial to ensure all critical components and services have adequate unit tests.
