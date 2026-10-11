import type { Metadata } from "next";
import "./globals.css";
import { SukoonProvider } from "@/lib/context";

export const metadata: Metadata = {
  title: "Sukoon • Verified Partner Washroom Network",
  description:
    "Verified-open partner washroom network for India, inspired by Germany's Nette Toilette scheme. Clean, safe, unlocked washrooms in cafes, stores, malls, and fuel stations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-cream-100 text-sand-900 antialiased selection:bg-sukoon-200 selection:text-sukoon-950">
        <SukoonProvider>{children}</SukoonProvider>
      </body>
    </html>
  );
}
