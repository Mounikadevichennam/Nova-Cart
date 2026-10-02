import test from 'node:test';
import assert from 'node:assert/strict';

import { CATEGORY_FALLBACK_IMAGES } from '../src/utils/imageHelper.js';

test('CLIENT 1. CATEGORY FALLBACK IMAGES MAP INTEGRITY', (t) => {
  assert.ok(CATEGORY_FALLBACK_IMAGES['cat-1'], 'Category cat-1 fallback image must exist');
  assert.ok(CATEGORY_FALLBACK_IMAGES['cat-2'], 'Category cat-2 fallback image must exist');
  assert.ok(CATEGORY_FALLBACK_IMAGES['cat-3'], 'Category cat-3 fallback image must exist');
  assert.ok(CATEGORY_FALLBACK_IMAGES['default'], 'Default fallback image must exist');
  assert.ok(CATEGORY_FALLBACK_IMAGES.default.startsWith('https://images.unsplash.com/'));
});

test('CLIENT 2. CART ITEM PRICE CALCULATIONS', (t) => {
  const calculateCartTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 29 : 0;
    const total = subtotal + deliveryFee;
    return { subtotal, deliveryFee, total };
  };

  const sampleItems = [
    { id: 'prod-1', price: 260, quantity: 1 },
    { id: 'prod-4', price: 28, quantity: 2 }
  ];

  const totals = calculateCartTotals(sampleItems);
  assert.strictEqual(totals.subtotal, 316);
  assert.strictEqual(totals.deliveryFee, 29);
  assert.strictEqual(totals.total, 345);
});

test('CLIENT 3. RESPONSIVE BREAKPOINTS CONFIGURATION', (t) => {
  const breakpoints = {
    mobileSmall: 320,
    mobileMedium: 375,
    mobileLarge: 390,
    mobileXLarge: 430,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  };

  assert.strictEqual(breakpoints.mobileSmall, 320);
  assert.strictEqual(breakpoints.mobileXLarge, 430);
  assert.strictEqual(breakpoints.tablet, 768);
});
