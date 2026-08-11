# Axios API Client

Axios is an HTTP client used by the frontend to communicate
with the backend API.

## Axios Instance

Instead of using Axios directly everywhere:

axios.get(...)
axios.post(...)

we create a configured Axios instance:

const axiosClient = axios.create({
    baseURL: "...",
});

This gives the application one centralized HTTP client.

## Why Use an Axios Instance?

It allows us to centrally configure:

- Base API URL
- Headers
- Timeout
- Authentication
- Request interceptors
- Response interceptors

## Axios Interceptor

An interceptor allows us to execute logic before or after
an HTTP request.

### Request Interceptor

Our request flow:

API Request
    ↓
Request Interceptor
    ↓
Read JWT
    ↓
Add Authorization Header
    ↓
Send Request

The JWT is added using:

config.headers.Authorization = `Bearer ${token}`;

The backend receives:

Authorization: Bearer <JWT>

## Response Interceptor

A response interceptor runs after the backend responds.

We can later use it for:

- 401 Unauthorized
- Expired tokens
- Automatic logout
- Global API error handling

## Environment Variables

Frontend Vite variables use the `VITE_` prefix.

Example:

VITE_API_URL=http://localhost:5000/api

Frontend environment variables are NOT suitable for
secrets because frontend code is exposed to the browser.

Never put:

- JWT secrets
- Database passwords
- Private API keys

inside VITE_* variables.