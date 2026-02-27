"use client";

import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <>
      {/* Overlay */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${
          state.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-400">
            ตะกร้าสินค้า{" "}
            {totalItems > 0 && (
              <span className="ml-1 text-sm font-normal text-gray-500">({totalItems} ชิ้น)</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-gray-100 transition"
            aria-label="ปิดตะกร้า"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <svg className="w-14 h-14 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 22a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <p className="text-sm">ยังไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            state.items.map((item) => {
              const key = `${item.sku}-${item.size}-${item.color}`;
              return (
                <div key={key} className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-400">{item.name}</p>
                    <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                      {item.size && <span>ไซส์: {item.size}</span>}
                      {item.color && <span>สี: {item.color}</span>}
                    </div>
                    <p className="text-sm font-semibold text-rose-600 mt-1">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-gray-400">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1, item.size, item.color)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-sm hover:bg-gray-100 transition"
                      >
                        −
                      </button>
                      <span className="text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1, item.size, item.color)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-sm hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.sku, item.size, item.color)}
                        className="ml-auto text-gray-400 hover:text-red-500 transition"
                        aria-label="ลบ"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ยอดรวม</span>
              <span className="font-bold text-base text-gray-400">฿{totalPrice.toLocaleString()}</span>
            </div>
            <button className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
              ดำเนินการชำระเงิน
            </button>
          </div>
        )}
      </div>
    </>
  );
}