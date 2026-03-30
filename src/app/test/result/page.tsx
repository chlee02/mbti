'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { dimensionDescriptions, functionDescriptions } from './descriptions';

// MBTI Type to Full 8-Function Stack Mapper
function getMBTIStack(type: string) {
  if (type.length !== 4) return null;
  const [e, s, t, j] = type.split('');
  const isExtra = e === 'E';
  const isIntuitive = s === 'N';
  const isThinker = t === 'T';
  const isJudger = j === 'J';

  const pE = isIntuitive ? 'ne' : 'se';
  const pI = isIntuitive ? 'ni' : 'si';
  const jE = isThinker ? 'te' : 'fe';
  const jI = isThinker ? 'ti' : 'fi';

  let dom, aux;
  if (isJudger) {
    if (isExtra) { dom = jE; aux = pI; }
    else { dom = pI; aux = jE; }
  } else {
    if (isExtra) { dom = pE; aux = jI; }
    else { dom = jI; aux = pE; }
  }

  const opposites: Record<string, string> = {
    ni: 'se', ne: 'si', si: 'ne', se: 'ni',
    ti: 'fe', te: 'fi', fi: 'te', fe: 'ti'
  };
  
  const shadowOf: Record<string, string> = {
    ni: 'ne', ne: 'ni', si: 'se', se: 'si',
    ti: 'te', te: 'ti', fi: 'fe', fe: 'fi'
  };

  const tert = opposites[aux];
  const inf = opposites[dom];

  return { 
    dom, 
    aux, 
    tert, 
    inf,
    opp: shadowOf[dom],
    crit: shadowOf[aux],
    trick: shadowOf[tert],
    demon: shadowOf[inf]
  };
}

const roleInfo: Record<string, { label: string, meaning: string, category: 'core' | 'shadow' }> = {
  dom: { label: '1차 주기능', meaning: '나의 핵심 정체성이자 가장 강력한 무기입니다.', category: 'core' },
  aux: { label: '2차 부기능', meaning: '주기능을 보조하여 내외적 균형을 맞춰주는 조력자입니다.', category: 'core' },
  tert: { label: '3차 구호기능', meaning: '미숙하지만 휴식이나 유희를 통해 발달 중인 능력입니다.', category: 'core' },
  inf: { label: '4차 열등기능', meaning: '가장 취약하지만 성장 잠재력이 큰 보완 영역입니다.', category: 'core' },
  opp: { label: '5차 대립기능', meaning: '주기능에 반대하며 방어적/회의적 태도를 유발합니다.', category: 'shadow' },
  crit: { label: '6차 비판기능', meaning: '자신과 타인에게 엄격한 잣대를 들이대는 비판적 기능입니다.', category: 'shadow' },
  trick: { label: '7차 결핍기능', meaning: '가장 인지하기 어렵고 실수를 연발하는 사각지대입니다.', category: 'shadow' },
  demon: { label: '8차 악마기능', meaning: '극심한 스트레스 상황에서 파괴적으로 발현되는 기능입니다.', category: 'shadow' }
};

function ResultDetailsContent() {
  const searchParams = useSearchParams();
  const scores: Record<string, number> = {};
  const functions = ['ni', 'ne', 'si', 'se', 'ti', 'te', 'fi', 'fe'];
  functions.forEach(fn => {
    scores[fn] = parseFloat(searchParams.get(fn) || '0');
  });

  const calculateRatio = (rightKeys: string[], leftKeys: string[], maxScore: number) => {
    const rightVal = rightKeys.reduce((acc, key) => acc + (scores[key] || 0), 0);
    const leftVal = leftKeys.reduce((acc, key) => acc + (scores[key] || 0), 0);
    const netScore = rightVal - leftVal;
    return { left: Math.min(Math.max(100 - ((netScore + maxScore) / (2 * maxScore)) * 100, 0), 100), right: Math.min(Math.max(((netScore + maxScore) / (2 * maxScore)) * 100, 0), 100) };
  };

  const dimensionRatios = {
    ei: calculateRatio(['ne', 'se', 'te', 'fe'], ['ni', 'si', 'ti', 'fi'], 160),
    sn: calculateRatio(['ni', 'ne'], ['si', 'se'], 80),
    tf: calculateRatio(['ti', 'te'], ['fi', 'fe'], 80),
    jp: calculateRatio(['te', 'fe'], ['ne', 'se'], 80),
  };

  const calculatedType = [
    dimensionRatios.ei.right > dimensionRatios.ei.left ? 'E' : 'I',
    dimensionRatios.sn.right > dimensionRatios.sn.left ? 'N' : 'S',
    dimensionRatios.tf.right > dimensionRatios.tf.left ? 'T' : 'F',
    dimensionRatios.jp.right > dimensionRatios.jp.left ? 'J' : 'P'
  ].join('');

  const stack = getMBTIStack(calculatedType);

  const getRole = (fn: string) => {
    if (!stack) return null;
    const roles = Object.entries(stack).find(([, f]) => f === fn);
    return roles ? roles[0] : null;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-24 font-sans leading-relaxed">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/test" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-all font-bold text-sm group">
            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            </div>
            테스트로 돌아가기
          </Link>
          <div className="bg-zinc-100 px-4 py-1.5 rounded-full text-[12px] font-black tracking-widest text-zinc-800">
            {calculatedType} STACK ANALYSIS
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-20 text-center pt-20">
          <h1 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter mb-6 leading-tight">
            정밀 분석 <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">리포트</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
            당신의 인지 기능 데이터와 8기능 전체 스택 심층 분석 결과입니다.
          </p>
        </header>

        {/* Dimension & Functions Charts remain same ... I will re-implement for completeness in this file rewrite */}
        <section className="bg-white rounded-[3rem] p-10 md:p-14 border border-zinc-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] mb-16 relative overflow-hidden">
          <h2 className="text-2xl font-black mb-14 flex items-center gap-4 text-zinc-800">
            <span className="w-1.5 h-10 bg-blue-500 rounded-full"></span>
            성격 차원 분포 (MBTI Dimensions)
          </h2>
          <div className="grid grid-cols-1 gap-y-16">
            {(['ei', 'sn', 'tf', 'jp'] as const).map((key) => {
              const ratio = dimensionRatios[key];
              const labels = {
                ei: { left: 'I', right: 'E', label: '에너지 방향', leftKey: 'i', rightKey: 'e' },
                sn: { left: 'S', right: 'N', label: '인식 방식', leftKey: 's', rightKey: 'n' },
                tf: { left: 'F', right: 'T', label: '판단 기준', leftKey: 'f', rightKey: 't' },
                jp: { left: 'P', right: 'J', label: '생활 양식', leftKey: 'p', rightKey: 'j' }
              }[key];
              
              const leftColor = dimensionDescriptions[labels.leftKey]?.color || '#3b82f6';
              const rightColor = dimensionDescriptions[labels.rightKey]?.color || '#3b82f6';

              return (
                <div key={key} className="relative">
                  <div className="flex justify-between items-center mb-6 px-4">
                    <div className="flex flex-col items-center">
                      <span className={`text-4xl font-black mb-1 transition-colors ${ratio.left > ratio.right ? 'text-zinc-900' : 'text-zinc-200'}`}>{labels.left}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{dimensionDescriptions[labels.leftKey]?.title.split(' ')[0]}</span>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">{labels.label}</p>
                      <div className="flex items-center gap-3 text-sm font-mono font-black">
                        <span style={{ color: ratio.left > ratio.right ? leftColor : '#d4d4d8' }}>{Math.round(ratio.left)}%</span>
                        <span className="text-zinc-200">:</span>
                        <span style={{ color: ratio.right > ratio.left ? rightColor : '#d4d4d8' }}>{Math.round(ratio.right)}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className={`text-4xl font-black mb-1 transition-colors ${ratio.right > ratio.left ? 'text-zinc-900' : 'text-zinc-200'}`}>{labels.right}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{dimensionDescriptions[labels.rightKey]?.title.split(' ')[0]}</span>
                    </div>
                  </div>
                  
                  <div className="relative h-4 bg-zinc-50 rounded-full flex overflow-hidden border border-zinc-100 shadow-inner">
                    <div className="flex-1 flex justify-end">
                      <div 
                        className="h-full transition-all duration-1000 ease-out rounded-l-full" 
                        style={{ 
                          width: `${ratio.left}%`, 
                          backgroundColor: leftColor, 
                          opacity: ratio.left >= ratio.right ? 1 : 0.2 
                        }} 
                      />
                    </div>
                    <div className="w-1 bg-white z-10 shrink-0" />
                    <div className="flex-1 flex justify-start">
                      <div 
                        className="h-full transition-all duration-1000 ease-out rounded-r-full" 
                        style={{ 
                          width: `${ratio.right}%`, 
                          backgroundColor: rightColor, 
                          opacity: ratio.right >= ratio.left ? 1 : 0.2 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-zinc-50 border border-zinc-100 rounded-[3rem] p-10 md:p-14 mb-16 relative overflow-hidden">
          <h2 className="text-2xl font-black mb-14 flex items-center gap-4 text-zinc-800">
            <span className="w-1.5 h-10 bg-indigo-500 rounded-full"></span>
            8대 인지 기능 강도 (Intensity)
          </h2>
          <div className="relative h-[400px] flex px-2 border-b border-zinc-200">
            {[20, 10, 0, -10, -20].map((v) => (
              <div key={v} className="absolute left-0 right-0 border-t border-zinc-200/50" style={{ bottom: `${(v + 20) / 40 * 100}%` }}>
                <span className="text-[9px] font-mono font-black text-zinc-300 -translate-x-10 inline-block">{v}</span>
              </div>
            ))}
            <div className="flex-1 flex justify-between h-full relative z-20">
              {functions.map((key) => {
                const val = scores[key] || 0;
                const height = (Math.abs(val) / 40) * 100;
                const isPositive = val >= 0;
                const desc = functionDescriptions[key];
                return (
                  <div key={key} className="flex-1 flex items-center justify-center relative group h-full">
                    <div className={`absolute w-8 md:w-12 transition-all duration-1000 ${isPositive ? 'rounded-t-lg' : 'rounded-b-lg'}`} style={{ height: `${height}%`, bottom: isPositive ? '50%' : `calc(50% - ${height}%)`, backgroundColor: desc?.color || '#3b82f6', opacity: Math.abs(val) > 0 ? 1 : 0.1 }}>
                      <div className="absolute inset-x-0 bottom-full mb-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-[10px] font-black text-zinc-400">{val}</span></div>
                    </div>
                    <span className="absolute bottom-[-30px] text-[10px] font-black text-zinc-800 uppercase">{key}</span>
                  </div>
                );
              })}
            </div>
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-300 z-10" />
          </div>
          <div className="h-10" />
        </section>

        {/* 3. Detailed Descriptions Cards - All 8 Functions */}
        <section>
          <h2 className="text-2xl font-black mb-10 px-4 flex items-center gap-4 text-zinc-800">
            <span className="w-1.5 h-10 bg-black rounded-full"></span>
            8대 인지 기능 상세 가이드
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {functions.map((key) => {
              const desc = functionDescriptions[key];
              const score = scores[key] || 0;
              const role = getRole(key);
              const roleDetail = role ? roleInfo[role] : null;

              return (
                <div 
                  key={key} 
                  className={`p-10 rounded-[2.5rem] border transition-all duration-500 group relative flex flex-col justify-between ${
                    roleDetail?.category === 'core' 
                    ? 'border-blue-100 bg-blue-50/20' 
                    : 'border-zinc-100 bg-white border-dashed'
                  }`}
                >
                  {roleDetail && (
                    <div className="absolute -top-4 left-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        role === 'dom' || role === 'aux' ? 'bg-zinc-900 text-white' : 
                        roleDetail.category === 'core' ? 'bg-blue-600 text-white' : 
                        'bg-zinc-200 text-zinc-600'
                      }`}>
                        {roleDetail.label}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-between mb-8 pt-2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-lg" style={{ backgroundColor: desc?.color }}>
                          {key.toUpperCase()}
                        </div>
                        <h3 className="font-black text-2xl text-zinc-800">{desc?.title}</h3>
                      </div>
                      <div 
                        className="px-4 py-2 rounded-xl font-mono font-black text-sm shadow-sm border"
                        style={{ 
                          backgroundColor: `${desc?.color}10`, // 10% opacity hex
                          color: desc?.color,
                          borderColor: `${desc?.color}20` 
                        }}
                      >
                        {score > 0 ? `+${score}` : score}
                      </div>
                    </div>
                    
                    {roleDetail && (
                      <p className={`mb-4 text-xs font-black uppercase tracking-widest italic ${roleDetail.category === 'core' ? 'text-blue-600/70' : 'text-zinc-400'}`}>
                        {roleDetail.meaning}
                      </p>
                    )}

                    <p className="text-zinc-500 text-[15px] leading-relaxed mb-8 font-medium">
                      {desc?.summary}
                    </p>
                  </div>
                  <div className="h-1.5 w-0 group-hover:w-full transition-all duration-700 rounded-full" style={{ backgroundColor: desc?.color }} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ResultDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono text-zinc-300 animate-pulse text-lg tracking-widest">EXTRACTING STACK...</div>}>
      <ResultDetailsContent />
    </Suspense>
  );
}
