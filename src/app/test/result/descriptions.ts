export interface DescriptionItem {
  title: string;
  summary: string;
  color: string;
}

export const dimensionDescriptions: Record<string, DescriptionItem> = {
  e: {
    title: "외향 (Extraversion)",
    summary: "외부 세계와 타인으로부터 에너지를 얻으며, 활발한 상호작용을 선호합니다.",
    color: "#3b82f6" // blue-500
  },
  i: {
    title: "내향 (Introversion)",
    summary: "자신의 내면 세계와 고요함으로부터 에너지를 얻으며, 깊이 있는 사색을 즐깁니다.",
    color: "#6366f1" // indigo-500
  },
  s: {
    title: "감각 (Sensing)",
    summary: "현재의 사실, 구체적인 경험, 오감으로 느껴지는 정보에 집중합니다.",
    color: "#10b981" // emerald-500
  },
  n: {
    title: "직관 (Intuition)",
    summary: "미래의 가능성, 비유적인 의미, 전체적인 흐름과 통찰에 집중합니다.",
    color: "#8b5cf6" // violet-500
  },
  t: {
    title: "사고 (Thinking)",
    summary: "논리적 분석과 객관적인 사실을 바탕으로 합리적인 결정을 내립니다.",
    color: "#06b6d4" // cyan-500
  },
  f: {
    title: "감정 (Feeling)",
    summary: "개인적인 가치관과 사람 사이의 관계, 공감을 바탕으로 결정을 내립니다.",
    color: "#f59e0b" // amber-500
  },
  j: {
    title: "판단 (Judging)",
    summary: "계획적이고 체계적이며, 명확한 결론과 정돈된 상태를 선호합니다.",
    color: "#ef4444" // red-500
  },
  p: {
    title: "인식 (Perceiving)",
    summary: "유연하고 개방적이며, 상황에 맞게 적응하고 자유로운 분위기를 즐깁니다.",
    color: "#f97316" // orange-500
  }
};

export const functionDescriptions: Record<string, DescriptionItem> = {
  ni: {
    title: "내향 직관 (Ni)",
    summary: "복잡한 현상 뒤에 숨겨진 명확한 원리나 미래의 통찰을 직관적으로 깨닫는 능력입니다.",
    color: "#a855f7" // purple-500
  },
  ne: {
    title: "외향 직관 (Ne)",
    summary: "외부의 사물들 사이에서 끊임없이 새로운 가능성과 연결고리를 찾아내는 창의적 능력입니다.",
    color: "#d946ef" // fuchsia-500
  },
  si: {
    title: "내향 감각 (Si)",
    summary: "과거의 구체적인 경험과 기억을 바탕으로 현재를 판단하고 안정을 유지하는 능력입니다.",
    color: "#10b981" // emerald-500
  },
  se: {
    title: "외향 감각 (Se)",
    summary: "현재 이 순간의 감각적인 즐거움과 즉각적인 자극을 온몸으로 경험하고 반응하는 능력입니다.",
    color: "#22c55e" // green-500
  },
  ti: {
    title: "내향 사고 (Ti)",
    summary: "어떠한 원리가 논리적으로 완벽하게 이해될 때까지 깊이 파고들어 자신만의 체계를 세우는 능력입니다.",
    color: "#3b82f6" // blue-500
  },
  te: {
    title: "외향 사고 (Te)",
    summary: "목표 달성을 위해 외부 환경을 효율적으로 조직화하고 실질적인 결과를 만들어내는 능력입니다.",
    color: "#0ea5e9" // sky-500
  },
  fi: {
    title: "내향 감정 (Fi)",
    summary: "자신의 내면적인 가치관과 진정성을 무엇보다 중요하게 여기며 스스로에게 솔직하려는 능력입니다.",
    color: "#f59e0b" // amber-500
  },
  fe: {
    title: "외향 감정 (Fe)",
    summary: "주변 사람들의 기분과 집단의 분위기를 파악하여 화합과 유대감을 만들어내는 사회적 능력입니다.",
    color: "#fbbf24" // amber-400
  }
};
