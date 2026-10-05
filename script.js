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
  { q: "successful", choices: ["成功した", "疲れた", "退屈な"], answer: 0, explain: "successful = 成功した（success の形容詞）" },

  // ----- 歴史（日本史・世界史） -----
  { label: "【日本史】", q: "鎌倉幕府を開いた人物は？", choices: ["足利尊氏", "源頼朝", "徳川家康"], answer: 1, explain: "源頼朝が鎌倉に幕府を開いた（1180年代）" },
  { label: "【日本史】", q: "室町幕府を開いた人物は？", choices: ["足利尊氏", "平清盛", "北条時宗"], answer: 0, explain: "足利尊氏が京都に室町幕府を開いた（1338年）" },
  { label: "【日本史】", q: "江戸幕府を開いた人物は？", choices: ["織田信長", "豊臣秀吉", "徳川家康"], answer: 2, explain: "徳川家康が1603年に江戸幕府を開いた" },
  { label: "【日本史】", q: "関ヶ原の戦いが起きた年は？", choices: ["1600年", "1543年", "1868年"], answer: 0, explain: "1600年。徳川家康の東軍が勝利した" },
  { label: "【日本史】", q: "本能寺の変で織田信長を討った武将は？", choices: ["石田三成", "明智光秀", "武田信玄"], answer: 1, explain: "1582年、明智光秀が本能寺の織田信長を襲った" },
  { label: "【日本史】", q: "豊臣秀吉が農民から武器を取り上げた政策は？", choices: ["楽市楽座", "刀狩", "参勤交代"], answer: 1, explain: "刀狩。一揆を防ぎ、武士と農民の身分を分けた" },
  { label: "【日本史】", q: "参勤交代を制度として定めた江戸幕府の法令は？", choices: ["武家諸法度", "御成敗式目", "十七条の憲法"], answer: 0, explain: "武家諸法度。1635年に徳川家光が参勤交代を制度化した" },
  { label: "【日本史】", q: "大政奉還を行った江戸幕府の15代将軍は？", choices: ["徳川家光", "徳川慶喜", "徳川吉宗"], answer: 1, explain: "1867年、徳川慶喜が政権を朝廷に返した" },
  { label: "【日本史】", q: "ペリーが黒船で来航した年は？", choices: ["1853年", "1603年", "1945年"], answer: 0, explain: "1853年、浦賀に来航して開国を求めた" },
  { label: "【日本史】", q: "明治維新で新政府が始まった年は？", choices: ["1853年", "1868年", "1894年"], answer: 1, explain: "1868年に明治時代が始まった" },
  { label: "【日本史】", q: "日本の初代内閣総理大臣は？", choices: ["伊藤博文", "大久保利通", "西郷隆盛"], answer: 0, explain: "伊藤博文が1885年に初代内閣総理大臣となった" },
  { label: "【日本史】", q: "日清戦争が始まった年は？", choices: ["1868年", "1894年", "1914年"], answer: 1, explain: "1894年に日清戦争が始まった" },
  { label: "【日本史】", q: "日露戦争が始まった年は？", choices: ["1894年", "1904年", "1937年"], answer: 1, explain: "1904年に日露戦争が始まった" },
  { label: "【日本史】", q: "日本国憲法が施行された年は？", choices: ["1945年", "1947年", "1952年"], answer: 1, explain: "1947年5月3日に施行（公布は1946年11月3日）" },
  { label: "【日本史】", q: "平安京に都を移した天皇は？", choices: ["天武天皇", "桓武天皇", "聖武天皇"], answer: 1, explain: "桓武天皇が794年に平安京へ遷都した" },
  { label: "【日本史】", q: "十七条の憲法を定めた人物は？", choices: ["聖徳太子", "中大兄皇子", "天智天皇"], answer: 0, explain: "聖徳太子（厩戸皇子）が604年に定めた" },
  { label: "【日本史】", q: "645年に始まった政治改革は？", choices: ["大化の改新", "明治維新", "享保の改革"], answer: 0, explain: "中大兄皇子と中臣鎌足らによる大化の改新" },
  { label: "【日本史】", q: "『源氏物語』の作者は？", choices: ["清少納言", "紫式部", "和泉式部"], answer: 1, explain: "紫式部。『枕草子』は清少納言" },
  { label: "【日本史】", q: "鎖国中、長崎の出島で貿易を許された西洋の国は？", choices: ["スペイン", "ポルトガル", "オランダ"], answer: 2, explain: "オランダ。中国（清）とも長崎で貿易をした" },
  { label: "【日本史】", q: "武士として初めて太政大臣になった人物は？", choices: ["平清盛", "源義経", "足利義満"], answer: 0, explain: "平清盛が1167年に太政大臣となった" },
  { label: "【日本史】", q: "元寇（蒙古襲来）のときの鎌倉幕府の執権は？", choices: ["北条政子", "北条時宗", "北条泰時"], answer: 1, explain: "北条時宗。1274年の文永の役と1281年の弘安の役" },
  { label: "【日本史】", q: "第二次世界大戦が終わった年は？", choices: ["1941年", "1945年", "1950年"], answer: 1, explain: "1945年に日本がポツダム宣言を受け入れた" },
  { label: "【世界史】", q: "コロンブスがアメリカ大陸近くに到達した年は？", choices: ["1492年", "1588年", "1776年"], answer: 0, explain: "1492年、西インド諸島に到達した" },
  { label: "【世界史】", q: "アメリカ独立宣言が出された年は？", choices: ["1689年", "1776年", "1861年"], answer: 1, explain: "1776年7月4日に独立宣言が出された" },
  { label: "【世界史】", q: "フランス革命が始まった年は？", choices: ["1789年", "1815年", "1914年"], answer: 0, explain: "1789年、バスティーユ牢獄の襲撃から始まった" },
  { label: "【世界史】", q: "産業革命が最初に起こった国は？", choices: ["フランス", "イギリス", "ドイツ"], answer: 1, explain: "18世紀後半のイギリス。蒸気機関や紡績機の発明が背景" },
  { label: "【世界史】", q: "ルネサンスが始まった国は？", choices: ["イタリア", "スペイン", "ロシア"], answer: 0, explain: "14世紀ごろのイタリア（フィレンツェなど）から広がった" },
  { label: "【世界史】", q: "第一次世界大戦が始まった年は？", choices: ["1904年", "1914年", "1939年"], answer: 1, explain: "1914年、サライェヴォ事件をきっかけに開戦" }
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

// ---------- スクロール制御 ----------
// いつでもスワイプできる。次のカードは先に用意しておく。
let bossActive = true;
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting || e.intersectionRatio <= 0.6) return;
    const card = e.target;
    if (card.dataset.kind !== "q") return;
    // 前の問題を答えずにスワイプしたら「スキップ」扱い（コンボだけ途切れる）
    const prev = card.previousElementSibling;
    if (prev && prev.dataset.kind === "q" && !prev.dataset.answered && !prev.dataset.skipped) {
      prev.dataset.skipped = "1";
      combo = 0;
      updateHud();
    }
    ensureNext(card);
  });
}, { root: feed, threshold: [0.6] });

function ensureNext(card) {
  if (bossActive && !card.nextElementSibling) addQuestionCard();
}
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

  card.appendChild(el("div", "q-label", q.label || "この単語の意味は？"));
  const qt = el("div", "q-text", q.q);
  if (q.q.length > 12) qt.classList.add("small"); // 長い問題文は小さめに
  card.appendChild(qt);

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
    ensureNext(card);
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
  bossActive = false;
  while (card.nextElementSibling) card.nextElementSibling.remove();
  feed.appendChild(clear);
  result.appendChild(el("div", "hint", "⬆ 上にスワイプ"));
  clear.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showDoneCard() {
  const done = el("section", "card center");
  done.dataset.kind = "info";
  done.appendChild(el("div", "big-emoji", "🌙"));
  done.appendChild(el("div", "q-text", "今日の探索は終了！"));
  done.appendChild(el("div", "explain", `今日は ${BOSSES_PER_DAY} 体倒しました。また明日挑戦しよう。`));
  bossActive = false;
  feed.appendChild(done);
}

function startBoss() {
  boss = {
    hp: BOSS_MAX_HP,
    monster: MONSTERS[state.totalDefeated % MONSTERS.length]
  };
  combo = 0;
  bossActive = true;
  updateHud();
  const card = addQuestionCard();
  card.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- キーボード操作（PC用） ----------
document.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
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
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
init();
