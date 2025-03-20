"use client"

import type React from "react"

import Button from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import type { Color, Size } from "@/types"
import { useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"

interface FilterProps {
  data: (Size | Color)[]
  name: string
  valueKey: string
}

const Filter: React.FC<FilterProps> = ({ data, name, valueKey }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedValue = searchParams.get(valueKey)

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

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <hr className="my-4 border-gray-200" />
      <div className="flex flex-wrap gap-3">
        {data.map((filter) => (
          <div key={filter.id} className="flex items-center">
            {valueKey === "colorId" ? (
              <Button
                className={cn(
                  "rounded-full w-9 h-9 p-0 flex items-center justify-center border-2 transition-all duration-200",
                  selectedValue === filter.id
                    ? "border-primary ring-2 ring-primary/20 shadow-sm"
                    : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => onClick(filter.id)}
                style={{
                  backgroundColor: (filter as Color).value || "white",
                }}
              >
                {selectedValue === filter.id && <span className="sr-only">Selected</span>}
              </Button>
            ) : (
              <Button
                className={cn(
                  "rounded-md text-sm px-4 py-2 transition-all duration-200",
                  selectedValue === filter.id
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => onClick(filter.id)}
              >
                {filter.name}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Filter

