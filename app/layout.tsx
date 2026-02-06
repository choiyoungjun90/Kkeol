import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "살껄. 팔껄. (Buy or Bye)",
  description: "그때 살껄, 그때 팔껄... 당신의 후회를 데이터로 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900">
        <AuthProvider>
          <div className="w-full max-w-md bg-white dark:bg-black min-h-screen shadow-2xl overflow-hidden flex flex-col relative">
            <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
              {children}
            </div>
            <BottomNav />
          </div>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
