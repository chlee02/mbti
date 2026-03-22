import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const mbtiTypes = [
    "ESTJ", "ESTP", "ESFJ", "ESFP",
    "ENTJ", "ENTP", "ENFJ", "ENFP",
    "ISTJ", "ISTP", "ISFJ", "ISFP",
    "INTJ", "INTP", "INFJ", "INFP"
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Header Section */}
      <header className="relative w-full max-w-5xl px-6 pt-12 pb-12 flex flex-col items-center border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-8 mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          mbti 밈 저장소
        </h1>

        <div className="w-full flex justify-end px-2 mb-4">
          <Link 
            href="/test" 
            className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:border-blue-500 text-sm font-bold transition-all duration-300"
          >
            내 MBTI 확인하기
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        {/* MBTI Selection Grid (Top Aligned) */}
        <nav className="w-full">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {mbtiTypes.map((type) => (
              <a
                key={type}
                href={`/mbti/${type}`}
                className="group relative flex items-center justify-center p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm"
              >
                <span className="text-sm font-bold tracking-tight group-hover:scale-110 transition-transform">
                  {type}
                </span>
                <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content Area (Reserved for future images) */}
      <main className="flex-1 w-full max-w-5xl p-6">
        {/* Placeholder for future images */}
        <div className="w-full py-20 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-2xl opacity-50">
          <p className="text-zinc-400 font-medium">Coming Soon: Trending Memes</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-900">
        <p>© 2026 mbti 밈 저장소. All rights reserved.</p>
      </footer>
    </div>
  );
}

// git commit test