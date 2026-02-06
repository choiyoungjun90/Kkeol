"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/theme";
import AttendanceCheck from "@/components/AttendanceCheck";
import HumanIndicator from "@/components/HumanIndicator";
import { Settings, ChevronRight, User, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MyPage() {
  const { user } = useAuthStore();
  const { mode, toggleMode } = useThemeStore();
  const isPain = mode === "pain";

  return (
    <div className="min-h-full">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-40 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b transition-all duration-300",
          isPain
            ? "bg-pain-bg/80 border-pain-border"
            : "bg-base-bg/80 border-base-border",
        )}
      >
        <h1
          className={cn(
            "text-xl font-bold tracking-tight",
            isPain ? "text-pain-text" : "text-base-text",
          )}
        >
          내 정보
        </h1>
        <button
          className={cn(
            "p-2 -mr-2 transition-colors",
            isPain
              ? "text-pain-subtext hover:text-white"
              : "text-base-subtext hover:text-black",
          )}
        >
          <Settings size={22} />
        </button>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <section
          className={cn(
            "rounded-3xl p-6 shadow-sm border transition-all duration-300 flex items-center gap-4",
            isPain
              ? "bg-pain-card border-pain-border"
              : "bg-base-card border-base-border",
          )}
        >
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              isPain
                ? "bg-gray-800 text-gray-500"
                : "bg-gray-100 text-gray-400",
            )}
          >
            <User size={32} />
          </div>
          <div className="flex-1">
            <h2
              className={cn(
                "text-lg font-bold",
                isPain ? "text-pain-text" : "text-base-text",
              )}
            >
              {user?.user_metadata?.nickname || "익명 껄무새"}
            </h2>
            <p
              className={cn(
                "text-xs font-medium",
                isPain ? "text-pain-subtext" : "text-base-subtext",
              )}
            >
              {user?.email || "비회원 (익명 로그인)"}
            </p>
          </div>
          <ChevronRight
            size={20}
            className={isPain ? "text-gray-600" : "text-gray-300"}
          />
        </section>

        <AttendanceCheck />
        <HumanIndicator />

        {/* Menu List */}
        <section
          className={cn(
            "rounded-3xl overflow-hidden shadow-sm border transition-all duration-300",
            isPain
              ? "bg-pain-card border-pain-border"
              : "bg-base-card border-base-border",
          )}
        >
          {/* 테마 변경 토글 */}
          <div
            onClick={toggleMode}
            className={cn(
              "p-4 border-b flex justify-between items-center cursor-pointer transition-colors",
              isPain
                ? "border-pain-border hover:bg-white/5"
                : "border-base-border hover:bg-black/5",
            )}
          >
            <div className="flex items-center gap-3">
              {isPain ? (
                <Moon size={18} className="text-painAccent-blue" />
              ) : (
                <Sun size={18} className="text-orange-500" />
              )}
              <span
                className={cn(
                  "text-sm font-bold",
                  isPain ? "text-pain-text" : "text-base-text",
                )}
              >
                {isPain ? "흑우(Pain) 모드" : "기본 모드"}
              </span>
            </div>

            <div
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors duration-300",
                isPain ? "bg-painAccent-blue" : "bg-gray-200",
              )}
            >
              <div
                className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-300",
                  isPain ? "translate-x-5" : "translate-x-0",
                )}
              />
            </div>
          </div>

          {/* 메뉴 아이템들 */}
          {[
            { label: "내가 쓴 글", color: "" },
            { label: "내가 투표한 종목", color: "" },
            { label: "로그아웃", color: "text-red-500", noBorder: true },
          ].map((item, id) => (
            <div
              key={id}
              className={cn(
                "p-4 flex justify-between items-center cursor-pointer transition-colors",
                !item.noBorder &&
                  (isPain
                    ? "border-b border-pain-border"
                    : "border-b border-base-border"),
                isPain ? "hover:bg-white/5" : "hover:bg-black/5",
              )}
            >
              <span
                className={cn(
                  "text-sm font-bold",
                  item.color || (isPain ? "text-pain-text" : "text-base-text"),
                )}
              >
                {item.label}
              </span>
              {!item.color && (
                <ChevronRight
                  size={18}
                  className={isPain ? "text-gray-600" : "text-gray-300"}
                />
              )}
            </div>
          ))}
        </section>

        <div className="text-center pb-10">
          <p
            className={cn(
              "text-[10px] font-medium italic transition-colors",
              isPain ? "text-gray-600" : "text-gray-400",
            )}
          >
            "투자는 본인의 책임입니다. 껄무새의 조언을 듣지 마세요."
          </p>
        </div>
      </div>
    </div>
  );
}
