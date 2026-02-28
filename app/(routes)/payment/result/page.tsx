import { Suspense } from "react";
import PaymentResultClient from "./PaymentResultClient";
import Container from "@/components/ui/container";

export const dynamic = "force-dynamic";

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <Container>
          <div className="py-16 max-w-xl mx-auto text-center">
            <p className="text-gray-600">Confirming your payment...</p>
            <div className="mt-4 h-8 w-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto" />
          </div>
        </Container>
      }
    >
      <PaymentResultClient />
    </Suspense>
  );
}
