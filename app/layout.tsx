import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demo Primărie",
  description: "Portal cetățean și dashboard operațional pentru primării.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
