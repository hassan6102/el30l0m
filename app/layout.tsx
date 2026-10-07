import type { Metadata } from "next"
import "./globals.css"
import { SiteDataProvider } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "منصة المدرسين",
  description: "أفضل منصة للبحث عن مدرسين لكل المراحل التعليمية",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <SiteDataProvider>{children}</SiteDataProvider>
      </body>
    </html>
  )
}
