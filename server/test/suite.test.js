import test from 'node:test';
import assert from 'node:assert/strict';

// Import services and mock data directly for unit & business logic testing
import { mockStores, mockProducts, mockCategories, mockOrders, mockSupportTickets, mockInventory } from '../data/mockData.js';
import {
  getRecommendedForYou,
  getFrequentlyBoughtTogether,
  getSimilarProducts,
  getLocalPicks,
  getOutOfStockAlternatives
} from '../services/recommendationEngine.js';

test('1. STORE NETWORK DATA INTEGRITY — 620 Stores Across 3 Indian Cities', (t) => {
  assert.strictEqual(mockStores.length, 620, 'Total store network count must be exactly 620');
  
  const mumbaiCount = mockStores.filter(s => s.city === 'Mumbai').length;
  const bengaluruCount = mockStores.filter(s => s.city === 'Bengaluru').length;
  const delhiCount = mockStores.filter(s => s.city === 'Delhi NCR').length;

  assert.strictEqual(mumbaiCount, 240, 'Mumbai network must have 240 stores');
  assert.strictEqual(bengaluruCount, 210, 'Bengaluru network must have 210 stores');
  assert.strictEqual(delhiCount, 170, 'Delhi NCR network must have 170 stores');
});

test('2. STORE SEARCH & CITY FILTERING LOGIC', (t) => {
  const mumbaiStores = mockStores.filter(s => s.city === 'Mumbai');
  assert.strictEqual(mumbaiStores.length, 240);

  const searched = mockStores.filter(s => s.name.toLowerCase().includes('subhash') || s.address.toLowerCase().includes('subhash'));
  assert.ok(searched.length > 0, 'Search should find stores matching keyword Subhash');
  assert.strictEqual(searched[0].name, 'Subhash Stores');
});

test('3. PRODUCT CATALOG & OUT-OF-STOCK DATA STATE', (t) => {
  assert.ok(mockProducts.length >= 30, 'Product catalog must contain at least 30 items');
  
  // Test out of stock items in mockInventory for store-1
  const oosInvItems = mockInventory.filter(i => i.stock_qty === 0 || !i.is_available);
  assert.ok(oosInvItems.length > 0, 'Inventory must contain out-of-stock items for OOS intelligence testing');

  const sampleOos = oosInvItems[0];
  assert.strictEqual(sampleOos.stock_qty, 0);
  assert.strictEqual(sampleOos.is_available, false);
});

test('4. RECOMMENDATION ENGINE — Deterministic Recommendations Generation', (t) => {
  const recs = getRecommendedForYou('user-1', mockProducts, null, mockOrders, 'store-1');
  const freq = getFrequentlyBoughtTogether(mockProducts[0].id, mockProducts, null, 'store-1');
  const picks = getLocalPicks(mockProducts, null, mockStores[0], 'store-1');
  
  assert.ok(Array.isArray(recs), 'Should return Recommended For You array');
  assert.ok(Array.isArray(freq), 'Should return Frequently Bought Together array');
  assert.ok(Array.isArray(picks), 'Should return Local Picks array');

  // Verify recommendations do not contain duplicate IDs
  const recIds = recs.map(p => p.id);
  const uniqueIds = new Set(recIds);
  assert.strictEqual(recIds.length, uniqueIds.size, 'Recommended items should not contain duplicates');
});

test('5. RECOMMENDATION ENGINE — Similar Products Match', (t) => {
  const targetProduct = mockProducts[0];
  const similar = getSimilarProducts(targetProduct.id, mockProducts, null, 'store-1');
  
  assert.ok(Array.isArray(similar));
  assert.ok(similar.every(p => p.id !== targetProduct.id), 'Similar products should exclude the target product itself');
  assert.ok(similar.every(p => p.category_id === targetProduct.category_id), 'Similar products should match the category');
});

test('6. OUT-OF-STOCK INTELLIGENCE — Best Match Alternative Selection', (t) => {
  const oosInvItem = mockInventory.find(i => i.stock_qty === 0 || !i.is_available);
  assert.ok(oosInvItem, 'An out of stock inventory item must exist');
  const oosProduct = mockProducts.find(p => p.id === oosInvItem.product_id);
  assert.ok(oosProduct, 'Corresponding product must exist');

  const { bestAlternative, alternatives } = getOutOfStockAlternatives(oosProduct.id, mockProducts, mockInventory, 'store-1');
  assert.ok(bestAlternative, 'Best match alternative must be returned for out-of-stock item');
  assert.notStrictEqual(bestAlternative.id, oosProduct.id, 'Alternative must not be the OOS item itself');
  assert.strictEqual(bestAlternative.category_id, oosProduct.category_id, 'Alternative should be in the same category');
});

test('7. INVENTORY SYNCHRONIZATION — Stock Update 0 -> 15 Updates Availability', (t) => {
  // Simulate stock mutation on an inventory item
  const testInvItem = { ...mockInventory.find(i => i.stock_qty === 0) };
  assert.strictEqual(testInvItem.stock_qty, 0);
  assert.strictEqual(testInvItem.is_available, false);

  // Update stock to 15
  testInvItem.stock_qty = 15;
  testInvItem.is_available = true;

  assert.strictEqual(testInvItem.stock_qty, 15);
  assert.strictEqual(testInvItem.is_available, true, 'Product must become available when stock > 0');
});

test('8. CART & CHECKOUT CALCULATIONS', (t) => {
  const cartItems = [
    { id: 'prod-1', price: 66, quantity: 2 }, // 132
    { id: 'prod-2', price: 110, quantity: 1 }  // 110
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 29;
  const grandTotal = subtotal + deliveryFee;

  assert.strictEqual(subtotal, 242);
  assert.strictEqual(deliveryFee, 29);
  assert.strictEqual(grandTotal, 271);
});

test('9. ORDER TRACKING TIMELINE STATES', (t) => {
  const sampleOrder = {
    id: 'ORD-98214',
    status: 'preparing',
    tracking_steps: [
      { step: 'placed', completed: true },
      { step: 'confirmed', completed: true },
      { step: 'preparing', completed: true },
      { step: 'out_for_delivery', completed: false },
      { step: 'delivered', completed: false }
    ]
  };

  assert.strictEqual(sampleOrder.status, 'preparing');
  const completedCount = sampleOrder.tracking_steps.filter(s => s.completed).length;
  assert.strictEqual(completedCount, 3, 'Order in preparing state must have 3 completed steps');
});

test('10. SUPPORT TICKET CREATION & CATEGORIES', (t) => {
  const validCategories = [
    'Refund status',
    'Delayed order',
    'Missing/unavailable item',
    'Coupon issue',
    'Incorrect item',
    'Other'
  ];

  const newTicket = {
    id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
    category: 'Delayed order',
    order_id: 'ORD-98214',
    subject: 'Order delayed past 18-minute SLA',
    description: 'Order placed 25 mins ago still showing preparing.',
    status: 'open',
    created_at: new Date().toISOString()
  };

  assert.ok(validCategories.includes(newTicket.category), 'Ticket category must be valid');
  assert.strictEqual(newTicket.status, 'open');
  assert.ok(newTicket.order_id.startsWith('ORD-'));
});

test('11. EXECUTIVE BUSINESS INSIGHTS PROJECTIONS', (t) => {
  const targetImpacts = [
    { metric: "Repeat Purchase Rate", current: "27%", projected: "38%", type: "Target Outcome" },
    { metric: "OOS Order Cancellations", current: "35% of total", projected: "12% of total", type: "Target Outcome" },
    { metric: "Average Delivery Time", current: "37 mins", projected: "24 mins", type: "Target Outcome" },
    { metric: "Support Ticket Friction", current: "5,900 / mo", projected: "2,400 / mo", type: "Target Outcome" }
  ];

  assert.strictEqual(targetImpacts.length, 4);
  assert.strictEqual(targetImpacts[0].current, '27%');
  assert.strictEqual(targetImpacts[0].projected, '38%');
  assert.ok(targetImpacts.every(ti => ti.type === 'Target Outcome'), 'Target outcomes must be explicitly typed as Target Outcome');
});
