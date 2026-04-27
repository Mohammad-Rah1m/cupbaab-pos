import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CartSidebar from "@/components/CartSidebar";
// import { usePathname } from 'next/navigation';
import LayoutWrapper from "@/components/LayoutWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cupbaab POS Application",
  description: "This is internal app for cupbaab restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html
    //   lang="en"
    //   className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    // >
    //   <body className="min-h-full flex flex-col">
    //     <div className="flex">
    //     <Sidebar />
    //       {/* We add margin-left 64 (w-64) so the content isn't hidden under the fixed sidebar */}
    //       <main className="flex-1 ml-64 min-h-screen">
    //         {children}
    //       </main>
    //     </div>

    //     </body>
    // </html>
    // <html
    //   lang="en"
    //   className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    // >
    //   <body className="min-h-full bg-slate-950">
    //     {" "}
    //     {/* Added dark background */}
    //     <div className="flex">
    //       <Sidebar />

    //       <div className="flex-1 ml-54 flex flex-col min-h-screen">
    //         {/* Header sits at the top of the content area */}
    //         <div className="flex">
    //           <Header />
    //           {/* <CartSidebar /> */}
    //           <aside className="w-[350px] h-screen bg-slate-950 border-l border-slate-800 flex-shrink-0">
    //             <CartSidebar />
    //           </aside>
    //         </div>

    //         <main className="flex-1 bg-slate-950 ">
    //           {children}
    //           {/* <CartSidebar/> */}
    //         </main>
    //       </div>
    //     </div>
    //   </body>
    // </html>
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="bg-slate-950">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
