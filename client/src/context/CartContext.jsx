import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('nova_cart_items', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1, note = '') => {
    if (!product || product.stock_qty <= 0 || product.is_available === false) {
      showToast(`⚠️ Cannot add out-of-stock item: ${product?.name || 'Product'}`);
      return false;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock_qty) {
          showToast(`⚠️ Only ${product.stock_qty} units available in stock`);
          updated[existingIndex].quantity = product.stock_qty;
        } else {
          updated[existingIndex].quantity = newQty;
          showToast(`Updated ${product.name} quantity to ${newQty}`);
        }
        return updated;
      } else {
        const initialQty = Math.min(quantity, product.stock_qty);
        showToast(note || `Added ${product.name} to Cart 🛒`);
        return [...prev, { product, quantity: initialQty }];
      }
    });

    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock_qty || 99;
          const targetQty = Math.min(newQuantity, maxStock);
          if (targetQty < newQuantity) {
            showToast(`⚠️ Only ${maxStock} units available`);
          }
          return { ...item, quantity: targetQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (item) {
        showToast(`Removed ${item.product.name} from Cart`);
      }
      return prev.filter(i => i.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 29;
  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryFee,
        totalAmount,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
