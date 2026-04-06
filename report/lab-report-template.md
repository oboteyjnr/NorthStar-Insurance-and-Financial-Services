# NorthStar Insurance Lab Report

## Lab Objective

Describe how the platform supports a secure two-sided insurance model with customer-facing and internal staff workflows.

## Architecture Overview

- Backend: Node.js, Express.js, HTTPS, JWT authentication, RBAC middleware, ownership checks
- Frontend: Next.js portals for customer, internal, and admin users
- Data model: in-memory lab dataset for users, policies, amendments, reductions, and claims

## Authentication Flow

Explain how a user submits credentials, receives a signed JWT, and uses the token on protected requests.

## Authorization Flow

Explain how middleware checks token validity, role membership, and record ownership before serving the request.

## User Profile Design

Describe the two-layer model:

- Authentication layer
- Business profile layer

## RBAC Management

Describe how the administrator assigns and removes roles through protected backend APIs and the admin portal.

## HTTPS Configuration

Explain the HTTPS server setup and include screenshots of the secure backend starting successfully.

## Screenshots

- Login screen
- Customer dashboard
- Internal review screens
- Admin RBAC screens
- HTTPS server console output

## Testing Results

Document login, access control, ownership checks, and workflow decisions.
