export interface Question {
  id: number;
  text: string;
  dimension: string;
  score: number;
}

export const precisionPool: Record<string, Question[]> = {
  ni: [
    { id: 101, text: "복잡한 현상 뒤에 숨겨진 명확한 원리나 통찰을 직관적으로 깨닫는 편인가요?", dimension: 'ni', score: 5 },
    { id: 102, text: "미래에 일어날 상황을 미리 예측하고 대비하는 과정이 즐거우신가요?", dimension: 'ni', score: 5 },
    { id: 103, text: "하나의 상징이나 아이디어가 여러 가지 의미로 연결되는 것을 느끼나요?", dimension: 'ni', score: 5 },
    { id: 104, text: "여러가지 정보를 하나의 핵심 의미나 결론으로 정리하는 편인가요?", dimension: 'ni', score: 5 },
    { id: 105, text: "겉으로 보이는 것 보다는 그 흐름이나 의도를 먼저 생각하는 편인가요?", dimension: 'ni', score: 5 },
    { id: 106, text: "여러 정보를 접해도 하나의 의미나 결론으로 정리할 필요를 느끼지 못하는 편인가요?", dimension: 'ni', score: -5 },
  ],
  ne: [
    { id: 201, text: "끊임없이 새로운 아이디어가 떠올라 실천하기보다 생각하는 단계에서 즐거움을 느끼나요?", dimension: 'ne', score: 5 },
    { id: 202, text: "전혀 상관없어 보이는 두 가지 사실에서 새로운 연결고리를 찾아내는 편인가요?", dimension: 'ne', score: 5 },
    { id: 203, text: "한 가지 정답보다는 여러 가지 가능성을 열어두는 것을 선호하시나요?", dimension: 'ne', score: 5 },
    { id: 204, text: "어떤 주제를 보고 다양한 해석이나 가능성이 자연스럽게 생각나나요?", dimension: 'ne', score: 5 },
    { id: 205, text: "하나의 방법보다 여러가지 방법을 동시에 떠올리는 것이 익숙하신가요?", dimension: 'ne', score: 5 },
    { id: 206, text: "새로운 아이디어를 만들기보다 이미 있는 방식대로 하는 것이 더 편한가요?", dimension: 'ne', score: -5 },
  ],
  si: [
    { id: 301, text: "과거의 구체적인 경험이나 기억을 바탕으로 현재의 상황을 판단하시나요?", dimension: 'si', score: 5 },
    { id: 302, text: "익숙한 방법과 전통을 따르는 것이 효율적이고 안정적이라고 느끼시나요?", dimension: 'si', score: 5 },
    { id: 303, text: "세부적인 사항이나 작은 변화를 민감하게 포착하는 편인가요?", dimension: 'si', score: 5 },
    { id: 304, text: "무언가를 배울 때 이전에 알던 것과 비교하면서 이해하려고 하는 편인가요?", dimension: 'si', score: 5 },
    { id: 305, text: "일을 할 때 검증된 방법을 따르는 것을 더 신뢰하나요?", dimension: 'si', score: 5 },
    { id: 306, text: "과거의 경험을 참고하기보다 그때그때 상황에 맞게 판단하는 편인가요?", dimension: 'si', score: -5 },
  ],
  se: [
    { id: 401, text: "현재 이 순간의 감각적인 즐거움과 즉각적인 행동에 집중하는 편인가요?", dimension: 'se', score: 5 },
    { id: 402, text: "새로운 자극이나 활동적인 스포츠, 체험을 통해 에너지를 얻으시나요?", dimension: 'se', score: 5 },
    { id: 403, text: "주변 환경의 변화를 즉각적으로 파악하고 빠르게 반응하시나요?", dimension: 'se', score: 5 },
    { id: 404, text: "무언가를 배울 때 직접 해보거나 경험하는 것이 가장 효과적이라고 생각하시나요?", dimension: 'se', score: 5 },
    { id: 405, text: "오래 고민하기보다 일단 행동하는 편인가요?", dimension: 'se', score: 5 },
    { id: 406, text: "예상치 못한 상황에서는 즉각적으로 대응하기보다 잠시 멈춰 생각하는 편인가요?", dimension: 'se', score: -5 },
  ],
  ti: [
    { id: 501, text: "어떠한 원리가 논리적으로 완벽하게 이해될 때까지 깊이 파고드는 편인가요?", dimension: 'ti', score: 5 },
    { id: 502, text: "감정적인 호소보다는 논리적 일관성과 객관적 사실을 더 중요하게 생각하시나요?", dimension: 'ti', score: 5 },
    { id: 503, text: "복잡한 시스템이나 정보를 자신만의 체계로 정리하는 것을 좋아하시나요?", dimension: 'ti', score: 5 },
    { id: 504, text: "어떤 주장을 들었을 때, 결론보다 논리 과정이 타당한지 먼저 확인하는 편인가요?", dimension: 'ti', score: 5 },
    { id: 505, text: "문제를 해결할 때, 결과가 나오더라도 원리를 완전히 이해하지 못하면 찝찝한가요?", dimension: 'ti', score: 5 },
    { id: 506, text: "일이 잘 해결되기만 한다면 그 과정이 논리적으로 완벽하지 않아도 크게 신경쓰지 않나요?", dimension: 'ti', score: -5 },
  ],
  te: [
    { id: 601, text: "목표를 달성하기 위해 가장 효율적인 방법과 계획을 세우는 것이 능숙하신가요?", dimension: 'te', score: 5 },
    { id: 602, text: "주변 환경이나 사람들을 조직화하여 최선의 결과를 내는 것을 선호하시나요?", dimension: 'te', score: 5 },
    { id: 603, text: "객관적인 지표와 결과물을 통해 성과를 증명하는 것을 중요하게 여기시나요?", dimension: 'te', score: 5 },
    { id: 604, text: "팀 프로젝트에서는 역할을 나누고 체계적으로 진행하는 것이 중요하다고 생각하시나요?", dimension: 'te', score: 5 },
    { id: 605, text: "비효율적인 방식은 기존 방식이라도 바로 수정해야 한다고 생각하시나요?", dimension: 'te', score: 5 },
    { id: 606, text: "명확한 목표나 계획이 없어도 상황에 맞게 진행된다면 괜찮다고 느끼시나요?", dimension: 'te', score: -5 },
  ],
  fi: [
    { id: 701, text: "자신의 내면적인 가치관과 신념을 지키는 것이 무엇보다 중요한가요?", dimension: 'fi', score: 5 },
    { id: 702, text: "타인의 시선보다는 스스로 당당하고 진실한 삶을 살고자 노력하시나요?", dimension: 'fi', score: 5 },
    { id: 703, text: "자신의 깊은 감정을 이해하고 그에 따라 행동할 때 편안함을 느끼시나요?", dimension: 'fi', score: 5 },
    { id: 704, text: "타인을 평가할 때 그 사람의 진정성을 중요하게 보나요?", dimension: 'fi', score: 5 },
    { id: 705, text: "결정을 내릴 때 다른 사람의 의견보다 내 마음이 어떻게 느끼는지가 더 중요한가요?", dimension: 'fi', score: 5 },
    { id: 706, text: "결정을 내릴 때 내가 중요하게 느끼는 기준이 없어도 불편함이 없나요?", dimension: 'fi', score: -5 },
  ],
  fe: [
    { id: 801, text: "주변 사람들의 기분이나 집단의 분위기를 빠르게 파악하고 조율하시나요?", dimension: 'fe', score: 5 },
    { id: 802, text: "개인의 이익보다는 공동체의 화합과 유대감을 위해 양보하는 편인가요?", dimension: 'fe', score: 5 },
    { id: 803, text: "다른 사람들에게 도움이 되거나 칭찬을 받을 때 큰 보람을 느끼시나요?", dimension: 'fe', score: 5 },
    { id: 804, text: "갈등 상황에서 누가 맞는지보다 관계가 상하지 않는 것이 더 중요한가요?", dimension: 'fe', score: 5 },
    { id: 805, text: "다른 사람들이 편한함을 느끼도록 내 행동이나 태도를 상황에 맞게 바꾸는 편인가요?", dimension: 'fe', score: 5 },
    { id: 806, text: "분위기가 어색해져도 굳이 나서서 바꾸려고 하지는 않는 편인가요?", dimension: 'fe', score: -5 },
  ],
};

export function generatePrecisionQuestions(countPerFunction: number = 4): Question[] {
  const selected: Question[] = [];

  // 기능별로 문항 추출
  Object.keys(precisionPool).forEach(dim => {
    const pool = [...precisionPool[dim]];
    if (pool.length === 0) return;

    // 1. 마지막 문항(역문항)은 무조건 포함
    const mandatory = pool.pop();
    if (mandatory) selected.push(mandatory);

    // 2. 나머지 문항 중 (countPerFunction - 1)개를 랜덤 추출
    const remainingToPick = countPerFunction - 1;
    for (let i = 0; i < remainingToPick && pool.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      selected.push(pool.splice(randomIndex, 1)[0]);
    }
  });

  // Fisher-Yates Shuffle로 전체 문항 섞기
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected;
}

export const simplePool: Question[] = [
  // EI: Positive = E, Negative = I
  { id: 1, text: "생각을 정리할 때, 다른 사람과 이야기하기 전에 스스로 정리하는 시간이 필요한가요?", dimension: 'ei', score: -5 },
  { id: 2, text: "문제가 생기면 혼자 고민하기보다 주변 사람에게 공유하는 편인가요?", dimension: 'ei', score: 5 },
  { id: 3, text: "혼자 있을 때보다 다른 사람들과 어울릴 때 더 에너지가 생기는 느낌인가요?", dimension: 'ei', score: 5 },
  // SN: Positive = N, Negative = S
  { id: 4, text: "설명을 들을 때 예시보다는 원리를 이해하는 것을 선호하시나요?", dimension: 'sn', score: 5 },
  { id: 5, text: "이미 검증된 방식보다 새로운 방식으로 시도해보는 것을 즐기시나요?", dimension: 'sn', score: 5 },
  { id: 6, text: "있는 그대로의 사실과 디테일을 중요하게 여기시나요?", dimension: 'sn', score: -5 },
  // TF: Positive = T, Negative = F
  { id: 7, text: "결정을 내릴 때 누구에게 어떤 영향이 갈지를 중요하게 여기시나요?", dimension: 'tf', score: -5 },
  { id: 8, text: "진실을 위해 때로는 타인의 감정을 상하게 하더라도 솔직하게 말하는 편인가요?", dimension: 'tf', score: 5 },
  { id: 9, text: "선택을 할 때 좋은 것보단 옳은 것을 선택하는 편인가요?", dimension: 'tf', score: 5 },
  // JP: Positive = J, Negative = P
  { id: 10, text: "무엇을 하든 미리 계획을 세우고 그에 맞춰 진행하는 것을 선호하시나요?", dimension: 'jp', score: 5 },
  { id: 11, text: "일을 진행하면서 방향성을 잡는 편인가요?", dimension: 'jp', score: -5 },
  { id: 12, text: "주변 환경이 항상 잘 정돈되어 있을 때 마음이 편안하신가요?", dimension: 'jp', score: 5 },
];

export function generateSimpleQuestions(): Question[] {
  const selected = [...simplePool];

  // Fisher-Yates Shuffle
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected;
}
