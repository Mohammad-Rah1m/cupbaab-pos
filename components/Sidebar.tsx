"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PlusCircle,
  History,
  ChefHat,
  Settings,
  CupSoda,
  ListTodo,
} from "lucide-react";
// import { cn } from "@/lib/utils"; // Standard Shadcn utility for merging classes

const navItems = [
  { name: "New Order", href: "/", icon: PlusCircle },
  { name: "Orders", href: "/orders", icon: ListTodo },
  { name: "Archive", href: "/archive", icon: History },
  // { name: "History", href: "/history", icon: History },
  // { name: "Kitchen", href: "/kitchen", icon: ChefHat },
  // { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-54 bg-slate-950 border-r border-slate-800 flex flex-col p-4 z-50">
      {/* Brand Section */}
      <div className="flex items-center gap-3 px-2 mb-10">
        {/* <div className="bg-orange-500 p-2 rounded-lg">
          <CupSoda className="text-white w-6 h-6" />
        </div> */}
        <span className="text-4xl font-bold text-white tracking-tight">
          Cupbaab
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-orange-500/10 text-orange-500"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-orange-500" : "group-hover:text-white"
                }`}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Staff Profile (Bottom Section) */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold">
            MR
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-none">
              M. Rahim
            </span>
            <span className="text-xs text-slate-500 mt-1">Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
