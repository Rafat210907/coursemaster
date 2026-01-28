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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground bg-dot-pattern`}
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
                duration: 5000,
                style: {
                  background: 'hsla(260, 30%, 5%, 0.8)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid hsla(270, 90%, 60%, 0.2)',
                  color: '#fff',
                  borderRadius: '1rem',
                  padding: '16px 24px',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                  fontSize: '16px',
                  fontWeight: '500',
                },
                success: {
                  iconTheme: {
                    primary: 'hsla(270, 90%, 60%, 1)',
                    secondary: '#fff',
                  },
                  style: {
                    borderLeft: '4px solid hsla(270, 90%, 60%, 1)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                  style: {
                    borderLeft: '4px solid #ef4444',
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
