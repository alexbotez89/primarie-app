import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primarie App",
  description: "Platformă digitală pentru cereri cetățenești, tracking, dashboard și hartă operațională.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
