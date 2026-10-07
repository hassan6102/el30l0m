"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, EyeOff, BookOpen, TrendingUp, MapPin, GraduationCap, Mail } from "lucide-react"
import { db } from "@/lib/firebase"
import { useSiteData } from "@/lib/site-data"
import { SeedBanner } from "./catalog-panel"

export function OverviewPanel() {
  const { subjects, educationLevels, locations } = useSiteData()
  const [counts, setCounts] = useState({ approved: 0, hidden: 0, pending: 0, students: 0, messages: 0 })

  useEffect(() => {
    ;(async () => {
      try {
        const [t, a, st, m] = await Promise.all([
          getDocs(collection(db, "teachers")),
          getDocs(collection(db, "applications")),
          getDocs(collection(db, "students")),
          getDocs(collection(db, "messages")),
        ])
        setCounts({
          approved: t.docs.filter((d) => d.data().status !== "hidden").length,
          hidden: t.docs.filter((d) => d.data().status === "hidden").length,
          pending: a.docs.filter((d) => d.data().status === "pending").length,
          students: st.docs.filter((d) => d.data().status === "new").length,
          messages: m.docs.filter((d) => d.data().status === "new").length,
        })
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const items = [
    { label: "مدرسين ظاهرين", value: counts.approved, icon: Users, color: "text-green-600 bg-green-100" },
    { label: "طلبات قيد المراجعة", value: counts.pending, icon: UserCheck, color: "text-yellow-600 bg-yellow-100" },
    { label: "طلاب جدد", value: counts.students, icon: GraduationCap, color: "text-blue-600 bg-blue-100" },
    { label: "رسائل جديدة", value: counts.messages, icon: Mail, color: "text-pink-600 bg-pink-100" },
    { label: "مدرسين مخفيين", value: counts.hidden, icon: EyeOff, color: "text-gray-600 bg-gray-100" },
    { label: "المواد", value: subjects.length, icon: BookOpen, color: "text-indigo-600 bg-indigo-100" },
    { label: "المراحل", value: educationLevels.length, icon: TrendingUp, color: "text-purple-600 bg-purple-100" },
    { label: "الأماكن", value: locations.length, icon: MapPin, color: "text-teal-600 bg-teal-100" },
  ]

  return (
    <div className="space-y-6">
      <SeedBanner />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((i) => (
          <Card key={i.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${i.color}`}>
                <i.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{i.label}</p>
                <p className="text-2xl font-bold">{i.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
