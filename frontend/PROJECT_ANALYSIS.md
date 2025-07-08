# Project Analysis: 10x-cards-frontend

This document provides an overview of the `10x-cards-frontend` React application.

## Project Overview

The project is a modern frontend application built with React and Vite. It uses TypeScript for type safety and features a clean, component-based architecture. The UI is styled with Tailwind CSS, and it includes routing, authentication, and form handling.

## Key Technologies

- **Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with `clsx` and `tailwind-merge` for utility class management.
- **UI Components:** A mix of custom components and [Radix UI](https://www.radix-ui.com/) primitives, including:
  - `@radix-ui/react-avatar`
  - `@radix-ui/react-label`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-toast`
- **Routing:** [React Router](https://reactrouter.com/) (`react-router-dom`) is used for client-side routing, with a distinction between public and protected routes.
- **State Management:** The application likely uses a combination of React's built-in state management (`useState`, `useContext`) and custom hooks. An `AuthProvider` is used for managing authentication state.
- **Forms:** [React Hook Form](https://react-hook-form.com/) is used for handling forms.
- **Linting:** [ESLint](https://eslint.org/) with TypeScript support.
- **Testing:** [Vitest](https://vitest.dev/) for unit and component testing.

## Project Structure

The project follows a standard React project structure:

```
/
├───src/
│   ├───components/   # Reusable UI components
│   ├───hooks/        # Custom React hooks
│   ├───lib/          # Utility functions and API calls
│   ├───pages/        # Application pages/views
│   ├───styles/       # Global styles
│   └───types/        # TypeScript type definitions
├───package.json      # Project metadata and dependencies
├───vite.config.ts    # Vite configuration
└───tsconfig.json     # TypeScript configuration
```

## Application Flow

1.  **Entry Point:** The application's entry point is `src/main.tsx`. It renders the `App` component within a `BrowserRouter` to enable routing.
2.  **Main Component:** The `src/App.tsx` component sets up the main layout and defines the application's routes using `react-router-dom`.
3.  **Routing:** The application has public routes (e.g., `/`, `/auth/login`) and protected routes (e.g., `/dashboard`, `/generate`).
4.  **Authentication:** Protected routes are wrapped in a `ProtectedRoute` component, which likely checks for user authentication status. The `AuthProvider` component provides authentication context to the entire application.
5.  **Pages & Components:** The application is divided into pages (located in `src/pages`) and reusable components (located in `src/components`).

## Scripts

The following scripts are available in `package.json`:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase for errors.
- `npm run test`: Runs the test suite.
