import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner";
import ThemeWrapper from "@/components/layout/ThemeWrapper"; // 경로 확인 필요

export const metadata: Metadata = {
  title: "살껄. 팔껄. (Buy or Bye)",
  description: "그때 살껄, 그때 팔껄... 당신의 후회를 데이터로 확인하세요.",
  // 모바일 웹앱 느낌을 위해 뷰포트 설정 추천
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* body 배경은 데스크탑에서 볼 때 앱 바깥 영역입니다. 
        앱 분위기에 맞춰 어둡게 가거나 깔끔한 회색으로 둡니다.
      */}
      <body className="antialiased min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
        <AuthProvider>
          {/* ThemeWrapper가 'max-w-md' 컨테이너 역할과 '모드 전환'을 모두 수행합니다 */}
          <ThemeWrapper>{children}</ThemeWrapper>

          <Toaster
            position="top-center"
            toastOptions={{
              // Toaster도 모드에 따라 스타일링하면 좋지만 일단 기본 설정
              className: "font-sans",
              duration: 2000,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
