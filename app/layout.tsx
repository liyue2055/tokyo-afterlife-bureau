import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Tokyo Afterlife Bureau — A second life for forgotten things",
  description:
    "Every forgotten object has a story. Meet its spirit, hear its wish, and give it another chapter.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/icon.svg" },
  appleWebApp: {
    capable: true,
    title: "Afterlife Bureau",
    statusBarStyle: "default",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f0e7",
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
