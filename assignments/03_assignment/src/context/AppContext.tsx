import React, { createContext, useContext, useState } from 'react';
import { MenuItem } from '../data/menuItems';

export type CartItem = MenuItem & { quantity: number };

type AppContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (v: boolean) => void;
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(item: MenuItem) {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  }

  function clearCart() {
    setCartItems([]);
  }

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AppContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      hasSeenOnboarding, setHasSeenOnboarding,
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
