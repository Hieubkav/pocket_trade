import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import NavigationWrapper from "../components/NavigationWrapper";
import { ConvexClientProvider } from "../ConvexClientProvider";
import { TraderAuthProvider } from "../contexts/TraderAuthContext";
import VisitorTracker from "../components/VisitorTracker";
import { getSettings } from "../lib/getSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: settings?.seoTitle || settings?.siteName || "Pocket Trade - Pokemon TCG",
    description: settings?.seoDescription || "Trade Pokemon TCG cards",
    keywords: settings?.seoKeywords?.join(", ") || "Pokemon TCG, Trade, Cards",
    icons: {
      icon: settings?.favicon || "/favicon.ico",
      shortcut: settings?.favicon || "/favicon.ico",
      apple: settings?.favicon || "/favicon.ico",
    },
    openGraph: {
      title: settings?.seoTitle || settings?.siteName || "Pocket Trade - Pokemon TCG",
      description: settings?.seoDescription || "Trade Pokemon TCG cards",
      siteName: settings?.siteName || "Pocket Trade",
      images: settings?.logo ? [{ url: settings.logo }] : [],
    },
  };
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <TraderAuthProvider>
            <VisitorTracker />
            <NavigationWrapper>{children}</NavigationWrapper>
          </TraderAuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
