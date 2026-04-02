'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Meme {
  id: number;
  url: string;
  alt: string;
  type: string;
  recommendations: number;
}

const customLoader = ({ src }: { src: string }) => src;
// 배포 환경에서 환경 변수가 없을 경우 상대 경로 사용 (localhost가 아닐 때)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:8080');

export default function Home() {
  const [featuredMemes, setFeaturedMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  const mbtiTypes = [
    "ESTJ", "ESTP", "ESFJ", "ESFP",
    "ENTJ", "ENTP", "ENFJ", "ENFP",
    "ISTJ", "ISTP", "ISFJ", "ISFP",
    "INTJ", "INTP", "INFJ", "INFP"
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/api/memes/featured`);
        if (response.ok) {
          const data = await response.json();
          setFeaturedMemes(data);
        }
      } catch (err) {
        console.error("Failed to fetch featured memes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

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
        
        <nav className="w-full">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {mbtiTypes.map((type) => (
              <Link
                key={type}
                href={`/mbti/${type}`}
                className="group relative flex items-center justify-center p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm"
              >
                <span className="text-sm font-bold tracking-tight group-hover:scale-110 transition-transform">
                  {type}
                </span>
                <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Featured Section */}
      <main className="flex-1 w-full max-w-5xl py-12 px-6 overflow-hidden">
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h2 className="text-2xl font-black tracking-tight">오늘의 인기 밈</h2>
            <p className="text-sm text-zinc-500 mt-1">추천 점수가 높은 MBTI 밈들을 만나보세요.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Live Trending</div>
          </div>
        </div>

        {loading ? (
          <div className="w-full h-80 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl animate-pulse">
            <span className="text-zinc-400 font-medium">인기 밈 불러오는 중...</span>
          </div>
        ) : featuredMemes.length > 0 ? (
          <div className="relative group">
            <div className="flex gap-4 overflow-x-auto pb-8 pt-2 px-2 scrollbar-hide snap-x transition-all">
              {featuredMemes.map((meme) => (
                <Link
                  key={meme.id}
                  href={`/mbti/${meme.type}`}
                  className="flex-none w-64 h-96 relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 snap-start bg-zinc-100 dark:bg-zinc-900"
                >
                  <Image
                    loader={customLoader}
                    src={meme.url}
                    alt={meme.alt}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                  {/* Overlay Info */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md uppercase tracking-tighter">
                        {meme.type}
                      </span >
                      <div className="flex items-center gap-1 text-white">
                        <span className="text-red-500 text-xs">▲</span>
                        <span className="text-xs font-bold">{meme.recommendations}</span>
                      </div >
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Scroll Indicator (Visual Fade Out) */}
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <p className="text-zinc-400 font-medium italic">아직 추천된 인기 밈이 없습니다.</p>
            <p className="text-xs text-zinc-500 mt-2">MBTI 페이지에서 밈을 추천해 보세요!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 text-center text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <p className="mb-2">© 2026 mbti 밈 저장소. All rights reserved.</p>
        <div className="flex justify-center gap-4 text-[10px] uppercase tracking-widest font-bold opacity-30">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    </div>
  );
}