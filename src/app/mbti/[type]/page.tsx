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

const MbtiPage = () => {
  const { type } = useParams(); // URL에서 MBTI 타입을 가져옴
  const [memes, setMemes] = useState<Meme[]>([]); // Meme 타입의 배열로 상태 정의
  const [error, setError] = useState<string | null>(null); // 오류 메시지 상태

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        // 환경변수에서 API URL 가져옴
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        
        // 해당 MBTI 타입에 대한 밈 데이터를 API 호출
        const response = await fetch(`${API_URL}/memes/${type}`);
        if (!response.ok) throw new Error(`Failed to fetch memes for type: ${type}`);

        // API 응답을 JSON 형태로 파싱 후 상태 업데이트
        const data = await response.json();
        setMemes(data);
      } catch (err: unknown) {
        // 에러가 발생한 경우 오류 메시지를 상태에 저장
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        console.error(err);
      }
    };

    fetchMemes();
  }, [type]); // 타입이 바뀔 때마다 호출하도록 설정

  // MBTI 타입이 잘못되었거나 데이터가 없는 경우 처리
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
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
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">{type} Memes</h1>
        <p className="mt-2 text-lg">Enjoy memes curated specifically for {type}!</p>
      </header>

      {/* Meme Grid */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
          >
            <Image
              src={meme.url} // API에서 반환되는 URL 사용
              alt={meme.alt}
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-16">
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Back to Home
        </Link>
      </footer>
    </div>
  );
};

export default MbtiPage;