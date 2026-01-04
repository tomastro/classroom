/* ---------- 1. HTMLテンプレート (IDは元の 'files' に戻しました) ---------- */
const test = `<div class="d4Fe0d i8Wprc" id="custom-files-container"><div class="iy4mWc"><div class="a0v2cc"></div>
    <h2 class="gmNu1d tl2Rdc mvRF3b">Files</h2><div jsaction="rcuQ6b:rcuQ6b;uwjiC:rcuQ6b;GjA5Zb:rcuQ6b" jscontroller="Ju9Clb"><div class="xo2x2e AX2up">
     <div class="riU7le FHXi2c" id="files"><div class="MM30Lb"></div>   
    </div><div class="CHJgKd"><div class="VfPpkd-dgl2Hf-ppHlrf-sM5MNb" data-is-touch-wrapper="true"><div class="mUIrbf-LgbsSe mUIrbf-LgbsSe-OWXEXe-dgl2Hf mUIrbf-kSE8rc-FoKg4d-sLO9V-YoZ4jf uBUej" jscontroller="w9C4d" jsaction="click:h5M12e;clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox; focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd" data-idom-class="uBUej"><span class="UTNHae" jscontroller="LBaJxb" jsname="m9ZlFb"></span><span jsname="Xr1QTb" class="mUIrbf-kBDsod-Rtc0Jf mUIrbf-kBDsod-Rtc0Jf-OWXEXe-M1Soyc"></span><span jsname="V67aGc" aria-hidden="true" class="mUIrbf-vQzf8d">View all</span><span jsname="UkTUqb" class="mUIrbf-kBDsod-Rtc0Jf mUIrbf-kBDsod-Rtc0Jf-OWXEXe-UbuQg"></span><a jsname="hSRGPd" class="mUIrbf-mRLv6 mUIrbf-RLmnJb" href="/a/not-turned-in/NjYwMzQ0NjE5Mzkw" aria-label="View all work"></a><span class="XjoK4b mUIrbf-UHGRz"></span></div></div></div></div></div>`;

/* ---------- 2. クローン処理 ---------- */
function updateFilesSection() {
  const parent = document.querySelector(".iy4mWc");
  if (!parent) return;

  // コンテナがなければ作成して挿入
  let container = document.querySelector("#custom-files-container");
  if (!container) {
    const tmp = document.createElement("div");
    tmp.innerHTML = test;
    container = tmp.firstElementChild;
    parent.appendChild(container);
  }

  const filesEl = container.querySelector("#files");
  if (!filesEl) return;

  // --- スタイルを直接JSで上書き (確実な方法) ---
  filesEl.style.display = "contents";
  // Classroom元のカードを取得（自分のコンテナ内にあるものは除外）
  const originalCards = Array.from(document.querySelectorAll(".luto0c"))
    .filter(card => !container.contains(card));

  // 無限増殖防止：既存のクローン数と元の数が同じならスキップ
  if (filesEl.children.length === originalCards.length) return;

  console.log("Updating files...");
  filesEl.innerHTML = ""; // クリア

  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    // クローンしたカードの中にあるクリックイベント等を維持しつつ追加
    filesEl.appendChild(clone);
  });
  const digitClassElements = document.querySelectorAll('.luto0c');
  digitClassElements.forEach(el => {
    el.style.marginBottom = "10px";
  });
}

/* ---------- 3. 監視設定 ---------- */
// 自分の操作によるループを防ぐためのフラグ
let isUpdating = false;

const observer = new MutationObserver(() => {
  if (isUpdating) return;

  isUpdating = true;
  updateFilesSection();
  // 処理が終わった後、少し間を置いてから監視を再開（負荷対策）
  setTimeout(() => { isUpdating = false; }, 500);
});

// 監視開始
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 初回実行
updateFilesSection();