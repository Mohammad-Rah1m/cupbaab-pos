"use client";

import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import { useCartStore } from "@/store/useCartStore";
import Banner from "@/components/Banner";

export default function Dashboard() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="flex">
      {/* Main Order Area */}
      <div className="flex-1 p-8 overflow-y-auto bg-slate-950">

        <Banner title="New Order" description="Select items for new order"/>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            size="Small"
            price={8.0}
            color="bg-emerald-500"
            onClick={() => addItem({ size: "Small", price: 8.0 })}
          />
          <ProductCard
            size="Medium"
            price={12.0}
            color="bg-blue-500"
            onClick={() => addItem({ size: "Medium", price: 12.0 })}
          />
          <ProductCard
            size="Large"
            price={15.0}
            color="bg-rose-500"
            onClick={() => addItem({ size: "Large", price: 15.0 })}
          />
          
        </div>
      </div>

      {/* Fixed Cart Sidebar */}
      {/* <aside className="w-[350px] h-screen bg-slate-950 border-l border-slate-800 flex-shrink-0">
        <CartSidebar />
      </aside> */}
    </div>
  );
}
