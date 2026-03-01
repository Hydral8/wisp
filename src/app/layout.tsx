import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wisp Instant",
  description: "Orchestrate MCP tool workflows with natural language",
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
