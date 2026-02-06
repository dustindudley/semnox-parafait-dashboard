import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Semnox Parafait Analytics | Dashboard",
  description: "Monitor ticket earnings, detect anomalies, and track redemptions in real-time",
  keywords: ["semnox", "parafait", "analytics", "dashboard", "tickets", "arcade"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="bg-grid-pattern bg-gradient-radial min-h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
