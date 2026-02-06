// 1. 分頁切換
// 修改後的 openTab 函式 (支援滑動切換樣式)
function openTab(tabId) {
  // 1. 內容切換
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => content.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  // 2. 按鈕樣式切換 (自動找到對應的按鈕)
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // 根據 onclick 事件中的 ID 來找按鈕 (這是最通用的方法)
  // 或是根據文字內容找，這裡我們用屬性選擇器來找對應按鈕
  const targetBtn = document.querySelector(
    `button[onclick="openTab('${tabId}')"]`,
  );
  if (targetBtn) {
    targetBtn.classList.add("active");

    // ★★★ 新增：讓上方選單自動捲動到該按鈕位置 (手機版很重要) ★★★
    targetBtn.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  // 3. 頁面自動微調高度 (避免切換後看原本的底部)
  window.scrollTo({ top: 380, behavior: "smooth" });
}

// 2. 倒數計時 (2026/02/15)
const tripDate = new Date("2026-02-26T16:30:00").getTime();

const countdownFunction = setInterval(function () {
  const now = new Date().getTime();
  const distance = tripDate - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;

  if (distance < 0) {
    clearInterval(countdownFunction);
    document.getElementById("countdown-box").innerHTML =
      "<h2>🎉 出發啦！ 🎉</h2>";
  }
}, 1000);

// 3. 檢查清單
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((box) => {
  const savedState = localStorage.getItem(box.id);
  if (savedState === "true") {
    box.checked = true;
    box.parentElement.classList.add("completed");
  }
  box.addEventListener("change", () => {
    localStorage.setItem(box.id, box.checked);
    if (box.checked) {
      box.parentElement.classList.add("completed");
    } else {
      box.parentElement.classList.remove("completed");
    }
  });
});

// --- 交通卡片折疊功能 ---
function toggleTransit(headerElement) {
  // 找到這個 header 的父層 (transit-app-card)
  const card = headerElement.parentElement;
  // 切換 'open' 這個 class
  card.classList.toggle("open");
}

// --- ★★★ 新增：手機左右滑動切換分頁 ★★★ ---

// 1. 定義分頁順序 (請確保這裡的 ID 跟你的 HTML 是一樣的)
const tabOrder = [
  "tab-day1",
  "tab-day2",
  "tab-day3",
  "tab-day4",
  "tab-day5",
  "tab-day6",
  "tab-day7",
  "tab-day8",
  "tab-day9",
  "tab-day10",
  "tab-day11",
  "tab-checklist", // 行李清單
  "tab-notes", // 注意事項
];

let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50; // 手指滑動至少 50px 才算數

// 監聽整個網頁的觸控事件
document.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  false,
);

document.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  false,
);

function handleSwipe() {
  // 計算滑動距離
  const distance = touchEndX - touchStartX;

  // 判斷目前是哪個分頁
  const currentTabId = document.querySelector(".tab-content.active").id;
  const currentIndex = tabOrder.indexOf(currentTabId);

  if (Math.abs(distance) > minSwipeDistance) {
    // 向左滑 (距離是負的) -> 下一頁
    if (distance < 0) {
      if (currentIndex < tabOrder.length - 1) {
        openTab(tabOrder[currentIndex + 1]);
      } else {
        // (選用) 如果想循環回第一頁，請打開下面這行
        // openTab(tabOrder[0]);
      }
    }

    // 向右滑 (距離是正的) -> 上一頁
    if (distance > 0) {
      if (currentIndex > 0) {
        openTab(tabOrder[currentIndex - 1]);
      }
    }
  }
}
