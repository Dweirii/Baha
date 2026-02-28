"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, CreditCard, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";

import Button from "@/components/ui/Button";
import Currency from "@/components/ui/currency";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCart from "@/hooks/use-cart";

const COUNTRY_OPTIONS = [
  { code: "JO", name: "Jordan" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "EG", name: "Egypt" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "OM", name: "Oman" },
  { code: "QA", name: "Qatar" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
];

const Summary = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const { getToken } = useAuth();
  const { user } = useUser();

  const [showBilling, setShowBilling] = useState(false);
  const [billing, setBilling] = useState({
    email: "",
    givenName: "",
    surname: "",
    street1: "",
    city: "",
    state: "",
    country: "JO",
    postcode: "",
  });

  useEffect(() => {
    if (user) {
      setBilling((prev) => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress ?? prev.email,
        givenName: user.firstName ?? prev.givenName,
        surname: user.lastName ?? prev.surname,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
      router.push("/thank-you");
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll, router]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const onCheckout = async () => {
    const { email, givenName, surname, street1, city, state, country, postcode } = billing;
    if (!email?.trim() || !givenName?.trim() || !surname?.trim()) {
      toast.error("Please enter your email and name.");
      setShowBilling(true);
      return;
    }
    if (!street1?.trim() || !city?.trim() || !country?.trim() || !postcode?.trim()) {
      toast.error("Please complete billing address (street, city, country, postcode).");
      setShowBilling(true);
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          productIds: items.map((item) => item.id),
          customer: { email: email.trim(), givenName: givenName.trim(), surname: surname.trim() },
          billing: {
            street1: street1.trim(),
            city: city.trim(),
            state: (state ?? "").trim(),
            country: country.trim(),
            postcode: postcode.trim(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { checkoutId, orderId, storeId, integrity, shopperResultUrl, widgetScriptUrl } = response.data;
      if (!checkoutId || !orderId || !storeId) {
        toast.error("Invalid checkout response.");
        return;
      }
      sessionStorage.setItem("hyperpay_integrity", integrity || "");
      sessionStorage.setItem("hyperpay_shopperResultUrl", shopperResultUrl || "");
      sessionStorage.setItem("hyperpay_widgetScriptUrl", widgetScriptUrl || "");
      const params = new URLSearchParams({ checkoutId, orderId, storeId });
      router.push(`/checkout/pay?${params.toString()}`);
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error("Failed to initiate checkout.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Number of items</span>
          <span className="font-medium">{items.length}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <Currency value={totalPrice} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-white" fill="red" />
            <span className="text-gray-600">Al-Baha store</span>
          </div>
          <span className="font-medium text-gray-800">Thank you</span>
        </div>

        <Separator className="my-2" />

        <div className="flex items-center justify-between pt-2">
          <div className="text-base font-medium text-gray-900">Order Total</div>
          <Currency value={totalPrice} />
        </div>
      </div>

      {/* Billing details - mandatory for HyperPay live */}
      <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowBilling(!showBilling)}
          className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100"
        >
          Billing & customer details
          {showBilling ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showBilling && (
          <div className="p-4 space-y-3 bg-white border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="billing-email">Email *</Label>
                <Input
                  id="billing-email"
                  type="email"
                  placeholder="your@email.com"
                  value={billing.email}
                  onChange={(e) => setBilling((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="billing-givenName">First name *</Label>
                <Input
                  id="billing-givenName"
                  placeholder="First name"
                  value={billing.givenName}
                  onChange={(e) => setBilling((p) => ({ ...p, givenName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="billing-surname">Last name *</Label>
              <Input
                id="billing-surname"
                placeholder="Last name"
                value={billing.surname}
                onChange={(e) => setBilling((p) => ({ ...p, surname: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="billing-street1">Street address *</Label>
              <Input
                id="billing-street1"
                placeholder="Street address"
                value={billing.street1}
                onChange={(e) => setBilling((p) => ({ ...p, street1: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="billing-city">City *</Label>
                <Input
                  id="billing-city"
                  placeholder="City"
                  value={billing.city}
                  onChange={(e) => setBilling((p) => ({ ...p, city: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="billing-state">State / Province</Label>
                <Input
                  id="billing-state"
                  placeholder="State"
                  value={billing.state}
                  onChange={(e) => setBilling((p) => ({ ...p, state: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="billing-country">Country *</Label>
                <select
                  id="billing-country"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  value={billing.country}
                  onChange={(e) => setBilling((p) => ({ ...p, country: e.target.value }))}
                >
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="billing-postcode">Postcode *</Label>
                <Input
                  id="billing-postcode"
                  placeholder="Postcode"
                  value={billing.postcode}
                  onChange={(e) => setBilling((p) => ({ ...p, postcode: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <Button
          onClick={onCheckout}
          className="w-full py-2 rounded-lg text-base font-medium flex items-center justify-center gap-2 bg-black hover:shadow-md transition"
        >
          <CreditCard className="h-5 w-5" />
          Proceed to Checkout
        </Button>

        <p className="text-xs text-center text-gray-500 px-4">
          By proceeding to checkout, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </motion.div>
  );
};

export default Summary;
