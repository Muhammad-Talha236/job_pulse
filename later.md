Backend Architecture
Express
Middleware
express.json()
CORS
REST API
HTTP Request / Response
Environment Variables
.env
.env.example
.gitignore
dotenv
ES Modules
Node.js package.json scripts
Nodemon
app.js vs server.js
Health Check Endpoint



React Hook Form
useForm()
register()
handleSubmit()
formState
Validation Errors
Zod Schema
z.object()
z.string()
zodResolver()
Spread Syntax
Ternary Operator
Boolean State
State Toggling
isSubmitting
Form Validation Flow


Password Hashing
Hashing vs Encryption
bcrypt
Salt
Salt Rounds / Cost Factor
Password Verification
bcrypt.compare()
Asynchronous Password Hashing
Security Through Separation of Concerns
Never Store Plain-Text Passwords
Never Return Passwords From APIs

200 → Successful request
201 → Resource created
400 → Bad request
401 → Not authenticated
403 → Not authorized
404 → Not found
409 → Conflict
500 → Server error



Express Controllers
Express Routers
Route Mounting
REST Endpoint
HTTP POST
Request Body
req.body
HTTP Status Codes
201 Created
400 Bad Request
409 Conflict
500 Internal Server Error
Parameterized SQL
SQL INSERT
SQL RETURNING
Duplicate Resource Handling
Backend Validation
Client vs Server Validation

Frontend ↔ Backend Communication
HTTP Request
HTTP Response
HTTP POST
Axios
API Layer
API Client
async / await
try / catch / finally
Optional Chaining
Loading State
Error State
CORS
Request Lifecycle
Separation of Concerns

Authentication
Authorization
JWT
JSON Web Token
JWT Header
JWT Payload
JWT Signature
jwt.sign()
jwt.verify()
JWT Secret
Environment Variables
Token Expiration
Bearer Token
Access Token



Login Controller
Credential Verification
bcrypt.compare()
Authentication Failure
401 Unauthorized
Generic Authentication Errors
JWT Generation
Stateless Authentication
JWT Payload
Safe User Object
Sensitive Data Removal

Express Middleware
Authentication Middleware
Authorization Header
Bearer Token
req.headers
jwt.verify()
Decoded JWT Payload
req.user
next()
Protected Routes
401 Unauthorized
Middleware as a Security Gate
Stateless Authentication

Axios Instance
API Client
API Domain Modules
Separation of Concerns
Base URL
Environment-specific Configuration
Frontend → API → Backend Flow

## Login Form Architecture

The LoginForm is responsible for:

- Collecting email and password
- Client-side validation
- Showing validation errors
- Showing server errors
- Showing loading state

The LoginPage is responsible for:

- Calling the login API
- Managing authentication state
- Handling API errors
- Handling successful login
- Navigating the user

### Flow

LoginForm
    ↓
React Hook Form
    ↓
Zod validation
    ↓
LoginPage.onSubmit()
    ↓
loginUser()
    ↓
apiClient
    ↓
Backend



# Protected Routes

A protected route is a route that requires authentication.

Example:

User requests /dashboard
        ↓
ProtectedRoute
        ↓
Is JWT token available?
        ↓
   ┌────┴────┐
   ↓         ↓
  YES        NO
   ↓         ↓
Dashboard   /login


## React Router Outlet

`Outlet` is used by React Router to render
the matched child route inside a parent route.

Example:

<Route element={<ProtectedRoute />}>
    <Route
        path="/dashboard"
        element={<Dashboard />}
    />
</Route>

When `/dashboard` is requested:

ProtectedRoute
      ↓
Outlet
      ↓
Dashboard


## Frontend vs Backend Protection

Frontend protection:

ProtectedRoute
    ↓
Prevents unauthenticated users from
opening protected pages.

Backend protection:

authMiddleware
    ↓
Verifies the JWT before allowing
access to protected API endpoints.

Both are required.

Frontend protection improves UX.
Backend protection provides actual API security.