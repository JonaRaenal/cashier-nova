import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  // State
  items: [],

  addItem: (product) => {
    const { items } = get();
    const existingIndex = items.findIndex((item) => item.product_id === product.id);

    if (existingIndex >= 0) {
      const updated = [...items];
      if (updated[existingIndex].quantity < product.stock) {
        updated[existingIndex].quantity += 1;
        updated[existingIndex].subtotal = updated[existingIndex].quantity * updated[existingIndex].price;
        set({ items: updated });
      }
    } else {
      set({
        items: [
          ...items,
          {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
            stock: product.stock,
            image_url: product.image_url,
          },
        ],
      });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.product_id !== productId) });
  },

  updateQty: (productId, quantity) => {
    const { items } = get();
    const updated = items.map((item) => {
      if (item.product_id === productId) {
        const qty = Math.max(1, Math.min(quantity, item.stock));
        return { ...item, quantity: qty, subtotal: qty * item.price };
      }
      return item;
    });
    set({ items: updated });
  },

  clearCart: () => set({ items: [] }),

  get total() {
    return get().items.reduce((sum, item) => sum + item.subtotal, 0);
  },

  getTotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),

  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

export default useCartStore;
