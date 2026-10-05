"use strict";

// ========== 問題データ（ここに足すだけで問題を増やせます） ==========
const QUESTIONS = [
  { q: "apple", choices: ["りんご", "みかん", "ぶどう"], answer: 0, explain: "apple = りんご" },
  { q: "book", choices: ["ペン", "本", "机"], answer: 1, explain: "book = 本" },
  { q: "library", choices: ["図書館", "本屋", "学校"], answer: 0, explain: "library = 図書館（本屋は bookstore）" },
  { q: "borrow", choices: ["貸す", "借りる", "買う"], answer: 1, explain: "borrow = 借りる ／ lend = 貸す" },
  { q: "decide", choices: ["忘れる", "決める", "助ける"], answer: 1, explain: "decide = 決める" },
  { q: "improve", choices: ["改善する", "壊す", "避ける"], answer: 0, explain: "improve = 改善する・上達する" },
  { q: "expensive", choices: ["安い", "高価な", "古い"], answer: 1, explain: "expensive = 高価な ⇔ cheap" },
  { q: "beautiful", choices: ["美しい", "危険な", "静かな"], answer: 0, explain: "beautiful = 美しい" },
  { q: "necessary", choices: ["不可能な", "必要な", "簡単な"], answer: 1, explain: "necessary = 必要な" },
  { q: "different", choices: ["同じ", "違う", "新しい"], answer: 1, explain: "different = 違う ⇔ same" },
  { q: "journey", choices: ["旅", "仕事", "夢"], answer: 0, explain: "journey = 旅（特に長めの旅）" },
  { q: "environment", choices: ["経験", "環境", "政府"], answer: 1, explain: "environment = 環境" },
  { q: "describe", choices: ["説明する・述べる", "予約する", "届ける"], answer: 0, explain: "describe = 描写する・説明する" },
  { q: "suddenly", choices: ["ゆっくり", "突然", "たいてい"], answer: 1, explain: "suddenly = 突然" },
  { q: "increase", choices: ["減る", "増える", "止まる"], answer: 1, explain: "increase = 増える ⇔ decrease" },
  { q: "agree", choices: ["賛成する", "反対する", "尋ねる"], answer: 0, explain: "agree = 賛成する ⇔ disagree" },
  { q: "dangerous", choices: ["安全な", "危険な", "有名な"], answer: 1, explain: "dangerous = 危険な ⇔ safe" },
  { q: "habit", choices: ["習慣", "趣味", "才能"], answer: 0, explain: "habit = 習慣" },
  { q: "protect", choices: ["守る", "運ぶ", "借りる"], answer: 0, explain: "protect = 守る" },
  { q: "successful", choices: ["成功した", "疲れた", "退屈な"], answer: 0, explain: "successful = 成功した（success の形容詞）" }
];

// ========== ゲーム本体 ==========
const STORAGE_KEY = "swipeVocabRPG.v1";
const BOSSES_PER_DAY = 3;       // 1日に倒せるボスの数（やりすぎ防止）
const BOSS_MAX_HP = 100;
const DAMAGE = 10;              // 正解1回のダメージ
const HEAL_ON_WRONG = 5;        // 不正解でボスが回復する量
const BASE_XP = 10;

const MONSTERS = [
  { emoji: "👾", name: "スライム語" },
  { emoji: "🐲", name: "ドラゴン文法" },
  { emoji: "👹", name: "オニ熟語" },
  { emoji: "🦑", name: "クラーケン構文" },
  { emoji: "🧟", name: "ゾンビ発音" },
  { emoji: "🦖", name: "ティラノ長文" }
];

const $ = (id) => document.getElementById(id);
const feed = $("feed");

// ---------- 保存データ ----------
function todayStr() {
  return new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD（端末のローカル日付）
}
function load() {
  const base = { level: 1, xp: 0, totalDefeated: 0, bestCombo: 0, date: todayStr(), bossesToday: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const s = Object.assign(base, saved);
    if (s.date !== todayStr()) { s.date = todayStr(); s.bossesToday = 0; }
    return s;
  } catch (e) {
    return base;
  }
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* 保存できなくても遊べる */ }
}

let state = load();
let boss = { hp: BOSS_MAX_HP, monster: MONSTERS[0] };
let combo = 0;
let queue = [];

// ---------- ユーティリティ ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function nextQuestion() {
  if (queue.length === 0) queue = shuffle(QUESTIONS);
  return queue.pop();
}
function xpNeeded() { return state.level * 50; }

// ---------- 効果音・演出 ----------
let audioCtx = null;
function beep(freqs, dur = 0.12) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      const t = audioCtx.currentTime + i * dur;
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + dur);
    });
  } catch (e) { /* 音が鳴らなくても問題なし */ }
}
function confetti(n = 36) {
  const fx = $("fx");
  const colors = ["#ffcf3f", "#3ddc84", "#6ea8ff", "#ff5470", "#b78bff"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "%";
    c.style.background = colors[i % colors.length];
    c.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
    c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    c.style.animationDelay = Math.random() * 0.25 + "s";
    fx.appendChild(c);
    setTimeout(() => c.remove(), 1900);
  }
}
function flash() {
  const f = document.createElement("div");
  f.className = "flash";
  $("fx").appendChild(f);
  setTimeout(() => f.remove(), 400);
}
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}
function retrigger(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

// ---------- HUD ----------
function updateHud() {
  $("level").textContent = "Lv." + state.level;
  $("xpFill").style.width = Math.min(100, (state.xp / xpNeeded()) * 100) + "%";
  $("hpFill").style.width = (boss.hp / BOSS_MAX_HP) * 100 + "%";
  $("enemyEmoji").textContent = boss.monster.emoji;
  $("enemyName").textContent = boss.monster.name;
  $("combo").textContent = "COMBO " + combo;
  $("today").textContent = `今日 ${state.bossesToday}/${BOSSES_PER_DAY}体`;
}
function gainXp(amount) {
  state.xp += amount;
  while (state.xp >= xpNeeded()) {
    state.xp -= xpNeeded();
    state.level++;
    toast(`🎉 レベルアップ！ Lv.${state.level}`);
    confetti(60);
    beep([523, 659, 784, 1047], 0.14);
  }
}

// ---------- スクロール制御（答えるまで次へ進めない） ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting && e.intersectionRatio > 0.6 &&
        e.target.dataset.kind === "q" && e.target.dataset.answered !== "1") {
      feed.style.overflowY = "hidden";
    }
  });
}, { root: feed, threshold: [0.6] });

function unlockFeed() { feed.style.overflowY = "scroll"; }
function goNext(card) {
  const next = card.nextElementSibling;
  if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- カード生成 ----------
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function addQuestionCard() {
  const q = nextQuestion();
  const card = el("section", "card");
  card.dataset.kind = "q";

  card.appendChild(el("div", "q-label", "この単語の意味は？"));
  card.appendChild(el("div", "q-text", q.q));

  const choices = el("div", "choices");
  const order = shuffle(q.choices.map((text, i) => ({ text, i })));
  const result = el("div", "result");

  order.forEach((c) => {
    const b = el("button", "choice", c.text);
    b.type = "button";
    b.addEventListener("click", () => onAnswer(card, q, order, choices, result, b, c.i));
    choices.appendChild(b);
  });
  card.appendChild(choices);
  card.appendChild(result);

  feed.appendChild(card);
  observer.observe(card);
  return card;
}

function onAnswer(card, q, order, choices, result, btn, picked) {
  if (card.dataset.answered === "1") return;
  card.dataset.answered = "1";

  const ok = picked === q.answer;
  const buttons = Array.from(choices.children);
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (order[idx].i === q.answer) b.classList.add("correct");
  });
  if (!ok) btn.classList.add("wrong");

  result.textContent = "";
  const verdict = el("div", "verdict " + (ok ? "ok" : "ng"), ok ? "⭕ 正解！" : "❌ 残念…");
  result.appendChild(verdict);
  result.appendChild(el("div", "explain", q.explain));

  if (ok) {
    combo++;
    state.bestCombo = Math.max(state.bestCombo, combo);
    boss.hp = Math.max(0, boss.hp - DAMAGE);
    gainXp(BASE_XP + Math.min(combo - 1, 5) * 2);
    beep([660, 880]);
    retrigger($("enemyEmoji"), "hit");
    retrigger($("combo"), "pop");
    confetti(combo >= 3 ? 40 : 12);
    if (combo >= 3) flash();
  } else {
    combo = 0;
    boss.hp = Math.min(BOSS_MAX_HP, boss.hp + HEAL_ON_WRONG);
    beep([220, 180], 0.15);
  }
  updateHud();
  save();

  if (boss.hp === 0) {
    bossDefeated(card, result);
  } else {
    result.appendChild(el("div", "hint", "⬆ 上にスワイプして次へ"));
    addQuestionCard();
    unlockFeed();
  }
}

function bossDefeated(card, result) {
  state.totalDefeated++;
  state.bossesToday++;
  save();
  updateHud();
  confetti(100);
  flash();
  beep([523, 659, 784, 1047, 1319], 0.12);

  const finished = state.bossesToday >= BOSSES_PER_DAY;
  const clear = el("section", "card center");
  clear.dataset.kind = "info";
  clear.appendChild(el("div", "big-emoji", "🏆"));
  clear.appendChild(el("div", "q-text", `${boss.monster.name} を撃破！`));
  clear.appendChild(el("div", "explain", `最高コンボ ${state.bestCombo} ／ 通算 ${state.totalDefeated} 体`));

  if (finished) {
    clear.appendChild(el("div", "explain", "今日の探索はここまで。おつかれさま！また明日 🌙"));
  } else {
    const b = el("button", "btn", "次のボスへ ▶");
    b.type = "button";
    b.addEventListener("click", startBoss);
    clear.appendChild(b);
  }
  feed.appendChild(clear);
  unlockFeed();
  result.appendChild(el("div", "hint", "⬆ 上にスワイプ"));
  clear.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showDoneCard() {
  const done = el("section", "card center");
  done.dataset.kind = "info";
  done.appendChild(el("div", "big-emoji", "🌙"));
  done.appendChild(el("div", "q-text", "今日の探索は終了！"));
  done.appendChild(el("div", "explain", `今日は ${BOSSES_PER_DAY} 体倒しました。また明日挑戦しよう。`));
  feed.appendChild(done);
  unlockFeed();
}

function startBoss() {
  boss = {
    hp: BOSS_MAX_HP,
    monster: MONSTERS[state.totalDefeated % MONSTERS.length]
  };
  combo = 0;
  updateHud();
  const card = addQuestionCard();
  card.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- キーボード操作（PC用） ----------
document.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  if (feed.style.overflowY === "hidden") return; // 未回答なら進めない
  feed.scrollBy({ top: (e.key === "ArrowDown" ? 1 : -1) * feed.clientHeight, behavior: "smooth" });
});

// ---------- 起動 ----------
function init() {
  boss.monster = MONSTERS[state.totalDefeated % MONSTERS.length];
  updateHud();
  if (state.bossesToday >= BOSSES_PER_DAY) {
    showDoneCard();
  } else {
    addQuestionCard();
  }
}
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
init();
