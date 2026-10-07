"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { ownerWhatsappLink, teacherCode } from "@/lib/config"

interface Props {
  teacherId: string
  teacherName: string
  subjects: string[]
  code?: string
}

export function ContactOwnerButton({ teacherId, teacherName, subjects, code }: Props) {
  const handleClick = () => {
    const c = code || teacherCode(teacherId)
    const message = `مرحباً، أريد حجز حصص ${subjects.join(" و ")} مع المدرس ${teacherName} (كود: ${c})`
    window.open(ownerWhatsappLink(message), "_blank")
  }

  return (
    <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" onClick={handleClick}>
      <MessageCircle className="ml-2 h-4 w-4" />
      احجز مع هذا المدرس عبر الواتساب
    </Button>
  )
}
