"use client";
import React from 'react';

export default function PrintableReceipt({ order }: { order: any }) {
  if (!order) return null;

  return (
    <div className="receipt-content p-8 bg-white text-black font-mono w-[80mm] mx-auto">
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h2 className="text-2xl font-black uppercase">CUPBAAB</h2>
        <p className="text-xs">DHA Phase 5, Lahore</p>
        <p className="text-[10px]">Date: {new Date(order.created_at).toLocaleString()}</p>
      </div>

      <div className="flex justify-between font-bold mb-4 text-sm">
        <span>Order: #{order.order_number}</span>
        <span className="uppercase">{order.payment_status}</span>
      </div>

      <table className="w-full text-xs mb-4">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left py-1">Item</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item: any, i: number) => (
            <tr key={i} className="border-b border-dotted border-gray-400">
              <td className="py-2">{item.size} Cup</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-right">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-1 text-xs text-right mb-6">
        <p>Subtotal: ${order.total_price.toFixed(2)}</p>
        <p className="text-lg font-black pt-2 border-t border-black">
          Total: ${order.total_price.toFixed(2)}
        </p>
      </div>

      <div className="text-center text-[10px] italic">
        <p>Thank you for choosing Cupbaab!</p>
        <p>Please come again.</p>
      </div>
    </div>
  );
}