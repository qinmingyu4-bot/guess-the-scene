const soups = [
  {
    title: "最后一班电梯",
    difficulty: "中等",
    theme: "办公室",
    scene: "凌晨，保安看见一个男人走进电梯。电梯门关上后，楼层数字没有变化。五分钟后，男人从电梯里出来，立刻报警。",
    answer: "男人是电梯维修员。电梯停在原地，是因为里面卡着一个已经昏迷的人，维修员打开轿厢顶部检查时发现了对方，所以出来报警。",
    hints: [
      "电梯没有坏到完全不能开门。",
      "男人进去不是为了上楼。",
      "报警不是因为他自己遇险。"
    ],
    keys: ["男人的职业和电梯有关", "电梯内还有另一个人", "他发现的是紧急情况"]
  },
  {
    title: "没有寄出的明信片",
    difficulty: "简单",
    theme: "旅行",
    scene: "女人在海边买了一张明信片，认真写完后却没有寄出。回家后，她把明信片交给警察，警察很快找到了一个失踪的人。",
    answer: "明信片不是她写给别人的，而是她在海边捡到后补写了缺失信息。明信片背面原本压出了失踪者留下的求救地址痕迹，她交给警察后，警察根据痕迹找到了人。",
    hints: [
      "重点在明信片上已有的痕迹。",
      "女人不是失踪者的熟人。",
      "她写字这件事帮助显现了线索。"
    ],
    keys: ["明信片上有隐藏痕迹", "失踪者留下过求救信息", "女人把物证交给警方"]
  },
  {
    title: "一碗热汤",
    difficulty: "困难",
    theme: "餐馆",
    scene: "男人点了一碗汤，只喝了一口就哭了。他没有投诉，反而给了厨师很多钱，然后再也没有来过。",
    answer: "男人多年前在事故中失去了记忆，只记得母亲做汤的味道。厨师偶然复刻了那种味道，让他想起母亲已经去世，也想起自己曾经抛下家人。钱是感谢，也是补偿。",
    hints: [
      "汤没有问题，味道太对了。",
      "哭是因为记忆回来了。",
      "钱不是小费那么简单。"
    ],
    keys: ["汤唤醒记忆", "男人曾失忆", "厨师无意复刻亲人的味道"]
  },
  {
    title: "空座位",
    difficulty: "中等",
    theme: "剧场",
    scene: "演出开始后，第一排一直空着一个座位。演员看见那个空位后突然忘词，观众却鼓起掌来。",
    answer: "那个座位属于去世的老导演。演员忘词时，下意识看向导演常坐的位置，发现剧团为他保留了座位。观众知道这是纪念演出，以为演员的停顿是设计好的致敬。",
    hints: [
      "空座位不是没人买票。",
      "演员和座位主人关系很深。",
      "掌声来自误解，也来自纪念。"
    ],
    keys: ["座位为特定人物保留", "那个人已经去世", "观众把失误理解为致敬"]
  },
  {
    title: "雨夜的合照",
    difficulty: "困难",
    theme: "悬疑",
    scene: "雨夜，女孩拍了一张只有自己的合照。第二天，她把照片删了，因为照片证明她说了谎。",
    answer: "女孩声称当晚一直独自在家，但照片是用橱窗反光拍的。画面里看似只有她，反光角落却能看出她在案发现场附近，而且身后还有公交站牌时间信息。",
    hints: [
      "照片里不只有正面看见的内容。",
      "合照这个词并非指另一个人清楚入镜。",
      "地点比人物更关键。"
    ],
    keys: ["照片有反光信息", "地点暴露了她", "她的不在场证明是假的"]
  }
];

let currentIndex = 0;
let hostMode = false;
let revealed = false;
let hintCount = 0;
let foundKeys = new Set();
let pendingQuestion = "";

const $ = (selector) => document.querySelector(selector);

const els = {
  title: $("#title"),
  difficulty: $("#difficulty"),
  theme: $("#theme"),
  scene: $("#scene"),
  progressFill: $("#progressFill"),
  progressText: $("#progressText"),
  caseId: $("#caseId"),
  newSoupBtn: $("#newSoupBtn"),
  hostToggleBtn: $("#hostToggleBtn"),
  questionForm: $("#questionForm"),
  questionInput: $("#questionInput"),
  logList: $("#logList"),
  hintBtn: $("#hintBtn"),
  hintList: $("#hintList"),
  revealBtn: $("#revealBtn"),
  answerPane: $("#answerPane"),
  answerContent: $("#answerContent"),
  answerText: $("#answerText"),
  keyList: $("#keyList"),
  tabs: document.querySelectorAll(".tab"),
  panes: document.querySelectorAll(".pane"),
  quickAnswers: document.querySelectorAll("[data-answer]")
};

function currentSoup() {
  return soups[currentIndex];
}

function renderSoup() {
  const soup = currentSoup();
  els.title.textContent = soup.title;
  els.difficulty.textContent = soup.difficulty;
  els.theme.textContent = soup.theme;
  els.scene.textContent = soup.scene;
  els.caseId.textContent = `CASE ${String(currentIndex + 1).padStart(3, "0")}`;
  els.answerText.textContent = soup.answer;
  els.keyList.innerHTML = soup.keys.map((key, index) => `
    <li>
      <label>
        <input type="checkbox" data-key="${index}">
        ${key}
      </label>
    </li>
  `).join("");
  els.hintList.innerHTML = "";
  els.logList.innerHTML = "";
  hintCount = 0;
  foundKeys = new Set();
  revealed = false;
  pendingQuestion = "";
  els.questionInput.value = "";
  els.answerContent.hidden = true;
  els.answerPane.classList.add("locked");
  els.hintBtn.textContent = "给一个提示";
  updateHostVisibility();
  updateProgress();
}

function updateProgress() {
  const total = currentSoup().keys.length;
  const found = foundKeys.size;
  els.progressFill.style.width = `${Math.round((found / total) * 100)}%`;
  els.progressText.textContent = `线索 ${found} / ${total}`;
}

function updateHostVisibility() {
  els.hostToggleBtn.classList.toggle("active", hostMode);
  els.hostToggleBtn.setAttribute("aria-pressed", String(hostMode));
  document.body.classList.toggle("hostMode", hostMode);
  els.answerContent.hidden = !(hostMode || revealed);
  els.answerPane.classList.toggle("locked", !(hostMode || revealed));
  els.keyList.querySelectorAll("input").forEach((input) => {
    input.disabled = !hostMode && !revealed;
  });
}

function switchTab(tabId) {
  els.tabs.forEach((tab) => {
    const isActive = tab.id === tabId;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  els.panes.forEach((pane) => {
    pane.classList.toggle("active", pane.id === tabId.replace("Tab", "Pane"));
  });
}

function addLog(question, answer) {
  const item = document.createElement("li");
  item.innerHTML = `<span>${escapeHtml(question)}</span><span class="answerBadge">${answer}</span>`;
  els.logList.prepend(item);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

els.newSoupBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % soups.length;
  renderSoup();
});

els.hostToggleBtn.addEventListener("click", () => {
  hostMode = !hostMode;
  updateHostVisibility();
});

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.id));
});

els.questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = els.questionInput.value.trim();
  if (!question) return;
  pendingQuestion = question;
  els.questionInput.value = "";
});

els.quickAnswers.forEach((button) => {
  button.addEventListener("click", () => {
    const question = pendingQuestion || "玩家提出了一个问题";
    addLog(question, button.dataset.answer);
    pendingQuestion = "";
  });
});

els.hintBtn.addEventListener("click", () => {
  const soup = currentSoup();
  if (hintCount >= soup.hints.length) return;

  const item = document.createElement("li");
  item.textContent = soup.hints[hintCount];
  els.hintList.append(item);
  hintCount += 1;
  els.hintBtn.textContent = hintCount >= soup.hints.length ? "提示已用完" : "再给一个提示";
});

els.revealBtn.addEventListener("click", () => {
  revealed = true;
  els.answerContent.hidden = false;
  els.answerPane.classList.remove("locked");
  updateHostVisibility();
});

els.keyList.addEventListener("change", (event) => {
  const input = event.target;
  if (!input.matches("[data-key]")) return;

  const key = input.dataset.key;
  if (input.checked) {
    foundKeys.add(key);
  } else {
    foundKeys.delete(key);
  }
  updateProgress();
});

renderSoup();
