"use client"

import { useCallback, useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs, updateDoc, writeBatch } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Pencil, Trash2, Phone, Mail, Loader2, Star, MessageCircle, ChevronDown } from "lucide-react"
import { db } from "@/lib/firebase"
import { useSiteData } from "@/lib/site-data"
import { isValidImageUrl } from "@/lib/applications"
import { waLink } from "@/lib/config"

interface AdminTeacher {
  id: string
  code?: string
  name: string
  image: string
  subjects: string[]
  educationLevel: string[]
  locations: string[]
  description: string
  teachingMethod: string
  rating: number
  reviewsCount: number
  status: "approved" | "hidden"
  featured: boolean
  qualification: string
  university: string
  experienceYears: number
  achievements: string
}

interface Priv {
  phone?: string
  email?: string
  hourlyPrice?: number
  availability?: string
  certificateUrl?: string
  socialUrl?: string
  currentWorkplace?: string
}

export function TeachersPanel() {
  const { subjects, educationLevels, locations, refresh } = useSiteData()
  const [teachers, setTeachers] = useState<AdminTeacher[]>([])
  const [priv, setPriv] = useState<Record<string, Priv>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [form, setForm] = useState<AdminTeacher | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [t, p] = await Promise.all([getDocs(collection(db, "teachers")), getDocs(collection(db, "teacherPrivate"))])
      setTeachers(
        t.docs.map((d) => {
          const x = d.data()
          return {
            id: d.id,
            code: x.code,
            name: x.name || "",
            image: x.image || "",
            subjects: x.subjects || [],
            educationLevel: x.educationLevel || [],
            locations: x.locations || [],
            description: x.description || "",
            teachingMethod: x.teachingMethod || "",
            rating: x.rating || 0,
            reviewsCount: x.reviewsCount || 0,
            status: x.status === "hidden" ? "hidden" : "approved",
            featured: !!x.featured,
            qualification: x.qualification || "",
            university: x.university || "",
            experienceYears: x.experienceYears || 0,
            achievements: x.achievements || "",
          } as AdminTeacher
        }),
      )
      const map: Record<string, Priv> = {}
      p.docs.forEach((d) => (map[d.id] = d.data() as Priv))
      setPriv(map)
    } catch (e) {
      console.error(e)
      alert("تعذر تحميل المدرسين")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleStatus = async (t: AdminTeacher) => {
    const status = t.status === "approved" ? "hidden" : "approved"
    await updateDoc(doc(db, "teachers", t.id), { status, isApproved: status === "approved" })
    setTeachers((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)))
    await refresh()
  }

  const toggleFeatured = async (t: AdminTeacher) => {
    const featured = !t.featured
    await updateDoc(doc(db, "teachers", t.id), { featured })
    setTeachers((prev) => prev.map((x) => (x.id === t.id ? { ...x, featured } : x)))
    await refresh()
  }

  const remove = async (t: AdminTeacher) => {
    if (!confirm(`حذف المدرس ${t.name} نهائياً؟`)) return
    const batch = writeBatch(db)
    batch.delete(doc(db, "teachers", t.id))
    batch.delete(doc(db, "teacherPrivate", t.id))
    await batch.commit()
    setTeachers((prev) => prev.filter((x) => x.id !== t.id))
    await refresh()
  }

  const toggleIn = (key: "subjects" | "educationLevel" | "locations", v: string, on: boolean) =>
    setForm((f) => (f ? { ...f, [key]: on ? [...f[key], v] : f[key].filter((x) => x !== v) } : f))

  const save = async () => {
    if (!form) return
    if (!isValidImageUrl(form.image)) return alert("رابط الصورة لازم يبدأ بـ https://")
    if (form.rating < 0 || form.rating > 5) return alert("التقييم من 0 لـ 5")
    setSaving(true)
    try {
      const onlineNames = locations.filter((l) => l.type === "online").map((l) => l.name)
      await updateDoc(doc(db, "teachers", form.id), {
        name: form.name.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
        teachingMethod: form.teachingMethod.trim(),
        subjects: form.subjects,
        educationLevel: form.educationLevel,
        locations: form.locations,
        qualification: form.qualification.trim(),
        university: form.university.trim(),
        experienceYears: Number(form.experienceYears) || 0,
        achievements: form.achievements.trim(),
        rating: Number(form.rating),
        reviewsCount: Number(form.reviewsCount),
        isOnline: form.locations.some((l) => onlineNames.includes(l)),
      })
      setTeachers((prev) => prev.map((x) => (x.id === form.id ? form : x)))
      setEditId(null)
      await refresh()
    } catch (e) {
      console.error(e)
      alert("فشل الحفظ")
    } finally {
      setSaving(false)
    }
  }

  const visible = teachers.filter(
    (t) => t.name.includes(search.trim()) || (t.code || "").toLowerCase().includes(search.trim().toLowerCase()),
  )

  if (loading)
    return (
      <p className="flex items-center gap-2 text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" /> جاري التحميل...
      </p>
    )

  return (
    <div className="space-y-4">
      <Input placeholder="ابحث بالاسم أو الكود..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {visible.length === 0 && <p className="text-gray-500">مفيش مدرسين. اقبل طلب من تاب "طلبات الانضمام".</p>}

      {visible.map((t) => (
        <Card key={t.id}>
          <button
            type="button"
            onClick={() => setOpenId(openId === t.id ? null : t.id)}
            className="flex w-full items-center gap-3 p-4 text-right"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.image || "/placeholder-user.jpg"}
              alt={t.name}
              className="h-12 w-12 shrink-0 rounded-full object-cover border bg-gray-100"
              onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder-user.jpg")}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{t.name}</span>
                {t.code && <Badge>{t.code}</Badge>}
                <Badge variant={t.status === "approved" ? "secondary" : "destructive"}>
                  {t.status === "approved" ? "ظاهر" : "مخفي"}
                </Badge>
                {t.featured && <Badge className="bg-amber-500 hover:bg-amber-500">⭐ مميز</Badge>}
              </div>
              <p className="truncate text-sm text-gray-500">{t.subjects.join("، ")}</p>
            </div>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${openId === t.id ? "rotate-180" : ""}`}
            />
          </button>
          {openId === t.id && (
          <CardContent className="border-t p-4 md:p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image || "/placeholder-user.jpg"}
                  alt={t.name}
                  className="h-20 w-20 shrink-0 rounded-full object-cover border bg-gray-100"
                  onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder-user.jpg")}
                />
                <div className="min-w-0 space-y-1 break-words">
                  {priv[t.id]?.phone && (
                    <p className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                      <Phone className="h-4 w-4" /> {priv[t.id].phone}
                    </p>
                  )}
                  {priv[t.id]?.email && (
                    <p className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                      <Mail className="h-4 w-4" /> {priv[t.id].email}
                    </p>
                  )}
                  {priv[t.id] && (
                    <div className="text-xs text-gray-500 space-y-0.5 pt-1">
                      {priv[t.id].hourlyPrice ? <p>سعر الساعة: {priv[t.id].hourlyPrice} جنيه</p> : null}
                      {priv[t.id].availability && <p>المواعيد: {priv[t.id].availability}</p>}
                      {priv[t.id].currentWorkplace && <p>مكان العمل: {priv[t.id].currentWorkplace}</p>}
                      <p className="flex gap-3">
                        {priv[t.id].certificateUrl && (
                          <a href={priv[t.id].certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            الشهادة
                          </a>
                        )}
                        {priv[t.id].socialUrl && (
                          <a href={priv[t.id].socialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            الحساب
                          </a>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {priv[t.id]?.phone && (
                  <a
                    href={waLink(priv[t.id].phone as string, `مرحباً أستاذ ${t.name}، معاك من منصة المدرسين.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <MessageCircle className="ml-1 h-4 w-4" /> واتساب
                    </Button>
                  </a>
                )}
                <Button
                  size="sm"
                  variant={t.featured ? "default" : "outline"}
                  className={t.featured ? "bg-amber-500 hover:bg-amber-600" : ""}
                  onClick={() => toggleFeatured(t)}
                >
                  <Star className="ml-1 h-4 w-4" /> {t.featured ? "إلغاء التمييز" : "تمييز"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditId(editId === t.id ? null : t.id)
                    setForm(t)
                  }}
                >
                  <Pencil className="ml-1 h-4 w-4" /> تعديل
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleStatus(t)}>
                  {t.status === "approved" ? (
                    <>
                      <EyeOff className="ml-1 h-4 w-4" /> إخفاء
                    </>
                  ) : (
                    <>
                      <Eye className="ml-1 h-4 w-4" /> إظهار
                    </>
                  )}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(t)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {editId === t.id && form && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>الاسم</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>رابط الصورة</Label>
                    <Input dir="ltr" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                  </div>
                  <div>
                    <Label>التقييم (0-5)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>المؤهل</Label>
                    <Input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
                  </div>
                  <div>
                    <Label>الجامعة / التخصص</Label>
                    <Input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
                  </div>
                  <div>
                    <Label>سنين الخبرة</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.experienceYears}
                      onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>عدد التقييمات</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.reviewsCount}
                      onChange={(e) => setForm({ ...form, reviewsCount: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>نبذة</Label>
                  <Textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>طريقة التدريس</Label>
                  <Textarea
                    rows={2}
                    value={form.teachingMethod}
                    onChange={(e) => setForm({ ...form, teachingMethod: e.target.value })}
                  />
                </div>

                {(
                  [
                    ["المواد", "subjects", subjects.map((s) => s.name)],
                    ["المراحل", "educationLevel", educationLevels.map((l) => l.name)],
                    ["الأماكن", "locations", locations.map((l) => l.name)],
                  ] as const
                ).map(([label, key, options]) => (
                  <div key={key}>
                    <Label className="font-semibold">{label}</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {options.map((o) => (
                        <div key={o} className="flex items-center gap-2">
                          <Checkbox
                            id={`${t.id}-${key}-${o}`}
                            checked={form[key].includes(o)}
                            onCheckedChange={(c) => toggleIn(key, o, !!c)}
                          />
                          <Label htmlFor={`${t.id}-${key}-${o}`} className="text-sm">
                            {o}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button onClick={save} disabled={saving}>
                    {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
                  </Button>
                  <Button variant="ghost" onClick={() => setEditId(null)}>
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
