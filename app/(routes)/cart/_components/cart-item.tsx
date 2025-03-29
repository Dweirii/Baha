"use client"

import type React from "react"

import Image from "next/image"
import { X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import IconButton from "@/components/ui/icon-button"
import Currency from "@/components/ui/currency"
import useCart from "@/hooks/use-cart"
import type { Product } from "@/types"

interface CartItemProps {
  data: Product
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart()
  const [isHovered, setIsHovered] = useState(false)

  const onRemove = () => {
    cart.removeItem(data.id)
  }

  return (
    <motion.li
      className="flex flex-col sm:flex-row py-4 gap-4 border-b relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-32 w-full sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-lg overflow-hidden bg-gray-50 self-center sm:self-start">
        <Image
          fill
          src={data.images[0].url || "/placeholder.svg"}
          alt={data.name}
          className="object-cover object-center transition-transform duration-300"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          sizes="(max-width: 640px) 100vw, 128px"
        />
      </div>

      {/* Product Details */}
      <div className="relative flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1 pr-8">
            <h3 className="text-base font-medium text-gray-900 line-clamp-2">{data.name}</h3>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100">
                {data.color.name}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100">
                {data.size.name}
              </span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={onRemove}
              icon={<X size={16} />}
              className="bg-white hover:bg-gray-100 text-gray-600"
            />
          </motion.div>
        </div>

        {/* Price and Quantity Controls */}
        <div className="flex items-center justify-between mt-4">
          <Currency value={data.price}  />
        </div>
      </div>
    </motion.li>
  )
}

export default CartItem

