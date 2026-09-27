# Slop Punisher

A private, community-driven penalty and accountability platform built for small groups.

Slop Punisher lets members create rules, report infractions, vote on proposed penalties, track balances, and manage cash transactions — all backed by a real-time Convex database and authenticated through Clerk.

The goal is simple: **make group accountability transparent, democratic, and slightly ridiculous.**

---

## ✨ Features

### 👥 Member management

- Clerk authentication with username + password
- Automatic user synchronization with Convex
- User profiles with:
  - Username
  - Name
  - Profile picture
  - Assigned color
- Automatic color assignment for new members

### 📜 Rules

Rules define what constitutes an infraction and how much it costs.

Each rule contains:

- Description
- Fine amount
- Fine unit
- Required approvals
- Status

Rules can go through a voting process before becoming active.

Supported units include:

- Occurrence
- File
- Row
- Line
- Minute
- Custom

### 🚨 Infractions

Members can report infractions against other members.

Each infraction tracks:

- Rule
- Accused member
- Reporter
- Quantity
- Amount
- Optional note
- Status
- Creation and resolution timestamps

Infractions can be voted on by other members before being confirmed or rejected.

### 💰 Transactions

Slop Punisher keeps track of money moving between members.

Transactions currently support:

- Cash payments
- Pending / confirmed / rejected states
- Required approvals
- Voting
- Resolution tracking

This allows payments to be confirmed collectively rather than relying on a single person.

### 🗳️ Voting

Several parts of the application use collective approval:

- Rule proposals
- Infractions
- Transactions

Votes are stored individually so the application can prevent duplicate votes and keep an audit trail.

### 📊 Dashboard

The dashboard provides an overview of the group's current state, including:

- Member balances
- Recent activity
- Items requiring attention
- Financial activity
- Balance history over time

Charts support multiple time ranges:

- Today
- 7 days
- 30 days
- 90 days
- 1 year

### 👤 Profiles

Each member has a dedicated profile containing:

- Current balance
- Financial history
- Voting statistics
- Activity statistics
- Account information
- Personal balance history

---

## 🏗️ Tech Stack

| Technology | Purpose |
| --- | --- |
| [Next.js](https://nextjs.org/) | React framework and application routing |
| [React](https://react.dev/) | User interface |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application code |
| [Convex](https://convex.dev/) | Database, queries and mutations |
| [Clerk](https://clerk.com/) | Authentication and user sessions |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI components |
| [Recharts](https://recharts.org/) | Data visualization |
| [Oxlint](https://oxc.rs/docs/guide/usage/linter) | JavaScript / TypeScript linting |
| [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) | Code formatting |

---

## 🧠 Architecture

The application is split between a Next.js frontend and a Convex backend.

```text
┌─────────────────────────────────────────────┐
│                   Next.js                   │
│                                             │
│  App Router                                 │
│  React Components                           │
│  shadcn/ui                                  │
│  Tailwind CSS                               │
│                                             │
│        │                                    │
│        │ Convex React Client                │
│        ▼                                    │
├─────────────────────────────────────────────┤
│                   Convex                    │
│                                             │
│  Queries                                    │
│  Mutations                                  │
│  Database                                   │
│  Authentication integration                 │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ Auth
                   ▼
             ┌───────────┐
             │   Clerk   │
             │           │
             │ Username  │
             │ + Password│
             └───────────┘
```

Convex handles the application's persistent state and server-side business logic, while Clerk handles authentication.

The Convex client is connected to Clerk through `ConvexProviderWithClerk`, allowing authenticated Convex queries and mutations to use the current Clerk identity.

---

## 📁 Project Structure

The project follows a feature-oriented structure on the frontend and separates backend functionality into Convex modules.

```text
.
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   └── ...
│
├── components/
│   ├── Dashboard/
│   │   ├── Chart/
│   │   └── ...
│   ├── Profile/
│   ├── Login/
│   └── ui/
│
├── convex/
│   ├── schema.ts
│   ├── users.ts
│   ├── profile.ts
│   ├── dashboard.ts
│   └── _generated/
│
├── hooks/
│   └── ...
│
├── lib/
│   └── ...
│
├── public/
│   └── ...
│
├── auth.config.ts
├── next.config.ts
├── oxlint.config.ts
└── ...
```

### Convex database

The main entities are:

```text
users
│
├── rules
│   └── ruleVotes
│
├── infractions
│   └── infractionVotes
│
├── transactions
│   └── transactionVotes
│
├── notifications
│
└── logs
```

The `logs` table provides an audit trail for important application actions such as:

- User creation
- Rule creation and updates
- Rule voting
- Rule confirmation/rejection
- Infraction creation and voting
- Transaction creation and voting
- Transaction confirmation/rejection
- Login/logout events

---

## 🔐 Authentication

Authentication is handled by Clerk.

The application uses **username + password authentication** rather than email-based login.

Clerk provides the authenticated identity to Convex, where server-side functions can access it through:

```ts
const identity = await ctx.auth.getUserIdentity();
```

Users are synchronized into the Convex `users` table through the application's user initialization logic.

The Clerk identity is used as the authoritative external user identifier.

---

## 🗄️ Data model

The main Convex tables are:

### `users`

Stores application-specific information associated with a Clerk user.

```text
clerkUserId
username
firstName
lastName
name
color
createdAt
updatedAt
```

### `rules`

Defines the available penalties and their approval requirements.

```text
description
fineAmountCents
unit
customUnitLabel
requiredApprovalsToConfirm
status
createdBy
createdAt
```

### `infractions`

Represents an infraction committed by a member.

```text
ruleId
accusedUserId
reportedBy
quantity
amountCents
note
status
createdAt
resolvedAt
```

### `transactions`

Represents a payment between members.

```text
userId
amountCents
paymentMethod
status
createdBy
createdAt
requiredApprovals
resolvedAt
```

### Voting tables

Voting is intentionally stored separately from the entities being voted on:

```text
ruleVotes
infractionVotes
transactionVotes
```

This allows each member to have at most one vote per entity through dedicated Convex indexes.

### `notifications`

Stores user-facing notifications such as pending infraction approvals.

### `logs`

Stores an audit history of important application events.

---

## 💸 Money handling

All monetary values are stored as **integer cents** rather than floating-point numbers.

For example:

```text
€10.50 → 1050
€25.00 → 2500
€3.99  → 399
```

This avoids floating-point precision issues when calculating balances.

The user's balance is calculated from confirmed activity:

```text
Balance = confirmed infractions - confirmed payments
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Node.js
- pnpm
- A Clerk application
- A Convex project

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Then configure the required Clerk and Convex environment variables used by the project.

Your Clerk application must be configured for username + password authentication.

Your Convex deployment must also be connected to the Clerk application.

### Start development

Run the Next.js development server:

```bash
pnpm dev
```

Run Convex development in a separate terminal if your project setup requires it:

```bash
pnpm convex dev
```

The application will then be available at:

```text
http://localhost:3000
```

---

## 🧪 Development

### Lint

The project uses Oxlint:

```bash
pnpm lint
```

### Format

The project uses Oxfmt:

```bash
pnpm format
```

### Type checking

Run TypeScript without emitting files:

```bash
pnpm typecheck
```

Before submitting changes, it is recommended to run:

```bash
pnpm lint
pnpm typecheck
```

---

## 🔄 Convex development

Convex generates typed APIs from the backend definitions.

After changing Convex schema, queries, mutations, or other generated APIs, make sure the Convex development process is running so the generated files remain synchronized.

Generated Convex files live under:

```text
convex/_generated/
```

These files should not be manually edited.

---

## 🔒 Authorization

Authentication and authorization are enforced primarily on the Convex side.

Authenticated Convex functions should retrieve the current identity before accessing protected data:

```ts
const identity = await ctx.auth.getUserIdentity();

if (!identity) {
  throw new Error("Not authenticated");
}
```

This is important because hiding UI elements on the client is not sufficient to protect application data.

---

## 📈 Balance history

The dashboard and profile charts calculate historical balances from financial events.

The chart system supports:

```text
Today
7 days
30 days
90 days
1 year
```

Historical calculations use a longer internal history window so that the balance at the beginning of a selected range can be calculated correctly.

The profile chart uses the same chart infrastructure as the dashboard while restricting the displayed data to the current member.

---

## 🎨 UI

The application uses shadcn/ui components combined with Tailwind CSS.

Reusable UI primitives live in:

```text
components/ui/
```

Feature-specific components live under their respective domains:

```text
components/
├── Dashboard/
├── Profile/
├── Login/
└── ...
```

This keeps generic UI primitives separate from application-specific components.

---

## 🛠️ Development principles

A few conventions are intentionally followed throughout the project:

- TypeScript-first development
- Strict typing
- No unnecessary `any`
- Server-side authorization for protected data
- Convex for persistent application state
- Clerk as the authentication provider
- Integer cents for monetary values
- Reusable UI components
- Feature-oriented component organization
- Typed Convex queries and mutations
- Oxlint for static analysis
- Oxfmt for consistent formatting

---

## 📌 Project status

Slop Punisher is an actively developed application.

The core system currently includes:

- Authentication
- User profiles
- Rules
- Rule voting
- Infractions
- Infraction voting
- Transactions
- Transaction voting
- Notifications
- Activity logs
- Dashboard analytics
- Balance history
- Profile analytics

Additional functionality can be built on top of the existing voting, transaction, notification, and audit-log infrastructure.

---

## 📚 Documentation

Useful documentation for the technologies used by this project:

- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Convex](https://docs.convex.dev/)
- [Clerk](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Recharts](https://recharts.org/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter)
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)

---

## 📄 License

This project is currently private and intended for its members and contributors.
