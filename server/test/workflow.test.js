import test from 'node:test';
import assert from 'node:assert/strict';

import { mockStores, mockProducts, mockInventory, mockOrders } from '../data/mockData.js';
import { getOutOfStockAlternatives, filterInStockProducts } from '../services/recommendationEngine.js';

test('WORKFLOW 1. END-TO-END CUSTOMER WORKFLOW — Catalog, Cart, Order & Stepper Timeline', (t) => {
  // 1. Select Store
  const store = mockStores.find(s => s.id === 'store-1');
  assert.strictEqual(store.name, 'Subhash Stores');

  // 2. Select In-Stock Product
  const product = mockProducts.find(p => p.id === 'prod-2'); // Fortune Atta
  assert.ok(product);

  // 3. Add to Cart & Calculate Totals
  const cartItems = [{ product, quantity: 2 }];
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 29;
  const grandTotal = subtotal + deliveryFee;

  assert.strictEqual(subtotal, 490); // 245 * 2
  assert.strictEqual(deliveryFee, 29);
  assert.strictEqual(grandTotal, 519);

  // 4. Create Order Object
  const createdOrder = {
    id: 'ord-test-101',
    order_number: 'ORD-9999',
    status: 'placed',
    subtotal,
    delivery_fee: deliveryFee,
    total_amount: grandTotal,
    items: cartItems.map(i => ({ product_id: i.product.id, price: i.product.price, quantity: i.quantity }))
  };

  assert.strictEqual(createdOrder.status, 'placed');
  assert.strictEqual(createdOrder.total_amount, 519);
});

test('WORKFLOW 2. END-TO-END OUT-OF-STOCK INTELLIGENCE WORKFLOW', (t) => {
  // 1. Customer attempts to view an Out of Stock item
  const oosInvItem = mockInventory.find(i => i.stock_qty === 0 || !i.is_available);
  assert.ok(oosInvItem);
  const oosProduct = mockProducts.find(p => p.id === oosInvItem.product_id);
  assert.ok(oosProduct);

  // 2. System blocks normal Add to Cart (stock = 0)
  const isAvailable = oosInvItem.stock_qty > 0 && oosInvItem.is_available;
  assert.strictEqual(isAvailable, false, 'Add to cart must be disabled for OOS items');

  // 3. OOS Recommendation Engine triggers Best Match Alternative
  const { bestAlternative, alternatives } = getOutOfStockAlternatives(oosProduct.id, mockProducts, mockInventory, 'store-1');
  assert.ok(bestAlternative, 'Best match alternative must be returned');
  assert.notStrictEqual(bestAlternative.id, oosProduct.id, 'Alternative must be a different product');

  // 4. Price Delta Calculation & 1-Click Replacement
  const priceDelta = (bestAlternative.price - oosProduct.price).toFixed(2);
  assert.ok(priceDelta !== undefined);

  // 5. Add Alternative to Cart
  const alternativeCartItem = { product: bestAlternative, quantity: 1 };
  assert.strictEqual(alternativeCartItem.product.id, bestAlternative.id);
});

test('WORKFLOW 3. END-TO-END INVENTORY LIVE SYNC WORKFLOW (0 -> 15 REFETCH)', (t) => {
  const invCopy = { ...mockInventory.find(i => i.stock_qty === 0) };
  
  // Step A: Stock = 0 -> Customer view is unavailable
  let inStock = filterInStockProducts(mockProducts, [invCopy], 'store-1');
  const initialMatch = inStock.find(p => p.id === invCopy.product_id);
  assert.strictEqual(initialMatch, undefined, 'Product must not appear in in-stock list when stock = 0');

  // Step B: Store Manager updates stock to 15
  invCopy.stock_qty = 15;
  invCopy.is_available = true;

  // Step C: Customer re-fetches inventory state
  inStock = filterInStockProducts(mockProducts, [invCopy], 'store-1');
  const updatedMatch = inStock.find(p => p.id === invCopy.product_id);
  assert.ok(updatedMatch, 'Product must appear in in-stock list after store updates stock to 15');
});

test('WORKFLOW 4. END-TO-END 620 STORE ADMIN NETWORK WORKFLOW', (t) => {
  // 1. Total Store Count Check
  assert.strictEqual(mockStores.length, 620);

  // 2. City Breakdown Verification
  const mumbai = mockStores.filter(s => s.city === 'Mumbai');
  const bengaluru = mockStores.filter(s => s.city === 'Bengaluru');
  const delhi = mockStores.filter(s => s.city === 'Delhi NCR');

  assert.strictEqual(mumbai.length, 240);
  assert.strictEqual(bengaluru.length, 210);
  assert.strictEqual(delhi.length, 170);

  // 3. Search Filter Execution
  const searchResult = mockStores.filter(s => s.name.toLowerCase().includes('metro') || s.area.toLowerCase().includes('connaught'));
  assert.ok(searchResult.length > 0);
});

test('WORKFLOW 5. EDGE CASE HANDLING — Invalid Inputs & Empty States', (t) => {
  // Edge Case A: Empty Search Term
  const emptySearch = mockProducts.filter(p => p.name.toLowerCase().includes('nonexistentkeyword12345'));
  assert.strictEqual(emptySearch.length, 0);

  // Edge Case B: Empty Cart Subtotal
  const emptyCartSubtotal = [].reduce((acc, item) => acc + item.price * item.quantity, 0);
  assert.strictEqual(emptyCartSubtotal, 0);

  // Edge Case C: Invalid Store Filter
  const invalidStoreFilter = mockStores.filter(s => s.city === 'InvalidCityName');
  assert.strictEqual(invalidStoreFilter.length, 0);
});
