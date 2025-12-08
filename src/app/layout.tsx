import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "../components/Header";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CourseMaster",
  description: "EdTech platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <Header />
            <main className="pt-16">
              {children}
            </main>
            <Toaster 
              position="top-right" 
              toastOptions={{
                duration: 4000,
                style: {
                  fontSize: '16px',
                  padding: '16px 20px',
                  minWidth: '300px',
                },
                error: {
                  style: {
                    fontSize: '16px',
                    padding: '16px 20px',
                    minWidth: '350px',
                    fontWeight: '500',
                  },
                },
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
