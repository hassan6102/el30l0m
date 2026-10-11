"use client"

import { SITE_NAME } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, GraduationCap, Baby, ChurchIcon as Mosque, University } from "lucide-react"
import Link from "next/link"
import { useSiteData } from "@/lib/site-data"

export default function LevelsPage() {
  const { educationLevels, teachers } = useSiteData()
  const getLevelIcon = (levelName: string) => {
    switch (levelName) {
      case "التأسيس":
        return Baby
      case "المرحلة الابتدائية":
        return BookOpen
      case "المرحلة الإعدادية":
        return GraduationCap
      case "المرحلة الثانوية":
        return Users
      case "القرآن الكريم والتجويد":
        return Mosque
      case "التعليم الجامعي":
        return University
      default:
        return BookOpen
    }
  }

  const getLevelColor = (levelName: string) => {
    switch (levelName) {
      case "التأسيس":
        return "bg-pink-100 text-pink-600"
      case "المرحلة الابتدائية":
        return "bg-blue-100 text-blue-600"
      case "المرحلة الإعدادية":
        return "bg-green-100 text-green-600"
      case "المرحلة الثانوية":
        return "bg-purple-100 text-purple-600"
      case "القرآن الكريم والتجويد":
        return "bg-emerald-100 text-emerald-600"
      case "التعليم الجامعي":
        return "bg-orange-100 text-orange-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
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
              <Link href="/levels" className="text-blue-600 font-semibold">
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
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">المراحل التعليمية</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اختر المرحلة التعليمية المناسبة لك واعثر على أفضل المدرسين المتخصصين
          </p>
        </div>

        {/* Education Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {educationLevels.map((level) => {
            const Icon = getLevelIcon(level.name)
            // حساب عدد المدرسين في هذه المرحلة بالضبط
            const teacherCount = teachers.filter((teacher) => teacher.educationLevel.includes(level.name)).length

            return (
              <Card key={level.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getLevelColor(level.name)}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl mb-2">{level.name}</CardTitle>
                  <p className="text-gray-600">
                    {teacherCount} مدرس متاح • {level.subjects.length} مادة دراسية
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">المواد المتاحة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {level.subjects.slice(0, 6).map((subject, index) => {
                          // حساب عدد المدرسين لكل مادة في هذه المرحلة
                          const subjectTeacherCount = teachers.filter(
                            (teacher) =>
                              teacher.subjects.includes(subject) && teacher.educationLevel.includes(level.name),
                          ).length

                          return (
                            <Link
                              key={index}
                              href={`/teachers?subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level.name)}`}
                            >
                              <Badge
                                variant="secondary"
                                className="text-xs hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
                                title={`${subjectTeacherCount} مدرس متاح`}
                              >
                                {subject}
                              </Badge>
                            </Link>
                          )
                        })}
                        {level.subjects.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{level.subjects.length - 6} مادة أخرى
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Link href={`/teachers?level=${encodeURIComponent(level.name)}`}>
                        <Button className="w-full group-hover:bg-blue-700">عرض المدرسين ({teacherCount})</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">لم تجد المرحلة المناسبة؟</h3>
            <p className="text-lg mb-6">تواصل معنا وسنساعدك في العثور على المدرس المناسب</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  تواصل معنا
                </Button>
              </Link>
              <Link href="/register-teacher">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  انضم كمدرس
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
