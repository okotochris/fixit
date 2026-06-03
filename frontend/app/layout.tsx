import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./component/providers/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "serviceHub - Find Skilled Workers Near You",
  description: "Connect with skilled workers in your area like plumbers, electricians, carpenters and more.",
   icons: {
    icon: "/fixit.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
