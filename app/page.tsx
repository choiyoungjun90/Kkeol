"use client";

import Calculator from "@/components/Calculator";
import { useThemeStore } from "@/store/theme";
import { cn } from "@/lib/utils";

export default function Home() {
  const { mode } = useThemeStore();
  const isPain = mode === "pain";

  return (
    <main className="flex-1 flex flex-col items-center justify-start pt-10 p-4 text-center space-y-6 overflow-y-auto pb-20">
      <div className="space-y-2 mb-4">
        <h1
          className={cn(
            "text-3xl font-black tracking-tighter transition-colors duration-300",
            isPain ? "text-pain-text" : "text-base-text"
          )}
        >
          <span className="text-primary">살껄</span>.{" "}
          <span className="text-state-danger">팔껄</span>.
        </h1>
        <p
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            isPain ? "text-pain-subtext" : "text-base-subtext"
          )}
        >
          이미 지나간 버스, 요금이라도 확인해보자.
        </p>
      </div>

      <Calculator />

      <div className="w-full max-w-sm grid grid-cols-2 gap-3 px-4">
        <button
          className={cn(
            "py-3 px-4 rounded-xl font-bold text-sm transition-colors duration-300",
            isPain
              ? "bg-pain-card text-pain-subtext hover:bg-gray-800"
              : "bg-base-card text-base-subtext hover:bg-gray-100"
          )}
        >
          🔥 실시간 투표
        </button>
        <button
          className={cn(
            "py-3 px-4 rounded-xl font-bold text-sm transition-colors duration-300",
            isPain
              ? "bg-pain-card text-pain-subtext hover:bg-gray-800"
              : "bg-base-card text-base-subtext hover:bg-gray-100"
          )}
        >
          🏆 명예의 전당
        </button>
      </div>

      <div
        className={cn(
          "pt-8 opacity-30 text-[10px] transition-colors duration-300",
          isPain ? "text-pain-subtext" : "text-base-subtext"
        )}
      >
        © 2026 Buy or Bye. 재미로만 보세요.
      </div>
    </main>
  );
}