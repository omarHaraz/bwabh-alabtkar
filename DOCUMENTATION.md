# Bwabh Alabtkar (Innovation Hub) — System Documentation Package

> **Note**: This documentation package accompanies the **Bwabh Alabtkar** enterprise innovation and workforce skill management platform. It is structured for both executive decision-makers and technical reviewers evaluating the system.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Features & Capabilities](#2-features--capabilities)
3. [User Guide & Workflows](#3-user-guide--workflows)
4. [Seeded Demo Accounts](#4-seeded-demo-accounts)
5. [Architecture Overview](#5-architecture-overview)
6. [Technology Stack & Design Rationale](#6-technology-stack--design-rationale)
7. [Deployment & Demonstration Environment Notes](#7-deployment--demonstration-environment-notes)
8. [Testing & Evaluation Instructions](#8-testing--evaluation-instructions)
9. [Current System Limitations](#9-current-system-limitations)
10. [Future Production Roadmap](#10-future-production-roadmap)
11. [Appendix: API Endpoints & Reference](#11-appendix)

---

## 1. Executive Summary

### What the Application Does
**Bwabh Alabtkar** (بوابة الابتكار — *Innovation Hub*) is a comprehensive enterprise SaaS platform designed to bridge workforce skill gaps and manage organizational innovation. The platform provides an end-to-end ecosystem where organizations can collect workforce ideas, evaluate skill competencies, recommend personalized development pathways, and track training impact on organizational performance.

### The Problem It Solves
Traditional organizations struggle with two core challenges:
1. **Workforce Skill Fragmentation**: Training programs are often generic, lacking alignment with actual employee skill deficiencies and strategic business goals.
2. **Unorganized Innovation Intake**: Valuable ideas from front-line employees are buried in emails or informal channels, missing structured evaluation and execution.

Bwabh Alabtkar consolidates skill assessment, OTP-secured authentication, multi-role administration, and structured innovation intake into a single web application.

### Target Users
- **Super Administrators**: Executive IT/HR heads managing administrative roles and system configuration.
- **Standard Administrators**: Operations managers overseeing customer accounts, user onboarding, and portal management.
- **Corporate Customers & Employees**: Enterprise staff submitting innovation proposals, verifying credentials, and accessing skill development resources.

### Business Value
- **Higher ROI on Training**: Data-driven skill gap analysis ensures training budgets target verified competency deficiencies.
- **Accelerated Innovation Lifecycle**: Reduces idea evaluation time from weeks to days via centralized intake workflows.
- **Enterprise-Grade Security**: Secured with stateless JWT authentication, Spring Security, Redis-backed OTP state management, and Jakarta Bean Input Validation (`@Valid`).

---

## 2. Features & Capabilities

### 2.1 Customer Portal Features
- **Responsive Landing Page**: Multi-device optimized presentation highlighting workforce skill bridging and innovation management.
- **Industry Solutions Showcase**: Specialized solution modules tailored for **Education**, **Enterprise**, **Government**, and **Healthcare** sectors.
- **Product Suite**: Interactive pages for **Whiteboard Collaboration**, **Idea Management**, and **AI Skill Analysis**.
- **Secure Authentication Suite**:
  - **Account Registration**: Full name, email, and password registration with strict frontend/backend validation.
  - **Single-Click OTP Verification**: 6-digit email verification delivered via Resend HTML API, featuring **one-click paste** that automatically splits 6-digit clipboard codes across input boxes.
  - **Stateless JWT Sign-in**: Secure authentication returning bearer JWT tokens.
  - **Password Recovery Flow**: Forgot password workflow with email verification code and multi-step verification before password update.

### 2.2 Admin Management Dashboard
- **Material Dashboard Aesthetic**: Sleek dark/light theme built on Material Dashboard with custom Toast notifications and confirmation dialogs.
- **Administrator Management**:
  - Create new Standard Admins or Super Admins.
  - Edit administrator details with email immutability enforcement.
  - Soft-deactivate and reactivate administrator accounts with Material dialog confirmation.
- **Customer Management**:
  - Monitor customer status (Active / Deactivated).
  - Update customer profiles and manage account lifecycle.
- **Navbar Profile Dropdown & Session Management**:
  - Topbar user dropdown displaying active user name and email.
  - One-click secure Logout clearing session tokens and returning to sign-in.

---

## 3. User Guide & Workflows

### 3.1 Customer Workflow (Sign-Up & Verification)
1. **Navigate to Sign-Up**: Click **Create Account** on the sign-in page (`docs/auth/signup.html`).
2. **Enter Credentials**: Fill in Full Name, Email, and Password (minimum 6 characters).
3. **Email OTP Delivery**: The system generates a 6-digit verification code stored in Redis and sends a styled HTML email to your inbox.
4. **One-Click OTP Entry**: Copy the 6-digit code from your email, click the first OTP box, and paste (`Ctrl+V` or right-click paste). All 6 boxes populate automatically.
5. **Complete Account Activation**: Click **Verify Code** to activate your account and proceed to Sign-In.

---

### 3.2 Password Reset Workflow
1. Click **Forgot Password?** on the sign-in page (`docs/auth/forgot-password.html`).
2. Enter your registered email address and submit.
3. Check your email for the **Bwabh Alabtkar Password Reset Code**.
4. Paste the 6-digit code on the verification screen (`docs/auth/verify-reset.html`).
5. Set your new password on the final screen (`docs/auth/reset-password.html`).

---

### 3.3 Admin Workflow (Dashboard Management)
1. Navigate to `docs/admin/pages/dashboard.html` and sign in using an Admin account.
2. **View System Analytics**: Access customer overview and system status metrics.
3. **Manage Administrators** (`docs/admin/pages/admins.html`):
   - Click **Add New Administrator** to open the modal.
   - Enter Name, Email, Password, and select Role (`ROLE_ADMIN` or `ROLE_SUPER_ADMIN`).
   - Click **Save** to submit. The system validates inputs via `@Valid` and displays toast notifications.
4. **Deactivate/Reactivate Accounts**:
   - Click **Deactivate** on an active account row.
   - Confirm the action in the custom Material modal.
   - To restore access, click **Reactivate**.
5. **Logout**: Click the user profile icon (`account_circle`) in the top-right navbar and click **Logout**.

---

## 4. Seeded Demo Accounts

The database contains pre-configured demonstration accounts for system evaluation:

| Account Type | Role Granted | Email Address | Password | Key Permissions & Capability Scope | Recommended Testing Scenarios |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `ROLE_SUPER_ADMIN`<br>`ROLE_ADMIN` | `superadmin@bwabhalabtkar.com` | `admin123` | • Full System Control<br>• Create & Edit Administrators<br>• Deactivate / Reactivate Admins<br>• Manage Customer Accounts<br>• View Dashboard Metrics | Test admin creation, role assignments, admin deactivation/reactivation, and customer management. |
| **Standard Admin** | `ROLE_ADMIN` | `admin@bwabhalabtkar.com` | `admin123` | • Operational Management<br>• Manage Customer Accounts<br>• View Dashboard Metrics<br>• Restricted from editing Super Admins | Test standard admin navigation, customer deactivation, and restricted super admin boundaries. |
| **Customer User** | `ROLE_CUSTOMER` | `customer@bwabhalabtkar.com` | `password123` | • Portal Access<br>• Explore Solutions & Products<br>• Profile & Password Recovery | Test sign-in, solution pages exploration, and password reset workflow. |

---

## 5. Architecture Overview

### Key Components
- **Frontend Layer**: Static web package stored in `docs/` (GitHub Pages compatible), built with Vanilla HTML5, CSS3 (WebP media optimization), and ES modules.
- **Backend Layer**: Spring Boot 4.1.0 application with Java 26, Spring Data JPA, and Spring Validation (`@Valid` Bean Validation).
- **Database & Cache**: Relational storage for permanent user entities, paired with Redis in-memory cache for ephemeral OTP registration states (`PendingSignup`, `PendingPasswordReset`) with 10-minute automatic expiration.
- **Security & Authentication**: Stateless JWT bearer tokens (`io.jsonwebtoken`), BCrypt password hashing, and Spring Security method-level protection.
- **Email Delivery**: Integrated with the **Resend API** for HTML transactional email delivery.

---

## 6. Technology Stack & Design Rationale

| Layer | Technology | Version | Rationale & Selection Criteria |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Spring Boot | 4.1.0 (Java 26) | Provides robust enterprise Java infrastructure, dependency injection, and native security filters. |
| **Security & Auth** | Spring Security + JWT | 0.12.5 | Enables stateless token-based authentication with zero server session overhead. |
| **Validation** | Jakarta Bean Validation | 3.1.0 | Enforces strict DTO constraints (`@NotBlank`, `@Email`, `@Pattern`, `@Size`) at controller endpoints. |
| **Cache Store** | Redis | 7.x | In-memory key-value cache with automatic TTL expiration for secure 6-digit OTP codes. |
| **Transactional Email** | Resend Java SDK | 3.1.0 | High-deliverability API for rendering HTML verification emails. |
| **Frontend Core** | HTML5 / CSS3 / Vanilla JS | ES6+ | Zero-dependency browser execution ensuring ultra-fast load times and lightweight footprint. |
| **Media Format** | WebP | Lossless 85% | Replaced PNG/JPG files, reducing image payload size by ~80% (~29 MB saved). |
| **Admin UI Theme** | Material Dashboard | 3.2.0 | High-end dashboard component framework with responsive sidebar and table controls. |

---

## 7. Deployment & Demonstration Environment Notes

> **Demonstration Environment Notice**:
> - The live backend service for this evaluation environment is hosted locally on a development machine and exposed securely using a **reverse HTTP/HTTPS tunnel**.
> - Because API requests travel over a local broadband connection through tunnel relays, response times may experience minor latency compared to cloud deployment.
> - In a **production deployment** (e.g., AWS EC2/ECS, GCP, or a dedicated Cloud VPS with managed Redis and PostgreSQL), response times are sub-100ms.

---

## 8. Testing & Evaluation Instructions

To evaluate the application thoroughly, test the following core scenarios:

### Scenario A: New User Registration & Single-Click OTP Paste
1. Open `docs/auth/signup.html`.
2. Enter your name, email, and password, then click **Create Account**.
3. Check your email for the 6-digit code.
4. Copy the code, click the first OTP input box, and press `Ctrl+V`. Verify that all 6 boxes populate instantly.
5. Click **Verify Code** and confirm account creation.

### Scenario B: DTO Input Validation (Backend Enforcement)
1. Open `docs/auth/login.html` and attempt to submit an invalid email format (e.g., `user@test`).
2. Observe backend validation response returning structured JSON field errors.
3. Test short password entry on signup to verify `@Size(min = 6)` enforcement.

### Scenario C: Admin Management & Role Actions
1. Open `docs/admin/pages/admins.html` and log in as `superadmin@bwabhalabtkar.com` (`admin123`).
2. Click **Add New Administrator** and create a new Standard Admin.
3. Deactivate an administrator account and verify the Material modal confirmation dialog.
4. Log out via the top-right account dropdown.

---

## 9. Current System Limitations

> **PoC Notice**:
> The current system is deployed as a **Proof of Concept (PoC)**. The following limitations are intentional for demonstration scope:
> 1. **Reverse Tunnel Backend**: Local host backend connectivity subject to local network variations.
> 2. **Email Sandbox Mode**: Email delivery via Resend API operates under free tier rate limits (100 emails/day).
> 3. **Single Region Database**: Operating single-instance relational storage without multi-region read replicas.

---

## 10. Future Production Roadmap

For full commercial production readiness, the following enhancements are planned:

1. **Cloud Native Infrastructure**: Containerize backend services with Docker & Kubernetes (EKS/GKE) behind an AWS Application Load Balancer.
2. **CI/CD Automation**: Automated testing, linting, and deployment pipelines via GitHub Actions.
3. **Observability & Monitoring**: Spring Boot Actuator integration with Prometheus & Grafana dashboards.
4. **Enhanced Content Security**: Strict Content Security Policy (CSP), CORS domain restriction, and Rate Limiting filters (`Bucket4j` / Redis rate limiter).
5. **SSO Integration**: OAuth2 / SAML 2.0 integration for enterprise Single Sign-On (Google Workspace, Microsoft Entra ID).

---

## 11. Appendix

### 11.1 Live Demonstration URLs
- **Customer Portal**: `docs/customer/pages/home.html` (GitHub Pages)
- **Admin Dashboard**: `docs/admin/pages/dashboard.html`
- **Sign-In Page**: `docs/auth/login.html`

### 11.2 API REST Endpoint Summary

| HTTP Method | Endpoint | Description | Auth Required | Validation DTO |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Initiate user registration & send OTP | No | `SignupRequest.java` |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No | `LoginRequest.java` |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit registration code | No | `OtpVerificationRequest.java` |
| `POST` | `/api/auth/forgot-password` | Send password reset OTP | No | `ForgotPasswordRequest.java` |
| `POST` | `/api/auth/reset-password` | Set new password with OTP | No | `ResetPasswordRequest.java` |
| `GET` | `/api/admin/management` | List all administrators | Yes (`ROLE_ADMIN`) | N/A |
| `POST` | `/api/admin/management` | Create new administrator | Yes (`ROLE_SUPER_ADMIN`) | `AdminCreateRequest.java` |
| `DELETE` | `/api/admin/management/{id}` | Soft-deactivate administrator | Yes (`ROLE_SUPER_ADMIN`) | N/A |
| `PATCH` | `/api/admin/management/{id}/reactivate` | Reactivate administrator | Yes (`ROLE_SUPER_ADMIN`) | N/A |
