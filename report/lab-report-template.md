# NorthStar Insurance Lab Report

## Lab Objective

This lab implements a secure, two-sided insurance platform for NorthStar Insurance and Financial Services. The platform unifies customer-facing operations and internal operations in one system while enforcing strict authentication, authorization, and ownership controls.

Primary objectives achieved:

- Provide secure login using JWT-based authentication.
- Enforce role-based authorization for customer, internal, and admin users.
- Protect customer data with ownership validation so customers only access their own records.
- Support core insurance workflows for life, car, and home products.
- Centralize RBAC administration through admin-only APIs and UI screens.
- Run backend APIs over HTTPS for secure transport.

## Architecture Overview

### 1. System Architecture

The solution uses a full-stack monorepo with two applications:

- Backend: Node.js + Express
- Frontend: React + Next.js App Router

The frontend calls the backend through REST APIs and includes separate portal experiences for:

- Customer portal
- Internal operations portal
- Admin management portal

### 2. Backend Structure

The backend is organized using modular layers:

- Routes: endpoint definitions for auth, profile, admin, policies, and workflows
- Controllers: request handling and business logic coordination
- Middleware: authentication, authorization, ownership checks, error handling
- Data store: in-memory business objects and sample users for lab demonstration
- Config and utilities: HTTPS certificate management, JWT signing and verification, constants

Main API mounting:

- /api/auth
- /api/profile
- /api/admin
- /api/policies
- /api/amendments
- /api/reductions
- /api/claims

### 3. Frontend Structure

Frontend includes:

- Authentication provider and session state
- Shared API client for authenticated requests
- Route-level role-aware portal layouts
- Dedicated pages for customer, internal, and admin capabilities

Portal navigation and redirects are role-aware:

- customer role -> /customer
- internal roles -> /internal
- admin role -> /admin

### 4. Data and Domain Model

In-memory domain objects include:

- User (auth + business profile fields)
- Policy
- Amendment request
- Reduction request
- Claim

Sample users cover all required roles:

- customer1, customer2
- agent1
- underwriter1
- adjuster1
- csr1
- compliance1
- admin1

## Authentication Flow

### 1. Login Process

1. User submits username and password from login page.
2. Frontend calls POST /api/auth/login.
3. Backend validates user exists, account is active, and password hash matches.
4. On success, backend issues signed JWT and returns safe user profile (no password hash).
5. Frontend stores token and user state and redirects user to role-appropriate portal.

### 2. JWT Contents and Security

JWT token payload includes:

- userId
- username
- roles

Token configuration:

- Signed with JWT_SECRET from environment variables
- Expiration enforced (default 8h)
- Issuer claim set to northstar-insurance

Important security behavior:

- Password hashes are never included in token payload.
- Raw passwords are never returned in API responses.

### 3. Authenticated Session Use

For protected requests, frontend sends:

- Authorization: Bearer <token>

Backend auth middleware validates token signature and expiry before request is allowed to continue.

## Authorization Flow

Authorization is enforced in three layers:

### 1. Authentication Layer

Middleware checks:

- Bearer token exists
- token is valid and not expired

If invalid or missing, response is 401 Unauthorized.

### 2. Role-Based Layer

Role middleware verifies user has one of required roles for the endpoint.

Examples:

- Policy creation: insurance-agent or admin
- Amendment review: underwriter or admin
- Claim review: claims-adjuster or admin
- RBAC management endpoints: admin

If user lacks required role, response is 403 Forbidden.

### 3. Ownership and Scope Layer

Ownership middleware prevents cross-customer data access.

Examples:

- Customers can access only their own profiles and records.
- Policy detail access checks ownership or valid internal role.
- Amendment/reduction/claim record access checks ownership or authorized review/support roles.

If ownership/scope fails, response is 403 Forbidden.

### 4. Error and Status Discipline

API uses consistent status codes:

- 200/201 for successful operations
- 400 for invalid inputs
- 401 for unauthenticated access
- 403 for unauthorized access
- 404 for missing routes/records
- 500 handled by centralized safe error middleware

## User Profile Design

The user model implements two logical layers.

### 1. Authentication Layer Fields

- userId
- username
- passwordHash
- status
- roles
- lastLoginAt
- tokenSubject

### 2. Business Profile Layer Fields

Implemented business profile attributes include:

- firstName, lastName, dateOfBirth
- email, phoneNumber
- addressLine1, addressLine2, city, provinceOrState, postalCode, country
- customerNumber or employeeNumber
- userType
- preferredContactMethod
- emergencyContactName, emergencyContactPhone
- createdAt, updatedAt

Customer-focused fields:

- clientCategory
- linkedPolicies
- beneficiaryPlaceholder

Internal-focused fields:

- department
- jobTitle
- supervisorName
- internalAccessStatus

### 3. Profile Access Rules in Implementation

- All authenticated users can view and update own allowed personal fields via /api/profile/me.
- Admin can create/update users and control activation status.
- Compliance can view users in read scope.
- Profile view by id is protected with ownership/scope checks.

## RBAC Management

RBAC is centrally managed through admin APIs and admin screens.

### 1. Admin RBAC Endpoints

Admin-protected routes include:

- GET /api/admin/roles
- GET /api/admin/users
- GET /api/admin/users/:userId
- POST /api/admin/users
- PATCH /api/admin/users/:userId
- PATCH /api/admin/users/:userId/status
- POST /api/admin/users/:userId/roles
- DELETE /api/admin/users/:userId/roles/:role

### 2. RBAC Governance Rules Enforced

- Only admin role can access admin route group.
- Role assignment validates role name against known role catalog.
- Role changes affect all future authorization checks immediately.
- Admin can activate/deactivate accounts centrally.

### 3. Separation of Duties

Implemented duty boundaries:

- Underwriter: amendment/reduction decisions
- Claims Adjuster: claim decisions
- Agent: policy creation
- Customer: own records and request/claim submission
- Compliance: read-oriented visibility
- Admin: RBAC and platform management

## Insurance Workflows and Functional Coverage

### 1. Policy Management

Implemented:

- List policies
- View policy details
- Create policy (agent/admin)

Behavior:

- Customers receive only their own policies.
- Internal roles and admin have broader policy visibility.

### 2. Amendment Workflow

Implemented:

- Submit amendment request (customer/agent/admin)
- List amendment requests
- Review decision (underwriter/admin)

Decision states handled:

- approved
- rejected

### 3. Reduction Workflow

Implemented:

- Submit reduction request
- List reduction requests
- Review decision (underwriter/admin)

Decision states handled:

- approved
- rejected

### 4. Claims Workflow

Implemented:

- Submit claim
- List claims
- Review and decision (claims-adjuster/admin)

Decision states handled:

- approved
- rejected

## HTTPS Configuration

### 1. Secure Transport Design

Backend runs with Node HTTPS server by default.

- Port configured via environment (default 3443)
- Development certificate key/cert loaded from configured paths
- Certificates auto-generated for local development when missing

Environment switch available:

- USE_HTTPS=true by default for secure lab behavior
- Optional HTTP fallback exists for troubleshooting only

### 2. API Hardening Controls

- Helmet headers enabled (CSP relaxed for development)
- Rate limiting enabled (120 requests/minute window)
- CORS restricted to local trusted frontend origins in development
- JSON body size limit set
- Centralized not found and error handlers

## Frontend Screen Coverage

The implemented frontend includes the required screens:

### Customer Portal

- Login page
- Dashboard
- Profile page
- My Policies page
- Amendment request form and status list
- Reduction request form and status list
- Claim submission form and My Claims status list

### Internal Portal

- Dashboard
- Policy management view
- Underwriting review pages (amendments and reductions)
- Claims review page
- Customer support view

### Admin Portal

- User list
- User profile details
- Edit user profile screen
- Role assignment/removal controls
- Account activation/deactivation controls

## Screenshots

Insert screenshots for submission in this section:

1. Backend HTTPS startup console showing secure URL and port.
2. Login page with portal demo options.
3. Customer dashboard and customer workflow pages.
4. Internal operations pages for underwriting and claims reviews.
5. Admin user list and role assignment screens.
6. Example API call success and denied access (403) evidence.

## Testing Results

### 1. Authentication Tests

- Valid credentials return JWT and user object: Passed
- Invalid password returns 401: Passed
- Missing bearer token on protected route returns 401: Passed
- Expired/invalid token returns 401: Passed

### 2. Authorization and Ownership Tests

- Customer can access own profile/policies/claims only: Passed
- Customer cannot access another customer records: Passed
- Agent can create policy; customer cannot create policy: Passed
- Underwriter can review amendment/reduction; other non-authorized roles blocked: Passed
- Claims adjuster can review claims; non-authorized roles blocked: Passed
- Admin-only RBAC routes block non-admin with 403: Passed

### 3. Workflow Tests

- Amendment submission and decision cycle: Passed
- Reduction submission and decision cycle: Passed
- Claim submission and decision cycle: Passed
- Status updates reflected in subsequent list views: Passed

### 4. Security and Operational Validation

- HTTPS backend startup confirmed: Passed
- CORS policy configured for local frontend origins: Passed
- Rate limiter active: Passed
- Safe error responses without stack trace leakage: Passed
- No password hash exposed in response payloads: Passed

## Conclusion

The project successfully demonstrates a secure insurance platform architecture suitable for lab objectives in financial services:

- Secure transport with HTTPS
- JWT authentication with expiry
- Role-based authorization and ownership controls
- Centralized RBAC administration by admin
- End-to-end customer and internal insurance workflows

The implementation provides a realistic baseline for modern secure digital insurance operations and can be extended with persistent database storage, audit logs, and finer-grained permission groups in future phases.
