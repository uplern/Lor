import "./globals.css";
import type { ReactNode } from "react";
import TopNav from "@/components/TopNav";

export const metadata = {
  title: "Uplern LOR",
  description: "Self-service letter of recommendation generator",
  icons: {
    icon: "/assets/favicon.png"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <TopNav />
          {children}
        </div>
      </body>
    </html>
  );
}