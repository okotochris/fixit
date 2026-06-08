import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./component/providers/SessionProviderWrapper";
import BottomNav from "./component/BottomNav";
import InstallPopup from "./component/installApp";
import Script from "next/script";

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
  description:
    "Connect with skilled workers in your area like plumbers, electricians, carpenters and more.",
  icons: {
    icon: "/fixit.png",
  },
  manifest: "/manifest.json",
  themeColor: "#1a73e8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Google Analytics (correct Next.js way) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RDR35RNTSK"
          strategy="afterInteractive"
        />

        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RDR35RNTSK');
          `}
        </Script>

        <SessionProviderWrapper>
          {children}

          {/* Mobile UI */}
          <BottomNav />
          <InstallPopup />
        </SessionProviderWrapper>

      </body>
    </html>
  );
}