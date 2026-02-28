"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import useCart from "@/hooks/use-cart";
import Container from "@/components/ui/container";

export default function PaymentResultClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const removeAll = useCart((state) => state.removeAll);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const resourcePath = searchParams.get("resourcePath");
    const storeId = searchParams.get("storeId");

    if (!resourcePath) {
      setStatus("error");
      setMessage("Payment incomplete. No result from payment provider.");
      return;
    }

    if (!storeId) {
      setStatus("error");
      setMessage("Missing store. Please try again from the cart.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setStatus("error");
      setMessage("Configuration error.");
      return;
    }

    const base = apiUrl.replace(/\/?$/, "");
    const statusPath = base.endsWith(storeId) ? "checkout/status" : `${storeId}/checkout/status`;
    const statusUrl = `${base}/${statusPath}?resourcePath=${encodeURIComponent(resourcePath)}`;

    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(statusUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = await res.text();
        let data: { success?: boolean; orderId?: string; storeId?: string; error?: string } = {};
        try {
          data = JSON.parse(raw);
        } catch {
          setStatus("error");
          setMessage(res.ok ? "Invalid response." : `Server error (${res.status}). Check the admin server logs.`);
          return;
        }

        if (data.success && data.orderId) {
          removeAll();
          setStatus("success");
          const redirectUrl = `/thank-you?order_id=${encodeURIComponent(data.orderId)}&store_id=${encodeURIComponent(data.storeId || storeId)}`;
          router.replace(redirectUrl);
          return;
        }

        setStatus("error");
        setMessage(data.error || "Payment could not be confirmed.");
      } catch (err) {
        console.error("Payment status error:", err);
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Unable to verify payment. Please contact support if you were charged.");
      }
    })();
  }, [searchParams, getToken, removeAll, router]);

  return (
    <Container>
      <div className="py-16 max-w-xl mx-auto text-center">
        {status === "loading" && (
          <>
            <p className="text-gray-600">Confirming your payment...</p>
            <div className="mt-4 h-8 w-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto" />
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-red-600 mb-4">{message}</p>
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="text-black underline"
            >
              Back to cart
            </button>
          </>
        )}
        {status === "success" && (
          <p className="text-gray-600">Redirecting to thank you page...</p>
        )}
      </div>
    </Container>
  );
}
