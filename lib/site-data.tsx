"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import type { Teacher, Subject, EducationLevel, Location, Review } from "./types"

interface SiteData {
  teachers: Teacher[]
  subjects: Subject[]
  educationLevels: EducationLevel[]
  locations: Location[]
  reviews: Review[]
  loading: boolean
  error: string
  refresh: () => Promise<void>
}

const SiteDataContext = createContext<SiteData | null>(null)

const byOrder = (a: { order?: number }, b: { order?: number }) => (a.order ?? 0) - (b.order ?? 0)

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [rawSubjects, setRawSubjects] = useState<Subject[]>([])
  const [rawLevels, setRawLevels] = useState<(EducationLevel & { order?: number })[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const refresh = useCallback(async () => {
    try {
      const [t, s, l, loc] = await Promise.all([
        getDocs(query(collection(db, "teachers"), where("status", "==", "approved"))),
        getDocs(collection(db, "subjects")),
        getDocs(collection(db, "educationLevels")),
        getDocs(collection(db, "locations")),
      ])

      setTeachers(
        t.docs.map((d) => {
          const x = d.data() as Partial<Teacher>
          return {
            id: d.id,
            code: x.code,
            name: x.name || "",
            image: x.image || "",
            subjects: x.subjects || [],
            educationLevel: x.educationLevel || [],
            locations: x.locations || [],
            description: x.description || "",
            teachingMethod: x.teachingMethod || "",
            rating: x.rating || 0,
            reviewsCount: x.reviewsCount || 0,
            isOnline: !!x.isOnline,
            isApproved: true,
            joinDate: x.joinDate || "",
            featured: !!x.featured,
            qualification: x.qualification || "",
            university: x.university || "",
            experienceYears: x.experienceYears || 0,
            achievements: x.achievements || "",
            gender: x.gender || "",
          } as Teacher
        }),
      )

      setRawSubjects(
        s.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Subject, "id">) }))
          .map((x) => ({ ...x, educationLevels: x.educationLevels || [] }))
          .sort(byOrder),
      )
      setRawLevels(
        l.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EducationLevel, "id">) })).sort(byOrder),
      )
      setLocations(loc.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Location, "id">) })).sort(byOrder))
      setError("")
    } catch (e) {
      console.error(e)
      setError("تعذر تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // المراحل تاخد موادها تلقائي من المواد (مصدر واحد للحقيقة)
  const educationLevels = useMemo<EducationLevel[]>(
    () =>
      rawLevels.map((lvl) => ({
        ...lvl,
        subjects: rawSubjects.filter((s) => s.educationLevels.includes(lvl.name)).map((s) => s.name),
      })),
    [rawLevels, rawSubjects],
  )

  const value: SiteData = {
    teachers,
    subjects: rawSubjects,
    educationLevels,
    locations,
    reviews: [],
    loading,
    error,
    refresh,
  }

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext)
  if (!ctx) throw new Error("useSiteData must be used inside SiteDataProvider")
  return ctx
}
