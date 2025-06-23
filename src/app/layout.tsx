import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });
const dmSerifDisplay = DM_Serif_Display({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display"
});

export const metadata: Metadata = {
  title: "Arunachal Literature",
  description: "Promoting and preserving the rich literary heritage of Arunachal Pradesh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always show header/footer in the main layout
  // /admin and /login can have their own layouts without header/footer
  return (
    <html lang="en">
      <body className={`${inter.className} ${dmSerifDisplay.variable}`}>
        <AdminLayoutWrapper showHeaderFooter={true}>
          {children}
        </AdminLayoutWrapper>
      </body>
    </html>
  );
}
