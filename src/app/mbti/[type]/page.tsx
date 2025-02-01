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
  const [error, setError] = useState<string | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);

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
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
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
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">{type} Memes</h1>
        <p className="mt-2 text-lg">Enjoy memes curated specifically for {type}!</p>
      </header>

      <main className="columns-5 gap-4 w-full max-w-6xl space-y-4">
        {memes.map((meme, index) => (
          <div
            key={`${meme.id}-${index}`}
            className="break-inside-avoid bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => setSelectedMeme(meme)}
          >
            <Image
              loader={customLoader}
              src={meme.url}
              alt={meme.alt}
              width={400}
              height={400}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        ))}
      </main>

      <footer className="mt-16">
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Back to Home
        </Link>
      </footer>

      {selectedMeme && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-screen-2xl">
            <Image
              loader={customLoader}
              src={selectedMeme.url}
              alt={selectedMeme.alt}
              width={2200}
              height={2200}
              className="w-auto max-h-[95vh] object-contain cursor-pointer"
              onClick={() => setSelectedMeme(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MbtiPage;