"use client";

import { useTheme } from "next-themes";
import React, { useEffect } from "react";

import Providers from "../providers";

export default function PagesLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Set the theme based on user preference or system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    prefersDark;
    setTheme("dark");
  }, [setTheme]);

  return (
    <Providers locale={locale}>
      <main className="h-[100vh] w-[100vw] overflow-hidden">{children}</main>
    </Providers>
  );
}
