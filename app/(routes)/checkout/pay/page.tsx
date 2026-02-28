import { Suspense } from "react";
import CheckoutPayClient from "./CheckoutPayClient";
import Container from "@/components/ui/container";

export const dynamic = "force-dynamic";

export default function CheckoutPayPage() {
  return (
    <Suspense
      fallback={
        <Container>
          <div className="py-16 text-center">Loading...</div>
        </Container>
      }
    >
      <CheckoutPayClient />
    </Suspense>
  );
}
