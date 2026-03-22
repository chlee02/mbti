'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  dimension: 'ei' | 'sn' | 'tf' | 'jp';
  score: number; // Score to add if "Yes" (negative if "Yes" favors the other side)
}

const questions: Question[] = [
  { id: 1, text: "낯선 사람들과 어울리는 것보다 혼자 있는 것이 편한가요?", dimension: 'ei', score: -3 },
  { id: 2, text: "실제 경험보다는 상상이나 아이디어에 더 관심이 많나요?", dimension: 'sn', score: 3 },
  { id: 3, text: "결정을 내릴 때 감정보다는 논리적인 이유를 더 중요하게 생각하나요?", dimension: 'tf', score: 3 },
  { id: 4, text: "계획을 세우기보다는 상황에 맞춰 유연하게 행동하는 것을 선호하시나요?", dimension: 'jp', score: -3 },
  // 나중에 질문을 더 추가할 수 있는 구조입니다.
];

export default function TestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ ei: 0, sn: 0, tf: 0, jp: 0 });
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (isYes: boolean) => {
    const q = questions[currentStep];
    const scoreDelta = isYes ? q.score : -q.score;

    setScores(prev => ({
      ...prev,
      [q.dimension]: prev[q.dimension] + scoreDelta
    }));

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateResult = () => {
    let result = "";
    result += scores.ei >= 0 ? "E" : "I";
    result += scores.sn >= 0 ? "N" : "S";
    result += scores.tf >= 0 ? "T" : "F";
    result += scores.jp >= 0 ? "J" : "P";
    return result;
  };

  if (isFinished) {
    const mbti = calculateResult();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-zinc-900 p-6">
        <h2 className="text-2xl font-bold mb-4">테스트 완료!</h2>
        <p className="text-zinc-500 mb-8">당신의 성격 유형은...</p>
        <div className="bg-zinc-50 border border-blue-500/20 p-10 rounded-3xl shadow-xl flex flex-col items-center">
          <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-purple-600 tracking-tighter">
            {mbti}
          </span>
          <Link
            href={`/mbti/${mbti}`}
            className="mt-10 px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            {mbti} 밈 보러가기 →
          </Link>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 text-zinc-400 hover:text-zinc-600 transition-colors underline underline-offset-4"
        >
          다시 테스트하기
        </button>
      </div>
    );
  }

  const progress = ((currentStep) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-zinc-900 p-6">
      <header className="w-full max-w-2xl mt-10 mb-20 text-center">
        <Link href="/" className="text-zinc-400 hover:text-zinc-600 transition-colors text-sm font-bold">← 홈으로 돌아가기</Link>
        <div className="mt-8 w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-zinc-400 text-xs font-mono uppercase tracking-widest">{currentStep + 1} / {questions.length}</p>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center">
        <div className="min-h-[200px] flex items-center justify-center text-center p-6">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-zinc-800">
            {questions[currentStep].text}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-10">
          <button
            onClick={() => handleAnswer(true)}
            className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-xl font-bold text-zinc-700 hover:text-blue-600"
          >
            예
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-xl font-bold text-zinc-700 hover:text-purple-600"
          >
            아니오
          </button>
        </div>
      </main>
    </div>
  );
}

