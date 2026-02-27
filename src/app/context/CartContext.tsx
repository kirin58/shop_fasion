"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { sku: string; size?: string; color?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { sku: string; size?: string; color?: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = `${action.payload.sku}-${action.payload.size}-${action.payload.color}`;
      const existingIndex = state.items.findIndex(
        (i) => `${i.sku}-${i.size}-${i.color}` === key
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (action.payload.quantity ?? 1),
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity ?? 1 }],
      };
    }
    case "REMOVE_ITEM": {
      const key = `${action.payload.sku}-${action.payload.size}-${action.payload.color}`;
      return { ...state, items: state.items.filter((i) => `${i.sku}-${i.size}-${i.color}` !== key) };
    }
    case "UPDATE_QUANTITY": {
      const key = `${action.payload.sku}-${action.payload.size}-${action.payload.color}`;
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => `${i.sku}-${i.size}-${i.color}` !== key) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          `${i.sku}-${i.size}-${i.color}` === key ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

interface CartContextValue {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (sku: string, size?: string, color?: string) => void;
  updateQuantity: (sku: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) =>
    dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (sku: string, size?: string, color?: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { sku, size, color } });
  const updateQuantity = (sku: string, quantity: number, size?: string, color?: string) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { sku, size, color, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const openCart = () => dispatch({ type: "OPEN_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart, toggleCart, openCart, closeCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}