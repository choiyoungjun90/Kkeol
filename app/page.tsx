import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-start pt-10 p-4 text-center space-y-6 overflow-y-auto pb-20">
      <div className="space-y-2 mb-4">
        <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
          <span className="text-blue-600">살껄</span>. <span className="text-red-500">팔껄</span>.
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          이미 지나간 버스, 요금이라도 확인해보자.
        </p>
      </div>

      <Calculator />

      <div className="w-full max-w-sm grid grid-cols-2 gap-3 px-4">
           <button className="py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 transition-colors">
             🔥 실시간 투표
           </button>
           <button className="py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 transition-colors">
             🏆 명예의 전당
           </button>
      </div>

      <div className="pt-8 opacity-30 text-[10px]">
        © 2026 Buy or Bye. 재미로만 보세요.
      </div>
    </main>
  );
}