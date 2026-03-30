import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { I18nProvider } from "@/lib/i18n/provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attend.AI",
  description: "Smart Attendance with Face Recognition",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface antialiased min-h-screen">
        <ThemeProvider>
          <I18nProvider>
            <Sidebar />
            <main className="lg:ml-64 min-h-screen">
              <Header />
              {children}
            </main>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
