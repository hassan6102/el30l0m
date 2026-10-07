"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, UserCheck, BarChart3, TrendingUp, MapPin, LogOut, GraduationCap, Mail, Menu, X } from "lucide-react"
import { auth } from "@/lib/firebase"
import { ADMIN_UID } from "@/lib/config"
import { OverviewPanel } from "@/components/admin/overview-panel"
import { ApplicationsPanel } from "@/components/admin/applications-panel"
import { TeachersPanel } from "@/components/admin/teachers-panel"
import { StudentsPanel } from "@/components/admin/students-panel"
import { MessagesPanel } from "@/components/admin/messages-panel"
import { SubjectsPanel, LevelsPanel, LocationsPanel } from "@/components/admin/catalog-panel"

const sidebarItems = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "applications", label: "طلبات الانضمام", icon: UserCheck },
  { id: "teachers", label: "إدارة المدرسين", icon: Users },
  { id: "students", label: "الطلاب المسجلين", icon: GraduationCap },
  { id: "messages", label: "رسائل التواصل", icon: Mail },
  { id: "subjects", label: "إدارة المواد", icon: BookOpen },
  { id: "levels", label: "إدارة المراحل", icon: TrendingUp },
  { id: "locations", label: "إدارة الأماكن", icon: MapPin },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [adminUser, setAdminUser] = useState("")
  const [authChecked, setAuthChecked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user || (ADMIN_UID && user.uid !== ADMIN_UID)) {
        router.push("/admin-login")
        return
      }
      setAdminUser(user.email || "المدير")
      setAuthChecked(true)
    })
    return () => unsub()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/admin-login")
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600" dir="rtl">
        جاري التحقق...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* شريط الموبايل */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-white px-4 py-3 shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-gray-900">
            {menuOpen ? "اختر القسم" : sidebarItems.find((i) => i.id === activeTab)?.label}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? <X className="ml-1 h-4 w-4" /> : <Menu className="ml-1 h-4 w-4" />}
          {menuOpen ? "إغلاق" : "القائمة"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`${menuOpen ? "block" : "hidden"} md:block md:w-64 md:shrink-0 bg-white shadow-sm md:border-l md:min-h-screen`}
        >
          <div className="p-4 md:p-6">
            <div className="hidden md:flex items-center gap-2 mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-600">مسجل الدخول</p>
              <p className="font-semibold text-gray-900 text-sm break-all" dir="ltr">
                {adminUser}
              </p>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg text-right transition-colors ${
                    activeTab === item.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className={`${menuOpen ? "hidden" : "block"} md:block flex-1 min-w-0 p-4 md:p-8 space-y-6`}>
          <h2 className="hidden md:block text-2xl font-bold text-gray-900">
            {sidebarItems.find((i) => i.id === activeTab)?.label}
          </h2>

          {activeTab === "overview" && <OverviewPanel />}
          {activeTab === "applications" && <ApplicationsPanel />}
          {activeTab === "teachers" && <TeachersPanel />}
          {activeTab === "students" && <StudentsPanel />}
          {activeTab === "messages" && <MessagesPanel />}
          {activeTab === "subjects" && <SubjectsPanel />}
          {activeTab === "levels" && <LevelsPanel />}
          {activeTab === "locations" && <LocationsPanel />}
        </main>
      </div>
    </div>
  )
}
