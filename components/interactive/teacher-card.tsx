"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, BookOpen, Heart, MessageCircle, Phone, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Teacher } from "@/lib/types"
import { ownerWhatsappLink, teacherCode } from "@/lib/config"

interface TeacherCardProps {
  teacher: Teacher
  showAnimation?: boolean
}

export function TeacherCard({ teacher, showAnimation = true }: TeacherCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleQuickContact = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const code = teacher.code || teacherCode(teacher.id)
    const message = `مرحباً، أريد الاستفسار عن دروس ${teacher.subjects.join(" و ")} مع المدرس ${teacher.name} (كود: ${code})`
    const whatsappUrl = ownerWhatsappLink(message)
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Card
      className={`hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${
        showAnimation ? "hover:scale-105" : ""
      } ${isHovered ? "ring-2 ring-blue-200" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Indicator */}
      <div className="absolute top-3 left-3 z-10">
        {teacher.isOnline && (
          <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            متاح الآن
          </div>
        )}
      </div>

      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
          isLiked ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
        }`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      </button>

      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="relative">
            <Image
              src={imgError || !teacher.image ? "/placeholder-user.jpg" : teacher.image}
              onError={() => setImgError(true)}
              alt={teacher.name}
              width={100}
              height={100}
              className="rounded-full mx-auto mb-4 border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-110"
            />
            {teacher.reviewsCount > 0 && (
              <>
            {/* Rating Badge */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <Star className="h-3 w-3 mr-1 fill-current" />
                {teacher.rating}
              </div>
              </>
            )}
          </div>

          {teacher.featured && (
            <span className="inline-block mb-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              ⭐ مدرس مميز
            </span>
          )}
          <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {teacher.name}
          </h4>

          {teacher.reviewsCount > 0 ? (
          <div className="flex items-center justify-center mb-3">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? "fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="mr-2 text-sm text-gray-600">({teacher.reviewsCount} تقييم)</span>
            </div>
          ) : (
            <p className="mb-3 text-sm text-gray-500">مدرس جديد</p>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <BookOpen className="h-4 w-4 ml-2" />
              المواد:
            </div>
            <div className="flex flex-wrap gap-1">
              {teacher.subjects.slice(0, 3).map((subject, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  {subject}
                </Badge>
              ))}
              {teacher.subjects.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{teacher.subjects.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 ml-2" />
              الأماكن:
            </div>
            <div className="flex flex-wrap gap-1">
              {teacher.locations.slice(0, 2).map((location, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {location}
                </Badge>
              ))}
              {teacher.locations.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{teacher.locations.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Preview */}
        <div className="mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showDetails ? <EyeOff className="h-4 w-4 ml-1" /> : <Eye className="h-4 w-4 ml-1" />}
            {showDetails ? "إخفاء التفاصيل" : "عرض التفاصيل"}
          </button>
          {showDetails && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 animate-in slide-in-from-top-2 duration-200">
              <p className="line-clamp-3">{teacher.description}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link href={`/teacher/${teacher.id}`}>
            <Button className="w-full group-hover:bg-blue-700 transition-colors">عرض الملف الشخصي</Button>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickContact}
              className="flex items-center justify-center hover:bg-green-50 hover:text-green-700 hover:border-green-300"
            >
              <MessageCircle className="h-4 w-4 ml-1" />
              واتساب
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            >
              <Phone className="h-4 w-4 ml-1" />
              اتصال
            </Button>
          </div>
        </div>

        {/* Experience Badge */}
        <div className="mt-3 text-center">
          <Badge variant="outline" className="text-xs">
            انضم في {new Date(teacher.joinDate).getFullYear()}
          </Badge>
        </div>
      </CardContent>

      {/* Hover Effect Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />
    </Card>
  )
}
