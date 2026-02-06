// src/components/layout/ThemeWrapper.tsx
"use client";

import { useThemeStore } from "@/store/theme";
import BottomNav from "@/components/BottomNav";
import { useEffect } from "react";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode } = useThemeStore();
  const isPain = mode === "pain";

  // 최상위 html 태그에 테마 속성 주입
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <div
      data-theme={mode} // globals.css의 [data-theme] 셀렉터와 연동
      className={`
        w-full max-w-md min-h-screen shadow-2xl overflow-hidden flex flex-col relative mx-auto
        transition-colors duration-500 ease-in-out
        ${isPain ? "bg-pain-bg text-pain-text" : "bg-base-bg text-base-text"}
      `}
    >
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
