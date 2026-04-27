import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import OrderList from "@/components/OrderList"; // We'll create this for real-time logic

export default async function HistoryPage() {
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
        <h1 className="text-3xl font-bold text-white">Order History</h1>
        <p className="text-slate-400">Monitor and manage all Cupbaab orders</p>
      </header>

      {/* We pass the initial data to a Client Component 
        so we can handle Real-time subscriptions and Button clicks
      */}
      <OrderList initialOrders={initialOrders || []} />
    </div>
  );
}