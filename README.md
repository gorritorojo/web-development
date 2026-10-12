# Honya

Honya is a book discovery app for searching the Open Library catalog, viewing book details, and managing borrowed books with a Supabase account.

## Features

- Browse books by genre and search the catalog
- View book details and current loan availability
- Borrow available books and return books borrowed by your account
- View your borrowed books on your profile
- Sign up and sign in with Supabase Auth
- Switch between light and dark themes, the preference is saved in the browser

## Tech stack

- React and TypeScript
- Vite and Tailwind CSS
- React Router
- Supabase Auth and Edge Functions
- Open Library API

## Getting started

Install dependencies and start the development server:

```sh
bun install
bun run dev
```

Create a `.env` file in the project root with your Supabase project settings:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Book loans use the deployed Supabase Edge Functions: `book-status`, `borrow-book`, `return-book`, and `my-loans`.

## Available scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run build` | Type-check and create a production build in `dist/` |
| `bun run preview` | Preview the production build locally |
| `bun run check` | Run the project code checks |
| `bun run test` | Run the test suite |

## Project structure

```text
src/
  components/  Shared UI components
  contexts/    Pagination and theme state
  hooks/       Reusable React hooks
  layouts/     Shared page layouts
  pages/       Home, search, genre, book details, login, and profile pages
  services/    Open Library and Supabase requests
  types/       API and application types
  utils/       API clients
supabase/
  functions/   Supabase Edge Function sources
```

## Main routes

- `/` — book catalog
- `/genre/:subject` — books by genre
- `/search?q=...` — search results
- `/books/:bookId` — book details and loan actions
- `/profile` — account details and borrowed books
- `/login` — sign-in and account creation
