"use client"

import { useCallback, useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MessageCircle, Phone, Trash2, Gift, ChevronDown } from "lucide-react"
import { db } from "@/lib/firebase"
import { waLink, SITE_NAME } from "@/lib/config"

type Status = "new" | "contacted" | "matched" | "started" | "closed"

interface Student {
  id: string
  name: string
  phone: string
  role: "student" | "parent"
  level: string
  subjects: string[]
  area: string
  preferredTimes: string
  notes: string
  teacherCode: string
  couponCode: string
  discountPercent: number
  offerUsed: boolean
  adminNotes: string
  status: Status
  createdAt?: { toDate: () => Date }
}

const statusLabels: Record<Status, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  matched: "تم ترشيح مدرس",
  started: "بدأ الحصص",
  closed: "مغلق",
}

export function StudentsPanel() {
  const [items, setItems] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Status | "all">("new")
  const [search, setSearch] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, "students"), orderBy("createdAt", "desc")))
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Student, "id">) })))
    } catch (e) {
      console.error(e)
      alert("تعذر تحميل الطلاب. اتأكد من نشر القواعد الجديدة.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const patch = async (id: string, data: Partial<Student>) => {
    await updateDoc(doc(db, "students", id), data)
    setItems((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)))
  }

  const remove = async (s: Student) => {
    if (!confirm(`حذف بيانات ${s.name}؟`)) return
    await deleteDoc(doc(db, "students", s.id))
    setItems((p) => p.filter((x) => x.id !== s.id))
  }

  const q = search.trim().toLowerCase()
  const visible = items.filter(
    (s) =>
      (filter === "all" || s.status === filter) &&
      (!q || s.name.toLowerCase().includes(q) || s.phone.includes(q) || (s.couponCode || "").toLowerCase().includes(q)),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["new", "contacted", "matched", "started", "closed"] as Status[]).map((st) => (
          <Button key={st} size="sm" variant={filter === st ? "default" : "outline"} onClick={() => setFilter(st)}>
            {statusLabels[st]} ({items.filter((i) => i.status === st).length})
          </Button>
        ))}
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          الكل ({items.length})
        </Button>
        <Button size="sm" variant="ghost" onClick={load}>
          تحديث
        </Button>
      </div>
      <Input placeholder="ابحث بالاسم أو الرقم أو كود العرض..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading && (
        <p className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" /> جاري التحميل...
        </p>
      )}
      {!loading && visible.length === 0 && <p className="text-gray-500">مفيش طلاب هنا.</p>}

      {visible.map((s) => (
        <Card key={s.id}>
          <button
            type="button"
            onClick={() => setOpenId(openId === s.id ? null : s.id)}
            className="flex w-full items-center gap-3 p-4 text-right"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{s.name}</span>
                <Badge variant="secondary">{s.role === "parent" ? "ولي أمر" : "طالب"}</Badge>
                <Badge>{statusLabels[s.status]}</Badge>
                {!s.offerUsed && <Badge className="bg-green-600 hover:bg-green-600">🎁 عرض متاح</Badge>}
              </div>
              <p className="truncate text-sm text-gray-500">
                {s.level} - {s.subjects?.join("، ")}
              </p>
            </div>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${openId === s.id ? "rotate-180" : ""}`}
            />
          </button>
          {openId === s.id && (
          <CardContent className="border-t p-4 md:p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                  <Phone className="h-4 w-4" /> {s.phone}
                </p>
                {s.createdAt?.toDate && (
                  <p className="text-xs text-gray-400">{s.createdAt.toDate().toLocaleString("ar-EG")}</p>
                )}
              </div>

              <div className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm">
                <p className="flex items-center gap-1 font-semibold text-green-800">
                  <Gift className="h-4 w-4" /> <span dir="ltr">{s.couponCode}</span>
                </p>
                <p className="text-green-700">حصة مجانية + خصم {s.discountPercent}%</p>
                <label className="mt-1 flex items-center gap-2 text-green-900">
                  <input
                    type="checkbox"
                    checked={s.offerUsed}
                    onChange={(e) => patch(s.id, { offerUsed: e.target.checked })}
                  />
                  تم استخدام العرض
                </label>
              </div>
            </div>

            <div className="grid gap-1 text-sm">
              <p>
                <strong>المرحلة:</strong> {s.level}
              </p>
              <p>
                <strong>المواد:</strong> {s.subjects?.join("، ")}
              </p>
              <p>
                <strong>المكان:</strong> {s.area}
              </p>
              {s.preferredTimes && (
                <p>
                  <strong>المواعيد:</strong> {s.preferredTimes}
                </p>
              )}
              {s.teacherCode && (
                <p>
                  <strong>مهتم بمدرس كود:</strong> <span dir="ltr">{s.teacherCode}</span>
                </p>
              )}
              {s.notes && (
                <p>
                  <strong>ملاحظات الطالب:</strong> {s.notes}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-1">ملاحظاتك الخاصة</p>
              <Textarea
                rows={2}
                defaultValue={s.adminNotes}
                onBlur={(e) => e.target.value !== s.adminNotes && patch(s.id, { adminNotes: e.target.value })}
                placeholder="اكتب ملاحظاتك (بتتحفظ تلقائي لما تطلع من الخانة)"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                className="border rounded-md px-3 py-2 bg-white text-sm"
                value={s.status}
                onChange={(e) => patch(s.id, { status: e.target.value as Status })}
              >
                {(Object.keys(statusLabels) as Status[]).map((st) => (
                  <option key={st} value={st}>
                    {statusLabels[st]}
                  </option>
                ))}
              </select>
              <a
                href={waLink(
                  s.phone,
                  `مرحباً ${s.name}، معاك من ${SITE_NAME}. شفنا طلبك (${s.subjects?.join("، ")} - ${s.level}) وكود العرض بتاعك ${s.couponCode}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <MessageCircle className="ml-1 h-4 w-4" /> واتساب
                </Button>
              </a>
              <Button size="sm" variant="destructive" onClick={() => remove(s)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
