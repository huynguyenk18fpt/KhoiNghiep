// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "Downing Prevention",
  description: "Web for Downing Prevention",
  icons: {
    icon: "/images/fav.png",
  },
}

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        {/* Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-12311005693`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-12311005693', {
                page_path: window.location.pathname,
              });
            `,
          }}
        ></script>
      </head>
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
