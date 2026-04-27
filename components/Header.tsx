"use client";

import React, { useState } from 'react';
import { Search, Moon, Sun, Bell, Power, Store, Info } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // This should eventually come from your DB/Context

  const toggleShift = () => {
    const action = isOpen ? "Close" : "Open";
    if (confirm(`Are you sure you want to ${action} the shop?`)) {
      setIsOpen(!isOpen);
      // Logic for Supabase shift table goes here
    }
  };

  return (
    <header className="h-16 p-4 border-b border-slate-800 bg-slate-950 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between w-full no-print">
      
      {/* Search Bar */}
      <div className="relative w-84 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search for orders, items or customers..." 
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
        />
      </div>
     
      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        
        {/* --- SHIFT TOGGLE BUTTON --- */}
        {/* <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-1 pl-4 rounded-2xl">
          <div className="flex flex-col items-start pr-2">
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Shop Status</span>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className={`text-xs font-bold ${isOpen ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
          </div>
          
          <button 
            onClick={toggleShift}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-lg ${
              isOpen 
              ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20' 
              : 'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-400/20'
            }`}
          >
            <Power size={14} />
            {isOpen ? "End Shift" : "Start Shift"}
          </button>
        </div> */}

        {/* Separator */}
        {/* <div className="h-8 w-[1px] bg-slate-800 mx-1" /> */}

        <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all hover:border-slate-700 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-slate-900"></span>
        </button>

        <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all hover:border-slate-700">
          <Sun size={20} />
        </button>

        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 p-[1px]">
          <div className="h-full w-full rounded-[11px] bg-slate-900 flex items-center justify-center font-bold text-xs text-white">
            MR
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;