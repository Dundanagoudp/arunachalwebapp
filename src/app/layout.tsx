import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arunachal Literature",
  description: "Promoting and preserving the rich literary heritage of Arunachal Pradesh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminLayoutWrapper>
          {children}
        </AdminLayoutWrapper>
      </body>
    </html>
  );
}
