// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"


export const metadata: Metadata = {
  title: {
    default: "Floaty",
    template: "%s",
  },
  description: "Floaty hỗ trợ phòng chống đuối nước với kiến thức, lộ trình học bơi và trang bị bơi lội an toàn.",
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans`}>
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        ) : null}
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
