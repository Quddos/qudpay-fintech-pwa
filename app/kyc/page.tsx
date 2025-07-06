"use client"
import { Suspense } from "react";
import KYCForm from "./KYCForm";

export default function KYCPage() {
  return (
    <Suspense>
      <KYCForm />
    </Suspense>
  );
}
