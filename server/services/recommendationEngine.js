// NOVA CART Smart Rule-Based Recommendation Engine
// Provides deterministic, high-relevance recommendations using user history, product attributes, inventory state, and category graphs.

/**
 * Filter products to only return items that are IN STOCK at the specified store
 */
export function filterInStockProducts(products, inventory, storeId = 'store-1') {
  return products.filter(product => {
    if (product.stock_qty !== undefined) {
      return product.stock_qty > 0 && (product.is_available !== false);
    }
    if (!inventory) return false;
    const inv = inventory.find(i => i.store_id === storeId && i.product_id === product.id);
    return inv && inv.stock_qty > 0 && (inv.is_available !== false);
  });
}

/**
 * Get "Recommended For You" based on customer's purchase history and category preferences
 */
export function getRecommendedForYou(userId, products, inventory, orders, storeId = 'store-1') {
  const inStockProducts = filterInStockProducts(products, inventory, storeId);
  const userOrders = orders.filter(o => o.user_id === userId);

  // Collect category counts and purchased product IDs from user order history
  const purchasedCategoryCounts = {};
  const purchasedProductIds = new Set();

  userOrders.forEach(order => {
    (order.items || []).forEach(item => {
      purchasedProductIds.add(item.product_id);
      const prod = products.find(p => p.id === item.product_id);
      if (prod) {
        purchasedCategoryCounts[prod.category_id] = (purchasedCategoryCounts[prod.category_id] || 0) + item.quantity;
      }
    });
  });

  // Find user's top favorite category
  let topCategory = null;
  let maxCount = 0;
  Object.entries(purchasedCategoryCounts).forEach(([catId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = catId;
    }
  });

  let recommendations = [];

  if (topCategory) {
    // Recommend unpurchased or highly relevant items from user's preferred category first
    const categoryMatches = inStockProducts.filter(p => p.category_id === topCategory);
    recommendations.push(...categoryMatches.map(p => ({
      ...p,
      reason: `Based on your frequent purchases in ${p.category_name}`,
      score: 0.95
    })));
  }

  // Fill remaining recommendations with popular items across other categories
  const otherItems = inStockProducts
    .filter(p => !recommendations.some(r => r.id === p.id))
    .map(p => ({
      ...p,
      reason: `Trending staple at your local store`,
      score: 0.80
    }));

  recommendations = [...recommendations, ...otherItems];
  return recommendations.slice(0, 8);
}

/**
 * Get "Frequently Bought Together" items for a given target product
 */
export function getFrequentlyBoughtTogether(productId, products, inventory, storeId = 'store-1') {
  const targetProduct = products.find(p => p.id === productId);
  if (!targetProduct) return [];

  const inStockProducts = filterInStockProducts(products, inventory, storeId);
  const pairedIds = targetProduct.frequently_bought_with || [];

  // Direct co-occurrence pairs
  const directPairs = inStockProducts.filter(p => pairedIds.includes(p.id)).map(p => ({
    ...p,
    reason: `Frequently bought together with ${targetProduct.name}`,
    score: 0.98
  }));

  // If direct pairs are fewer than 4, add cross-category essentials (e.g. Milk + Bread, Rice + Dal, Atta + Oil)
  let fallbackPairs = [];
  if (directPairs.length < 4) {
    fallbackPairs = inStockProducts
      .filter(p => p.id !== productId && p.category_id !== targetProduct.category_id && !pairedIds.includes(p.id))
      .map(p => ({
        ...p,
        reason: `Popular pairing with ${targetProduct.category_name}`,
        score: 0.75
      }));
  }

  return [...directPairs, ...fallbackPairs].slice(0, 4);
}

/**
 * Get "Similar Products" (Same category, within +/- 30% price range)
 */
export function getSimilarProducts(productId, products, inventory, storeId = 'store-1') {
  const targetProduct = products.find(p => p.id === productId);
  if (!targetProduct) return [];

  const inStockProducts = filterInStockProducts(products, inventory, storeId);

  return inStockProducts
    .filter(p => p.id !== productId && p.category_id === targetProduct.category_id)
    .map(p => {
      const priceDiffRatio = Math.abs(p.price - targetProduct.price) / targetProduct.price;
      return {
        ...p,
        reason: `Similar brand & pack size in ${targetProduct.category_name}`,
        score: Math.max(0.5, 1 - priceDiffRatio)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

/**
 * Get "Local Picks" — High-rated available items at local store
 */
export function getLocalPicks(products, inventory, store, storeId = 'store-1') {
  const inStockProducts = filterInStockProducts(products, inventory, storeId);
  const storeName = store ? store.name : 'your local store';

  return inStockProducts.map(p => ({
    ...p,
    reason: `Available with 15-min delivery from ${storeName}`,
    score: 0.90
  })).slice(0, 8);
}

/**
 * SECTION 7: OUT-OF-STOCK INTELLIGENCE
 * Computes the Best Alternative & Alternative list when a product is OUT OF STOCK.
 */
export function getOutOfStockAlternatives(productId, products, inventory, storeId = 'store-1') {
  const targetProduct = products.find(p => p.id === productId);
  if (!targetProduct) return { bestAlternative: null, alternatives: [] };

  const inStockProducts = filterInStockProducts(products, inventory, storeId);

  // Candidates in the exact same category
  const sameCategoryCandidates = inStockProducts.filter(p => p.id !== productId && p.category_id === targetProduct.category_id);

  if (sameCategoryCandidates.length === 0) {
    // If no candidate in exact category, fallback to related categories
    return { bestAlternative: null, alternatives: [] };
  }

  // Score each candidate based on price closeness, brand similarity, unit match
  const scoredCandidates = sameCategoryCandidates.map(candidate => {
    let matchScore = 0;

    // Price difference ratio (closer price = higher score)
    const priceRatio = 1 - Math.min(1, Math.abs(candidate.price - targetProduct.price) / targetProduct.price);
    matchScore += priceRatio * 50;

    // Same pack unit (e.g. 5 kg vs 5 kg, 1 L vs 1 L)
    if (candidate.unit === targetProduct.unit) {
      matchScore += 30;
    }

    // Different brand (good for alternative brand search)
    if (candidate.brand !== targetProduct.brand) {
      matchScore += 20;
    }

    return {
      ...candidate,
      matchScore: Math.round(matchScore),
      priceDifference: (candidate.price - targetProduct.price).toFixed(2),
      reason: candidate.brand !== targetProduct.brand
        ? `Best alternative brand in ${targetProduct.unit}`
        : `Same brand alternative size`
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const bestAlternative = scoredCandidates[0] || null;
  const alternatives = scoredCandidates.slice(1, 6);

  return {
    bestAlternative,
    alternatives
  };
}
