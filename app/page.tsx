"use client";

import { useEffect, useMemo, useState } from "react";

type Phase = "intro" | "test" | "analyzing" | "result";
type Score = [number, number, number];
type Choice = { label: string; hint: string; scores: Score };
type Question = { label: string; title: string; choices: Choice[] };
type Profile = {
  key: string;
  code: string;
  icon: string;
  name: string;
  line: string;
  description: string;
  color: string;
  soft: string;
  tastes: [string, string, string];
  matchKey: string;
  group: "A" | "B";
  subgroup: string;
};

const questions: Question[] = [
  {
    label: "FESTIVAL MODE",
    title: "축제에 도착하면 가장 먼저 어디로 갈까?",
    choices: [
      { label: "사람이 몰린 메인 무대", hint: "열기부터 느껴야지", scores: [2, 0, 2] },
      { label: "처음 보는 체험 부스", hint: "새로운 건 못 참아", scores: [0, 2, 1] },
      { label: "친한 친구와 푸드존", hint: "익숙한 조합이 최고", scores: [1, -2, -1] },
      { label: "한적한 포토 스팟", hint: "천천히 분위기 탐색", scores: [-2, 1, -2] },
    ],
  },
  {
    label: "FIRST HELLO",
    title: "처음 만난 사람과 단둘이 남았다면?",
    choices: [
      { label: "먼저 질문을 던진다", hint: "어색함은 내가 깬다", scores: [2, 1, 1] },
      { label: "공통 관심사를 찾아본다", hint: "취향으로 말 걸기", scores: [1, 2, -1] },
      { label: "상대가 말할 때까지 기다린다", hint: "천천히 맞추는 편", scores: [-2, 0, -2] },
      { label: "상황을 보며 가볍게 농담한다", hint: "센스 있게 분위기 전환", scores: [1, 0, 2] },
    ],
  },
  {
    label: "WEEKEND PLAN",
    title: "갑자기 비어버린 주말, 나는?",
    choices: [
      { label: "친구들을 바로 소집한다", hint: "같이 놀 사람 여기 모여", scores: [2, -1, 2] },
      { label: "새로운 동네로 떠난다", hint: "낯선 곳에서 리프레시", scores: [-1, 2, 2] },
      { label: "좋아하는 카페에 간다", hint: "검증된 공간이 편해", scores: [-1, -2, -1] },
      { label: "아무것도 정하지 않는다", hint: "기분이 이끄는 대로", scores: [-1, 1, -2] },
    ],
  },
  {
    label: "TEAM PLAY",
    title: "팀플에서 자연스럽게 맡는 역할은?",
    choices: [
      { label: "분위기를 띄우는 추진자", hint: "우리 일단 해보자", scores: [2, 0, 2] },
      { label: "색다른 아이디어 제안자", hint: "이런 방식은 어때?", scores: [0, 2, 1] },
      { label: "빈틈을 챙기는 조율자", hint: "모두의 속도를 맞춰", scores: [1, -1, -2] },
      { label: "묵묵히 완성하는 실행자", hint: "정확하고 확실하게", scores: [-2, -1, 1] },
    ],
  },
  {
    label: "PLAYLIST",
    title: "요즘 플레이리스트를 채우는 방법은?",
    choices: [
      { label: "친구들의 추천을 전부 듣는다", hint: "좋은 건 같이 들어야 해", scores: [2, 1, 0] },
      { label: "매주 새로운 음악을 찾는다", hint: "나만의 신곡 레이더", scores: [-1, 2, 1] },
      { label: "좋아하는 곡을 오래 반복한다", hint: "질리지 않는 나의 명곡", scores: [-1, -2, -1] },
      { label: "그날 무드에 따라 고른다", hint: "오늘의 분위기가 기준", scores: [0, 1, -2] },
    ],
  },
  {
    label: "MESSAGE STYLE",
    title: "친구에게 고민 메시지가 왔다면?",
    choices: [
      { label: "바로 전화해서 들어준다", hint: "지금 네 옆에 있을게", scores: [2, -1, 2] },
      { label: "해결 아이디어를 같이 찾는다", hint: "다른 관점으로 풀어보기", scores: [1, 2, 1] },
      { label: "긴 답장으로 마음을 다독인다", hint: "천천히 진심을 담아서", scores: [-1, 0, -2] },
      { label: "만나서 맛있는 걸 먹는다", hint: "말보다 행동으로", scores: [1, -2, 1] },
    ],
  },
  {
    label: "CAFE PICK",
    title: "넷 중 지금 더 끌리는 카페는?",
    choices: [
      { label: "대화가 가득한 대형 카페", hint: "북적이는 에너지", scores: [2, -1, 1] },
      { label: "막 오픈한 콘셉트 카페", hint: "새로운 공간 수집", scores: [0, 2, 1] },
      { label: "늘 가던 동네 단골 카페", hint: "아는 맛과 편한 자리", scores: [-1, -2, -1] },
      { label: "조용한 음악의 작은 카페", hint: "혼자 머물기 좋은 곳", scores: [-2, 1, -2] },
    ],
  },
  {
    label: "TRAVEL SIGNAL",
    title: "여행 계획을 세울 때 가까운 모습은?",
    choices: [
      { label: "친구들과 단톡방부터 만든다", hint: "같이 짜는 과정도 여행", scores: [2, 0, 1] },
      { label: "현지의 숨은 장소를 찾는다", hint: "남들이 안 가본 곳으로", scores: [-1, 2, 1] },
      { label: "검증된 코스를 꼼꼼히 저장한다", hint: "실패 없는 동선이 중요", scores: [0, -2, -1] },
      { label: "숙소만 잡고 즉흥적으로 간다", hint: "여백 있는 여행", scores: [-1, 1, -2] },
    ],
  },
  {
    label: "PARTY ENERGY",
    title: "즐거운 모임이 끝나갈 때 드는 생각은?",
    choices: [
      { label: "2차 갈 사람을 찾는다", hint: "이대로 끝내긴 아쉬워", scores: [2, 0, 2] },
      { label: "새로 알게 된 사람을 팔로우한다", hint: "다음 연결도 기대돼", scores: [1, 2, 1] },
      { label: "친한 친구와 오늘을 복기한다", hint: "좋았던 순간 다시 보기", scores: [0, -2, -1] },
      { label: "집에 가는 길의 혼자 시간이 좋다", hint: "조용히 에너지 충전", scores: [-2, 0, -2] },
    ],
  },
  {
    label: "CHEMISTRY",
    title: "새로운 인연에게 기대하는 순간은?",
    choices: [
      { label: "함께 신나게 웃는 순간", hint: "텐션이 통할 때", scores: [2, 0, 2] },
      { label: "서로의 새 취향을 나누는 순간", hint: "세계가 조금 넓어질 때", scores: [1, 2, 0] },
      { label: "별말 없이도 편안한 순간", hint: "꾸미지 않아도 괜찮을 때", scores: [-1, -2, -2] },
      { label: "깊은 이야기가 오가는 순간", hint: "마음의 결이 닿을 때", scores: [-2, 1, -1] },
    ],
  },
];

const profiles: Profile[] = [
  { key: "SND", code: "TYPE 01", icon: "🔥", name: "Spark Explorer", line: "재미의 온도를 먼저 올리는 사람", description: "새로운 장면과 사람 앞에서 에너지가 살아나요. 먼저 웃고, 먼저 제안하고, 모두를 오늘의 모험 안으로 끌어들이는 타입이에요.", color: "#ff5d3a", soft: "#fff0eb", tastes: ["☕ 핫플레이스", "🎵 라이브 음악", "✈ 즉흥 여행"], matchKey: "RFC", group: "A", subgroup: "spark" },
  { key: "SNC", code: "TYPE 02", icon: "🎧", name: "Mood Curator", line: "사람과 취향 사이를 감각적으로 잇는 사람", description: "새로운 취향을 발견하는 감각과 상대의 분위기를 읽는 여유를 함께 가졌어요. 좋은 음악, 공간, 사람을 자연스럽게 연결해요.", color: "#7657ff", soft: "#f0edff", tastes: ["🎧 인디 음악", "📷 사진 산책", "🍸 밤의 분위기"], matchKey: "SFD", group: "A", subgroup: "mood" },
  { key: "SFD", code: "TYPE 03", icon: "⚡", name: "Happy Booster", line: "익숙한 사이에 가장 큰 웃음을 더하는 사람", description: "사람을 좋아하고 반응이 빠른 에너자이저예요. 새로움보다 함께라는 감각이 중요하고, 친한 사람들의 텐션을 확실히 끌어올려요.", color: "#ffb000", soft: "#fff7dc", tastes: ["🍕 맛집 모임", "🎤 함께 노래하기", "🎮 팀플레이"], matchKey: "SNC", group: "A", subgroup: "mood" },
  { key: "SFC", code: "TYPE 04", icon: "☕", name: "Warm Connector", line: "편안한 대화로 사이를 천천히 데우는 사람", description: "낯선 사람도 부담 없이 머물게 하는 따뜻함이 있어요. 익숙하고 편안한 공간에서 오래 이어지는 관계를 만드는 타입이에요.", color: "#d56a8a", soft: "#fff0f5", tastes: ["☕ 아늑한 카페", "💬 깊은 대화", "🍰 달콤한 휴식"], matchKey: "RND", group: "B", subgroup: "warm" },
  { key: "RND", code: "TYPE 05", icon: "🚲", name: "Solo Adventurer", line: "자기만의 속도로 새로운 세계를 여는 사람", description: "혼자 움직일 때 오히려 호기심이 더 선명해져요. 남들이 지나친 장소와 취향을 발견하고, 특별한 경험으로 만들어 돌아와요.", color: "#0e9f86", soft: "#e5faf5", tastes: ["🚲 도시 라이딩", "🗺 숨은 명소", "🥤 새로운 맛"], matchKey: "SFC", group: "B", subgroup: "warm" },
  { key: "RNC", code: "TYPE 06", icon: "🌙", name: "Dreamy Observer", line: "조용한 순간 속 디테일을 발견하는 사람", description: "빠르게 섞이기보다 분위기와 사람을 천천히 바라봐요. 감각적인 취향과 섬세한 관찰로 평범한 순간을 특별하게 기억해요.", color: "#5371d8", soft: "#ebf0ff", tastes: ["🌙 밤 산책", "📖 조용한 독서", "🎞 예술 영화"], matchKey: "RFD", group: "B", subgroup: "steady" },
  { key: "RFD", code: "TYPE 07", icon: "🧩", name: "Steady Maker", line: "믿을 수 있는 리듬으로 관계를 완성하는 사람", description: "화려하게 앞에 서기보다 약속과 디테일을 지켜요. 익숙한 사람들에게 든든한 중심이 되고, 함께한 시간을 차곡차곡 쌓아가요.", color: "#527d35", soft: "#edf7e7", tastes: ["🧩 깊은 몰입", "🥪 집 근처 피크닉", "📚 서점 산책"], matchKey: "RNC", group: "B", subgroup: "steady" },
  { key: "RFC", code: "TYPE 08", icon: "🌿", name: "Calm Listener", line: "말보다 마음의 속도를 먼저 맞추는 사람", description: "조용히 듣고 꼭 필요한 순간에 정확한 말을 건네요. 가까워질수록 편안하고 오래 남는 안정감을 주는 타입이에요.", color: "#288d62", soft: "#e8f7ef", tastes: ["🌿 느린 산책", "🫖 차 한 잔", "💌 진솔한 대화"], matchKey: "SND", group: "A", subgroup: "spark" },
];

function getResult(answers: number[]) {
  const totals = answers.reduce<Score>((sum, answer, questionIndex) => {
    const score = questions[questionIndex]?.choices[answer]?.scores ?? [0, 0, 0];
    return [sum[0] + score[0], sum[1] + score[1], sum[2] + score[2]];
  }, [0, 0, 0]);
  const key = `${totals[0] >= 0 ? "S" : "R"}${totals[1] >= 0 ? "N" : "F"}${totals[2] >= 0 ? "D" : "C"}`;
  const profile = profiles.find((item) => item.key === key) ?? profiles[0];
  const match = profiles.find((item) => item.key === profile.matchKey) ?? profiles[7];
  const confidence = Math.abs(totals[0]) + Math.abs(totals[1]) + Math.abs(totals[2]);
  const chemistry = Math.min(97, 82 + Math.round(confidence / 4));
  return { profile, match, chemistry, totals };
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const result = useMemo(() => getResult(answers), [answers]);
  const resultGroup = profiles.filter((profile) => profile.group === result.profile.group);
  const nearbyProfiles = resultGroup.filter((profile) => profile.key !== result.profile.key);

  useEffect(() => {
    if (phase !== "analyzing") return;
    const timer = window.setTimeout(() => setPhase("result"), 1800);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const begin = () => { setAnswers([]); setStep(0); setPhase("test"); };
  const choose = (index: number, button: HTMLButtonElement) => {
    button.blur();
    setHoverEnabled(false);
    const next = answers.slice(0, step);
    next[step] = index;
    setAnswers(next);
    if (step === questions.length - 1) setPhase("analyzing");
    else setStep(step + 1);
  };
  const goBack = () => {
    if (step === 0) setPhase("intro");
    else { setStep(step - 1); setAnswers(answers.slice(0, -1)); }
  };

  return (
    <main className={`app phase-${phase}`} style={{ "--accent": result.profile.color, "--soft": result.profile.soft } as React.CSSProperties}>
      <header className="topbar">
        <button className="brand" onClick={() => setPhase("intro")} aria-label="처음 화면으로">
          <span>🧪</span><b>SALC CHEMISTRY LAB</b>
        </button>
        <div className="top-pills"><span>8 TYPES</span><span>10 Q&apos;S</span><i>LIVE</i></div>
      </header>

      {phase === "intro" && (
        <section className="intro page-in">
          <div className="intro-copy">
            <h1>What&apos;s your<br /><strong>chemistry?</strong></h1>
            <p>10개의 선택으로 발견하는<br />나의 취향, 텐션, 그리고 잘 맞는 사람.</p>
            <button className="cta" onClick={begin}><span>테스트 시작하기</span><b>START ↗</b></button>
            <div className="intro-foot"><span>ABOUT 3 MIN</span></div>
          </div>
          <div className="card-stack" aria-hidden="true">
            <div className="ghost-card ghost-one" /><div className="ghost-card ghost-two" />
            <article className="preview-card">
              <div className="preview-head"><b>🧪 SALC</b><span>CHEMISTRY LAB</span></div>
              <div className="preview-icon">🔥</div>
              <p className="preview-name">Explorer</p>
              <div className="preview-score"><span>CHEMISTRY</span><b>87%</b></div>
              <div className="preview-tastes"><span>☕ Cafe</span><span>🎵 Music</span><span>✈ Travel</span></div>
              <div className="preview-match"><span>BEST MATCH</span><b>🌿 Calm Listener</b></div>
            </article>
            <i className="sticker sticker-one">GOOD<br />VIBES</i><i className="sticker sticker-two">8<br />TYPES</i>
          </div>
        </section>
      )}

      {phase === "test" && (
        <section className="test page-in">
          <div className="test-top">
            <button onClick={goBack}>← BACK</button>
            <div className="step-count"><b>{String(step + 1).padStart(2, "0")} / {questions.length}</b></div>
            <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="progress"><i style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
          <div className="question" key={step}>
            <p>{questions[step].label}</p><h2>{questions[step].title}</h2>
            <div
              className={`choices${hoverEnabled ? " is-hoverable" : ""}`}
              onPointerMove={() => setHoverEnabled(true)}
            >
              {questions[step].choices.map((choice, index) => (
                <button key={choice.label} onClick={(event) => choose(index, event.currentTarget)}>
                  <span>{String.fromCharCode(65 + index)}</span><div><b>{choice.label}</b><small>{choice.hint}</small></div><i>↗</i>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {phase === "analyzing" && (
        <section className="analyzing page-in">
          <div className="loader"><span>🧪</span><i /><i /><i /></div>
          <p>RULE-BASED MATCHING</p><h2>Mixing your<br /><strong>chemistry...</strong></h2>
          <div className="calc"><span>Social energy</span><b>CHECK</b><span>Taste openness</span><b>CHECK</b><span>Activity tempo</span><b>CALCULATING</b></div>
        </section>
      )}

      {phase === "result" && (
        <section className="result page-in">
          <div className="result-copy">
            <p className="result-overline">YOUR CHEMISTRY · {result.profile.code}</p>
            <span className="result-emoji">{result.profile.icon}</span>
            <h1>{result.profile.name}</h1>
            <p className="result-line">“{result.profile.line}”</p>
            <p className="result-description">{result.profile.description}</p>
            <div className="axis-list">
              <div><span>Social Energy</span><i><b style={{ width: `${50 + Math.max(-40, Math.min(40, result.totals[0] * 3))}%` }} /></i></div>
              <div><span>New Taste</span><i><b style={{ width: `${50 + Math.max(-40, Math.min(40, result.totals[1] * 3))}%` }} /></i></div>
              <div><span>Active Tempo</span><i><b style={{ width: `${50 + Math.max(-40, Math.min(40, result.totals[2] * 3))}%` }} /></i></div>
            </div>
            <div className="actions"><button className="retry" onClick={begin}>RETRY ↻</button></div>
          </div>
          <article className="result-card">
            <div className="result-card-head"><b>🧪 SALC</b><span>CHEMISTRY LAB<br />{result.profile.code}</span></div>
            <div className="result-card-icon">{result.profile.icon}</div>
            <div className="result-card-name"><b>{result.profile.name}</b></div>
            <div className="score-box"><span>CHEMISTRY</span><b>{result.chemistry}<i>%</i></b></div>
            <div className="taste-box"><span>MY TASTE</span>{result.profile.tastes.map((taste) => <b key={taste}>{taste}</b>)}</div>
            <div className="match-box"><div><span>BEST MATCH</span><b>{result.match.name}</b></div><strong>{result.match.icon}</strong></div>
          </article>
          <div className="match-visual">
            <div className="match-visual-head"><span>나의 케미 지도</span><b>같은 그룹 · 3가지 연결</b></div>
            <article className="match-triangle">
              <div className="triangle-stage">
                <i className="triangle-line line-top" /><i className="triangle-line line-right" /><i className="triangle-line line-left" />
                {nearbyProfiles.map((profile, index) => (
                  <div className={`triangle-node triangle-node-${index + 1} ${profile.key === result.match.key ? "is-match" : ""}`} key={profile.key}>
                    <span>{profile.icon}</span><b>{profile.key}</b><small>{profile.name}</small>
                  </div>
                ))}
                <div className="triangle-center"><span>{result.profile.icon}</span><b>{result.profile.key}</b><small>나의 유형</small></div>
              </div>
              <div className="triangle-caption"><b>{result.profile.name}</b><small>라임색은 가장 잘 맞는 유형이에요</small></div>
            </article>
          </div>
        </section>
      )}
    </main>
  );
}
