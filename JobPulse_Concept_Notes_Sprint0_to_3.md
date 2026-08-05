# JobPulse Learning Notes (Sprint 0--3)

## 1. Software Architecture

Software architecture is the high-level blueprint of an application. It
defines the major parts of the system, their responsibilities, and how
they communicate.

### Three Layers

-   **Frontend (React):** Displays the UI, collects user input, and
    communicates with the backend through HTTP requests.
-   **Backend (Express):** Contains business logic, validates requests,
    talks to the database, and coordinates services like Playwright.
-   **Database:** Stores application data permanently (users, jobs,
    saved jobs, etc.).

### Why separate them?

-   Easier maintenance
-   Better security
-   Easier testing
-   Scales as the application grows

------------------------------------------------------------------------

## 2. Single Page Application (SPA)

A Single Page Application loads one HTML page (`index.html`) and updates
the UI using JavaScript instead of reloading the entire website.

Benefits: - Faster navigation - Better user experience - Less data
transferred

------------------------------------------------------------------------

## 3. React Entry Point

### `index.html`

Contains:

``` html
<div id="root"></div>
```

This is the container where React renders the application.

### `main.jsx`

The true entry point of the React application.

Responsibilities: - Creates the React application - Mounts React into
`<div id="root">` - Wraps the app with global providers (Router, Theme,
Auth, etc.)

### `App.jsx`

The root React component.

Responsibilities: - Starts the UI tree - Composes layouts and routes -
Usually stays small in production applications

------------------------------------------------------------------------

## 4. React StrictMode

`React.StrictMode` is a development tool that helps detect unsafe
patterns and common mistakes. It does not affect production.

------------------------------------------------------------------------

## 5. Separation of Concerns (SoC)

Each folder or file should have one clear responsibility.

Examples:

-   `components/` → reusable UI
-   `pages/` → complete screens
-   `services/` → API communication
-   `utils/` → helper functions

Benefits: - Easier debugging - Easier collaboration - Better scalability

------------------------------------------------------------------------

## 6. Routing

Routing decides which page should be displayed for a specific URL.

Example:

-   `/` → Home
-   `/login` → Login
-   `/jobs` → Jobs

------------------------------------------------------------------------

## 7. Client-Side Routing

Instead of reloading the whole page, React changes only the displayed
component.

Benefits: - Faster navigation - Better user experience - Preserves
application state

------------------------------------------------------------------------

## 8. React Router

React Router enables navigation in React applications.

Main responsibilities: - Watches URL changes - Matches URLs to pages -
Renders the correct component

------------------------------------------------------------------------

## 9. BrowserRouter

Think of BrowserRouter as the GPS for React.

Responsibilities: - Watches the browser URL - Listens for URL changes -
Notifies React to render the correct route

Best practice: Wrap the entire application with `BrowserRouter` in
`main.jsx` because routing is a global concern.

------------------------------------------------------------------------

## 10. Routes

`Routes` checks the current URL and finds the matching `Route`.

Think of it as a switchboard that decides which page to display.

------------------------------------------------------------------------

## 11. Route

A `Route` maps a URL to a React component.

Example:

-   `/jobs` → `JobsPage`
-   `/login` → `LoginPage`

------------------------------------------------------------------------

## 12. Nested Routes

Nested routes allow multiple pages to share the same layout.

Example:

Dashboard Layout - Navbar - Sidebar - Outlet - Footer

Different child pages are rendered inside the Outlet.

Benefits: - No repeated layout code - Easier maintenance

------------------------------------------------------------------------

## 13. Outlet

`<Outlet />` is a placeholder inside a layout.

It renders whichever child route matches the current URL.

Example:

`/dashboard/jobs`

Dashboard Layout - Navbar - Sidebar - Outlet → JobsPage - Footer

------------------------------------------------------------------------

## 14. Why Layouts Exist

Layouts keep shared UI (Navbar, Sidebar, Footer) in one place.

Benefits: - Avoid duplication - Easier updates - Cleaner architecture

------------------------------------------------------------------------

## 15. Why Playwright Runs on the Backend

Playwright is a server-side automation tool.

Reasons: - Keeps credentials secure - Prevents users from running
automation in their browsers - Centralizes scraping logic - Makes
scheduled scraping possible

------------------------------------------------------------------------

## 16. Scheduled Scraping

Instead of scraping every time a user opens the app:

Scheduler → Playwright → Database

Users read data from the database.

Benefits: - Faster responses - Lower server load - Better scalability
