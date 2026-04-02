'use client';

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Meme 타입 정의
interface Meme {
  id: number;
  url: string;
  alt: string;
  recommendations: number;
}

const customLoader = ({ src }: { src: string }) => src;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const MbtiPage = () => {
  const { type } = useParams();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [numCols, setNumCols] = useState<number>(2); // 기본값 2

  const fetchMemes = async () => {
    try {
      const response = await fetch(`${API_URL}/memes/${type}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setMemes(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, [type]);

  // 화면 크기에 따른 컬럼 수 계산
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setNumCols(5);
      else if (width >= 768) setNumCols(4);
      else if (width >= 640) setNumCols(3);
      else setNumCols(2);
    };

    handleResize(); // 초기화
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 데이터를 컬럼별로 분산 (좌->우 흐름용)
  const getColumns = () => {
    const cols: Meme[][] = Array.from({ length: numCols }, () => []);
    memes.forEach((meme, index) => {
      cols[index % numCols].push(meme);
    });
    return cols;
  };

  const handleRecommend = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/memes/${id}/recommend`, {
        method: 'POST',
      });
      if (response.ok) {
        // 성공 시 로컬 상태 업데이트 (추천수 +1, 즉시 정렬은 하지 않음)
        setMemes(prev => prev.map(m => 
          m.id === id ? { ...m, recommendations: m.recommendations + 1 } : m
        ));
        
        if (selectedMeme && selectedMeme.id === id) {
          setSelectedMeme(prev => prev ? { ...prev, recommendations: prev.recommendations + 1 } : null);
        }
      }
    } catch (err) {
      console.error("Failed to recommend:", err);
    }
  };

  const handleDislike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/memes/${id}/dislike`, {
        method: 'POST',
      });
      if (response.ok) {
        // 성공 시 로컬 상태 업데이트 (추천수 -1, 즉시 정렬은 하지 않음)
        setMemes(prev => prev.map(m => 
          m.id === id ? { ...m, recommendations: m.recommendations - 1 } : m
        ));
        
        if (selectedMeme && selectedMeme.id === id) {
          setSelectedMeme(prev => prev ? { ...prev, recommendations: prev.recommendations - 1 } : null);
        }
      }
    } catch (err) {
      console.error("Failed to dislike:", err);
    }
  };

  const mbtiTypes = [
    "ESTJ", "ESTP", "ESFJ", "ESFP",
    "ENTJ", "ENTP", "ENFJ", "ENFP",
    "ISTJ", "ISTP", "ISFJ", "ISFP",
    "INTJ", "INTP", "INFJ", "INFP"
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <h1 className="text-2xl font-bold">Error Loading Memes</h1>
        <p className="mt-4">{error}</p>
        <Link href="/" className="mt-8 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:opacity-80 transition">
          Go Back Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <h1 className="text-2xl font-bold animate-pulse text-zinc-400">Loading Memes...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Header Section */}
      <header className="w-full max-w-5xl px-6 pt-12 pb-8 flex flex-col items-center border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="group mb-8">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 group-hover:opacity-80 transition-opacity">
            mbti 밈 저장소
          </h1>
        </Link>
        
        <nav className="w-full">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {mbtiTypes.map((t) => (
              <Link
                key={t}
                href={`/mbti/${t}`}
                className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                  t === type 
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-md" 
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500"
                }`}
              >
                <span className="text-xs font-bold">{t}</span>
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Current Type Header */}
      <div className="w-full max-w-5xl px-6 py-10 flex items-center justify-between">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
          {type}
          <span className="ml-2 text-blue-500">.</span>
        </h2>
        <div className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <span>{memes.length} memes found</span>
          <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
          <span>Sorted by popularity</span>
        </div>
      </div>

      <main className="flex flex-row gap-4 justify-center w-full max-w-5xl mx-auto px-6 pb-20 items-start">
        {getColumns().map((column, colIndex) => (
          <div key={`col-${colIndex}`} className="flex flex-col gap-4 flex-1">
            {column.map((meme) => (
              <div
                key={meme.id}
                className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedMeme(meme)}
              >
                <Image
                  loader={customLoader}
                  src={meme.url}
                  alt={meme.alt}
                  width={400}
                  height={400}
                  className="w-full h-auto block object-cover"
                />
                
                {/* 추천/비추천 통합 버튼 (데스크톱 hover / 모바일 상시) - 화살표 스타일 */}
                <div className="absolute bottom-3 right-3 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 z-20">
                  <div className="flex items-center bg-black/60 backdrop-blur-md rounded-full px-1 py-1 border border-white/20 shadow-xl overflow-hidden">
                    <button 
                      onClick={(e) => handleRecommend(e, meme.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-white hover:bg-white/10 hover:scale-110 active:scale-125 transition-all"
                      title="추천"
                    >
                      <span className="text-zinc-300 text-[10px]">▲</span>
                      <span className="text-[11px] font-black">{meme.recommendations || 0}</span>
                    </button>
                    <button 
                      onClick={(e) => handleDislike(e, meme.id)}
                      className="flex items-center px-2.5 py-1 text-white hover:bg-white/10 hover:scale-110 active:scale-125 transition-all"
                      title="비추천"
                    >
                      <span className="text-zinc-300 text-[10px]">▼</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>

      <footer className="w-full py-12 text-center text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-900">
        <Link href="/" className="hover:text-blue-500 transition-colors">© 2026 mbti 밈 저장소</Link>
      </footer>

      {selectedMeme && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4 cursor-pointer animate-in fade-in duration-300" 
          onClick={() => setSelectedMeme(null)}
        >
          <div className="relative flex flex-col items-center justify-center max-w-[95vw] md:max-w-4xl w-full max-h-[95vh]">
            <div className="relative w-full flex justify-center">
              <Image
                loader={customLoader}
                src={selectedMeme.url}
                alt={selectedMeme.alt}
                width={2000}
                height={2000}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform"
              />
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="text-white/40 text-[10px] font-medium tracking-widest uppercase">
                {new URL(selectedMeme.url).hostname.replace('www.', '')}
              </div>
            </div>

            <button 
              className="absolute -top-14 right-0 text-white/50 hover:text-white transition-colors p-2"
              onClick={() => setSelectedMeme(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MbtiPage;