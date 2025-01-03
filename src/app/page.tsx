import Image from "next/image";

export default function Home() {
  const mbtiTypes = [
    "ESTJ",
    "ESTP",
    "ESFJ",
    "ESFP",
    "ENTJ",
    "ENTP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISTP",
    "ISFJ",
    "ISFP",
    "INTJ",
    "INTP",
    "INFJ",
    "INFP"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Header */}
      <header className="flex flex-col items-center gap-4">
        <Image
          src="/mbti-logo.svg" // 적합한 로고를 public 폴더에 추가하세요
          alt="MBTI Meme Site Logo"
          width={150}
          height={150}
          priority
        />
        <h1 className="text-4xl font-bold text-center">
          Welcome to the MBTI Meme Site!
        </h1>
        <p className="text-center text-lg max-w-2xl">
          Explore memes curated for each MBTI type. Click your personality type
          below and dive into the fun!
        </p>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
        {mbtiTypes.map((type) => (
          <a
            key={type}
            href={`/mbti/${type}`}
            className="flex items-center justify-center w-28 h-28 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <span className="text-xl font-semibold">{type}</span>
          </a>
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm">
        <p>
          Built with ❤️ using{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            Next.js
          </a>{" "}
          and hosted on{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            Vercel
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
// git commit test