# Plan: Align Angular Dashboard with React Dashboard

## 1. Layout & Structure
- Ensure the Angular template uses the same container classes as React (`max-w-6xl mx-auto`).
- Ensure the flexbox layout for the header and the error message block matches React.

## 2. Header Section
- Ensure the `<h1>` and welcome message use the same classes and structure as React.
- Use `text-3xl font-bold` for the title and `text-muted-foreground` for the subtitle.
- Ensure the logout button uses the same variant and placement as in React.
- Use the `outline` variant and align it to the right.

## 3. Error Message Block
- Match the error block styling: `mb-6 p-4 bg-red-50 border border-red-200 rounded-md`.
- Use `text-red-700` for the error text.
- Add a dismiss button styled as in React (`variant="outline" size="sm" class="mt-2"`).

## 4. Generations Table
- Ensure `<app-generations-table>` is styled and structured like React's `<GenerationsTable>`.
- Pass error handling via `(error)="handleError($event)"`.
- Ensure the table uses the same classes for borders, headers, and rows as in React.
- Use badges for flashcard counts and align action buttons to the right.
- Add "Manage" and "Delete" buttons with the same variants and loading states as React.
- If there are no generations, display a message and a button to generate new flashcards, matching the React empty state.

## 5. SCSS Styling
- Move any inline or template classes that are reused into SCSS.
- Ensure all utility classes from React (Tailwind) are either used as-is (if Tailwind is available) or replicated in SCSS.

## 6. Button & Badge Components
- Ensure the Angular `<app-button>` matches the style and variants of the React `<Button>`.
- If not present, create a badge component or use a styled span for flashcard counts.

## 7. User Data
- Ensure the user email is displayed as in React (`Welcome back, {user?.email}`).

## 8. Error Handling
- Ensure errors from the generations table propagate up and are displayed in the error block.

---

**Deliverables:**
- Updated `dashboard.component.html` to match React structure and classes.
- Updated `dashboard.component.scss` for any missing styles.
- Adjustments to `dashboard.component.ts` for error handling and user data.
- Updates to `<app-generations-table>` as needed for table and empty state styling.
- Ensure all buttons and badges match the React look and feel. 