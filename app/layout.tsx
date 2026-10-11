import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { SiteDataProvider } from "@/lib/site-data"

const brand = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-brand",
  display: "swap",
})

export const metadata: Metadata = {
  title: "منصة العلوم",
  description: "أفضل منصة للبحث عن مدرسين لكل المراحل التعليمية",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={brand.variable}>
        <SiteDataProvider>{children}</SiteDataProvider>
      </body>
    </html>
  )
}
