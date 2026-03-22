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
}

const customLoader = ({ src }: { src: string }) => src;

const MbtiPage = () => {
  const { type } = useParams();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
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

    fetchMemes();
  }, [type]);

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
      {/* Header Section (Consistent with Home) */}
      <header className="w-full max-w-5xl px-6 pt-12 pb-8 flex flex-col items-center border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="group mb-8">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 group-hover:opacity-80 transition-opacity">
            mbti 밈 저장소
          </h1>
        </Link>
        
        {/* MBTI Selection Grid (Top Nav) */}
        <nav className="w-full">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {mbtiTypes.map((t) => (
              <a
                key={t}
                href={`/mbti/${t}`}
                className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                  t === type 
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-md" 
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500"
                }`}
              >
                <span className="text-xs font-bold">{t}</span>
              </a>
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
        <div className="text-sm font-medium text-zinc-400">
          Showing {memes.length} memes
        </div>
      </div>

      <main className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4 w-full max-w-5xl mx-auto px-6 pb-20">
        {memes.map((meme, index) => (
          <div
            key={`${meme.id}-${index}`}
            className="break-inside-avoid bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedMeme(meme)}
          >
            <Image
              loader={customLoader}
              src={meme.url}
              alt={meme.alt}
              width={400}
              height={400}
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-900">
        <Link href="/" className="hover:text-blue-500 transition-colors">© 2026 mbti 밈 저장소</Link>
      </footer>

      {selectedMeme && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4" onClick={() => setSelectedMeme(null)}>
          <div className="relative flex flex-col items-center justify-center max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              loader={customLoader}
              src={selectedMeme.url}
              alt={selectedMeme.alt}
              width={2200}
              height={2200}
              className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-md cursor-pointer"
              onClick={() => setSelectedMeme(null)}
            />
            <div className="mt-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
              출처: {new URL(selectedMeme.url).hostname.replace('www.', '')}
            </div>
            <button 
              className="absolute top-0 right-0 -mt-10 -mr-10 text-white hover:text-gray-300 text-3xl font-bold"
              onClick={() => setSelectedMeme(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MbtiPage;