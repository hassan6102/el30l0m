import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

export async function submitContactMessage(input: {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}) {
  await addDoc(collection(db, "messages"), {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: "new",
    createdAt: serverTimestamp(),
  })
}

export interface StudentInput {
  name: string
  phone: string
  role: "student" | "parent"
  level: string
  subjects: string[]
  area: string
  preferredTimes: string
  notes: string
  teacherCode: string
}

function makeCoupon() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let c = ""
  for (let i = 0; i < 5; i++) c += chars[Math.floor(Math.random() * chars.length)]
  return `WELCOME-${c}`
}

export async function submitStudent(input: StudentInput, discountPercent: number) {
  const couponCode = makeCoupon()
  await addDoc(collection(db, "students"), {
    name: input.name.trim(),
    phone: input.phone.trim(),
    role: input.role,
    level: input.level,
    subjects: input.subjects,
    area: input.area,
    preferredTimes: input.preferredTimes.trim(),
    notes: input.notes.trim(),
    teacherCode: input.teacherCode.trim(),
    couponCode,
    offerFreeLesson: true,
    discountPercent,
    offerUsed: false,
    adminNotes: "",
    status: "new",
    createdAt: serverTimestamp(),
  })
  return couponCode
}
