# 🛒 NOVA CART — Hyperlocal Quick-Commerce & Out-of-Stock Intelligence Platform

NOVA CART is a production-grade quick-commerce web application connecting customers with **620 local stores** across 3 Indian cities (Mumbai: 240, Bengaluru: 210, Delhi NCR: 170) with an **18-minute delivery SLA guarantee**, **deterministic product recommendation engine**, **price-matched out-of-stock intelligence**, **live inventory synchronization**, and **executive business performance analytics**.

---

## 🧪 Testing & Verification (For Evaluators)

NOVA CART contains a zero-dependency automated test runner powered by Node.js Native Test Runner (`node:test` & `node:assert`). All 29 automated tests execute directly from root or sub-package commands.

### Quick Test Commands

```bash
# Run ALL 29 Automated Tests (Unit, API Routes, Workflows & Client Utilities)
npm test

# Run Server & API Integration Test Suite (26 tests)
npm run test:server

# Run Client Utility & Breakpoint Test Suite (3 tests)
npm run test:client

# Run Express API Route HTTP Endpoint Tests (10 tests)
npm run test:api

# Run End-to-End Workflow Integration Tests (5 tests)
npm run test:workflow
```

---

## 📊 Summary of Automated Test Suite (29 Tests)

| Category | Suite File | Tests | Status | Verification Scope |
|---|---|---|---|---|
| **Unit Tests** | `server/test/unit.test.js` | 11 | **PASSED** | 620 Store count, Category graphs, OOS scoring, Cart math, Stepper timeline |
| **API Route Tests** | `server/test/api.test.js` | 10 | **PASSED** | HTTP 200/201/400/404 status codes, schema validation, 404/400 failure edge cases |
| **Workflow Tests** | `server/test/workflow.test.js` | 5 | **PASSED** | E2E Customer flow, OOS alternative selection, Live stock sync (0 -> 15), Admin filters |
| **Client Tests** | `client/test/clientSuite.test.js` | 3 | **PASSED** | Image fallback maps, cart price calculators, responsive breakpoint rules |

*See [`TESTING.md`](./TESTING.md) for full detailed test log tables and execution evidence.*

---

## 🚀 How to Run the Application Locally

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### 1. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Start Backend API Server
```bash
cd server
npm start
# Server listens on http://localhost:5000
```

### 3. Start Frontend Client Dev Server
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📦 Production Build Verification

To verify production bundle build status:
```bash
npm run build
# Or: cd client && npm run build
```
Output:
- Minified production build compiled into `client/dist/` in ~7.8s with **0 errors**.

---

## 🔑 Key Features & Core Business Workflows

### 1. Customer Quick-Commerce UX
- **5-Second Value Proposition**: Clear hero stating *"Shop from Nearby Local Stores With Reliable Availability & Smart Alternatives."*
- **Role Switching**: Demo bar toggles between `Customer`, `Store Portal`, and `Admin` modes.
- **Cart & Checkout**: Real-time bill breakdown, subtotal, ₹29 delivery fee, free delivery progress bar, and instant order placement.

### 2. Out-of-Stock Intelligence Engine
- **Workflow**: Product stock = 0 ➔ Normal Add to Cart blocked ➔ Best Match Alternative computed in same category ➔ Price delta shown ➔ 1-click alternative replacement.
- **Wording Accuracy**: *"Inventory reflected from latest store update • NOVA CART OOS Engine"*.

### 3. Hyperlocal Live Inventory Synchronization
- **Workflow**: Store Manager updates stock from `0` to `15` in Store Dashboard ➔ Customer refetches/refreshes page ➔ Item instantly shifts from unavailable to available in customer view.

### 4. 620 Partner Store Network Portal (`/admin/stores`)
- **Scale**: Mumbai (240), Bengaluru (210), Delhi NCR (170) = **620 Stores**.
- **Controls**: Filter by city, search store name or area, inspect individual store inventory catalog (`/admin/stores/:id`).

### 5. Executive Business Intelligence (`/business-insights`)
- **Projections**: Metrics clearly labeled with explicit `PROJECTED TARGET OUTCOME` badges (e.g. repeat purchase rate recovery from 27% baseline to 38% target).

---

## 📁 Repository Structure
```
nova-cart/
├── package.json              # Unified root scripts (npm test, npm run build)
├── TESTING.md                # Comprehensive verifiable test documentation
├── README.md                 # Project guide & evaluator instructions
├── server/
│   ├── index.js              # Express backend server entry point
│   ├── package.json          # Server dependencies & test scripts
│   ├── routes/               # Express API route handlers
│   ├── services/             # Database & recommendation engine logic
│   └── test/                 # Server test suites (unit, api, workflow)
└── client/
    ├── package.json          # Client Vite + React dependencies
    ├── src/                  # React components, pages, context & assets
    └── test/                 # Client utility test suite
```
