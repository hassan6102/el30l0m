"use client"

import { SiteNavbar } from "@/components/site-navbar"
import { SITE_NAME } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, BookOpen, Phone, Mail, MessageCircle, Calendar, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useSiteData } from "@/lib/site-data"
import { ContactOwnerButton } from "@/components/interactive/contact-owner"

export default function TeacherProfilePage() {
  const params = useParams<{ id: string }>()
  const { teachers, loading } = useSiteData()
  const teacher = teachers.find((t) => t.id === params.id)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600" dir="rtl">
        جاري التحميل...
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" dir="rtl">
        <p className="text-xl text-gray-700">المدرس غير موجود أو غير متاح حالياً</p>
        <Link href="/teachers">
          <Button>تصفح المدرسين</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <SiteNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4 space-x-reverse">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  الرئيسية
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link href="/teachers" className="text-gray-500 hover:text-gray-700">
                  المدرسين
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-900">{teacher.name}</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teacher Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 md:space-x-reverse">
                  <Image
                    src={teacher.image || "/placeholder.svg"}
                    alt={teacher.name}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto md:mx-0"
                  />
                  <div className="flex-1 text-center md:text-right">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{teacher.name}</h2>
                    <div className="flex items-center justify-center md:justify-start mb-3">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="mr-1 text-lg font-semibold text-gray-900">{teacher.rating}</span>
                      <span className="mr-2 text-gray-600">({teacher.reviewsCount} تقييم)</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 ml-2" />
                      انضم في {new Date(teacher.joinDate).toLocaleDateString("ar-EG")}
                    </div>
                    {teacher.isOnline && <Badge className="bg-green-100 text-green-800">متاح للتدريس الأونلاين</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subjects and Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 ml-2" />
                  المواد والمراحل التعليمية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">المواد الدراسية:</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">المراحل التعليمية:</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.educationLevel.map((level, index) => (
                        <Badge key={index} variant="outline">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>نبذة عن المدرس</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{teacher.description}</p>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">طريقة التدريس:</h4>
                  <p className="text-gray-700 leading-relaxed">{teacher.teachingMethod}</p>
                </div>
              </CardContent>
            </Card>

            {(teacher.qualification || teacher.university || teacher.experienceYears || teacher.achievements) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 ml-2" />
                    المؤهلات والخبرة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-gray-700">
                  {teacher.qualification && (
                    <p>
                      <strong>المؤهل:</strong> {teacher.qualification}
                    </p>
                  )}
                  {teacher.university && (
                    <p>
                      <strong>الجامعة / التخصص:</strong> {teacher.university}
                    </p>
                  )}
                  {teacher.experienceYears ? (
                    <p>
                      <strong>سنين الخبرة:</strong> {teacher.experienceYears} سنة
                    </p>
                  ) : null}
                  {teacher.achievements && (
                    <p>
                      <strong>إنجازات:</strong> {teacher.achievements}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>تواصل مع المدرس</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ContactOwnerButton
                  teacherId={teacher.id}
                  teacherName={teacher.name}
                  subjects={teacher.subjects}
                  code={teacher.code}
                />
                <Link href={`/register-student?teacher=${encodeURIComponent(teacher.code || `T-${String(teacher.id).padStart(4, "0")}`)}`}>
                  <Button variant="outline" className="w-full">
                    🎁 سجّل بياناتك واحصل على حصة مجانية
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center leading-5">
                  التواصل مع المدرسين بيتم من خلال إدارة المنصة لضمان الجودة وترتيب المواعيد.
                </p>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 ml-2" />
                  أماكن التدريس
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teacher.locations.map((location, index) => (
                    <div key={index} className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 ml-2" />
                      <span className="text-gray-700">{location}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 ml-2" />
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">التقييم:</span>
                    <span className="font-semibold">{teacher.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد التقييمات:</span>
                    <span className="font-semibold">{teacher.reviewsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المواد:</span>
                    <span className="font-semibold">{teacher.subjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الأماكن:</span>
                    <span className="font-semibold">{teacher.locations.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
