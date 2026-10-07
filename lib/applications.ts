import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"
import type { TeacherApplicationInput } from "./types"

// رقم موبايل مصري: 11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015
export function normalizePhone(phone: string) {
  return (phone || "").replace(/\D/g, "")
}

export function isValidEgyptPhone(phone: string) {
  return /^01[0125][0-9]{8}$/.test(normalizePhone(phone))
}

export function isFullName(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).length >= 3
}

export function isValidImageUrl(url: string) {
  try {
    const u = new URL(url.trim())
    return u.protocol === "https:"
  } catch {
    return false
  }
}

export async function submitApplication(input: TeacherApplicationInput) {
  await addDoc(collection(db, "applications"), {
    name: input.name.trim(),
    phone: normalizePhone(input.phone),
    email: input.email.trim(),
    subjects: input.subjects,
    educationLevels: input.educationLevels,
    locations: input.locations,
    description: input.description.trim(),
    teachingMethod: input.teachingMethod.trim(),
    image: input.image.trim(),
    gender: input.gender,
    qualification: input.qualification.trim(),
    university: input.university.trim(),
    experienceYears: Number(input.experienceYears) || 0,
    currentWorkplace: input.currentWorkplace.trim(),
    hourlyPrice: Number(input.hourlyPrice) || 0,
    availability: input.availability.trim(),
    achievements: input.achievements.trim(),
    certificateUrl: input.certificateUrl.trim(),
    socialUrl: input.socialUrl.trim(),
    status: "pending",
    agreedToTerms: true,
    submittedAt: serverTimestamp(),
  })
}
