'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Question, generatePrecisionQuestions, generateSimpleQuestions } from './questions';

type TestMode = 'selection' | 'simple' | 'precision';

interface HistoryState {
  currentStep: number;
  scores: Record<string, number>;
}

export default function TestPage() {
  const [testMode, setTestMode] = useState<TestMode>('selection');
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const startTest = (mode: TestMode) => {
    setTestMode(mode);
    setCurrentStep(0);

    if (mode === 'simple') {
      setQuestions(generateSimpleQuestions());
      setScores({ ei: 0, sn: 0, tf: 0, jp: 0 });
    } else {
      const dynamicQs = generatePrecisionQuestions(4); // 8기능 * 4개 = 32문제
      setQuestions(dynamicQs);
      setScores({ ni: 0, ne: 0, si: 0, se: 0, ti: 0, te: 0, fi: 0, fe: 0 });
    }

    setHistory([]);
    setIsFinished(false);
  };

  const handleAnswer = (weight: number) => {
    if (!questions[currentStep]) return;
    const q = questions[currentStep];
    const scoreDelta = (weight / 5) * q.score;

    setHistory(prev => [...prev, { currentStep, scores: { ...scores } }]);

    const newScores = {
      ...scores,
      [q.dimension]: (scores[q.dimension] || 0) + scoreDelta
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
      return [result];
    } else {
      // Precision Analysis: Grant Stack Logic & Ambiguity Handling
      const thresholds = {
        ei: (scores.ne || 0) + (scores.se || 0) + (scores.te || 0) + (scores.fe || 0) - ((scores.ni || 0) + (scores.si || 0) + (scores.ti || 0) + (scores.fi || 0)),
        sn: ((scores.ni || 0) + (scores.ne || 0)) - ((scores.si || 0) + (scores.se || 0)),
        tf: ((scores.ti || 0) + (scores.te || 0)) - ((scores.fi || 0) + (scores.fe || 0)),
      };

      const getOptions = (val: number) => {
        if (Math.abs(val) <= 3) return [true, false]; // Ambiguous
        return [val >= 0];
      };

      const ei_opts = getOptions(thresholds.ei);
      const sn_opts = getOptions(thresholds.sn);
      const tf_opts = getOptions(thresholds.tf);

      // J-P Determination logic (Advanced)
      const sortedFunctions = Object.entries(scores).sort(([, a], [, b]) => b - a);
      const dominant = sortedFunctions[0]?.[0] || "";
      const auxiliary = sortedFunctions[1]?.[0] || "";
      const findExtraverted = (f: string) => f.endsWith('e');
      const extraverted = findExtraverted(dominant) ? dominant : (findExtraverted(auxiliary) ? auxiliary : null);

      let jp_opts: boolean[] = [];
      if (extraverted) {
        const category = extraverted.substring(0, 1);
        jp_opts = [category === 't' || category === 'f'];
      } else {
        const jp_val = ((scores.te || 0) + (scores.fe || 0)) - ((scores.ne || 0) + (scores.se || 0));
        jp_opts = getOptions(jp_val);
      }

      const possibleTypes: string[] = [];

      ei_opts.forEach(e => {
        sn_opts.forEach(n => {
          tf_opts.forEach(t => {
            jp_opts.forEach(j => {
              const temp_ei = e ? "E" : "I";
              const temp_sn = n ? "N" : "S";
              const temp_tf = t ? "T" : "F";
              const temp_jp = j ? "J" : "P";
              possibleTypes.push(`${temp_ei}${temp_sn}${temp_tf}${temp_jp}`);
            });
          });
        });
      });

      return Array.from(new Set(possibleTypes));
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
            <p className="text-zinc-500 text-sm">4가지 성격 지표를 중심으로 빠르게 당신의 성향을 파악합니다.</p>
          </button>
          <button
            onClick={() => startTest('precision')}
            className="p-10 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-purple-500 hover:shadow-xl transition-all text-left flex flex-col group"
          >
            <span className="text-2xl font-black mb-2 group-hover:text-purple-600 transition-colors">정밀 테스트</span>
            <p className="text-zinc-500 text-sm">8가지 인지 기능을 심층적으로 분석하여 정밀한 결과를 도출합니다.</p>
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const results = calculateResult();
    const displayTypes = results.slice(0, 2);
    const isHighlyAmbiguous = results.length > 4;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-zinc-900 p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">테스트 완료!</h2>
        <p className="text-zinc-500 mb-8">{testMode === 'simple' ? '간단' : '정밀'} 테스트 결과입니다.</p>

        <div className="bg-zinc-50 border border-blue-500/20 p-10 rounded-3xl shadow-xl flex flex-col items-center max-w-lg w-full">
          <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-purple-600 tracking-tighter mb-10">
            {displayTypes.join(' / ')}
          </span>
          <div className="flex flex-col gap-3 w-full">
            {displayTypes.map(type => (
              <Link
                key={type}
                href={`/mbti/${type}`}
                className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all shadow-lg text-sm"
              >
                {type} 밈 보러가기 →
              </Link>
            ))}
            {testMode === 'precision' && (
              <Link
                href={`/test/result?mode=${testMode}&${new URLSearchParams(
                  Object.entries(scores).map(([k, v]) => [k, v.toString()])
                ).toString()}`}
                className="px-8 py-4 bg-white border border-zinc-200 hover:border-blue-500 text-zinc-600 hover:text-blue-600 font-bold rounded-2xl transition-all shadow-sm text-sm"
              >
                상세 분석 결과 보기 (그래프)
              </Link>
            )}
          </div>
          {isHighlyAmbiguous && (
            <p className="mt-8 text-zinc-400 text-xs italic">결과가 부정확할 수 있습니다.</p>
          )}
        </div>
        <div className="mt-8 flex gap-4">
          <button onClick={() => setTestMode('selection')} className="text-zinc-400 hover:text-zinc-600 underline underline-offset-4 text-sm">모드 선택으로</button>
          <button onClick={() => startTest(testMode)} className="text-zinc-400 hover:text-zinc-600 underline underline-offset-4 text-sm">다시 하기</button>
        </div>
      </div>
    );
  }

  const progress = (currentStep / questions.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-zinc-900 p-6">
      <header className="w-full max-w-2xl mt-10 mb-16 text-center">
        <button onClick={() => setTestMode('selection')} className="text-zinc-400 hover:text-zinc-600 transition-colors text-sm font-bold">← 모드 선택으로</button>
        <div className="mt-8 w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-4 text-zinc-400 text-xs font-mono tracking-widest uppercase">{testMode === 'simple' ? 'Simple' : 'Precision'} Mode | {currentStep + 1} / {questions.length}</p>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center">
        <div className="min-h-[200px] flex items-center justify-center text-center p-8 bg-zinc-50/50 rounded-[2.5rem] border border-dashed border-zinc-200 w-full mb-12">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-zinc-800">
            {questions[currentStep]?.text || "문항을 불러오는 중입니다..."}
          </h1>
        </div>

        <div className="w-full">
          {testMode === 'simple' ? (
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={() => handleAnswer(5)}
                className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-xl font-bold text-zinc-700 hover:text-blue-600"
              >
                예
              </button>
              <button
                onClick={() => handleAnswer(-5)}
                className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-xl font-bold text-zinc-700 hover:text-purple-600"
              >
                아니오
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => handleAnswer(5)}
                className="p-5 rounded-2xl bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all font-bold text-lg"
              >
                그렇다
              </button>
              <button
                onClick={() => handleAnswer(2)}
                className="p-5 rounded-2xl bg-white border-2 border-blue-300 text-blue-400 hover:bg-blue-50 transition-all font-bold text-lg"
              >
                약간 그렇다
              </button>
              <button
                onClick={() => handleAnswer(-2)}
                className="p-5 rounded-2xl bg-white border-2 border-purple-300 text-purple-400 hover:bg-purple-50 transition-all font-bold text-lg"
              >
                약간 그렇지 않다
              </button>
              <button
                onClick={() => handleAnswer(-5)}
                className="p-5 rounded-2xl bg-white border-2 border-purple-600 text-purple-700 hover:bg-purple-50 transition-all font-bold text-lg"
              >
                그렇지 않다
              </button>
            </div>
          )}
        </div>

        {currentStep > 0 && (
          <button onClick={goBack} className="mt-12 text-zinc-400 hover:text-zinc-600 transition-colors text-sm flex items-center gap-2">
            <span>←</span> 이전 문항으로 돌아가기
          </button>
        )}
      </main>
    </div>
  );
}


