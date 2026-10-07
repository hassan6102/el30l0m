"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Calculator, Globe, Beaker, Heart } from "lucide-react"
import Link from "next/link"
import { useSiteData } from "@/lib/site-data"

export default function SubjectsPage() {
  const { subjects, teachers, educationLevels } = useSiteData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all") // Updated default value to "all"

  const getSubjectIcon = (subjectName: string) => {
    if (subjectName.includes("رياضيات")) return Calculator
    if (subjectName.includes("إنجليزية") || subjectName.includes("فرنسية") || subjectName.includes("ألمانية"))
      return Globe
    if (subjectName.includes("كيمياء") || subjectName.includes("فيزياء") || subjectName.includes("علوم")) return Beaker
    if (subjectName.includes("أحياء") || subjectName.includes("طب")) return Heart
    if (subjectName.includes("قرآن") || subjectName.includes("تجويد")) return BookOpen
    return BookOpen
  }

  const getSubjectColor = (subjectName: string) => {
    if (subjectName.includes("رياضيات")) return "bg-blue-100 text-blue-600"
    if (subjectName.includes("إنجليزية") || subjectName.includes("فرنسية")) return "bg-green-100 text-green-600"
    if (subjectName.includes("كيمياء") || subjectName.includes("فيزياء")) return "bg-purple-100 text-purple-600"
    if (subjectName.includes("أحياء")) return "bg-emerald-100 text-emerald-600"
    if (subjectName.includes("قرآن") || subjectName.includes("تجويد")) return "bg-teal-100 text-teal-600"
    if (subjectName.includes("عربية")) return "bg-orange-100 text-orange-600"
    return "bg-gray-100 text-gray-600"
  }

  // تحديث منطق فلترة المواد لتكون أكثر دقة
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase())

    // إذا تم اختيار مرحلة معينة، اعرض فقط المواد المتاحة في هذه المرحلة
    const matchesLevel = selectedLevel === "all" || subject.educationLevels.includes(selectedLevel)

    return matchesSearch && matchesLevel
  })

  // تجميع المواد حسب المرحلة مع عرض المدرسين الصحيحين
  const groupedSubjects = filteredSubjects.reduce(
    (acc, subject) => {
      subject.educationLevels.forEach((level) => {
        if (selectedLevel === "all" || level === selectedLevel) {
          if (!acc[level]) acc[level] = []
          // التأكد من عدم التكرار
          if (!acc[level].find((s) => s.id === subject.id)) {
            acc[level].push(subject)
          }
        }
      })
      return acc
    },
    {} as Record<string, typeof subjects>,
  )

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
              <Link href="/subjects" className="text-blue-600 font-semibold">
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
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">المواد الدراسية</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف جميع المواد الدراسية المتاحة واعثر على المدرس المناسب لكل مادة
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="ابحث عن مادة دراسية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المراحل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المراحل</SelectItem> {/* Updated value prop to "all" */}
                  {educationLevels.map((level) => (
                    <SelectItem key={level.id} value={level.name}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            تم العثور على {filteredSubjects.length} مادة دراسية
            {selectedLevel !== "all" && ` في ${selectedLevel}`}
          </p>
        </div>

        {/* Subjects by Level */}
        {Object.entries(groupedSubjects).map(([levelName, levelSubjects]) => (
          <div key={levelName} className="mb-12">
            <div className="flex items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{levelName}</h3>
              <Badge variant="outline" className="mr-3">
                {levelSubjects.length} مادة
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {levelSubjects.map((subject) => {
                const Icon = getSubjectIcon(subject.name)
                // حساب عدد المدرسين الذين يدرسون هذه المادة في هذه المرحلة بالضبط
                const teacherCount = teachers.filter(
                  (teacher) => teacher.subjects.includes(subject.name) && teacher.educationLevel.includes(levelName),
                ).length

                return (
                  <Card key={`${subject.id}-${levelName}`} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${getSubjectColor(subject.name)}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h4>
                        <p className="text-sm text-gray-600">
                          {teacherCount} مدرس متاح في {levelName}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">متاح في:</p>
                          <div className="flex flex-wrap gap-1">
                            {subject.educationLevels.slice(0, 2).map((level, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {level}
                              </Badge>
                            ))}
                            {subject.educationLevels.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{subject.educationLevels.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/teachers?subject=${encodeURIComponent(subject.name)}&level=${encodeURIComponent(levelName)}`}
                        >
                          <Button className="w-full group-hover:bg-blue-700" size="sm">
                            عرض المدرسين ({teacherCount})
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لم يتم العثور على مواد</h3>
            <p className="text-gray-600 mb-4">جرب تغيير كلمات البحث أو المرحلة التعليمية</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedLevel("all") // Updated default value to "all"
              }}
            >
              مسح البحث
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">هل تدرس مادة غير موجودة؟</h3>
            <p className="text-lg mb-6">انضم إلى منصتنا وأضف تخصصك لتصل إلى المزيد من الطلاب</p>
            <Link href="/register-teacher">
              <Button size="lg" variant="secondary">
                سجّل كمدرس الآن
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
