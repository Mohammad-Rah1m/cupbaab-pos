import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import OrderList from "@/components/OrderList"; // We'll create this for real-time logic
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch initial orders on the server for instant loading
  const { data: initialOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Order History
            </h1>
            <p className="text-slate-500 text-sm font-bold">
              Monitor and manage today's orders
            </p>
          </div>
        </div>
      </header>

      {/* We pass the initial data to a Client Component 
        so we can handle Real-time subscriptions and Button clicks
      */}
      <OrderList initialOrders={initialOrders || []} />
    </div>
  );
}
