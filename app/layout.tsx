import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEB — Grupo de Estudo Bíblico",
  description:
    "Leve a Palavra de Deus até à sua casa. Faça parte do Grupo de Estudo Bíblico e ajude a expandir o Reino de Deus através de pequenos grupos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink">{children}</body>
    </html>
  );
}
