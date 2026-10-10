# HunarHub – Digital Marketplace for Local Micro-Entrepreneurs
## Product Requirements Document (PRD) & Technical Documentation

---

## 1. Executive Summary & Problem Context

Millions of micro-entrepreneurs—such as cobblers, potters (*kumhar*), tailors, artisans, and small vendors—possess high-value traditional skills but lack digital visibility and access to broader markets. Most depend strictly on physical foot traffic and word-of-mouth recommendations, capping their income potential and financial sustainability.

**HunarHub** bridges this digital divide by providing a unified marketplace. Micro-entrepreneurs showcase their skills, list handmade products, receive service requests, and accept direct orders while maintaining complete transparency in pricing and availability.

---

## 2. System Scope & Boundaries

### In-Scope Features
* **Responsive Web Platform**: Built with React.js, Express.js, and PostgreSQL via Prisma ORM.
* **User & Entrepreneur Authentication**: Role-Based Access Control (RBAC) supporting `CUSTOMER`, `ENTREPRENEUR`, and `ADMIN`.
* **Category Directory**: Support for core categories (*Cobbler*, *Potter (Kumhar)*, *Tailor*, *Artisan*, *Small Vendor*).
* **Search & Multi-Criteria Filtering**: Filter by skill, location, keyword search, and price range.
* **Product Marketplace**: Image gallery, pricing details, and direct order placement.
* **Service Request Booking**: Request customization/repair services with status tracking (`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`).
* **Ratings & Feedback**: Verified customer reviews tied to completed orders and service requests.
* **Admin Governance**: Verification approval, category management, order monitoring, dispute force-resolution, and real-time analytics.

### Out-of-Scope (Future Scope)
* Native iOS/Android mobile apps.
* International shipping & currency conversion.
* Automated logistics and physical delivery routing.
* Advanced AI recommendation engines.

---

## 3. Data Dictionary & Entity-Relationship Schema

The database model is defined via Prisma schema mapping directly to PostgreSQL:

| Entity | Primary Key | Attributes | Relationships |
| :--- | :--- | :--- | :--- |
| **`User`** | `id` (UUID) | `name`, `email` (unique), `passwordHash`, `role` (`CUSTOMER` \| `ENTREPRENEUR` \| `ADMIN`), `phone`, `location`, `createdAt` | 1:1 with `Entrepreneur`, 1:N with `Order`, `ServiceRequest`, `Review` |
| **`Category`** | `id` (UUID) | `name` (unique) | 1:N with `Entrepreneur` |
| **`Entrepreneur`**| `id` (UUID) | `userId` (FK), `categoryId` (FK), `bio`, `location`, `priceRange`, `isVerified` (boolean), `isAvailable` (boolean) | Belongs to `User` & `Category`; 1:N with `Product`, `ServiceRequest`, `Review` |
| **`Product`** | `id` (UUID) | `entrepreneurId` (FK), `name`, `description`, `price` (Decimal 10,2), `imageUrl` | Belongs to `Entrepreneur`; 1:N with `Order` |
| **`ServiceRequest`**| `id` (UUID)| `customerId` (FK), `entrepreneurId` (FK), `description`, `status` (`PENDING` \| `ACCEPTED` \| `REJECTED` \| `COMPLETED`) | Belongs to `User` & `Entrepreneur`; 1:1 with `Review` |
| **`Order`** | `id` (UUID) | `customerId` (FK), `productId` (FK), `quantity` (Int), `totalPrice` (Decimal 10,2), `status` (`PENDING` \| `CONFIRMED` \| `COMPLETED` \| `CANCELLED`) | Belongs to `User` & `Product`; 1:1 with `Review` |
| **`Review`** | `id` (UUID) | `customerId` (FK), `entrepreneurId` (FK), `orderId` (FK, unique), `serviceRequestId` (FK, unique), `rating` (Int 1-5), `comment` | Linked to completed `Order` or `ServiceRequest` |

---

## 4. API Endpoints Architecture

### Auth Routes (`/api/auth`)
* `POST /api/auth/register`: Create user account (Customer or Micro-Entrepreneur).
* `POST /api/auth/login`: Authenticate and receive JWT token.
* `GET /api/auth/me`: Fetch current logged-in user profile.

### Category Routes (`/api/categories`)
* `GET /api/categories`: List all categories.
* `POST /api/categories`: Add category (Admin only).
* `DELETE /api/categories/:id`: Remove category (Admin only).

### Entrepreneur Routes (`/api/entrepreneurs`)
* `GET /api/entrepreneurs`: List & filter verified entrepreneurs (Query: `category`, `location`, `search`).
* `GET /api/entrepreneurs/:id`: Get detailed entrepreneur profile, products, and reviews.
* `GET /api/entrepreneurs/me/dashboard`: Fetch own dashboard (Entrepreneur only).
* `PUT /api/entrepreneurs/me`: Update profile details & availability (Entrepreneur only).
* `GET /api/entrepreneurs/me/earnings`: Calculate total revenue and completed counts.
* `PUT /api/entrepreneurs/:id/verify`: Approve/verify entrepreneur (Admin only).

### Product Routes (`/api/products`)
* `GET /api/products`: Browse products (Query: `category`, `minPrice`, `maxPrice`).
* `GET /api/products/:id`: Get product details.
* `POST /api/products`: Create product listing (Entrepreneur only).
* `PUT /api/products/:id`: Update product listing (Owner only).
* `DELETE /api/products/:id`: Remove product listing (Owner only).

### Service Request Routes (`/api/service-requests`)
* `POST /api/service-requests`: Submit service booking request (Customer only).
* `GET /api/service-requests/mine`: Track service request history (Customer only).
* `GET /api/service-requests/received`: List incoming requests (Entrepreneur only).
* `PUT /api/service-requests/:id/status`: Update status (`ACCEPTED`, `REJECTED`, `COMPLETED`).

### Order Routes (`/api/orders`)
* `POST /api/orders`: Place product order (Customer only).
* `GET /api/orders/mine`: Track order history (Customer only).
* `GET /api/orders/received`: List incoming product orders (Entrepreneur only).
* `PUT /api/orders/:id/status`: Update order status (`CONFIRMED`, `COMPLETED`, `CANCELLED`).

### Review Routes (`/api/reviews`)
* `POST /api/reviews`: Submit rating & feedback for completed order/request (Customer only).
* `GET /api/reviews/entrepreneur/:entrepreneurId`: List public reviews for an entrepreneur.

### Admin Routes (`/api/admin`)
* `GET /api/admin/entrepreneurs/pending`: View unverified entrepreneurs.
* `GET /api/admin/orders`: Monitor all platform orders.
* `GET /api/admin/service-requests`: Monitor all platform service requests.
* `PUT /api/admin/orders/:id/dispute`: Force-cancel order for dispute resolution.
* `PUT /api/admin/service-requests/:id/dispute`: Force-reject service request for dispute resolution.
* `GET /api/admin/analytics`: Real-time KPI metrics calculations.

---

## 5. Security & Non-Functional Compliance

1. **Authentication & Authorization**: JWT token signature verification with role enforcement middleware (`requireRole`).
2. **Brute-Force & Rate Limiting**: `express-rate-limit` configured for auth endpoints (20 max requests / 15 mins) and API routes (200 max requests / 15 mins).
3. **HTTP Hardening**: `helmet` header integration, strict CORS whitelisting (`CLIENT_URL`), and payload size limiting (10kb).
4. **Input Validation**: Data sanitization and verification for email patterns, minimum 8-character passwords, UUID parameters, positive numeric pricing/quantity, and 1-5 rating constraints.
5. **Timing Attack Protection**: Constant-time bcrypt hash comparison during login attempts.
6. **Data Privacy**: Internal stack traces and database error codes are sanitized prior to responding to clients.

---

## 6. Key Performance Indicators (KPIs) & Analytics Formulas

* **Registered Entrepreneurs**: Count of `Entrepreneur` records.
* **Active Users**: Count of `User` records where `role = 'CUSTOMER'`.
* **Service Request Conversion Rate**: `(ACCEPTED + COMPLETED Requests) / Total Requests`.
* **Product Sales Volume**: Sum of `quantity` across all `COMPLETED` orders.
* **Average Entrepreneur Earnings**: `Total Revenue from COMPLETED Orders / Total Registered Entrepreneurs`.
* **Customer Satisfaction Rating**: Average of all `Review.rating` scores (1–5 scale).

---

## 7. Deployment Guide

### Database Setup (Supabase)
Run `server/prisma/migrations.sql` in Supabase SQL Editor, or run `npx prisma migrate dev` after populating connection strings in `server/.env`.

### Production Commands
```bash
# Server
cd server
npm install
npm test
npm start

# Client
cd client
npm install
npm run build
```
