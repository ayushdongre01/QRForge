import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QRForge — QR Code Generator",
  description: "Generate beautiful, customizable QR codes instantly from any URL.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}