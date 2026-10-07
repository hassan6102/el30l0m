"use client"

import { useState } from "react"
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc, writeBatch } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Pencil, Check, X, Database } from "lucide-react"
import { db } from "@/lib/firebase"
import { useSiteData } from "@/lib/site-data"
import {
  subjects as seedSubjects,
  educationLevels as seedLevels,
  locations as seedLocations,
} from "@/lib/data"

type WithOrder = { order?: number }
const nextOrder = (items: WithOrder[]) => items.reduce((m, i) => Math.max(m, i.order ?? 0), 0) + 1

/* ---------- استيراد البيانات الأولية ---------- */
export function SeedBanner() {
  const { subjects, educationLevels, locations, refresh, loading } = useSiteData()
  const [busy, setBusy] = useState(false)
  const empty = subjects.length === 0 && educationLevels.length === 0 && locations.length === 0

  if (loading || !empty) return null

  const seed = async () => {
    if (!confirm("هيتم استيراد المواد والمراحل والأماكن الجاهزة. متابعة؟")) return
    setBusy(true)
    try {
      const batch = writeBatch(db)
      seedLevels.forEach((l, i) => batch.set(doc(db, "educationLevels", l.id), { name: l.name, order: i + 1 }))
      seedSubjects.forEach((s, i) =>
        batch.set(doc(db, "subjects", s.id), { name: s.name, educationLevels: s.educationLevels, order: i + 1 }),
      )
      seedLocations.forEach((l, i) => batch.set(doc(db, "locations", l.id), { name: l.name, type: l.type, order: i + 1 }))
      await batch.commit()
      await refresh()
    } catch (e) {
      console.error(e)
      alert("فشل الاستيراد. تأكد إن قواعد Firestore الجديدة اتنشرت.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="border-yellow-300 bg-yellow-50">
      <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-yellow-900">المواد والمراحل والأماكن لسه فاضية في Firebase</p>
          <p className="text-sm text-yellow-800">اضغط الزرار لاستيراد القوائم الجاهزة، وبعدها تقدر تعدل فيها زي ما تحب.</p>
        </div>
        <Button onClick={seed} disabled={busy}>
          <Database className="ml-2 h-4 w-4" />
          {busy ? "جاري الاستيراد..." : "استيراد البيانات الأولية"}
        </Button>
      </CardContent>
    </Card>
  )
}

/* ---------- المواد ---------- */
export function SubjectsPanel() {
  const { subjects, educationLevels, refresh } = useSiteData()
  const [name, setName] = useState("")
  const [levels, setLevels] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLevels, setEditLevels] = useState<string[]>([])
  const [search, setSearch] = useState("")

  const toggle = (list: string[], v: string, on: boolean) => (on ? [...list, v] : list.filter((x) => x !== v))

  const add = async () => {
    const n = name.trim()
    if (!n) return
    if (subjects.some((s) => s.name === n)) return alert("المادة دي موجودة بالفعل")
    if (levels.length === 0) return alert("اختار مرحلة واحدة على الأقل")
    await addDoc(collection(db, "subjects"), { name: n, educationLevels: levels, order: nextOrder(subjects as WithOrder[]) })
    setName("")
    setLevels([])
    await refresh()
  }

  const saveLevels = async (id: string) => {
    if (editLevels.length === 0) return alert("اختار مرحلة واحدة على الأقل")
    await updateDoc(doc(db, "subjects", id), { educationLevels: editLevels })
    setEditingId(null)
    await refresh()
  }

  const remove = async (id: string, n: string) => {
    if (!confirm(`حذف مادة "${n}"؟ المدرسين اللي بيدرسوها هتفضل ظاهرة عندهم.`)) return
    await deleteDoc(doc(db, "subjects", id))
    await refresh()
  }

  const visible = subjects.filter((s) => s.name.includes(search.trim()))

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold">إضافة مادة جديدة</h3>
          <Input placeholder="اسم المادة" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {educationLevels.map((l) => (
              <div key={l.id} className="flex items-center gap-2">
                <Checkbox
                  id={`new-s-${l.id}`}
                  checked={levels.includes(l.name)}
                  onCheckedChange={(c) => setLevels((p) => toggle(p, l.name, !!c))}
                />
                <Label htmlFor={`new-s-${l.id}`} className="text-sm">
                  {l.name}
                </Label>
              </div>
            ))}
          </div>
          <Button onClick={add}>
            <Plus className="ml-2 h-4 w-4" /> إضافة
          </Button>
        </CardContent>
      </Card>

      <Input placeholder="ابحث في المواد..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="space-y-3">
        {visible.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{s.name}</span>
                  {s.educationLevels.map((l) => (
                    <Badge key={l} variant="secondary">
                      {l}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(s.id)
                      setEditLevels(s.educationLevels)
                    }}
                  >
                    <Pencil className="ml-1 h-4 w-4" /> المراحل
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(s.id, s.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {editingId === s.id && (
                <div className="border-t pt-3 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {educationLevels.map((l) => (
                      <div key={l.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`edit-${s.id}-${l.id}`}
                          checked={editLevels.includes(l.name)}
                          onCheckedChange={(c) => setEditLevels((p) => toggle(p, l.name, !!c))}
                        />
                        <Label htmlFor={`edit-${s.id}-${l.id}`} className="text-sm">
                          {l.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveLevels(s.id)}>
                      <Check className="ml-1 h-4 w-4" /> حفظ
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="ml-1 h-4 w-4" /> إلغاء
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {visible.length === 0 && <p className="text-gray-500">مفيش مواد.</p>}
      </div>
    </div>
  )
}

/* ---------- المراحل ---------- */
export function LevelsPanel() {
  const { educationLevels, subjects, refresh } = useSiteData()
  const [name, setName] = useState("")

  const add = async () => {
    const n = name.trim()
    if (!n) return
    if (educationLevels.some((l) => l.name === n)) return alert("المرحلة دي موجودة بالفعل")
    await addDoc(collection(db, "educationLevels"), { name: n, order: nextOrder(educationLevels as WithOrder[]) })
    setName("")
    await refresh()
  }

  const remove = async (id: string, n: string) => {
    if (!confirm(`حذف مرحلة "${n}"؟ هتتشال كمان من المواد المرتبطة بيها.`)) return
    const batch = writeBatch(db)
    batch.delete(doc(db, "educationLevels", id))
    subjects
      .filter((s) => s.educationLevels.includes(n))
      .forEach((s) =>
        batch.update(doc(db, "subjects", s.id), { educationLevels: s.educationLevels.filter((x) => x !== n) }),
      )
    await batch.commit()
    await refresh()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 flex gap-3">
          <Input placeholder="اسم المرحلة الجديدة" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={add}>
            <Plus className="ml-2 h-4 w-4" /> إضافة
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {educationLevels.map((l) => (
          <Card key={l.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{l.name}</p>
                <p className="text-sm text-gray-500">{l.subjects.length} مادة</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => remove(l.id, l.name)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {educationLevels.length === 0 && <p className="text-gray-500">مفيش مراحل.</p>}
      </div>
      <p className="text-sm text-gray-500">لربط مادة بمرحلة، روح لتاب "المواد" واضغط "المراحل" جنب المادة.</p>
    </div>
  )
}

/* ---------- الأماكن ---------- */
const typeLabels: Record<string, string> = { city: "مدينة", area: "منطقة", online: "أونلاين" }

export function LocationsPanel() {
  const { locations, refresh } = useSiteData()
  const [name, setName] = useState("")
  const [type, setType] = useState<"city" | "area" | "online">("area")

  const add = async () => {
    const n = name.trim()
    if (!n) return
    if (locations.some((l) => l.name === n)) return alert("المكان ده موجود بالفعل")
    await addDoc(collection(db, "locations"), { name: n, type, order: nextOrder(locations as WithOrder[]) })
    setName("")
    await refresh()
  }

  const remove = async (id: string, n: string) => {
    if (!confirm(`حذف "${n}"؟`)) return
    await deleteDoc(doc(db, "locations", id))
    await refresh()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 flex flex-wrap gap-3">
          <Input
            className="flex-1 min-w-[200px]"
            placeholder="اسم المكان"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="border rounded-md px-3 py-2 bg-white text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as "city" | "area" | "online")}
          >
            <option value="city">مدينة</option>
            <option value="area">منطقة</option>
            <option value="online">أونلاين</option>
          </select>
          <Button onClick={add}>
            <Plus className="ml-2 h-4 w-4" /> إضافة
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {locations.map((l) => (
          <Card key={l.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{l.name}</span>
                <Badge variant="secondary">{typeLabels[l.type]}</Badge>
              </div>
              <Button size="sm" variant="destructive" onClick={() => remove(l.id, l.name)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {locations.length === 0 && <p className="text-gray-500">مفيش أماكن.</p>}
      </div>
    </div>
  )
}
