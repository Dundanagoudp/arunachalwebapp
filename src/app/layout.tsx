import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";

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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logofavicon.jpg" type="image/jpeg" />
      </head>
      <body className={`${inter.className} ${dmSerifDisplay.variable}`}>
        {children}
      </body>
    </html>
  );
}
