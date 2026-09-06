import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/common/Footer";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <a href="#contenido" className="pc-skip-link">
        Saltar al contenido
      </a>
      <Navbar />
      <div id="contenido" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </div>
      <Footer />
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}
