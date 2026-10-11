"use client"

import { SITE_NAME } from "@/lib/config"
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, ImageIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSiteData } from "@/lib/site-data"
import { submitApplication, isValidImageUrl, isValidEgyptPhone, isFullName } from "@/lib/applications"

export default function RegisterTeacherPage() {
  const { subjects, educationLevels, locations } = useSiteData()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subjects: [] as string[],
    educationLevels: [] as string[],
    locations: [] as string[],
    description: "",
    teachingMethod: "",
    image: "",
    gender: "",
    qualification: "",
    university: "",
    experienceYears: 0,
    currentWorkplace: "",
    hourlyPrice: 0,
    availability: "",
    achievements: "",
    certificateUrl: "",
    socialUrl: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [imageFailed, setImageFailed] = useState(false)

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, subject],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        subjects: prev.subjects.filter((s) => s !== subject),
      }))
    }
  }

  const handleLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        educationLevels: [...prev.educationLevels, level],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        educationLevels: prev.educationLevels.filter((l) => l !== level),
      }))
    }
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        locations: [...prev.locations, location],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        locations: prev.locations.filter((l) => l !== location),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isFullName(formData.name)) {
      setError("اكتب الاسم ثلاثي (الاسم الأول واسم الأب واسم الجد)")
      return
    }
    if (!isValidEgyptPhone(formData.phone)) {
      setError("رقم الهاتف لازم يكون 11 رقم صحيح ويبدأ بـ 010 أو 011 أو 012 أو 015")
      return
    }
    if (formData.subjects.length === 0 || formData.educationLevels.length === 0 || formData.locations.length === 0) {
      setError("من فضلك اختر مادة ومرحلة ومكان واحد على الأقل")
      return
    }
    if (!isValidImageUrl(formData.image)) {
      setError("رابط الصورة لازم يكون رابط مباشر يبدأ بـ https://")
      return
    }
    if (!formData.gender || !formData.qualification || !formData.university.trim() || !formData.availability.trim()) {
      setError("من فضلك كمّل بيانات التحقق (النوع والمؤهل والجامعة والمواعيد)")
      return
    }
    if (formData.certificateUrl && !isValidImageUrl(formData.certificateUrl)) {
      setError("رابط الشهادة لازم يبدأ بـ https://")
      return
    }
    if (formData.socialUrl && !isValidImageUrl(formData.socialUrl)) {
      setError("رابط الحساب لازم يبدأ بـ https://")
      return
    }
    if (!agreed) {
      setError("لازم توافق على الشروط قبل الإرسال")
      return
    }

    setIsSubmitting(true)
    try {
      await submitApplication(formData)
      setIsSubmitted(true)
    } catch (err) {
      console.error(err)
      setError("حصلت مشكلة أثناء الإرسال، حاول مرة تانية")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">تم إرسال طلبك بنجاح!</h2>
            <p className="text-gray-600 mb-6">شكراً لك على التسجيل. سيتم مراجعة طلبك والتواصل معك خلال 24-48 ساعة.</p>
            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full">العودة للرئيسية</Button>
              </Link>
              <Link href="/teachers">
                <Button variant="outline" className="w-full">
                  تصفح المدرسين
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4 space-x-reverse">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{SITE_NAME}</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                الرئيسية
              </Link>
              <Link href="/teachers" className="text-gray-700 hover:text-blue-600">
                المدرسين
              </Link>
              <Link href="/subjects" className="text-gray-700 hover:text-blue-600">
                المواد
              </Link>
              <Link href="/levels" className="text-gray-700 hover:text-blue-600">
                المراحل
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                تواصل معنا
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">انضم كمدرس</h2>
            <p className="text-gray-600">املأ النموذج التالي للانضمام إلى منصتنا وابدأ في تدريس الطلاب</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">الاسم الثلاثي *</Label>
                    <Input
                      id="name"
                      placeholder="مثال: أحمد محمد علي"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      dir="ltr"
                      maxLength={11}
                      placeholder="01xxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 11) }))
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">الصورة الشخصية</Label>
                  <Input
                    id="image"
                    type="url"
                    dir="ltr"
                    placeholder="https://i.ibb.co/xxxxxx/photo.jpg"
                    value={formData.image}
                    onChange={(e) => {
                      setImageFailed(false)
                      setFormData((prev) => ({ ...prev, image: e.target.value }))
                    }}
                    required
                  />

                  {formData.image && isValidImageUrl(formData.image) && (
                    <div className="mt-3 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.image}
                        alt="معاينة الصورة"
                        className="h-20 w-20 rounded-full object-cover border"
                        onError={() => setImageFailed(true)}
                        onLoad={() => setImageFailed(false)}
                      />
                      {imageFailed && (
                        <p className="text-sm text-red-600">
                          الرابط ده مش بيعرض صورة. تأكد إنه رابط مباشر ينتهي بـ .jpg أو .png
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      إزاي تجيب رابط الصورة؟
                    </p>
                    <ol className="list-decimal pr-5 space-y-1">
                      <li>
                        افتح موقع{" "}
                        <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline font-medium" dir="ltr">
                          imgbb.com
                        </a>{" "}
                        واضغط <strong>Start uploading</strong>.
                      </li>
                      <li>اختار صورتك من الموبايل أو الكمبيوتر وارفعها.</li>
                      <li>بعد الرفع اضغط <strong>Upload</strong> لو ظهر لك زرار.</li>
                      <li>
                        من القائمة اللي جنب <strong>Embed codes</strong> اختار <strong>Direct links</strong>.
                      </li>
                      <li>انسخ الرابط (بينتهي بـ .jpg أو .png) والصقه في الخانة اللي فوق.</li>
                    </ol>
                    <p className="text-blue-800">
                      ⚠️ لا تستخدم رابط جوجل درايف أو إنستجرام، لأنهم مش بيشتغلوا كرابط مباشر للصورة.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Information */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات التدريس</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-semibold">المواد الدراسية *</Label>
                  <p className="text-sm text-gray-600 mb-3">اختر المواد التي تدرسها</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`subject-${subject.id}`}
                          checked={formData.subjects.includes(subject.name)}
                          onCheckedChange={(checked) => handleSubjectChange(subject.name, checked as boolean)}
                        />
                        <Label htmlFor={`subject-${subject.id}`} className="text-sm">
                          {subject.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">المراحل التعليمية *</Label>
                  <p className="text-sm text-gray-600 mb-3">اختر المراحل التي تدرس لها</p>
                  <div className="space-y-2">
                    {educationLevels.map((level) => (
                      <div key={level.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`level-${level.id}`}
                          checked={formData.educationLevels.includes(level.name)}
                          onCheckedChange={(checked) => handleLevelChange(level.name, checked as boolean)}
                        />
                        <Label htmlFor={`level-${level.id}`} className="text-sm">
                          {level.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">أماكن التدريس *</Label>
                  <p className="text-sm text-gray-600 mb-3">اختر الأماكن المتاحة للتدريس</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {locations.map((location) => (
                      <div key={location.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`location-${location.id}`}
                          checked={formData.locations.includes(location.name)}
                          onCheckedChange={(checked) => handleLocationChange(location.name, checked as boolean)}
                        />
                        <Label htmlFor={`location-${location.id}`} className="text-sm">
                          {location.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {/* بيانات التحقق */}
            <Card>
              <CardHeader>
                <CardTitle>بيانات التحقق من الخبرة</CardTitle>
                <p className="text-sm text-gray-500">
                  البيانات دي بتساعدنا نتأكد من مستواك. الراتب والروابط الخاصة بتظهر للإدارة بس.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">النوع *</Label>
                    <select
                      id="gender"
                      className="mt-1 w-full border rounded-md px-3 py-2 bg-white text-sm"
                      value={formData.gender}
                      onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value }))}
                      required
                    >
                      <option value="">اختر</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="qualification">المؤهل الدراسي *</Label>
                    <select
                      id="qualification"
                      className="mt-1 w-full border rounded-md px-3 py-2 bg-white text-sm"
                      value={formData.qualification}
                      onChange={(e) => setFormData((p) => ({ ...p, qualification: e.target.value }))}
                      required
                    >
                      <option value="">اختر</option>
                      <option value="طالب جامعي">طالب جامعي</option>
                      <option value="بكالوريوس / ليسانس">بكالوريوس / ليسانس</option>
                      <option value="دبلومة">دبلومة</option>
                      <option value="ماجستير">ماجستير</option>
                      <option value="دكتوراه">دكتوراه</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="university">الجامعة / الكلية والتخصص *</Label>
                    <Input
                      id="university"
                      placeholder="مثال: كلية العلوم - جامعة القاهرة - رياضيات"
                      value={formData.university}
                      onChange={(e) => setFormData((p) => ({ ...p, university: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="experienceYears">سنين الخبرة في التدريس *</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min={0}
                      max={60}
                      value={formData.experienceYears}
                      onChange={(e) => setFormData((p) => ({ ...p, experienceYears: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentWorkplace">مكان العمل الحالي (مدرسة / سنتر)</Label>
                    <Input
                      id="currentWorkplace"
                      value={formData.currentWorkplace}
                      onChange={(e) => setFormData((p) => ({ ...p, currentWorkplace: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyPrice">سعر الساعة المتوقع (جنيه)</Label>
                    <Input
                      id="hourlyPrice"
                      type="number"
                      min={0}
                      value={formData.hourlyPrice}
                      onChange={(e) => setFormData((p) => ({ ...p, hourlyPrice: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="availability">الأيام والمواعيد المتاحة *</Label>
                  <Input
                    id="availability"
                    placeholder="مثال: السبت والاثنين والأربعاء من 4 العصر لـ 9 المغرب"
                    value={formData.availability}
                    onChange={(e) => setFormData((p) => ({ ...p, availability: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="achievements">إنجازات ونتائج طلابك (اختياري)</Label>
                  <Textarea
                    id="achievements"
                    rows={3}
                    placeholder="مثال: 90% من طلابي حصلوا على درجات فوق 85%"
                    value={formData.achievements}
                    onChange={(e) => setFormData((p) => ({ ...p, achievements: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="certificateUrl">رابط صورة الشهادة أو الكارنيه (اختياري)</Label>
                    <Input
                      id="certificateUrl"
                      type="url"
                      dir="ltr"
                      placeholder="https://i.ibb.co/..."
                      value={formData.certificateUrl}
                      onChange={(e) => setFormData((p) => ({ ...p, certificateUrl: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="socialUrl">رابط فيسبوك / لينكدإن / يوتيوب (اختياري)</Label>
                    <Input
                      id="socialUrl"
                      type="url"
                      dir="ltr"
                      placeholder="https://facebook.com/..."
                      value={formData.socialUrl}
                      onChange={(e) => setFormData((p) => ({ ...p, socialUrl: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>نبذة عنك وطريقة التدريس</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">نبذة مختصرة عنك *</Label>
                  <Textarea
                    id="description"
                    placeholder="اكتب نبذة مختصرة عن خبرتك ومؤهلاتك..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="teachingMethod">طريقة التدريس *</Label>
                  <Textarea
                    id="teachingMethod"
                    placeholder="اشرح طريقتك في التدريس وكيف تساعد الطلاب على الفهم..."
                    value={formData.teachingMethod}
                    onChange={(e) => setFormData((prev) => ({ ...prev, teachingMethod: e.target.value }))}
                    required
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox id="agree" checked={agreed} onCheckedChange={(c) => setAgreed(c as boolean)} />
                  <Label htmlFor="agree" className="text-sm leading-6">
                    أوافق إن التواصل مع الطلاب وأولياء الأمور بيتم من خلال إدارة المنصة، وإني مش هتواصل معاهم
                    مباشرة خارجها، وإن بياناتي (الرقم والإيميل) متظهرش للعامة.
                  </Label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <Button type="submit" size="lg" className="px-12" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال الطلب"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
