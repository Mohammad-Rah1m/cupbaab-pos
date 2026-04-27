// app/print/order/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import PrintableReceipt from "@/components/PrintableReceipt"; // Reuse your component

export default function PrintPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (data) {
        setOrder(data);
        // Wait for render, then print and close
        setTimeout(() => {
          window.print();
          window.close(); // Automatically closes the tab after printing/cancelling
        }, 500);
      }
    };
    fetchOrder();
  }, [params.id]);

  if (!order) return <div className="p-8">Loading Receipt...</div>;

  return (
    <div className="bg-white min-h-screen">
       <PrintableReceipt order={order} />
    </div>
  );
}