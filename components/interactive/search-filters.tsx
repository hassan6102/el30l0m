"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, Filter, X, Star, Users } from "lucide-react"
import { useSiteData } from "@/lib/site-data"

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  totalResults: number
}

interface FilterState {
  searchTerm: string
  selectedLevel: string
  selectedSubject: string
  selectedLocation: string
  minRating: number
  onlineOnly: boolean
  sortBy: string
}

export function SearchFilters({ onFiltersChange, totalResults }: SearchFiltersProps) {
  const { educationLevels, subjects, locations } = useSiteData()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isInitialized = useRef(false)
  const lastFiltersRef = useRef<FilterState | null>(null)

  // حالة الفلاتر
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedLevel: "",
    selectedSubject: "",
    selectedLocation: "",
    minRating: 0,
    onlineOnly: false,
    sortBy: "rating",
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  // تحميل القيم من URL مرة واحدة فقط عند التحميل الأول
  useEffect(() => {
    if (!isInitialized.current) {
      const initialFilters: FilterState = {
        searchTerm: searchParams.get("search") || "",
        selectedLevel: searchParams.get("level") || "",
        selectedSubject: searchParams.get("subject") || "",
        selectedLocation: searchParams.get("location") || "",
        minRating: Number.parseFloat(searchParams.get("rating") || "0"),
        onlineOnly: searchParams.get("online") === "true",
        sortBy: searchParams.get("sort") || "rating",
      }

      setFilters(initialFilters)
      lastFiltersRef.current = initialFilters
      onFiltersChange(initialFilters)
      isInitialized.current = true
    }
  }, [searchParams, onFiltersChange])

  // دالة لتحديث URL بدون إعادة تحميل
  const updateURL = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams()

      if (newFilters.searchTerm) params.set("search", newFilters.searchTerm)
      if (newFilters.selectedLevel) params.set("level", newFilters.selectedLevel)
      if (newFilters.selectedSubject) params.set("subject", newFilters.selectedSubject)
      if (newFilters.selectedLocation) params.set("location", newFilters.selectedLocation)
      if (newFilters.minRating > 0) params.set("rating", newFilters.minRating.toString())
      if (newFilters.onlineOnly) params.set("online", "true")
      if (newFilters.sortBy !== "rating") params.set("sort", newFilters.sortBy)

      const newURL = params.toString() ? `?${params.toString()}` : "/teachers"
      router.replace(newURL, { scroll: false })
    },
    [router],
  )

  // دالة لتحديث فلتر واحد
  const updateFilter = useCallback(
    (key: keyof FilterState, value: any) => {
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters, [key]: value }

        // تحقق من أن الفلاتر تغيرت فعلاً
        if (JSON.stringify(newFilters) !== JSON.stringify(lastFiltersRef.current)) {
          lastFiltersRef.current = newFilters
          onFiltersChange(newFilters)
          updateURL(newFilters)
        }

        return newFilters
      })
    },
    [onFiltersChange, updateURL],
  )

  // مسح جميع الفلاتر
  const clearAllFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      searchTerm: "",
      selectedLevel: "",
      selectedSubject: "",
      selectedLocation: "",
      minRating: 0,
      onlineOnly: false,
      sortBy: "rating",
    }

    setFilters(clearedFilters)
    lastFiltersRef.current = clearedFilters
    onFiltersChange(clearedFilters)
    router.replace("/teachers", { scroll: false })
  }, [onFiltersChange, router])

  // مسح فلتر واحد
  const removeFilter = useCallback(
    (filterType: keyof FilterState) => {
      const defaultValues: Record<keyof FilterState, any> = {
        searchTerm: "",
        selectedLevel: "",
        selectedSubject: "",
        selectedLocation: "",
        minRating: 0,
        onlineOnly: false,
        sortBy: "rating",
      }
      updateFilter(filterType, defaultValues[filterType])
    },
    [updateFilter],
  )

  // حساب عدد الفلاتر النشطة
  const activeFiltersCount = [
    filters.searchTerm,
    filters.selectedLevel,
    filters.selectedSubject,
    filters.selectedLocation,
    filters.minRating > 0,
    filters.onlineOnly,
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* شريط البحث الرئيسي */}
      <Card className="shadow-lg border-2 border-blue-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="ابحث بالاسم أو المادة أو المدينة..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
                className="pr-12 h-12 text-lg border-2 focus:border-blue-400"
              />
            </div>

            <Select
              value={filters.selectedLevel}
              onValueChange={(value) => updateFilter("selectedLevel", value === "all" ? "" : value)}
            >
              <SelectTrigger className="h-12 border-2">
                <SelectValue placeholder="المرحلة التعليمية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المراحل</SelectItem>
                {educationLevels.map((level) => (
                  <SelectItem key={level.id} value={level.name}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`h-12 border-2 ${showAdvanced ? "bg-blue-50 border-blue-300" : ""}`}
            >
              <Filter className="ml-2 h-4 w-4" />
              فلاتر متقدمة
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="mr-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* الفلاتر المتقدمة */}
          {showAdvanced && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={filters.selectedSubject}
                  onValueChange={(value) => updateFilter("selectedSubject", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="المادة الدراسية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المواد</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.selectedLocation}
                  onValueChange={(value) => updateFilter("selectedLocation", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="المكان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأماكن</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">التقييم الأعلى</SelectItem>
                    <SelectItem value="reviews">الأكثر تقييماً</SelectItem>
                    <SelectItem value="newest">الأحدث انضماماً</SelectItem>
                    <SelectItem value="name">الاسم أبجدياً</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">الحد الأدنى للتقييم: {filters.minRating}</Label>
                  <Slider
                    value={[filters.minRating]}
                    onValueChange={(value) => updateFilter("minRating", value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>5</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="online-only"
                    checked={filters.onlineOnly}
                    onCheckedChange={(checked) => updateFilter("onlineOnly", checked)}
                  />
                  <Label htmlFor="online-only" className="text-sm font-medium">
                    التدريس الأونلاين فقط
                  </Label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* الفلاتر النشطة */}
      {activeFiltersCount > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-blue-600 ml-2" />
                <span className="text-sm font-medium text-blue-800">الفلاتر النشطة:</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-blue-600 hover:text-blue-800">
                مسح الكل
                <X className="h-4 w-4 mr-1" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.searchTerm && (
                <Badge variant="secondary" className="flex items-center">
                  البحث: {filters.searchTerm}
                  <button onClick={() => removeFilter("searchTerm")} className="mr-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.selectedLevel && (
                <Badge variant="secondary" className="flex items-center">
                  المرحلة: {filters.selectedLevel}
                  <button onClick={() => removeFilter("selectedLevel")} className="mr-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.selectedSubject && (
                <Badge variant="secondary" className="flex items-center">
                  المادة: {filters.selectedSubject}
                  <button onClick={() => removeFilter("selectedSubject")} className="mr-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.selectedLocation && (
                <Badge variant="secondary" className="flex items-center">
                  المكان: {filters.selectedLocation}
                  <button onClick={() => removeFilter("selectedLocation")} className="mr-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.minRating > 0 && (
                <Badge variant="secondary" className="flex items-center">
                  التقييم: {filters.minRating}+ نجوم
                  <button onClick={() => removeFilter("minRating")} className="mr-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.onlineOnly && (
                <Badge variant="secondary" className="flex items-center">
                  أونلاين فقط
                  <button onClick={() => removeFilter("onlineOnly")} className="mr-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ملخص النتائج */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <Users className="h-4 w-4 ml-2" />
          <span>تم العثور على {totalResults} مدرس</span>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
            <span>
              مرتب حسب{" "}
              {filters.sortBy === "rating"
                ? "التقييم"
                : filters.sortBy === "reviews"
                  ? "عدد التقييمات"
                  : filters.sortBy === "newest"
                    ? "الأحدث"
                    : "الاسم"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
