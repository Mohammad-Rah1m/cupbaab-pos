"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Calendar, 
  FileText, 
  ChevronRight, 
  Printer, 
  ArrowLeft,
  Clock,
  DollarSign
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import jsPDF from "jspdf";

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("is_archived", true) // ONLY archived orders
        .order("created_at", { ascending: false });

      if (!error) setOrders(data);
      setLoading(false);
    };
    fetchHistory();
  }, [supabase]);

  // Filtering Logic
  const filteredHistory = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.order_number.toString().includes(searchTerm);
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      const matchesDate = dateFilter ? orderDate === dateFilter : true;
      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, dateFilter]);

  // Stats for the filtered view
  const historyStats = useMemo(() => {
    const total = filteredHistory.reduce((acc, o) => acc + o.total_price, 0);
    return { total, count: filteredHistory.length };
  }, [filteredHistory]);

  const handleReprint = (order: any) => {
    // Reuse your formatted jsPDF logic here to reprint the receipt
    alert(`Reprinting Order #${order.order_number}`);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Order Archives</h1>
            <p className="text-slate-500 text-sm font-bold">Review and reprint past settlements</p>
          </div>
        </div>

        {/* Filter Summary Card */}
        <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase">Records Found</span>
            <span className="text-xl font-mono font-bold text-white">{historyStats.count}</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase">Archived Value</span>
            <span className="text-xl font-mono font-bold text-emerald-500">${historyStats.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order #..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="date" 
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50 [color-scheme:dark]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <button 
          onClick={() => {setSearchTerm(""); setDateFilter("");}}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs uppercase"
        >
          Reset Filters
        </button>
      </div>

      {/* History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Order</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date & Time</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Items</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredHistory.map((order) => (
              <tr key={order.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="p-4">
                  <span className="font-mono font-black text-white bg-slate-800 px-2 py-1 rounded-lg">
                    #{order.order_number.toString().padStart(3, "0")}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-300">{new Date(order.created_at).toLocaleDateString()}</span>
                    <span className="text-[10px] text-slate-500">{new Date(order.created_at).toLocaleTimeString()}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {order.items.map((it: any, i: number) => (
                      <span key={i} className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                        {it.quantity}x {it.size}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className="text-lg font-black text-orange-500 font-mono">${order.total_price.toFixed(2)}</span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleReprint(order)}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all group-hover:border-slate-600"
                  >
                    <Printer size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredHistory.length === 0 && !loading && (
          <div className="p-20 text-center flex flex-col items-center">
            <FileText size={48} className="text-slate-800 mb-4" />
            <p className="text-slate-500 font-bold">No archived orders found matching those criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}