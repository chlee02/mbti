'use client';

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from "react";

// Meme 타입 정의
interface Meme {
  id: number;
  url: string;
  alt: string;
}

const customLoader = ({ src }: { src: string }) => src;

const MbtiPage = () => {
  const { type } = useParams(); // URL에서 MBTI 타입을 가져옴
  const [memes, setMemes] = useState<Meme[]>([]); // Meme 타입의 배열로 상태 정의
  const [error, setError] = useState<string | null>(null); // 오류 메시지 상태

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await fetch(`${API_URL}/memes/${type}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setMemes(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        console.error(err);
      }
    };

    fetchMemes();
  }, [type]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
        <h1 className="text-2xl font-bold">Error Loading Memes</h1>
        <p className="mt-4">{error}</p>
        <Link href="/" className="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Go Back Home
        </Link>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
        <h1 className="text-2xl font-bold">No Memes Found</h1>
        <p className="mt-4">
          The MBTI type <strong>{type}</strong> doesn&apos;t have any memes yet.
        </p>
        <Link href="/" className="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">{type} Memes</h1>
        <p className="mt-2 text-lg">Enjoy memes curated specifically for {type}!</p>
      </header>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme, index) => (
          <div key={`${meme.id}-${index}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <Image
              loader={customLoader}
              src={meme.url}
              alt={meme.alt}
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        ))}
      </main>
      <footer className="mt-16">
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Back to Home
        </Link>
      </footer>
    </div>
  );
};

export default MbtiPage;