// ============================================
// CashierNova — Cart Store (Zustand)
// State management untuk keranjang belanja Landing Page
// ============================================

import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('landing_cart') || '[]'),
  isOpen: false,

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      let newItems;
      
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, quantity: 1 }];
      }
      
      localStorage.setItem('landing_cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== productId);
      localStorage.setItem('landing_cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((item) => item.id !== productId);
        localStorage.setItem('landing_cart', JSON.stringify(newItems));
        return { items: newItems };
      }
      
      const newItems = state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('landing_cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem('landing_cart');
    set({ items: [] });
  },

  getCartTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getCartCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}));

export default useCartStore;
