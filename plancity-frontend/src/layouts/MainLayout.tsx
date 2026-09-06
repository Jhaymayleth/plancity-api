import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/common/Footer";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}
