"use client"

import { SiteNavbar } from "@/components/site-navbar"
import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, CheckCircle, AlertCircle, Loader2, Gift, MessageCircle } from "lucide-react"
import { useSiteData } from "@/lib/site-data"
import { submitStudent } from "@/lib/forms"
import { isValidEgyptPhone, normalizePhone } from "@/lib/applications"
import { OFFER, ownerWhatsappLink, SITE_NAME } from "@/lib/config"

export default function RegisterStudentPage() {
  const { subjects, educationLevels, locations } = useSiteData()
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "student" as "student" | "parent",
    level: "",
    subjects: [] as string[],
    area: "",
    preferredTimes: "",
    notes: "",
    teacherCode: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [coupon, setCoupon] = useState("")

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("teacher")
    if (t) setForm((f) => ({ ...f, teacherCode: t }))
  }, [])

  const levelSubjects = subjects.filter((s) => !form.level || s.educationLevels.includes(form.level))

  const toggleSubject = (name: string, on: boolean) =>
    setForm((f) => ({ ...f, subjects: on ? [...f.subjects, name] : f.subjects.filter((x) => x !== name) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!isValidEgyptPhone(form.phone)) return setError("رقم الموبايل لازم يكون 11 رقم صحيح (مثال: 01012345678)")
    if (!form.level) return setError("اختار المرحلة الدراسية")
    if (form.subjects.length === 0) return setError("اختار مادة واحدة على الأقل")
    if (!form.area) return setError("اختار المكان أو أونلاين")

    setSubmitting(true)
    try {
      const code = await submitStudent({ ...form, phone: normalizePhone(form.phone) }, OFFER.discountPercent)
      setCoupon(code)
    } catch (err) {
      console.error(err)
      setError("حصلت مشكلة أثناء الإرسال، حاول مرة تانية")
    } finally {
      setSubmitting(false)
    }
  }

  if (coupon) {
    const msg = `مرحباً، أنا ${form.name} وسجلت على المنصة. كود العرض بتاعي ${coupon}، وعايز أحجز الحصة المجانية.`
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">تم تسجيل بياناتك!</h2>
            <p className="text-gray-600">هنتواصل معاك قريب جداً علشان نرشحلك المدرس المناسب.</p>
            <div className="rounded-xl border-2 border-dashed border-green-400 bg-green-50 p-4">
              <p className="text-sm text-green-800 mb-1">كود العرض بتاعك</p>
              <p className="text-2xl font-bold tracking-wider text-green-700" dir="ltr">
                {coupon}
              </p>
              <p className="text-sm text-green-800 mt-2">
                {OFFER.freeLesson ? "حصة مجانية + " : ""}خصم {OFFER.discountPercent}%
              </p>
            </div>
            <a href={ownerWhatsappLink(msg)} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                <MessageCircle className="ml-2 h-4 w-4" />
                كلمنا على الواتساب دلوقتي
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" className="w-full">
                العودة للرئيسية
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <SiteNavbar />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white mb-8 text-center">
          <Gift className="h-10 w-10 mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-1">{OFFER.title}</h2>
          <p>
            سجّل بياناتك واحصل على {OFFER.freeLesson ? "حصة مجانية + " : ""}خصم {OFFER.discountPercent}%
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>بياناتك</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الموبايل (واتساب) *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={11}
                    placeholder="01xxxxxxxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>أنا *</Label>
                <div className="mt-2 flex gap-6">
                  {(
                    [
                      ["student", "طالب"],
                      ["parent", "ولي أمر"],
                    ] as const
                  ).map(([v, l]) => (
                    <label key={v} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="role"
                        checked={form.role === v}
                        onChange={() => setForm({ ...form, role: v })}
                      />
                      {l}
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إيه اللي محتاجه؟</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="level">المرحلة الدراسية *</Label>
                <select
                  id="level"
                  className="mt-1 w-full border rounded-md px-3 py-2 bg-white text-sm"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value, subjects: [] })}
                  required
                >
                  <option value="">اختر المرحلة</option>
                  {educationLevels.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>المواد المطلوبة *</Label>
                {!form.level && <p className="text-sm text-gray-500 mt-1">اختار المرحلة الأول</p>}
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {form.level &&
                    levelSubjects.map((s) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`sub-${s.id}`}
                          checked={form.subjects.includes(s.name)}
                          onCheckedChange={(c) => toggleSubject(s.name, !!c)}
                        />
                        <Label htmlFor={`sub-${s.id}`} className="text-sm">
                          {s.name}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <Label htmlFor="area">المكان *</Label>
                <select
                  id="area"
                  className="mt-1 w-full border rounded-md px-3 py-2 bg-white text-sm"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  required
                >
                  <option value="">اختر المكان أو أونلاين</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="times">المواعيد المناسبة</Label>
                <Input
                  id="times"
                  placeholder="مثال: بعد الساعة 5 مساءً، الجمعة والسبت"
                  value={form.preferredTimes}
                  onChange={(e) => setForm({ ...form, preferredTimes: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="مستوى الطالب، مشاكل معينة، طلبات خاصة..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {form.teacherCode && (
                <p className="text-sm text-blue-700 bg-blue-50 rounded-md p-3">
                  مهتم بالمدرس صاحب الكود: <strong dir="ltr">{form.teacherCode}</strong>
                </p>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإرسال...
              </>
            ) : (
              "سجّل واحصل على العرض"
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center">بياناتك بتظهر لإدارة المنصة بس ومش بتتنشر.</p>
        </form>
      </div>
    </div>
  )
}
