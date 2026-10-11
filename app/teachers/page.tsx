"use client"

import { SITE_NAME } from "@/lib/config"
import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { useSiteData } from "@/lib/site-data"
import { TeacherCard } from "@/components/interactive/teacher-card"
import { SearchFilters } from "@/components/interactive/search-filters"

interface FilterState {
  searchTerm: string
  selectedLevel: string
  selectedSubject: string
  selectedLocation: string
  minRating: number
  onlineOnly: boolean
  sortBy: string
}

export default function TeachersPage() {
  const { teachers, loading } = useSiteData()
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedLevel: "",
    selectedSubject: "",
    selectedLocation: "",
    minRating: 0,
    onlineOnly: false,
    sortBy: "rating",
  })

  // دالة لتحديث الفلاتر
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  // فلترة وترتيب المدرسين
  const filteredAndSortedTeachers = useMemo(() => {
    const filtered = teachers.filter((teacher) => {
      // البحث في الاسم والمواد والأماكن
      const matchesSearch =
        !filters.searchTerm ||
        teacher.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        teacher.subjects.some((subject) => subject.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        teacher.locations.some((location) => location.toLowerCase().includes(filters.searchTerm.toLowerCase()))

      // فلترة المرحلة التعليمية
      const matchesLevel = !filters.selectedLevel || teacher.educationLevel.includes(filters.selectedLevel)

      // فلترة المادة
      const matchesSubject = !filters.selectedSubject || teacher.subjects.includes(filters.selectedSubject)

      // فلترة المكان
      const matchesLocation = !filters.selectedLocation || teacher.locations.includes(filters.selectedLocation)

      // فلترة التقييم
      const matchesRating = teacher.rating >= filters.minRating

      // فلترة التدريس الأونلاين
      const matchesOnline = !filters.onlineOnly || teacher.isOnline

      return matchesSearch && matchesLevel && matchesSubject && matchesLocation && matchesRating && matchesOnline
    })

    // ترتيب النتائج
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviewsCount - a.reviewsCount
        case "newest":
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        case "name":
          return a.name.localeCompare(b.name, "ar")
        default:
          return 0
      }
    })

    return filtered
  }, [filters, teachers])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4 space-x-reverse">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{SITE_NAME}</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                الرئيسية
              </Link>
              <Link href="/teachers" className="text-blue-600 font-semibold">
                المدرسين
              </Link>
              <Link href="/subjects" className="text-gray-700 hover:text-blue-600 transition-colors">
                المواد
              </Link>
              <Link href="/levels" className="text-gray-700 hover:text-blue-600 transition-colors">
                المراحل
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                تواصل معنا
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            جميع المدرسين
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اعثر على المدرس المناسب لك من بين أفضل المدرسين المؤهلين في جميع التخصصات
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters onFiltersChange={handleFiltersChange} totalResults={filteredAndSortedTeachers.length} />

        {/* Teachers Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">جاري تحميل المدرسين...</div>
        ) : filteredAndSortedTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredAndSortedTeachers.map((teacher, index) => (
              <div
                key={teacher.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TeacherCard teacher={teacher} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <BookOpen className="h-24 w-24 mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">لم يتم العثور على مدرسين</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              جرب تغيير معايير البحث أو مسح الفلاتر للعثور على المزيد من المدرسين
            </p>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  searchTerm: "",
                  selectedLevel: "",
                  selectedSubject: "",
                  selectedLocation: "",
                  minRating: 0,
                  onlineOnly: false,
                  sortBy: "rating",
                })
              }
              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            >
              مسح جميع الفلاتر
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
