"use client"

import { useCallback, useEffect, useState } from "react"
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Loader2, Phone, Mail, MessageCircle, ChevronDown } from "lucide-react"
import { db } from "@/lib/firebase"
import { isValidImageUrl } from "@/lib/applications"
import { useSiteData } from "@/lib/site-data"
import { waLink, SITE_NAME } from "@/lib/config"

type Status = "pending" | "approved" | "rejected"

interface Application {
  id: string
  name: string
  phone: string
  email: string
  subjects: string[]
  educationLevels: string[]
  locations: string[]
  description: string
  teachingMethod: string
  image: string
  gender?: string
  qualification?: string
  university?: string
  experienceYears?: number
  currentWorkplace?: string
  hourlyPrice?: number
  availability?: string
  achievements?: string
  certificateUrl?: string
  socialUrl?: string
  status: Status
  teacherCode?: string
  submittedAt?: { toDate: () => Date }
}

const statusLabels: Record<Status, string> = {
  pending: "قيد المراجعة",
  approved: "تم القبول",
  rejected: "مرفوض",
}

export function ApplicationsPanel() {
  const { locations, refresh } = useSiteData()
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<Status>("pending")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [imageEdits, setImageEdits] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const snap = await getDocs(query(collection(db, "applications"), orderBy("submittedAt", "desc")))
      setApps(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Application, "id">) })))
    } catch (e) {
      console.error(e)
      setError("تعذر تحميل الطلبات. تأكد من تسجيل الدخول ومن قواعد Firestore.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const approve = async (app: Application) => {
    const image = (imageEdits[app.id] ?? app.image).trim()
    if (!isValidImageUrl(image)) {
      alert("رابط الصورة غير صالح (لازم يبدأ بـ https://)")
      return
    }
    setBusyId(app.id)
    try {
      const counterRef = doc(db, "meta", "counters")
      const appRef = doc(db, "applications", app.id)

      const code = await runTransaction(db, async (tx) => {
        const counterSnap = await tx.get(counterRef)
        const next = (counterSnap.exists() ? (counterSnap.data().teacher as number) : 100) + 1
        const teacherId = String(next)
        const teacherCode = `T-${String(next).padStart(4, "0")}`

        // بيانات عامة (بدون رقم أو إيميل)
        tx.set(doc(db, "teachers", teacherId), {
          id: teacherId,
          code: teacherCode,
          name: app.name,
          image,
          subjects: app.subjects,
          educationLevel: app.educationLevels,
          locations: app.locations,
          description: app.description,
          teachingMethod: app.teachingMethod,
          rating: 0,
          reviewsCount: 0,
          isOnline: app.locations.some((n) => locations.find((l) => l.name === n)?.type === "online"),
          isApproved: true,
          featured: false,
          gender: app.gender || "",
          qualification: app.qualification || "",
          university: app.university || "",
          experienceYears: app.experienceYears || 0,
          achievements: app.achievements || "",
          status: "approved",
          joinDate: new Date().toISOString().slice(0, 10),
        })

        // بيانات خاصة للأدمن فقط
        tx.set(doc(db, "teacherPrivate", teacherId), {
          phone: app.phone,
          email: app.email,
          hourlyPrice: app.hourlyPrice || 0,
          availability: app.availability || "",
          currentWorkplace: app.currentWorkplace || "",
          certificateUrl: app.certificateUrl || "",
          socialUrl: app.socialUrl || "",
          applicationId: app.id,
        })

        tx.set(counterRef, { teacher: next }, { merge: true })
        tx.update(appRef, { status: "approved", teacherCode, image, reviewedAt: serverTimestamp() })
        return teacherCode
      })

      setApps((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: "approved", teacherCode: code, image } : a)),
      )
      await refresh()
    } catch (e) {
      console.error(e)
      alert("حصل خطأ أثناء القبول")
    } finally {
      setBusyId(null)
    }
  }

  const reject = async (app: Application) => {
    if (!confirm(`رفض طلب ${app.name}؟`)) return
    setBusyId(app.id)
    try {
      await updateDoc(doc(db, "applications", app.id), { status: "rejected", reviewedAt: serverTimestamp() })
      setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: "rejected" } : a)))
    } catch (e) {
      console.error(e)
      alert("حصل خطأ أثناء الرفض")
    } finally {
      setBusyId(null)
    }
  }

  const visible = apps.filter((a) => a.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["pending", "approved", "rejected"] as Status[]).map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
            {statusLabels[s]} ({apps.filter((a) => a.status === s).length})
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={load}>
          تحديث
        </Button>
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" /> جاري التحميل...
        </p>
      )}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && visible.length === 0 && <p className="text-gray-500">مفيش طلبات هنا.</p>}

      {visible.map((app) => {
        const image = imageEdits[app.id] ?? app.image
        return (
          <Card key={app.id}>
            <button
              type="button"
              onClick={() => setOpenId(openId === app.id ? null : app.id)}
              className="flex w-full items-center gap-3 p-4 text-right"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image || "/placeholder-user.jpg"}
                alt={app.name}
                className="h-12 w-12 shrink-0 rounded-full object-cover border bg-gray-100"
                onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder-user.jpg")}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold">{app.name}</span>
                  <Badge variant="secondary">{statusLabels[app.status]}</Badge>
                  {app.teacherCode && <Badge>{app.teacherCode}</Badge>}
                </div>
                <p className="truncate text-sm text-gray-500">{app.subjects?.join("، ")}</p>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${openId === app.id ? "rotate-180" : ""}`}
              />
            </button>
            {openId === app.id && (
            <CardContent className="border-t p-4 md:p-6 space-y-4">
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image || "/placeholder-user.jpg"}
                  alt={app.name}
                  className="h-20 w-20 shrink-0 rounded-full object-cover border bg-gray-100"
                  onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder-user.jpg")}
                />
                <div className="min-w-0 flex-1 space-y-1 break-words">
                  <p className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                    <Phone className="h-4 w-4" /> {app.phone}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                    <Mail className="h-4 w-4" /> {app.email}
                  </p>
                  {app.submittedAt?.toDate && (
                    <p className="text-xs text-gray-400">{app.submittedAt.toDate().toLocaleString("ar-EG")}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2 text-sm">
                <p>
                  <strong>المواد:</strong> {app.subjects?.join("، ")}
                </p>
                <p>
                  <strong>المراحل:</strong> {app.educationLevels?.join("، ")}
                </p>
                <p>
                  <strong>الأماكن:</strong> {app.locations?.join("، ")}
                </p>
                <p>
                  <strong>نبذة:</strong> {app.description}
                </p>
                <p>
                  <strong>طريقة التدريس:</strong> {app.teachingMethod}
                </p>
                <div className="mt-2 rounded-md border bg-gray-50 p-3 space-y-1">
                  <p className="font-semibold">بيانات التحقق</p>
                  {app.gender && <p>النوع: {app.gender}</p>}
                  {app.qualification && <p>المؤهل: {app.qualification}</p>}
                  {app.university && <p>الجامعة / التخصص: {app.university}</p>}
                  <p>سنين الخبرة: {app.experienceYears ?? 0}</p>
                  {app.currentWorkplace && <p>مكان العمل: {app.currentWorkplace}</p>}
                  {app.hourlyPrice ? <p>سعر الساعة: {app.hourlyPrice} جنيه</p> : null}
                  {app.availability && <p>المواعيد: {app.availability}</p>}
                  {app.achievements && <p>إنجازات: {app.achievements}</p>}
                  <p className="flex gap-4">
                    {app.certificateUrl && (
                      <a href={app.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        الشهادة / الكارنيه
                      </a>
                    )}
                    {app.socialUrl && (
                      <a href={app.socialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        الحساب الشخصي
                      </a>
                    )}
                  </p>
                </div>
                <div>
                  <a
                    href={waLink(app.phone, `مرحباً أستاذ ${app.name}، معاك من ${SITE_NAME} بخصوص طلب انضمامك.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <MessageCircle className="ml-1 h-4 w-4" /> واتساب
                    </Button>
                  </a>
                </div>
              </div>

              {app.status === "pending" && (
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <p className="text-sm font-medium mb-1">رابط الصورة (تقدر تعدله قبل القبول)</p>
                    <Input
                      dir="ltr"
                      value={image}
                      onChange={(e) => setImageEdits((prev) => ({ ...prev, [app.id]: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      disabled={busyId === app.id}
                      onClick={() => approve(app)}
                    >
                      <CheckCircle className="ml-2 h-4 w-4" /> قبول
                    </Button>
                    <Button variant="destructive" disabled={busyId === app.id} onClick={() => reject(app)}>
                      <XCircle className="ml-2 h-4 w-4" /> رفض
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
