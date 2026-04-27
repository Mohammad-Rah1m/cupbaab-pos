// store/useCartStore.ts
import { create } from 'zustand';

export type CartItem = {
  id: string;
  size: string;
  price: number;
  quantity: number;
};

interface CartState {
  cart: CartItem[];
  discount: number; // Percentage
  taxRate: number; // Percentage
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setDiscount: (value: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  discount: 0,
  taxRate: 5, // Default 5% tax

  addItem: (newItem) => set((state) => {
    // Check if item with the same size already exists
    const existingItem = state.cart.find(item => item.size === newItem.size);
    
    if (existingItem) {
      return {
        cart: state.cart.map(item => 
          item.size === newItem.size 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      };
    }
    
    // If it's a new item, give it a unique ID
    return { 
      cart: [...state.cart, { ...newItem, id: Math.random().toString(36).substr(2, 9), quantity: 1 }] 
    };
  }),

  updateQuantity: (id, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      ),
    }));
  },

  removeItem: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),

  setDiscount: (value) => set({ 
    discount: Math.max(0, Math.min(100, value)) // Clamp between 0% and 100%
  }),

  clearCart: () => set({ cart: [], discount: 0 }),

  // Senior Tip: Use helper functions for clean financial logic
  getSubtotal: () => {
    return get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const tax = subtotal * (get().taxRate / 100);
    const discountAmount = subtotal * (get().discount / 100);
    return subtotal + tax - discountAmount;
  },
}));