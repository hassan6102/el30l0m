export interface Teacher {
  id: string
  code?: string
  featured?: boolean
  qualification?: string
  university?: string
  experienceYears?: number
  achievements?: string
  gender?: string
  name: string
  image: string
  subjects: string[]
  educationLevel: string[]
  locations: string[]
  description: string
  teachingMethod: string
  contactWhatsapp?: string
  contactEmail?: string
  rating: number
  reviewsCount: number
  isOnline: boolean
  isApproved: boolean
  joinDate: string
}

export interface Subject {
  id: string
  name: string
  educationLevels: string[]
}

export interface EducationLevel {
  id: string
  name: string
  subjects: string[]
}

export interface Location {
  id: string
  name: string
  type: "city" | "area" | "online"
}

export interface Review {
  id: string
  teacherId: string
  studentName: string
  rating: number
  comment: string
  date: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  date: string
  isRead: boolean
}

export interface TeacherApplication {
  id: string
  name: string
  phone: string
  email: string
  subjects: string[]
  educationLevels: string[]
  locations: string[]
  image: string
  description: string
  status: "pending" | "approved" | "rejected"
  submissionDate: string
}

export interface TeacherApplicationInput {
  name: string
  phone: string
  email: string
  subjects: string[]
  educationLevels: string[]
  locations: string[]
  description: string
  teachingMethod: string
  image: string // رابط مباشر للصورة (https)
  gender: string
  qualification: string
  university: string
  experienceYears: number
  currentWorkplace: string
  hourlyPrice: number
  availability: string
  achievements: string
  certificateUrl: string
  socialUrl: string
}

export interface Lead {
  id?: string
  name: string
  phone: string
  level: string
  subject: string
  area: string
  teacherCode?: string
  status: "new" | "contacted" | "matched" | "started" | "rejected"
  notes?: string
}
