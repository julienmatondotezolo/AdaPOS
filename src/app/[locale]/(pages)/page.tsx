"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useRouter } from "@/navigation";

export default function Index() {
  const router = useRouter();
  const indexPageText = useTranslations("Index");

  useEffect(() => {
    // Redirect to the dashboard page
    router.push("/dashboard");
  }, [router]);

  return (
    <main className="relative">
      <p>{indexPageText("welcome")}</p>
    </main>
  );
}
