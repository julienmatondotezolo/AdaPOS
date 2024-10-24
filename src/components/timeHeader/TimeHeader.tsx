import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import { useRouter } from "@/navigation";

import { LanguageSwitcher } from "../languageSwitcher";

const TimeHeader = () => {
  const [time, setTime] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-between p-2 bg-neutral-900 dark:bg-black text-white">
      <nav className="flex space-x-5">
        <button className="text-xs font-bold" onClick={() => router.push("/dashboard")}>
          Ada
        </button>
        <button className="text-xs font-bold" onClick={() => router.push("/orders")}>
          Order
        </button>
      </nav>
      <div>
        <small className="font-medium">{time}</small>
      </div>
      <div className="flex ">
        <LanguageSwitcher />
        <button onClick={toggleTheme} className="ml-4 p-2 ">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export { TimeHeader };
