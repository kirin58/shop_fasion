"use client";

import { useCart } from "../context/CartContext";

export default function CartButton() {
  const { toggleCart, totalItems } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 rounded-full hover:bg-gray-100 transition"
      aria-label="ตะกร้าสินค้า"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 22a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}