import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  variable: "--font-sans-custom",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif-custom",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lakshadweep Heritage Holidays | Premium Tropical Island Escapes",
  description: "Curated island escapes, luxury water adventures, and end-to-end permit support for Agatti, Bangaram, Kavaratti, and Kalpeni islands in Lakshadweep.",
  keywords: ["Lakshadweep travel", "Agatti package", "Bangaram resort", "Lakshadweep tour operator", "Kavaratti honeymoon"],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${lato.variable} ${playfair.variable} antialiased scroll-smooth`}
    >
      <body suppressHydrationWarning className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
