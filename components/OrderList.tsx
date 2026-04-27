"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Clock,
  Search,
  Printer,
  Calendar,
  Trash2,
  Loader2,
  CheckCircle,
  Download,
  Archive,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrderList({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders || []);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const supabase = createClient();

  // --- 1. FILTERING LOGIC (Senior Engineer Safety Checks) ---
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    
    return orders.filter((order) => {
      const orderNumStr = order?.order_number?.toString() || "";
      const matchesSearch = orderNumStr.includes(searchTerm);
      const matchesFilter = filterStatus === "all" || order.payment_status === filterStatus;
      
      // Only show orders that are NOT archived on the active dashboard
      const isNotArchived = !order.is_archived;
      
      return matchesSearch && matchesFilter && isNotArchived;
    });
  }, [orders, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = filteredOrders.reduce((acc, order) => acc + (order.total_price || 0), 0);
    const count = filteredOrders.length;
    return { total, count };
  }, [filteredOrders]);

  // --- 2. CLOSE DAY & ARCHIVE LOGIC ---
  const handleCloseDay = async () => {
    if (filteredOrders.length === 0) return alert("No active orders to close.");

    const confirmClose = confirm(
      `CLOSE DAY?\n\n1. Generate Daily PDF Report\n2. Archive ${filteredOrders.length} orders\n\nThis will clear the current dashboard. Proceed?`
    );

    if (!confirmClose) return;

    setIsArchiving(true);
    try {
      // Step A: Generate the Report
      downloadDailyReport();

      // Step B: Bulk Update Supabase
      const { error } = await supabase
        .from("orders")
        .update({ is_archived: true })
        .eq("is_archived", false);

      if (error) throw error;

      // Step C: Optimistic Local UI Update
      setOrders((prev) => prev.map((o) => ({ ...o, is_archived: true })));
      alert("Day closed successfully. Dashboard cleared.");
    } catch (err) {
      console.error("Archive Error:", err);
      alert("Error archiving orders. Please check your connection.");
    } finally {
      setIsArchiving(false);
    }
  };

  // --- 3. PDF GENERATORS ---
  const downloadDailyReport = () => {
    const doc = new jsPDF();
    const todayStr = new Date().toLocaleDateString("en-GB");

    doc.setFontSize(20).setTextColor(249, 115, 22); // Orange
    doc.text("CUPBAAB DAILY SALES REPORT", 14, 20);

    doc.setFontSize(10).setTextColor(100);
    doc.text(`Report Date: ${todayStr}`, 14, 28);
    doc.text(`Total Orders Settled: ${stats.count}`, 14, 34);
    doc.text(`Total Revenue: $${stats.total.toFixed(2)}`, 14, 40);

    const tableRows = filteredOrders.map((order) => [
      `#${order.order_number.toString().padStart(3, "0")}`,
      new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      order.payment_status.toUpperCase(),
      `$${order.total_price.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Order #", "Time", "Payment", "Amount"]],
      body: tableRows,
      headStyles: { fillColor: [15, 23, 42] }, // Slate-900
    });

    doc.save(`Cupbaab_Settlement_${todayStr.replace(/\//g, "-")}.pdf`);
  };

  const handlePrint = (order: any) => {
    const itemHeight = (order.items?.length || 0) * 8;
    const totalHeight = 80 + itemHeight;
    const doc = new jsPDF({ unit: "mm", format: [80, totalHeight] });
    const pageWidth = 80;
    const margin = 5;
    let y = 10;

    doc.setFont("Courier", "bold").setFontSize(18);
    doc.text("CUPBAAB", pageWidth / 2, y, { align: "center" });
    
    y += 12;
    doc.setFontSize(9).setFont("Courier", "normal");
    doc.text(`ORDER: #${order.order_number.toString().padStart(3, "0")}`, margin, y);
    doc.text(new Date(order.created_at).toLocaleTimeString(), pageWidth - margin, y, { align: "right" });

    y += 5;
    doc.text("------------------------------------------", margin, y);

    order.items?.forEach((item: any) => {
      y += 7;
      doc.text(`${item.quantity}x ${item.size}`, margin, y);
      const price = (item.price || 0).toFixed(2);
      doc.text(`$${price}`, pageWidth - margin, y, { align: "right" });
    });

    y += 8;
    doc.text("------------------------------------------", margin, y);
    y += 7;
    doc.setFontSize(14).setFont("Courier", "bold");
    doc.text("TOTAL:", margin, y);
    doc.text(`$${order.total_price.toFixed(2)}`, pageWidth - margin, y, { align: "right" });

    const pdfBlob = doc.output("bloburl");
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfBlob.toString();
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 2000);
    };
  };

  // --- 4. REALTIME & DB ACTIONS ---
  // useEffect(() => {
  //   const channel = supabase
  //     .channel("orders_realtime")
  //     .on("postgres_changes" as any, { event: "*", table: "orders", schema:"public" }, (payload) => {
  //       if (payload.eventType === "INSERT") setOrders((p) => [payload.new, ...p]);
  //       if (payload.eventType === "UPDATE") setOrders((p) => p.map((o) => (o.id === payload.new.id ? payload.new : o)));
  //       if (payload.eventType === "DELETE") setOrders((p) => p.filter((o) => o.id !== payload.old.id));
  //     })
  //     .subscribe();
  //   return () => { supabase.removeChannel(channel); };
  // }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order record permanently?")) return;
    setIsDeleting(id);
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) alert("Delete failed.");
    setIsDeleting(null);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("orders").update({ order_status: newStatus }).eq("id", id);
  };

  return (
    <div className="space-y-6">
      {/* TOP STATS RIBBON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Active Revenue</p>
          <h3 className="text-3xl font-black text-white font-mono">
            ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-orange-500 font-bold mt-2 flex items-center gap-1">
            <CheckCircle size={12} /> {stats.count} Unarchived Orders
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl border-dashed flex flex-col justify-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">System Live</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white font-bold text-sm">Waiting for Orders...</span>
          </div>
        </div>

        <button
          onClick={handleCloseDay}
          disabled={isArchiving || filteredOrders.length === 0}
          className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white p-6 rounded-3xl border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1 group"
        >
          {isArchiving ? <Loader2 size={24} className="animate-spin" /> : <Archive size={24} />}
          <span className="font-black uppercase text-xs">Close Day & Settle</span>
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search Order ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {["all", "paid", "unpaid"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded-xl font-bold text-xs uppercase transition-all ${
                filterStatus === status ? "bg-orange-500 text-white" : "text-slate-500"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col lg:flex-row items-center justify-between group hover:border-slate-700 transition-all gap-6">
            <div className="flex gap-6 items-center w-full lg:w-auto">
              <div className="flex flex-col items-center border-r border-slate-800 pr-6">
                <span className="text-3xl font-mono font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                  #{order.order_number.toString().padStart(3, "0")}
                </span>
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-1">
                  <Clock size={10} /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {order.items?.map((item: any, idx: number) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs font-bold border border-slate-700">
                      {item.quantity} × {item.size}
                    </span>
                  ))}
                </div>
                <p className="text-orange-500 font-mono font-black text-2xl">${(order.total_price || 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <button onClick={() => handlePrint(order)} className="p-4 bg-slate-950 text-slate-500 rounded-2xl hover:text-white border border-slate-800 transition-all">
                <Printer size={20} />
              </button>
              <button onClick={() => handleDelete(order.id)} className="p-4 bg-slate-950 text-slate-500 rounded-2xl border border-slate-800 hover:text-rose-500">
                {isDeleting === order.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
              </button>
              
              <div className="w-[1px] h-10 bg-slate-800 mx-2 hidden lg:block" />

              <div className={`px-5 py-2 rounded-2xl border font-black text-[10px] uppercase ${
                order.payment_status === "paid" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
              }`}>
                {order.payment_status}
              </div>

              {order.order_status !== "completed" ? (
                <button
                  onClick={() => updateStatus(order.id, "completed")}
                  className="bg-white text-black px-6 py-4 rounded-2xl font-black text-xs uppercase hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95"
                >
                  Complete Order
                </button>
              ) : (
                <div className="px-6 py-4 rounded-2xl border border-blue-500/20 text-blue-500 font-black text-xs uppercase flex items-center gap-2">
                  <CheckCircle size={14} /> Ready
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="p-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem]">
            <p className="text-slate-600 font-bold uppercase tracking-widest">No active orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}