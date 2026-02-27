"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

interface Product {
  sku: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  stock: number;
}

interface AddToCartButtonProps {
  product: Product;
  /** แสดงตัวเลือก size/color หรือเพิ่มเลยทันที */
  variant?: "quick" | "select";
  className?: string;
}

export default function AddToCartButton({
  product,
  variant = "select",
  className = "",
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] ?? "");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  if (variant === "quick") {
    return (
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className={`flex items-center justify-center gap-1.5 bg-black text-white text-sm py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition ${className}`}
      >
        {added ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            เพิ่มแล้ว!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 22a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            เพิ่มลงตะกร้า
          </>
        )}
      </button>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Size selector */}
      {product.sizes.length > 1 && (
        <div>
          <p className="text-xs text-gray-500 mb-1.5">ไซส์</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 text-sm rounded-md border transition ${
                  selectedSize === s
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color selector */}
      {product.colors.length > 1 && (
        <div>
          <p className="text-xs text-gray-500 mb-1.5">สี</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`px-3 py-1 text-sm rounded-md border transition ${
                  selectedColor === c
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {product.stock === 0 ? (
          "สินค้าหมด"
        ) : added ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            เพิ่มลงตะกร้าแล้ว!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 22a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            เพิ่มลงตะกร้า
          </>
        )}
      </button>
    </div>
  );
}