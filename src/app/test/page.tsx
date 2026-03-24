'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  dimension: string; // 'ei', 'sn', 'tf', 'jp' OR 'ni', 'ne', 'si', 'se', 'ti', 'te', 'fi', 'fe'
  score: number;
}

const simpleQuestions: Question[] = [
  { id: 1, text: "낯선 사람들과 어울리는 것보다 혼자 있는 것이 편한가요?", dimension: 'ei', score: -3 },
  { id: 2, text: "실제 경험보다는 상상이나 아이디어에 더 관심이 많나요?", dimension: 'sn', score: 3 },
  { id: 3, text: "결정을 내릴 때 감정보다는 논리적인 이유를 더 중요하게 생각하나요?", dimension: 'tf', score: 3 },
  { id: 4, text: "계획을 세우기보다는 상황에 맞춰 유연하게 행동하는 것을 선호하시나요?", dimension: 'jp', score: -3 },
];

const precisionQuestions: Question[] = [
  { id: 1, text: "복잡한 상황 속에서도 미래의 가능성을 꿰뚫어 보는 편인가요? (Ni)", dimension: 'ni', score: 5 },
  { id: 2, text: "항상 새로운 아이디어나 대안을 생각하는 것을 즐기시나요? (Ne)", dimension: 'ne', score: 5 },
  { id: 3, text: "과거의 경험과 구체적인 데이터를 바탕으로 결정하시나요? (Si)", dimension: 'si', score: 5 },
  { id: 4, text: "현재 이 순간의 감각적인 즐거움과 행동에 집중하는 편인가요? (Se)", dimension: 'se', score: 5 },
  { id: 5, text: "논리적 일관성과 정확한 체계를 세우는 것을 좋아하시나요? (Ti)", dimension: 'ti', score: 5 },
  { id: 6, text: "효율성과 목표 달성을 위해 주변 환경을 정리하는 편인가요? (Te)", dimension: 'te', score: 5 },
  { id: 7, text: "자신의 내면적인 가치와 신념을 가장 중요하게 생각하시나요? (Fi)", dimension: 'fi', score: 5 },
  { id: 8, text: "주변 사람들과의 조화와 감정적인 유대감을 중시하시나요? (Fe)", dimension: 'fe', score: 5 },
];

type TestMode = 'selection' | 'simple' | 'precision';

interface HistoryState {
  currentStep: number;
  scores: any;
}

export default function TestPage() {
  const [testMode, setTestMode] = useState<TestMode>('selection');
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<any>({});
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const startTest = (mode: TestMode) => {
    setTestMode(mode);
    setCurrentStep(0);
    setScores(mode === 'simple' ? { ei: 0, sn: 0, tf: 0, jp: 0 } : { ni: 0, ne: 0, si: 0, se: 0, ti: 0, te: 0, fi: 0, fe: 0 });
    setHistory([]);
    setIsFinished(false);
  };

  const handleAnswer = (isYes: boolean) => {
    const questions = testMode === 'simple' ? simpleQuestions : precisionQuestions;
    const q = questions[currentStep];
    const scoreDelta = isYes ? q.score : -q.score;
    
    // Save to history
    setHistory(prev => [...prev, { currentStep, scores: { ...scores } }]);

    const newScores = {
      ...scores,
      [q.dimension]: scores[q.dimension] + scoreDelta
    };
    setScores(newScores);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const goBack = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setCurrentStep(previousState.currentStep);
    setScores(previousState.scores);
    setHistory(prev => prev.slice(0, -1));
  };

  const calculateResult = () => {
    if (testMode === 'simple') {
      let result = "";
      result += scores.ei >= 0 ? "E" : "I";
      result += scores.sn >= 0 ? "N" : "S";
      result += scores.tf >= 0 ? "T" : "F";
      result += scores.jp >= 0 ? "J" : "P";
      return result;
    } else {
      // Precision Calculation Logic (Simplified Function Stack)
      const e_score = (scores.ne || 0) + (scores.se || 0) + (scores.te || 0) + (scores.fe || 0);
      const i_score = (scores.ni || 0) + (scores.si || 0) + (scores.ti || 0) + (scores.fi || 0);
      const n_score = (scores.ni || 0) + (scores.ne || 0);
      const s_score = (scores.si || 0) + (scores.se || 0);
      const t_score = (scores.ti || 0) + (scores.te || 0);
      const f_score = (scores.fi || 0) + (scores.fe || 0);
      
      let res = "";
      res += e_score >= i_score ? "E" : "I";
      res += n_score >= s_score ? "N" : "S";
      res += t_score >= f_score ? "T" : "F";
      
      const judging_max = Math.max(scores.ti || 0, scores.te || 0, scores.fi || 0, scores.fe || 0);
      const perceiving_max = Math.max(scores.ni || 0, scores.ne || 0, scores.si || 0, scores.se || 0);
      res += judging_max >= perceiving_max ? "J" : "P";
      
      return res;
    }
  };

  if (testMode === 'selection') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-zinc-900 p-6">
        <header className="mb-16 text-center">
          <Link href="/" className="text-zinc-400 hover:text-zinc-600 transition-colors text-sm font-bold">← 홈으로 돌아가기</Link>
          <h1 className="text-4xl font-black mt-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">MBTI 테스트 선택</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <button 
            onClick={() => startTest('simple')}
            className="p-10 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-blue-500 hover:shadow-xl transition-all text-left flex flex-col group"
          >
            <span className="text-2xl font-black mb-2 group-hover:text-blue-600 transition-colors">간단 테스트</span>
            <p className="text-zinc-500 text-sm">4가지 성격 지표를 중심으로 빠르게 당신의 성향을 파악합니다. (약 1분 소요)</p>
          </button>
          <button 
            onClick={() => startTest('precision')}
            className="p-10 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-purple-500 hover:shadow-xl transition-all text-left flex flex-col group"
          >
            <span className="text-2xl font-black mb-2 group-hover:text-purple-600 transition-colors">정밀 테스트</span>
            <p className="text-zinc-500 text-sm">8가지 인지 기능을 심층적으로 분석하여 정밀한 결과를 도출합니다. (추천)</p>
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const mbti = calculateResult();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-zinc-900 p-6">
        <h2 className="text-2xl font-bold mb-4">테스트 완료!</h2>
        <p className="text-zinc-500 mb-8">{testMode === 'simple' ? '간단' : '정밀'} 테스트 결과입니다.</p>
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
        <div className="mt-8 flex gap-4">
          <button 
            onClick={() => setTestMode('selection')}
            className="text-zinc-400 hover:text-zinc-600 transition-colors underline underline-offset-4"
          >
            모드 선택으로
          </button>
          <button 
            onClick={() => startTest(testMode)}
            className="text-zinc-400 hover:text-zinc-600 transition-colors underline underline-offset-4"
          >
            다시 하기
          </button>
        </div>
      </div>
    );
  }

  const questions = testMode === 'simple' ? simpleQuestions : precisionQuestions;
  const progress = (currentStep / questions.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-zinc-900 p-6">
      <header className="w-full max-w-2xl mt-10 mb-16 text-center">
        <button onClick={() => setTestMode('selection')} className="text-zinc-400 hover:text-zinc-600 transition-colors text-sm font-bold">← 모드 선택으로</button>
        <div className="mt-8 w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-zinc-400 text-xs font-mono tracking-widest uppercase">{testMode === 'simple' ? 'Simple' : 'Precision'} Mode | {currentStep + 1} / {questions.length}</p>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center">
        <div className="min-h-[220px] flex items-center justify-center text-center p-6 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200 w-full mb-10">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-zinc-800">
            {questions[currentStep].text}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
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

        {currentStep > 0 && (
          <button 
            onClick={goBack}
            className="mt-10 text-zinc-400 hover:text-zinc-600 transition-colors text-sm flex items-center gap-2"
          >
            <span>←</span> 이전 문항으로 돌아가기
          </button>
        )}
      </main>
    </div>
  );
}


