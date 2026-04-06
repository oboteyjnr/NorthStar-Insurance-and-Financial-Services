# NorthStar Insurance and Financial Services

Secure full-stack insurance platform for a lab scenario using a Node.js/Express HTTPS backend and a Next.js frontend.

## What is included

- HTTPS-enabled Express API with JWT authentication
- Role-based authorization for customer, internal staff, and administrator flows
- Ownership checks so customers can only access their own records
- User profile, policy, amendment, reduction, and claims modules
- Admin RBAC management APIs for assigning and removing roles
- Next.js portal UI for customer, internal, and admin users
- Lab report template and setup instructions

## Project layout

- `backend` - Express API, middleware, in-memory data store, and HTTPS server
- `frontend` - Next.js application with role-aware portals and protected navigation
- `report` - lab report template for screenshots and write-up

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

## Install

```bash
npm install
```

## Run the backend

```bash
npm run dev --workspace backend
```

The backend starts on HTTPS and will create development certificates automatically when they are missing.

## Run the frontend

```bash
npm run dev --workspace frontend
```

## Environment setup

Backend example variables are in `backend/.env.example`.

Frontend example variables are in `frontend/.env.local.example`.

Copy them to `.env` and `.env.local` respectively before running the apps.

## Sample users

All sample users use the password `Password123!`.

- `customer1` - Customer
- `agent1` - Insurance Agent
- `underwriter1` - Underwriter
- `adjuster1` - Claims Adjuster
- `csr1` - Customer Service Representative
- `compliance1` - Compliance Officer
- `admin1` - Administrator

## HTTPS notes

The backend uses the Node.js `https` module. If certificates are absent, the server generates local development certificates into `backend/certs`.

If you want to regenerate certificates manually, run:

```bash
npm run create-cert --workspace backend
```

## JWT notes

Successful login returns a signed access token containing the user id, username, roles, issued-at time, and expiration. Passwords are never stored in the token.

## Profile and RBAC

The backend exposes protected profile APIs for viewing and updating business profile data. Admin-only RBAC APIs allow listing users, viewing profiles, assigning roles, removing roles, and activating or deactivating accounts.

## Report deliverable

Use `report/lab-report-template.md` as the basis for the PDF or DOCX submission. Add screenshots for HTTPS startup, login, customer workflows, internal reviews, and admin RBAC management.