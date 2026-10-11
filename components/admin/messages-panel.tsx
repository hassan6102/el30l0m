"use client"

import { useCallback, useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageCircle, Mail, Phone, Trash2, CheckCheck } from "lucide-react"
import { db } from "@/lib/firebase"
import { waLink, SITE_NAME } from "@/lib/config"

interface Msg {
  id: string
  name: string
  phone: string
  email: string
  subject: string
  message: string
  status: "new" | "read"
  createdAt?: { toDate: () => Date }
}

export function MessagesPanel() {
  const [items, setItems] = useState<Msg[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"new" | "all">("new")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")))
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Msg, "id">) })))
    } catch (e) {
      console.error(e)
      alert("تعذر تحميل الرسائل. اتأكد من نشر القواعد الجديدة.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const markRead = async (m: Msg) => {
    await updateDoc(doc(db, "messages", m.id), { status: "read" })
    setItems((p) => p.map((x) => (x.id === m.id ? { ...x, status: "read" } : x)))
  }

  const remove = async (m: Msg) => {
    if (!confirm("حذف الرسالة؟")) return
    await deleteDoc(doc(db, "messages", m.id))
    setItems((p) => p.filter((x) => x.id !== m.id))
  }

  const visible = items.filter((m) => filter === "all" || m.status === "new")
  const newCount = items.filter((m) => m.status === "new").length

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" variant={filter === "new" ? "default" : "outline"} onClick={() => setFilter("new")}>
          جديدة ({newCount})
        </Button>
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          الكل ({items.length})
        </Button>
        <Button size="sm" variant="ghost" onClick={load}>
          تحديث
        </Button>
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" /> جاري التحميل...
        </p>
      )}
      {!loading && visible.length === 0 && <p className="text-gray-500">مفيش رسائل.</p>}

      {visible.map((m) => (
        <Card key={m.id} className={m.status === "new" ? "border-blue-300" : ""}>
          <CardContent className="p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{m.name}</h3>
                {m.status === "new" && <Badge>جديدة</Badge>}
              </div>
              {m.createdAt?.toDate && (
                <span className="text-xs text-gray-400">{m.createdAt.toDate().toLocaleString("ar-EG")}</span>
              )}
            </div>
            <p className="font-semibold text-gray-800">{m.subject}</p>
            <p className="whitespace-pre-wrap text-gray-700">{m.message}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600" dir="ltr">
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> {m.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> {m.email}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={waLink(m.phone, `مرحباً ${m.name}، بخصوص رسالتك على ${SITE_NAME}: ${m.subject}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <MessageCircle className="ml-1 h-4 w-4" /> واتساب
                </Button>
              </a>
              <a href={`mailto:${m.email}?subject=${encodeURIComponent("رد: " + m.subject)}`}>
                <Button size="sm" variant="outline">
                  <Mail className="ml-1 h-4 w-4" /> إيميل
                </Button>
              </a>
              {m.status === "new" && (
                <Button size="sm" variant="outline" onClick={() => markRead(m)}>
                  <CheckCheck className="ml-1 h-4 w-4" /> تمت القراءة
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => remove(m)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
