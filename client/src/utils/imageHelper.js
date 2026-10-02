// NOVA CART Image Utility Helper
// Provides reliable fallback images matched per category to ensure zero broken image icons

export const CATEGORY_FALLBACK_IMAGES = {
  "cat-1": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80", // Atta / Rice
  "cat-2": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80", // Dairy / Eggs
  "cat-3": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80", // Fruits / Veggies
  "cat-4": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80", // Oil / Masalas
  "cat-5": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80", // Snacks / Tea
  "cat-6": "https://images.unsplash.com/photo-1585832770485-e68a5fc88240?auto=format&fit=crop&w=600&q=80", // Household
  "cat-7": "https://images.unsplash.com/photo-1607006482602-76ca97ac9378?auto=format&fit=crop&w=600&q=80", // Personal Care
  "cat-8": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80", // Packaged Foods
  "default": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
};

export function handleImageError(e, categoryId) {
  const fallback = CATEGORY_FALLBACK_IMAGES[categoryId] || CATEGORY_FALLBACK_IMAGES.default;
  if (e.target.src !== fallback) {
    e.target.src = fallback;
  }
}
