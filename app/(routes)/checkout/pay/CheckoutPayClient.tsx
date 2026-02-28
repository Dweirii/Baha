"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Container from "@/components/ui/container";

export default function CheckoutPayClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  const checkoutId = searchParams.get("checkoutId");
  const orderId = searchParams.get("orderId");
  const storeId = searchParams.get("storeId");

  const [integrity, setIntegrity] = useState<string>("");
  const [shopperResultUrl, setShopperResultUrl] = useState<string>("");
  const [widgetScriptUrl, setWidgetScriptUrl] = useState<string>(
    "https://eu-prod.oppwa.com/v1/paymentWidgets.js"
  );

  useEffect(() => {
    setIntegrity(sessionStorage.getItem("hyperpay_integrity") || "");
    setShopperResultUrl(sessionStorage.getItem("hyperpay_shopperResultUrl") || "");
    setWidgetScriptUrl(
      sessionStorage.getItem("hyperpay_widgetScriptUrl") ||
        "https://eu-prod.oppwa.com/v1/paymentWidgets.js"
    );
  }, []);

  useEffect(() => {
    if (!checkoutId || !storeId || !orderId) {
      setError("Missing checkout parameters. Please start from the cart.");
      return;
    }
  }, [checkoutId, storeId, orderId]);

  if (error) {
    return (
      <Container>
        <div className="py-16 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="text-black underline"
          >
            Back to cart
          </button>
        </div>
      </Container>
    );
  }

  if (!checkoutId) {
    return (
      <Container>
        <div className="py-16 text-center">Loading...</div>
      </Container>
    );
  }

  const scriptSrc =
    widgetScriptUrl && widgetScriptUrl.startsWith("http")
      ? `${widgetScriptUrl}?checkoutId=${encodeURIComponent(checkoutId)}`
      : null;

  return (
    <Container>
      <div className="py-16 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Complete payment</h1>
        {scriptSrc && (
          <Script
            src={scriptSrc}
            integrity={integrity || undefined}
            crossOrigin="anonymous"
            strategy="afterInteractive"
            onLoad={() => {
              if (formRef.current && typeof (window as unknown as { wp: unknown }).wp !== "undefined") {
                (window as unknown as { wp: { init: () => void } }).wp?.init?.();
              }
            }}
          />
        )}
        <form
          ref={formRef}
          action={shopperResultUrl}
          className="paymentWidgets"
          data-brands="VISA MASTER AMEX"
        />
        <p className="mt-4 text-sm text-gray-500">
          Secure payment by HyperPay. You will be redirected after payment.
        </p>
      </div>
    </Container>
  );
}
