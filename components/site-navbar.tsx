"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCap,
  Menu,
  Home,
  Users,
  BookOpen,
  Layers,
  Mail,
  MessageCircle,
  UserPlus,
  Gift,
  ChevronLeft,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SITE_NAME, OFFER, ownerWhatsappLink } from "@/lib/config"

const brandFont = { fontFamily: "var(--font-brand), 'Cairo', 'Segoe UI', sans-serif" }

const links = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/teachers", label: "المدرسين", icon: Users },
  { href: "/subjects", label: "المواد", icon: BookOpen },
  { href: "/levels", label: "المراحل", icon: Layers },
  { href: "/contact", label: "تواصل معنا", icon: Mail },
]

export function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5" style={brandFont}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 shadow-sm shadow-blue-600/30">
        <GraduationCap className="h-5 w-5 text-white" />
      </span>
      <span className="flex flex-col">
  <span
    className={`pb-0.5 text-[20px] font-extrabold leading-[1.5] ${
      light ? "text-white" : "bg-gradient-to-l from-blue-900 to-indigo-600 bg-clip-text text-transparent"
    }`}
  >
    {SITE_NAME}
  </span>
  <span className={`-mt-1 text-[10px] font-semibold leading-none ${light ? "text-blue-100" : "text-gray-500"}`}>
    تعليم بثقة
  </span>
</span>
    </span>
  )
}

export function SiteNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <header
      className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75"
      style={brandFont}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 md:h-[68px]">
        <Link href="/" aria-label={SITE_NAME}>
          <BrandLogo />
        </Link>

        {/* قائمة الكمبيوتر */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(l.href) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/register-teacher">
            <Button variant="outline" size="sm" className="rounded-full font-semibold">
              انضم كمدرس
            </Button>
          </Link>
          <Link href="/register-student">
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-l from-blue-700 to-indigo-600 font-semibold hover:from-blue-800 hover:to-indigo-700"
            >
              <Gift className="ml-1.5 h-4 w-4" />
              سجّل كطالب
            </Button>
          </Link>
        </div>

        {/* الموبايل */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/register-student" className="hidden min-[400px]:block">
            <Button
              size="sm"
              className="h-9 rounded-full bg-gradient-to-l from-blue-700 to-indigo-600 px-4 text-[13px] font-semibold"
            >
              سجّل كطالب
            </Button>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="القائمة"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 active:scale-95 transition"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-[86%] max-w-sm flex-col gap-0 p-0" style={brandFont}>
              <SheetTitle className="sr-only">القائمة</SheetTitle>
              <SheetDescription className="sr-only">روابط التنقل في الموقع</SheetDescription>

              {/* رأس القائمة */}
              <div className="bg-gradient-to-br from-blue-800 to-indigo-700 px-5 pb-5 pt-6">
                <BrandLogo light />
                <Link
                  href="/register-student"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2.5 text-[13px] font-semibold text-white backdrop-blur active:bg-white/25"
                >
                  <Gift className="h-4 w-4 shrink-0" />
                  <span className="flex-1">
                    {OFFER.freeLesson ? "حصة مجانية + " : ""}خصم {OFFER.discountPercent}% للطلاب الجدد
                  </span>
                  <ChevronLeft className="h-4 w-4 shrink-0 opacity-80" />
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {/* أزرار التسجيل */}
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/register-student" onClick={() => setOpen(false)}>
                    <Button className="h-auto w-full flex-col gap-1 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 py-3 font-semibold">
                      <Gift className="h-5 w-5" />
                      سجّل كطالب
                    </Button>
                  </Link>
                  <Link href="/register-teacher" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="h-auto w-full flex-col gap-1 rounded-xl border-2 py-3 font-semibold">
                      <UserPlus className="h-5 w-5" />
                      سجّل كمدرس
                    </Button>
                  </Link>
                </div>

                {/* الروابط */}
                <nav className="mt-5 space-y-1">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold transition-colors ${
                        isActive(l.href) ? "bg-blue-50 text-blue-700" : "text-gray-700 active:bg-gray-100"
                      }`}
                    >
                      <l.icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1">{l.label}</span>
                      <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* واتساب */}
              <div className="border-t bg-white p-4">
                <a
                  href={ownerWhatsappLink(`مرحباً، أريد الاستفسار عن ${SITE_NAME}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="h-11 w-full rounded-xl bg-green-600 text-[15px] font-semibold hover:bg-green-700">
                    <MessageCircle className="ml-2 h-5 w-5" />
                    تواصل معانا على واتساب
                  </Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
