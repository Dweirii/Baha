import type React from "react"
import Image from "next/image"
import { Tab } from "@headlessui/react"
import { cn } from "@/lib/utils"
import type { Image as ImageType } from "@/types"

interface GalleryTabProps {
  image: ImageType
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  return (
    <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 overflow-hidden group">
      {({ selected }) => (
        <div className="w-full h-full">
          <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
            <Image
              fill
              src={image.url || "/placeholder.svg"}
              alt=""
              className={cn(
                "object-cover object-center transition-all duration-300",
                "group-hover:scale-105",
                selected ? "" : "group-hover:brightness-90",
              )}
              sizes="(max-width: 768px) 25vw, 150px"
            />
          </span>

          {/* Selection indicator */}
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-1 transition-all duration-200",
              selected ? "ring-black" : "ring-transparent group-hover:ring-gray-300",
            )}
          />

          {/* Selected overlay */}
          {selected && <span className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent rounded-md" />}

          {/* Hover overlay */}
          <span
            className={cn(
              "absolute inset-0 bg-black/0 transition-colors duration-200 rounded-md",
              selected ? "" : "group-hover:bg-black/5",
            )}
          />
        </div>
      )}
    </Tab>
  )
}

export default GalleryTab

