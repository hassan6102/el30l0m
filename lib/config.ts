// رقم واتساب صاحب المنصة - كل أزرار التواصل بتروح له
export const OWNER_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201125741855"

// UID حساب الأدمن في Firebase Auth (الحماية الحقيقية في firestore.rules)
export const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID || ""

export function teacherCode(id: string) {
  return `T-${String(id).padStart(4, "0")}`
}

export function ownerWhatsappLink(message: string) {
  return `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`
}

// تحويل رقم مصري (01xxxxxxxxx) لصيغة دولية وفتح واتساب
export function waLink(phone: string, message = "") {
  let d = (phone || "").replace(/\D/g, "")
  if (d.startsWith("00")) d = d.slice(2)
  else if (d.startsWith("0")) d = "20" + d.slice(1)
  const text = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${d}${text}`
}

// عرض الترحيب للطلاب الجدد (غيّر الأرقام من هنا)
export const OFFER = {
  freeLesson: true,
  discountPercent: 10,
  title: "عرض الترحيب للطلاب الجدد",
}
