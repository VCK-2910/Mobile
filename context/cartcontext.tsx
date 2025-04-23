import React, { createContext, useContext, useState, useMemo } from "react";
import { FoodDoc } from "@/context/types";

export interface CartItem {
  foodDocId : string;      // tham chiếu tới document gốc
  name      : string;
  price     : number;      // đơn giá
  quantity  : number;
  imageUrl  : string;      // đã convert từ imageId
}

interface CartContextType {
  cart            : CartItem[];
  addToCart       : (item: CartItem) => void;
  removeFromCart  : (foodDocId: string) => void;
  increaseQuantity: (food: CartItem) => void;
  decreaseQuantity: (foodDocId: string) => void;
  totalPrice      : number;
  clearCart       : () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ---------------- Provider ---------------- */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [cart, setCart] = useState<CartItem[]>([]);

  /* Thêm hoặc +1 số lượng nếu đã tồn tại */
  const addToCart = (item: CartItem) => {
    setCart(prev =>
      prev.find(p => p.foodDocId === item.foodDocId)
        ? prev.map(p =>
            p.foodDocId === item.foodDocId
              ? { ...p, quantity: p.quantity + item.quantity }
              : p)
        : [...prev, item]
    );
  };

  const removeFromCart = (Id: string) =>
    setCart(prev => prev.filter(p => p.foodDocId !== Id));

  const increaseQuantity = (item: CartItem) =>
    addToCart({ ...item, quantity: 1 });

  const decreaseQuantity = (Id: string) =>
    setCart(prev =>
      prev.map(p =>
        p.foodDocId === Id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
      )
    );

  const totalPrice = useMemo(
    () => cart.reduce((t, p) => t + p.price * p.quantity, 0),
    [cart]
  );

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice, clearCart }} 
    >
      {children}
    </CartContext.Provider>
  );
};

/* ---------------- Hook ---------------- */
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
