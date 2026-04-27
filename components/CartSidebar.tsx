"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, ShoppingCart, Loader2, Minus, Plus, Percent } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function CartSidebar() {
  const { cart, removeItem, clearCart, updateQuantity, discount, setDiscount, taxRate } = useCartStore();
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  // Financial Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const discountAmount = subtotal * (discount / 100);
  const finalTotal = subtotal + taxAmount - discountAmount;

  const handlePlaceOrder = async (isPaid: boolean) => {
    if (cart.length === 0) return;
    setIsSaving(true);
    
    const { error } = await supabase.from("orders").insert({
      items: cart,
      subtotal: subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total_price: finalTotal,
      payment_status: isPaid ? "paid" : "unpaid",
      order_status: "pending",
    });

    if (error) {
      console.error("Supabase Error:", error.message);
      alert("Failed to save order.");
    } else {
      clearCart();
      setDiscount(0); // Reset discount for next customer
    }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 h-16 p-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          {/* <ShoppingCart className="text-orange-500" /> */}
          Current Order
        </h2>
        <button
          onClick={clearCart}
          className="text-xs text-slate-500 hover:text-rose-500 uppercase tracking-wider font-bold transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Scrollable Order List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar p-4">
        {cart.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
            <p>No items added yet</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-slate-700 transition-all">
              <div className="flex-1">
                <p className="font-bold text-lg">{item.size} Cup</p>
                <p className="text-sm text-orange-400 font-mono">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-700">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400"><Minus size={16} /></button>
                  <span className="w-8 text-center font-bold font-mono">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400"><Plus size={16} /></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-rose-500 p-2 bg-slate-900 rounded-xl border border-slate-700"><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Financial Breakdown Section */}
      <div className="pt-4 border-t border-slate-800 space-y-2 p-4">
        <div className="flex justify-between text-slate-400 text-sm font-medium">
          <span>Subtotal</span>
          <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-slate-400 text-sm font-medium items-center">
          <span>Tax ({taxRate}%)</span>
          <span className="text-white font-mono">${taxAmount.toFixed(2)}</span>
        </div>

        {/* Editable Discount */}
        <div className="flex justify-between text-slate-400 text-sm font-medium items-center">
          <div className="flex items-center gap-2">
            <span>Discount (%)</span>
          </div>
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 w-20">
            <input 
              type="number" 
              value={discount || ""} 
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="0"
              className="bg-transparent w-full text-right text-orange-400 font-mono focus:outline-none text-sm"
            />
            <Percent size={12} className="text-slate-500 ml-1" />
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-t border-slate-800">
          <span className="text-slate-400 text-md">Total Amount</span>
          <span className="text-md font-bold text-orange-400">${finalTotal.toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            disabled={cart.length === 0 || isSaving}
            onClick={() => handlePlaceOrder(false)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold py-2 rounded-2xl transition-all active:scale-[0.98] border border-slate-700 text-sm"
          >
            {isSaving ? <Loader2 className="animate-spin mx-auto" /> : "PAY LATER"}
          </button>

          <button
            disabled={cart.length === 0 || isSaving}
            onClick={() => handlePlaceOrder(true)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 text-white font-bold py-2 rounded-2xl transition-all active:scale-[0.98] text-sm flex items-center justify-center"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "PAID NOW"}
          </button>
        </div>
      </div>
    </div>
  );
}