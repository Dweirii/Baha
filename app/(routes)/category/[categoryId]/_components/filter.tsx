"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"
import  Button  from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Color, Size } from "@/types"

interface FilterProps {
  data: (Size | Color)[]
  name: string
  valueKey: string
}

const Filter: React.FC<FilterProps> = ({ data, name, valueKey }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const selectedValue = searchParams.get(valueKey)
  const isColorFilter = valueKey === "colorId"

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString())

    const query = {
      ...current,
      [valueKey]: current[valueKey] === id ? null : id,
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true },
    )

    router.push(url)
  }

  const clearFilter = () => {
    const current = qs.parse(searchParams.toString())

    const query = {
      ...current,
      [valueKey]: null,
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true },
    )

    router.push(url)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">{name}</h3>
        {selectedValue && (
          <Button  onClick={clearFilter} className="h-8 px-3 text-xs font-medium">
            Clear
            <X className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className={cn("flex flex-wrap gap-2", isColorFilter ? "gap-3" : "gap-2")}>
        {data.map((filter) => {
          const isSelected = selectedValue === filter.id

          if (isColorFilter) {
            const color = filter as Color
            return (
              <TooltipProvider key={filter.id} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <button
                        className={cn(
                          "h-10 w-10 rounded-full transition-all duration-200 flex items-center justify-center",
                          "border-2 focus:outline-none focus:ring-2 focus:ring-primary/30",
                          isSelected ? "border-primary shadow-sm" : "border-gray-200 hover:border-gray-300",
                        )}
                        onClick={() => onClick(filter.id)}
                        style={{
                          backgroundColor: color.value || "white",
                        }}
                        aria-label={`${color.name} color`}
                      >
                        {isSelected && (
                          <span
                            className={cn(
                              "flex items-center justify-center h-5 w-5 rounded-full",
                              getContrastYIQ(color.value) === "black" ? "bg-white" : "bg-black",
                            )}
                          >
                            <Check
                              className={cn(
                                "h-3 w-3",
                                getContrastYIQ(color.value) === "black" ? "text-black" : "text-white",
                              )}
                            />
                          </span>
                        )}
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="px-3 py-1.5">
                    {filter.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          }

          return (
            <Badge
              key={filter.id}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "px-3 py-2 h-auto text-sm font-normal cursor-pointer transition-all duration-200",
                isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-secondary",
              )}
              onClick={() => onClick(filter.id)}
            >
              {filter.name}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}

// Helper function to determine if text should be black or white based on background color
function getContrastYIQ(hexcolor: string): "black" | "white" {
  // Default to black for empty or invalid colors
  if (!hexcolor) return "black"

  // Remove # if present
  hexcolor = hexcolor.replace("#", "")

  // Convert to RGB
  const r = Number.parseInt(hexcolor.substr(0, 2), 16)
  const g = Number.parseInt(hexcolor.substr(2, 2), 16)
  const b = Number.parseInt(hexcolor.substr(4, 2), 16)

  // If any value is NaN, return black as default
  if (isNaN(r) || isNaN(g) || isNaN(b)) return "black"

  // YIQ equation
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Return black for bright colors, white for dark colors
  return yiq >= 128 ? "black" : "white"
}

export default Filter

