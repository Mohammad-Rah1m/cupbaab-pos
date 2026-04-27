import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Banner = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link
        href="/"
        className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
      >
        <ArrowLeft size={20} />
      </Link>
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          {title}
        </h1>
        <p className="text-slate-500 text-sm font-bold">{description}</p>
      </div>
    </div>
  );
};

export default Banner;
