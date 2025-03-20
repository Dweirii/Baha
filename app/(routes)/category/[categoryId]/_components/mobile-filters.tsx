"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"

import type { Color, Size } from "@/types"
import Button from "@/components/ui/Button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import Filter from "./filter"

interface MobileFiltersProps {
  sizes: Size[]
  colors: Color[]
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ sizes, colors }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-x-2 lg:hidden bg-black">
        Filters
        <Plus className="h-4 w-4" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-medium">Filters</SheetTitle>
              <SheetClose asChild>
                <Button className="h-8 w-8">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full pb-20">
            <div className="space-y-4">
              <Filter valueKey="sizeId" name="Sizes" data={sizes} />
            </div>

            <div className="space-y-4">
              <Filter valueKey="colorId" name="Colors" data={colors} />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
            <Button onClick={() => setOpen(false)} className="w-full">
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default MobileFilters

