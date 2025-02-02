import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Image from "next/image";
import "@/public/image/logoPsสัญลักษณ์-01.png";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PS OPENHOUSE2025",
  description: "School of Excellent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <Image
                      src="/image/logoPsสัญลักษณ์-01.png"
                      alt="Logo Icon"
                      width={30}
                      height={30}
                      priority
                    />
                    <span className=" sm:inline font-medium" style={{ color: "#1537e8" }}>
                      PS OPENHOUSE 2025
                    </span>
                    
                    <span className="hidden sm:inline font-medium " style={{ color: "#a8a8a8" }}>
                       #SCHOOL OF EXCELLENT
                    </span>
                  </div>
                </div>
              </nav>

              <div className="w-full max-w-5xl p-5">
                {children}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
