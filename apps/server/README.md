# Open DGymBook API

A comprehensive gym management system API built with Bun, Hono, and Drizzle ORM. This project provides a complete backend solution for managing gyms, members, plans, and memberships with proper data relationships and security.

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **Framework**: [Hono](https://hono.dev) - Lightweight web framework
- **Database**: [PostgreSQL](https://postgresql.org) via [Neon](https://neon.tech)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team) - Type-safe SQL toolkit
- **Validation**: [Zod](https://zod.dev) - TypeScript-first schema validation

## 📁 Project Structure

```
src/
├── db/
│   ├── index.ts              # Database connection
│   ├── schema/
│   │   ├── auth.ts          # Authentication tables
│   │   └── gym.ts           # Gym management tables
│   └── migrations/          # Database migrations
├── routes/
│   ├── gyms.route.ts        # Gym endpoints
│   ├── members.route.ts     # Member endpoints
│   ├── plans.route.ts       # Plan endpoints
│   └── memberships.route.ts # Membership endpoints
├── services/
│   ├── gym.service.ts       # Gym business logic
│   ├── member.service.ts    # Member business logic
│   ├── plan.service.ts      # Plan business logic
│   └── membership.service.ts # Membership business logic
├── schema/
│   ├── gym.schema.ts        # Gym validation schemas
│   ├── member.schema.ts     # Member validation schemas
│   ├── plan.schema.ts       # Plan validation schemas
│   └── membership.schema.ts # Membership validation schemas
└── index.ts                 # Application entry point
```

## 🗄️ Database Schema

### Tables

- **gyms**: Gym information and settings
- **members**: Gym member profiles
- **plans**: Subscription plans and pricing
- **memberships**: Links members to plans with duration

### Relationships

```
gyms (1) → (N) members
gyms (1) → (N) plans
members (1) → (N) memberships
plans (1) → (N) memberships
```

## 🚦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/docs/installation) >= 1.0
- PostgreSQL database (recommend [Neon](https://neon.tech))
- Node.js knowledge

### Installation

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL=postgresql://user:password@host/database
   CORS_ORIGIN=http://localhost:3001
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Generate and run database migrations**
   ```bash
   bun run db:generate
   bun run db:push
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
Authentication is currently **disabled** for easy development and testing. All endpoints are publicly accessible.

To enable authentication:
1. Uncomment the auth import in `src/index.ts`
2. Uncomment the auth route handler in `src/index.ts`
3. Add `better-auth` back to `package.json` dependencies
4. Uncomment auth environment variables in `.env`

Authentication endpoints would be handled by Better Auth at `/api/auth/*`

### Gym Management

#### Gyms
```http
GET    /api/gyms                    # List all gyms
POST   /api/gyms                    # Create a gym
GET    /api/gyms/:id                # Get gym by ID
PATCH  /api/gyms/:id                # Update gym
DELETE /api/gyms/:id                # Delete gym
```

#### Members (Scoped to Gym)
```http
GET    /api/:gymId/members          # List gym members
POST   /api/:gymId/members          # Create member
GET    /api/:gymId/members/:id      # Get member
PATCH  /api/:gymId/members/:id      # Update member
DELETE /api/:gymId/members/:id      # Delete member
```

#### Plans (Scoped to Gym)
```http
GET    /api/:gymId/plans            # List gym plans
POST   /api/:gymId/plans            # Create plan
GET    /api/:gymId/plans/:id        # Get plan
PATCH  /api/:gymId/plans/:id        # Update plan
DELETE /api/:gymId/plans/:id        # Delete plan
```

#### Memberships (Scoped to Gym)
```http
GET    /api/:gymId/memberships      # List gym memberships
POST   /api/:gymId/memberships      # Create membership
GET    /api/:gymId/memberships/:id  # Get membership
PATCH  /api/:gymId/memberships/:id  # Update membership
DELETE /api/:gymId/memberships/:id  # Delete membership
```

### Request/Response Examples

#### Create a Gym
```bash
curl -X POST http://localhost:3000/api/gyms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PowerFit Gym",
    "address": "123 Fitness Street",
    "phone": "+1-555-0123",
    "email": "info@powerfit.com"
  }'
```

#### Create a Member
```bash
curl -X POST http://localhost:3000/api/{gymId}/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-1234",
    "dateOfBirth": "1990-05-15"
  }'
```

#### Create a Plan
```bash
curl -X POST http://localhost:3000/api/{gymId}/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basic Monthly Plan",
    "description": "Access to gym equipment",
    "price": 29.99,
    "duration": 30,
    "durationType": "days"
  }'
```

#### Create a Membership
```bash
curl -X POST http://localhost:3000/api/{gymId}/memberships \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "member-uuid",
    "planId": "plan-uuid"
  }'
```

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "count": 10  // For list endpoints
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔧 Development

### Available Scripts

```bash
bun run dev          # Start development server with hot reload
bun run build        # Build for production
bun run start        # Start production server
bun run check-types  # Type checking
bun run db:generate  # Generate database migrations
bun run db:push      # Push schema changes to database
bun run db:studio    # Open Drizzle Studio (database GUI)
```

### Database Management

#### Generate Migration
```bash
bun run db:generate
```

#### Push Changes
```bash
bun run db:push
```

#### View Database
```bash
bun run db:studio
```
Opens Drizzle Studio at `https://local.drizzle.studio`

### Code Structure Guidelines

1. **Services**: Business logic and data operations
2. **Routes**: HTTP endpoint definitions and validation
3. **Schemas**: Zod validation schemas for request/response
4. **Database**: Drizzle ORM table definitions and relationships

## 🏗️ Architecture

### Data Flow

1. **Request** → Route Handler
2. **Validation** → Zod Schema
3. **Business Logic** → Service Layer
4. **Database** → Drizzle ORM
5. **Response** → JSON Format

### Environment Variables
```env
DATABASE_URL=postgresql://...           # Production database
CORS_ORIGIN=https://yourdomain.com     # Production frontend
BETTER_AUTH_SECRET=strong-secret-key   # Secure random string
BETTER_AUTH_URL=https://api.yourdomain.com
```

### Monitoring
- Health check endpoint: `GET /api/health`
- Request logging via Hono middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request
