"use client"

import type React from "react"
import { ownerWhatsappLink } from "@/lib/config"
import { submitContactMessage } from "@/lib/forms"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendError("")
    setIsSending(true)
    try {
      await submitContactMessage(formData)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setIsSubmitted(true)
    } catch (err) {
      console.error(err)
      setSendError("حصلت مشكلة أثناء الإرسال، حاول مرة تانية أو كلمنا على واتساب")
    } finally {
      setIsSending(false)
    }
  }

  const handleWhatsApp = () => {
    const message = "مرحباً، أريد الاستفسار عن منصة المدرسين"
    const whatsappUrl = ownerWhatsappLink(message)
    window.open(whatsappUrl, "_blank")
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">تم إرسال رسالتك بنجاح!</h2>
            <p className="text-gray-600 mb-6">شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.</p>
            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full">العودة للرئيسية</Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                إرسال رسالة أخرى
              </Button>
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
              <h1 className="text-2xl font-bold text-gray-900">منصة المدرسين</h1>
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
              <Link href="/contact" className="text-blue-600 font-semibold">
                تواصل معنا
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">تواصل معنا</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نحن هنا لمساعدتك! تواصل معنا عبر أي من الطرق التالية وسنكون سعداء للرد على استفساراتك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 ml-2" />
                  تواصل سريع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleWhatsApp}>
                  <MessageCircle className="ml-2 h-4 w-4" />
                  واتساب: 01234567890
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="ml-2 h-4 w-4" />
                  اتصال مباشر: 01234567890
                </Button>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 ml-3 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">الهاتف</p>
                    <p className="text-gray-600">01234567890</p>
                    <p className="text-gray-600">01234567891</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 ml-3 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">البريد الإلكتروني</p>
                    <p className="text-gray-600">info@teachers-platform.com</p>
                    <p className="text-gray-600">support@teachers-platform.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 ml-3 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">العنوان</p>
                    <p className="text-gray-600">القاهرة، مصر</p>
                    <p className="text-gray-600">شارع التحرير، وسط البلد</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 ml-3 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">ساعات العمل</p>
                    <p className="text-gray-600">السبت - الخميس: 9:00 ص - 6:00 م</p>
                    <p className="text-gray-600">الجمعة: مغلق</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>تابعنا على</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 space-x-reverse">
                  <Button variant="outline" size="icon" className="text-blue-600">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-pink-600">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-blue-400">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 ml-2" />
                  أرسل لنا رسالة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
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
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
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
                    <Label htmlFor="subject">موضوع الرسالة *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="مثال: استفسار عن التسجيل كمدرس"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">الرسالة *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="اكتب رسالتك هنا..."
                      rows={6}
                      required
                    />
                  </div>

                  {sendError && <p className="text-sm text-red-600">{sendError}</p>}

                  <Button type="submit" size="lg" className="w-full" disabled={isSending}>
                    <Send className="ml-2 h-4 w-4" />
                    {isSending ? "جاري الإرسال..." : "إرسال الرسالة"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">الأسئلة الشائعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">كيف يمكنني التسجيل كمدرس؟</h4>
                  <p className="text-gray-600 mb-4">
                    يمكنك التسجيل من خلال صفحة "سجّل كمدرس" وملء النموذج المطلوب. سيتم مراجعة طلبك خلال 24-48 ساعة.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">هل الخدمة مجانية للطلاب؟</h4>
                  <p className="text-gray-600 mb-4">نعم، البحث عن المدرسين والتواصل معهم مجاني تماماً للطلاب.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">كيف يتم ضمان جودة المدرسين؟</h4>
                  <p className="text-gray-600 mb-4">
                    نقوم بمراجعة جميع طلبات المدرسين والتحقق من مؤهلاتهم قبل الموافقة على انضمامهم.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">هل يمكن التدريس أونلاين؟</h4>
                  <p className="text-gray-600 mb-4">
                    نعم، العديد من المدرسين يقدمون خدمات التدريس الأونلاين بالإضافة للتدريس الحضوري.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
