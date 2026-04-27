"use client";

interface ProductCardProps {
  size: "Small" | "Medium" | "Large";
  price: number;
  color: string;
  onClick?: () => void;
}

export default function ProductCard({ size, price, color, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-orange-500 transition-all active:scale-95 text-center h-64"
    >
      {/* Visual Indicator for Size - Using Template Literals for the color prop */}
      <div 
        className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg ${color}`}
      >
        {size[0]}
      </div>

      <h3 className="text-xl font-bold text-white mb-1">{size} Cup</h3>
      <p className="text-slate-400 font-medium text-xl">${price.toFixed(2)}</p>

      {/* Modern "Plus" hint */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-orange-500 rounded-full p-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
    </button>
  );
}