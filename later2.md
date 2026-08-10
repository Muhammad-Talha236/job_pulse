# React Context

React Context allows data to be shared between components
without manually passing props through every level.

## Problem: Prop Drilling

Without Context:

App
 ↓
Layout
 ↓
Navbar
 ↓
User

Every level may need to pass the user as a prop.

## Context

With Context:

AuthProvider
    ↓
 ┌──┼─────────┐
 ↓  ↓         ↓
Navbar Jobs  Profile

All components can access authentication state.

## Auth Context

Our AuthContext provides:

- token
- user
- isAuthenticated
- login()
- logout()

Components can access them using:

const { user, logout } = useAuth();

## React State vs localStorage

React state:
- Causes UI updates
- Exists during the current application session

localStorage:
- Survives browser refresh
- Persists data in the browser

We use both because they solve different problems.


# Context Provider

Creating a Context is not enough.

The application must be wrapped in the corresponding Provider.

Example:

<AuthProvider>
    <App />
</AuthProvider>

All components inside AuthProvider can access
the authentication context.

## Application Provider Structure

BrowserRouter
    ↓
AuthProvider
    ↓
App
    ↓
Routes
    ↓
Pages

BrowserRouter handles:
- URL
- Navigation
- Routing

AuthProvider handles:
- Authentication
- User
- Token
- Login
- Logout

## Vite Development Server

`npm run dev`

starts the Vite development server.

During development, Vite processes the application
and provides fast updates when files change.

"Compile successfully" in our development workflow
means the application starts without import,
syntax, or runtime errors.