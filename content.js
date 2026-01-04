/* ---------- 1. HTMLテンプレート (IDは元の 'files' に戻しました) ---------- */
const test = `<div class="d4Fe0d i8Wprc" id="custom-files-container"><div class="iy4mWc"><div class="a0v2cc"></div>
    <h2 class="gmNu1d tl2Rdc mvRF3b">Files</h2><div jsaction="rcuQ6b:rcuQ6b;uwjiC:rcuQ6b;GjA5Zb:rcuQ6b" jscontroller="Ju9Clb"><div class="xo2x2e AX2up">
     <div class="riU7le FHXi2c" id="files"><div class="MM30Lb"></div>   
    </div><div class="CHJgKd"><div class="VfPpkd-dgl2Hf-ppHlrf-sM5MNb" data-is-touch-wrapper="true"><div class="mUIrbf-LgbsSe mUIrbf-LgbsSe-OWXEXe-dgl2Hf mUIrbf-kSE8rc-FoKg4d-sLO9V-YoZ4jf uBUej" jscontroller="w9C4d" jsaction="click:h5M12e;clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox; focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd" data-idom-class="uBUej"><span class="UTNHae" jscontroller="LBaJxb" jsname="m9ZlFb"></span><span jsname="Xr1QTb" class="mUIrbf-kBDsod-Rtc0Jf mUIrbf-kBDsod-Rtc0Jf-OWXEXe-M1Soyc"></span><span jsname="V67aGc" aria-hidden="true" class="mUIrbf-vQzf8d">View all</span><span jsname="UkTUqb" class="mUIrbf-kBDsod-Rtc0Jf mUIrbf-kBDsod-Rtc0Jf-OWXEXe-UbuQg"></span><a jsname="hSRGPd" class="mUIrbf-mRLv6 mUIrbf-RLmnJb" href="/a/not-turned-in/NjYwMzQ0NjE5Mzkw" aria-label="View all work"></a><span class="XjoK4b mUIrbf-UHGRz"></span></div></div></div></div></div>`;

let updateScheduled = false;

function getVisiblePageRoot() {
  return [...document.querySelectorAll(".iy4mWc")]
    .find(el => el.offsetParent !== null);
}

function updateFilesSection(force = false) {
  if (updateScheduled && !force) return;
  updateScheduled = true;

  requestAnimationFrame(() => {
    updateScheduled = false;
    const pageRoot = getVisiblePageRoot();

    let container = document.querySelector("#custom-files-container");
    if (!container) {
      const tmp = document.createElement("div");
      tmp.innerHTML = test;
      container = tmp.firstElementChild;
      pageRoot.appendChild(container);
    }

    const filesEl = container.querySelector("#files");
    if (!filesEl) return;

    filesEl.style.display = "contents";

    // 毎回「今この瞬間のカード」を取得
    const originalCards = Array.from(
      document.querySelectorAll(".luto0c")
    ).filter(card =>
      card.isConnected &&        // DOMに接続されている
      card.offsetParent !== null // display:none でない
    );


    // 常に再描画（差分判定しない）
    filesEl.replaceChildren(
      ...originalCards.map(card => card.cloneNode(true))
    );

    // style 適用
    const digitClassElements = document.querySelectorAll('.luto0c');
    digitClassElements.forEach(el => { el.style.marginBottom = "10px"; });

    console.log("Files section refreshed:", originalCards.length);
  });
}

// message ごとに必ず更新
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showFiles") {
    updateFilesSection(true);
  }
});


let observerStarted = false;

function waitAndUpdateFiles() {
  const pageRoot = document.querySelector(".iy4mWc");
  const cards = document.querySelectorAll(".luto0c");

  if (pageRoot && cards.length > 0) {
    updateFilesSection(true);
    return true;
  }
  return false;
}

function startObserver() {
  if (observerStarted) return;
  observerStarted = true;

  const observer = new MutationObserver(() => {
    if (waitAndUpdateFiles()) {
      observer.disconnect(); // 成功したら停止
      observerStarted = false;
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
