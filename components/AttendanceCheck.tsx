'use client';

import React, { useState, useEffect } from 'react';
import { Droplets, Calendar, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/theme';

export default function AttendanceCheck() {
  const [streak, setStreak] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { mode } = useThemeStore();
  const isPain = mode === "pain";

  useEffect(() => {
    // Mocking persistence with localStorage
    const saved = localStorage.getItem('attendance_data');
    if (saved) {
      const { lastDate, count } = JSON.parse(saved);
      const today = new Date().toDateString();
      setStreak(count);
      setIsChecked(lastDate === today);
    }
    setLoading(false);
  }, []);

  const handleWipeTears = () => {
    if (isChecked) {
      toast.info('이미 오늘의 눈물을 닦았습니다. 앵무새가 기분 좋아 보여요!');
      return;
    }

    const today = new Date().toDateString();
    const newStreak = streak + 1;
    
    setStreak(newStreak);
    setIsChecked(true);
    
    localStorage.setItem('attendance_data', JSON.stringify({
      lastDate: today,
      count: newStreak
    }));

    toast.success(`${newStreak}일째 눈물 닦기 완료! 앵무새가 고마워합니다.`, {
      icon: '🦜',
    });
  };

  if (loading) return null;

  return (
    <div className={cn(
      "rounded-3xl p-6 shadow-sm border space-y-4 transition-colors duration-300",
      isPain ? "bg-pain-card border-pain-border" : "bg-base-card border-base-border"
    )}>
      <div className="flex justify-between items-center">
        <div className="space-y-1 text-left">
          <h3 className={cn(
            "text-lg font-bold flex items-center gap-2 transition-colors duration-300",
            isPain ? "text-pain-text" : "text-base-text"
          )}>
            눈물 닦아주기 🦜
          </h3>
          <p className={cn(
            "text-xs font-medium transition-colors duration-300",
            isPain ? "text-pain-subtext" : "text-base-subtext"
          )}>
            슬퍼하는 껄무새의 눈물을 닦아주세요.
          </p>
        </div>
        <div className={cn(
          "px-3 py-1.5 rounded-2xl flex items-center gap-1.5 transition-colors duration-300 font-bold",
          isPain ? "bg-gray-800 text-painAccent-blue" : "bg-primary-soft text-primary"
        )}>
            <Calendar size={14} />
            <span className="text-sm">{streak}일</span>
        </div>
      </div>

      <div className="relative flex flex-col items-center py-4">
        <button 
          onClick={handleWipeTears}
          disabled={isChecked}
          className={cn(
            "relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden",
            isChecked 
              ? (isPain ? "bg-gray-800 ring-4 ring-painAccent-blue/30" : "bg-yellow-50 ring-4 ring-yellow-400/30") 
              : (isPain ? "bg-pain-bg hover:bg-gray-800 shadow-inner" : "bg-blue-50 hover:bg-blue-100 shadow-inner")
          )}
        >
          {/* Parrot Image Placeholder */}
          <div className="relative z-10 w-32 h-32 flex items-center justify-center text-6xl">
             <span className={cn("transition-transform duration-700", isChecked ? "scale-110 rotate-12" : "grayscale-[0.5]")}>
                {isChecked ? '🦜✨' : '🦜'}
             </span>
             
             {/* Tear Droplets (Animated when not checked) */}
             {!isChecked && (
                 <>
                    <Droplets 
                        size={20} 
                        className="absolute top-10 left-6 text-painAccent-blue animate-bounce transition-opacity duration-300" 
                    />
                    <Droplets 
                        size={16} 
                        className="absolute top-12 left-10 text-blue-300 animate-pulse delay-700 transition-opacity duration-300" 
                    />
                 </>
             )}
          </div>

          {/* Wipe Effect Overlay */}
          {!isChecked && (
              <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white bg-primary/80 px-3 py-1 rounded-full text-[10px] font-bold">
                    터치해서 닦기
                  </span>
              </div>
          )}

          {isChecked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Heart size={40} className="text-state-danger fill-state-danger animate-ping opacity-0" />
              </div>
          )}
        </button>

        <div className="mt-4 text-center">
            <p className={cn(
                "font-bold text-sm transition-colors duration-300",
                isChecked 
                  ? (isPain ? "text-painAccent-blue" : "text-yellow-600") 
                  : (isPain ? "text-painAccent-red" : "text-primary")
            )}>
                {isChecked ? '기분이 좋아진 껄무새!' : '껄무새가 울고 있어요...'}
            </p>
            {isChecked && (
                <p className={cn(
                  "text-[10px] mt-1 animate-pulse transition-colors duration-300",
                  isPain ? "text-pain-subtext" : "text-base-subtext"
                )}>
                    내일 다시 눈물을 닦으러 오세요!
                </p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 pt-2">
        {[...Array(7)].map((_, i) => (
            <div 
                key={i} 
                className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i < (streak % 8) 
                      ? (isPain ? "bg-painAccent-blue shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]") 
                      : (isPain ? "bg-gray-800" : "bg-gray-100")
                )}
            />
        ))}
      </div>
      
      <p className={cn(
        "text-[10px] text-center transition-colors duration-300",
        isPain ? "text-pain-subtext" : "text-base-subtext"
      )}>
        7일 연속 눈물을 닦으면 특별한 <span className={cn(
          "font-bold",
          isPain ? "text-painAccent-yellow" : "text-yellow-600"
        )}>'황금 껄무새'</span> 스킨을 드립니다!
      </p>
    </div>
  );
}
