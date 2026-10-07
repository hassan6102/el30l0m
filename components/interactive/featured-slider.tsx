"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { TeacherCard } from "@/components/interactive/teacher-card"
import type { Teacher } from "@/lib/types"

export function FeaturedSlider({ teachers }: { teachers: Teacher[] }) {
  const [api, setApi] = useState<CarouselApi>()

  return (
    <div>
      <Carousel setApi={setApi} opts={{ align: "start", direction: "rtl", dragFree: true }} className="w-full">
        <CarouselContent>
          {teachers.map((teacher) => (
            <CarouselItem key={teacher.id} className="basis-[88%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <TeacherCard teacher={teacher} showAnimation={false} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {teachers.length > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" size="icon" onClick={() => api?.scrollPrev()} aria-label="السابق">
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => api?.scrollNext()} aria-label="التالي">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
