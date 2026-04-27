"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CartSidebar from "@/components/CartSidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Always Fixed */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-54 flex flex-col">
        <div className="flex flex-1">
          {/* Content Section */}
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-950">
              {children}
            </main>
          </div>

          {/* Sidebar - Only on Home Page */}
          {isHomePage && (
            <aside className="w-[320px] sticky top-0 h-screen bg-slate-950 border-l border-slate-800 flex-shrink-0 overflow-y-auto">
              <CartSidebar />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}