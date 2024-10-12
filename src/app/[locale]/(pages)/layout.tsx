"use client";

import React from "react";

import Providers from "../providers";

export default function PagesLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <Providers locale={locale}>
      <main className="h-[100vh] w-[100vw] overflow-hidden">{children}</main>
    </Providers>
  );
}
