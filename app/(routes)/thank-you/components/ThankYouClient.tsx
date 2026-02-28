'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Package } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

import Button from "@/components/ui/Button"

interface OrderItem {
  id: string
  productId: string
  productName: string
  storeId: string
}

export default function ThankYouPage() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const storeId = searchParams.get("store_id")
  const { getToken } = useAuth()

  useEffect(() => {
    async function fetchOrderData() {
      if (!orderId || !storeId) return
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) return
      try {
        const token = await getToken()
        const base = apiUrl.replace(/\/?$/, "")
        const ordersPath = base.endsWith(storeId) ? `orders/${orderId}` : `${storeId}/orders/${orderId}`
        const url = `${base}/${ordersPath}`
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setOrderItems(data.orderItems || [])
      } catch (error) {
        console.error("Failed to load order items", error)
      }
    }

    fetchOrderData()

    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [orderId, storeId, getToken])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart")
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative bg-white dark:bg-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,black_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed w-3 h-3 rounded-full bg-black dark:bg-white"
              initial={{ top: "-10%", left: `${Math.random() * 100}%`, opacity: 1, scale: 0 }}
              animate={{
                top: "110%",
                opacity: 0,
                scale: [0, 1, 0.5],
                x: Math.random() * 200 - 100,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 4 + 4,
              }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i + 30}
              className="fixed w-2 h-8 bg-gray-600 dark:bg-gray-400"
              initial={{ top: "-10%", left: `${Math.random() * 100}%`, opacity: 1, rotate: 0 }}
              animate={{
                top: "110%",
                opacity: 0,
                rotate: 180,
                x: Math.random() * 150 - 75,
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                delay: Math.random() * 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 5 + 3,
              }}
            />
          ))}
        </>
      )}

      <div className="max-w-2xl w-full flex flex-col items-center text-center z-10 relative">
        {/* Success icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
            >
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            </motion.div>
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-500"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
          />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-8"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            Thank You!
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            Your order has been received successfully.
          </motion.p>
          <motion.p
            className="text-base text-gray-500 dark:text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            We will prepare your items for shipping. You will receive an order confirmation by email.
          </motion.p>
        </motion.div>

        {/* Order summary - physical products list only */}
        {orderItems.length > 0 && (
          <motion.div
            className="w-full max-w-md mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-black dark:text-white">Order summary</h2>
            </div>
            <ul className="space-y-2 text-left">
              {orderItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7 + index * 0.05 }}
                >
                  <span className="text-gray-400">•</span>
                  {item.productName}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Continue shopping */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <Button className="w-full h-12 text-lg font-semibold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black border-2 border-black dark:border-white transition-all duration-300">
            <Link href="/" className="flex items-center justify-center gap-2">
              Continue Shopping
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                →
              </motion.div>
            </Link>
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-10 text-gray-500 dark:text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          Thanks for shopping with Al-Baha store!
        </motion.p>
      </div>
    </div>
  )
}
