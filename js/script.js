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

/* script.js - 修正路徑版 */

// 1. 交通卡片折疊功能
function toggleTransit(header) {
    header.parentElement.classList.toggle('open');
}

// 2. 頁面滑動切換邏輯
// 定義所有頁面的順序 (注意：這裡只列出檔名)
const pageOrder = [
    'index.html',
    'day1.html', 'day2.html', 'day3.html', 'day4.html', 'day5.html', 
    'day6.html', 'day7.html', 'day8.html', 'day9.html', 'day10.html',
    'gear.html', 'notes.html'
];

let touchStartX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;
    const minSwipe = 60; // 滑動門檻

    // 取得當前頁面的檔名
    let path = window.location.pathname;
    let currentPage = path.split("/").pop();
    
    // 如果是空字串或 /，代表是 index.html
    if (currentPage === "" || currentPage === "/") currentPage = "index.html";

    const currentIndex = pageOrder.indexOf(currentPage);

    // 判斷目前是否在 page 資料夾內 (透過路徑是否包含 '/page/')
    const isInPageFolder = path.includes("/page/");

    if (Math.abs(distance) > minSwipe && currentIndex !== -1) {
        
        // --- 向左滑 (下一頁) ---
        if (distance < 0 && currentIndex < pageOrder.length - 1) {
            const nextPage = pageOrder[currentIndex + 1];
            
            // 邏輯 A: 從首頁(根目錄) -> 去 page 資料夾
            if (currentPage === "index.html") {
                window.location.href = "page/" + nextPage;
            } 
            // 邏輯 B: 都在 page 資料夾內切換
            else {
                window.location.href = nextPage;
            }
        }
        
        // --- 向右滑 (上一頁) ---
        if (distance > 0 && currentIndex > 0) {
            const prevPage = pageOrder[currentIndex - 1];

            // 邏輯 C: 要回到首頁 (從 day1 -> index)
            if (prevPage === "index.html") {
                // 如果目前在 page 資料夾，要往上一層找
                window.location.href = "../index.html";
            } 
            // 邏輯 D: 都在 page 資料夾內切換
            else {
                window.location.href = prevPage;
            }
        }
    }
}, false);
