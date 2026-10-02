import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

import productsRouter from '../routes/products.js';
import categoriesRouter from '../routes/categories.js';
import storesRouter from '../routes/stores.js';
import ordersRouter from '../routes/orders.js';
import inventoryRouter from '../routes/inventory.js';
import recommendationsRouter from '../routes/recommendations.js';
import supportRouter from '../routes/support.js';
import insightsRouter from '../routes/insights.js';

let server;
let baseUrl;

before(async () => {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', service: 'NOVA CART Backend API', timestamp: new Date().toISOString() });
  });

  app.use('/api/products', productsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/stores', storesRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/inventory', inventoryRouter);
  app.use('/api/recommendations', recommendationsRouter);
  app.use('/api/support', supportRouter);
  app.use('/api/insights', insightsRouter);

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

// API HTTP ROUTE TESTS (SUCCESS & FAILURE EDGE CASES)

test('API 1. GET /api/health — Health Endpoint Returns 200 OK', async (t) => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'OK');
  assert.strictEqual(data.service, 'NOVA CART Backend API');
});

test('API 2. GET /api/categories — Returns Category List', async (t) => {
  const res = await fetch(`${baseUrl}/api/categories`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.strictEqual(json.data.length, 8);
});

test('API 3. GET /api/products — Returns Product Catalog', async (t) => {
  const res = await fetch(`${baseUrl}/api/products?storeId=store-1`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length >= 25);
});

test('API 4. GET /api/products/:id — Success & 404 Edge Case', async (t) => {
  // Success Case
  const resValid = await fetch(`${baseUrl}/api/products/prod-1?storeId=store-1`);
  assert.strictEqual(resValid.status, 200);
  const jsonValid = await resValid.json();
  assert.strictEqual(jsonValid.success, true);
  assert.strictEqual(jsonValid.data.id, 'prod-1');

  // Failure / 404 Edge Case
  const resInvalid = await fetch(`${baseUrl}/api/products/non-existent-product-id`);
  assert.strictEqual(resInvalid.status, 404);
  const jsonInvalid = await resInvalid.json();
  assert.strictEqual(jsonInvalid.success, false);
  assert.strictEqual(jsonInvalid.message, 'Product not found');
});

test('API 5. GET /api/stores — 620 Stores Network & City Filtering', async (t) => {
  // All Stores Summary
  const resAll = await fetch(`${baseUrl}/api/stores`);
  assert.strictEqual(resAll.status, 200);
  const dataAll = await resAll.json();
  assert.strictEqual(dataAll.networkSummary.totalStores, 620);
  assert.strictEqual(dataAll.networkSummary.cityBreakdown.mumbai, 240);
  assert.strictEqual(dataAll.networkSummary.cityBreakdown.bengaluru, 210);
  assert.strictEqual(dataAll.networkSummary.cityBreakdown.delhi, 170);

  // Filtered by City = Mumbai
  const resMumbai = await fetch(`${baseUrl}/api/stores?city=Mumbai`);
  assert.strictEqual(resMumbai.status, 200);
  const dataMumbai = await resMumbai.json();
  assert.strictEqual(dataMumbai.filteredCount, 240);

  // Search Filter = Subhash
  const resSearch = await fetch(`${baseUrl}/api/stores?search=Subhash`);
  assert.strictEqual(resSearch.status, 200);
  const dataSearch = await resSearch.json();
  assert.ok(dataSearch.stores.length > 0);
});

test('API 6. POST /api/inventory/update — Stock Mutation (0 -> 15)', async (t) => {
  const payload = {
    storeId: 'store-1',
    productId: 'prod-1',
    stockQty: 15,
    isAvailable: true
  };

  const res = await fetch(`${baseUrl}/api/inventory/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.strictEqual(json.data.stock_qty, 15);
  assert.strictEqual(json.data.is_available, true);
});

test('API 7. POST /api/orders — Order Creation & Validation Edge Cases', async (t) => {
  // Success Order Creation
  const validOrderPayload = {
    user_id: 'user-1',
    user_name: 'Rahul Sharma',
    store_id: 'store-1',
    store_name: 'Subhash Stores — Andheri East',
    subtotal: 260,
    delivery_fee: 29,
    total_amount: 289,
    delivery_address: 'Flat 402, Green Meadows, Marol, Andheri East, Mumbai',
    payment_method: 'UPI',
    items: [
      { product_id: 'prod-1', product_name: 'Aashirvaad Whole Wheat Atta', price: 260, quantity: 1, item_total: 260 }
    ]
  };

  const resValid = await fetch(`${baseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validOrderPayload)
  });

  assert.strictEqual(resValid.status, 201);
  const jsonValid = await resValid.json();
  assert.strictEqual(jsonValid.success, true);
  assert.ok(jsonValid.data.id || jsonValid.data.order_number);

  // Failure Edge Case (Missing Items)
  const invalidPayload = { user_id: 'user-1', items: [] };
  const resInvalid = await fetch(`${baseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidPayload)
  });

  assert.strictEqual(resInvalid.status, 400);
  const jsonInvalid = await resInvalid.json();
  assert.strictEqual(jsonInvalid.success, false);
});

test('API 8. POST /api/support/tickets — Ticket Creation & Missing Data Validation', async (t) => {
  // Success Ticket Creation
  const validTicketPayload = {
    order_id: 'ord-1',
    order_number: 'ORD-9842',
    user_id: 'user-1',
    user_name: 'Rahul Sharma',
    category: 'Delayed delivery',
    subject: 'Order delayed past SLA',
    description: 'Order placed 30 mins ago.'
  };

  const resValid = await fetch(`${baseUrl}/api/support/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validTicketPayload)
  });

  assert.strictEqual(resValid.status, 201);
  const jsonValid = await resValid.json();
  assert.strictEqual(jsonValid.success, true);

  // Failure Edge Case (Missing Category/Subject)
  const invalidTicketPayload = { user_id: 'user-1' };
  const resInvalid = await fetch(`${baseUrl}/api/support/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidTicketPayload)
  });

  assert.strictEqual(resInvalid.status, 400);
  const jsonInvalid = await resInvalid.json();
  assert.strictEqual(jsonInvalid.success, false);
});

test('API 9. GET /api/recommendations/out-of-stock/:productId — OOS Alternatives Endpoint', async (t) => {
  const res = await fetch(`${baseUrl}/api/recommendations/out-of-stock/prod-1?storeId=store-1`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.ok(json.targetProduct !== undefined);
});

test('API 10. GET /api/insights — Business Intelligence & Projected Targets Endpoint', async (t) => {
  const res = await fetch(`${baseUrl}/api/insights?storeId=store-1`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.ok(json.data.summary);
  assert.ok(Array.isArray(json.data.targetImpacts));
});
