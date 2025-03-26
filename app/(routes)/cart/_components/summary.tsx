"use client"

import { useState } from "react"
import  Button  from "@/components/ui/Button"
import Currency from "@/components/ui/currency"
import useCart from "@/hooks/use-cart"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { PaymentModal } from "@/components/payment-modal"
import { CashOnDeliveryForm } from "@/components/cash-on-delivery-form"

const Summary = () => {
  const searchParams = useSearchParams()
  const items = useCart((state) => state.items)
  const removeAll = useCart((state) => state.removeAll)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isDeliveryFormOpen, setIsDeliveryFormOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.")
      removeAll()
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.")
    }
  }, [searchParams, removeAll])

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0)

  const onCheckout = () => {
    setIsPaymentModalOpen(true)
  }

  const handleSelectCashOnDelivery = () => {
    setIsPaymentModalOpen(false)
    setIsDeliveryFormOpen(true)
  }

  return (
    <>
      <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-base font-medium text-gray-900">Order Total</div>
            <Currency value={totalPrice} />
          </div>
        </div>
        <Button onClick={onCheckout} className="bg-black w-full mt-6 rounded-2xl h-12 text-lg">
          Checkout
        </Button>
      </div>

      {/* Payment Method Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectCashOnDelivery={handleSelectCashOnDelivery}
      />

      {/* Cash on Delivery Form Modal */}
      <CashOnDeliveryForm isOpen={isDeliveryFormOpen} onClose={() => setIsDeliveryFormOpen(false)} />

    </>
  )
}

export default Summary

