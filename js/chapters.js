const MAX_VERSE = {1:47,2:72,3:43,4:42,5:29,6:47,7:30,8:28,9:34,10:42,11:55,12:20,13:35,14:27,15:20,16:24,17:28,18:78};

let currentLang = "en";
let currentChapter = null;
let currentVerse = null;

function buildWheel() {
  const wheel = document.getElementById("wheel");
  const radius = 42; // percent
  for (let i = 1; i <= 18; i++) {
    const angle = (i - 1) * (360 / 18) - 90; // start at top
    const rad = (angle * Math.PI) / 180;
    const x = 50 + radius * Math.cos(rad);
    const y = 50 + radius * Math.sin(rad);
    // alternating depth gives the ring real relief in 3D, not a flat circle
    const depth = i % 2 === 0 ? 14 : -4;

    const spoke = document.createElement("button");
    spoke.className = "spoke";
    spoke.type = "button";
    spoke.style.left = x + "%";
    spoke.style.top = y + "%";
    const baseTransform = `translate(-50%,-50%) translateZ(${depth}px)`;
    spoke.style.transform = baseTransform;
    spoke.dataset.baseTransform = baseTransform;
    spoke.textContent = i;
    spoke.setAttribute("aria-label", "Chapter " + i);
    spoke.dataset.ch = i;
    spoke.addEventListener("click", () => selectChapter(i));
    wheel.appendChild(spoke);
  }
}

async function selectChapter(ch) {
  currentChapter = ch;
  currentVerse = null;
  document.getElementById("verse-detail").innerHTML = "";
  document.querySelectorAll(".spoke").forEach(s => {
    const isActive = Number(s.dataset.ch) === ch;
    s.classList.toggle("active", isActive);
    // the result spoke lifts toward the viewer and grows — the wheel
    // "showing" which chapter answered the click
    s.style.transform = isActive
      ? "translate(-50%,-50%) translateZ(52px) scale(1.18)"
      : s.dataset.baseTransform;
  });

  const panel = document.getElementById("chapter-panel");
  panel.innerHTML = `<p class="ref">Loading chapter ${ch}…</p>`;

  try {
    const data = await fetchChapter(ch);
    const name = data.transliteration || data.name || "";
    const meaningEn = data.meaning && data.meaning.en ? data.meaning.en : "";
    const summaryEn = data.summary && data.summary.en ? data.summary.en : "";
    panel.innerHTML = `
      <p class="ref">Chapter ${ch} of 18 · ${data.verses_count} verses</p>
      <h3 style="margin-top:10px; color:var(--marigold-2); font-family:var(--f-sanskrit); font-size:26px;">${data.name || ""}</h3>
      <p style="color:var(--parchment-2); margin-top:4px; font-style:italic;">${name}${meaningEn ? " — " + meaningEn : ""}</p>
      ${summaryEn ? `<p style="color:var(--sandstone); margin-top:16px; max-width:70ch;">${summaryEn}</p>` : ""}
      <div class="verse-grid" id="verse-grid"></div>
    `;
    const grid = document.getElementById("verse-grid");
    const count = data.verses_count || MAX_VERSE[ch] || 1;
    for (let v = 1; v <= count; v++) {
      const pill = document.createElement("button");
      pill.className = "verse-pill";
      pill.type = "button";
      pill.textContent = v;
      pill.addEventListener("click", () => selectVerse(ch, v));
      grid.appendChild(pill);
    }
  } catch (e) {
    panel.innerHTML = `<p class="ref">Couldn't load chapter ${ch}. Check your connection and try again.</p>`;
  }
}

async function selectVerse(ch, v) {
  currentVerse = v;
  document.querySelectorAll(".verse-pill").forEach(p => p.classList.toggle("active", Number(p.textContent) === v));

  const holder = document.getElementById("verse-detail");
  holder.innerHTML = `<div class="verse-card"><p class="ref">Loading BG ${ch}.${v}…</p></div>`;
  holder.scrollIntoView({ behavior: "smooth", block: "nearest" });

  try {
    const data = await fetchVerse(ch, v);
    renderVerseDetail(data, ch, v);
  } catch (e) {
    holder.innerHTML = `<div class="verse-card"><p class="ref">Couldn't load this verse. Try another.</p></div>`;
  }
}

function answerTranslationForChapter(data, ch, v, lang) {
  if (lang === "te") {
    const te = teluguFor(ch, v);
    if (te) return { text: te, author: "ఈ వెబ్‌సైట్ కోసం అనువదించబడింది", fallback: false };
    const en = pickTranslation(data, "en");
    return { text: en.text, author: en.author, fallback: true };
  }
  return pickTranslation(data, lang);
}

function renderVerseDetail(data, ch, v) {
  const t = answerTranslationForChapter(data, ch, v, currentLang);
  const holder = document.getElementById("verse-detail");
  holder.innerHTML = `
    <div class="verse-card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <span class="ref">Bhagavad Gita ${ch}.${v}</span>
        <div class="lang-toggle">
          <button type="button" data-lang="en" class="${currentLang === "en" ? "active" : ""}">English</button>
          <button type="button" data-lang="hi" class="${currentLang === "hi" ? "active" : ""}">Hindi</button>
          <button type="button" data-lang="te" class="${currentLang === "te" ? "active" : ""}">తెలుగు</button>
        </div>
      </div>
      <p class="verse-sanskrit">${data.slok || ""}</p>
      <p class="verse-translit">${data.transliteration || ""}</p>
      ${currentLang === "te" && t.fallback ? `<p class="ref" style="margin-top:16px; color:var(--vermillion-2);">తెలుగు అనువాదం ఇంకా జోడించలేదు — ఆంగ్లంలో చూపిస్తోంది</p>` : ""}
      <p class="verse-translation">${t.text}</p>
      <div class="verse-meta">
        <span class="ref">${t.author ? "— " + t.author : ""}</span>
      </div>
    </div>
  `;
  holder.querySelectorAll(".lang-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      renderVerseDetail(data, ch, v);
    });
  });
}

buildWheel();

async function loadChapterIndexGrid() {
  const box = document.getElementById("chapter-index-full");
  if (!box) return;
  try {
    const chapters = await fetchChapters();
    box.innerHTML = chapters.map(c => `
      <a href="#wheel" data-ch="${c.chapter_number}">
        <span class="num">${c.chapter_number}</span>
        <span>
          <h4>${c.name || ""}</h4>
          <p class="meaning">${c.translation || c.transliteration || ""} · ${c.verses_count} verses</p>
        </span>
      </a>
    `).join("");
    box.querySelectorAll("a[data-ch]").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const ch = Number(a.dataset.ch);
        selectChapter(ch);
        document.getElementById("wheel").scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  } catch (e) {
    box.innerHTML = `<p style="padding:24px; color:var(--sandstone);">Couldn't load the chapter list — check your connection.</p>`;
  }
}
loadChapterIndexGrid();

// deep-link support: chapters.html?ch=2&verse=47
const params = new URLSearchParams(window.location.search);
if (params.get("ch")) {
  const ch = Number(params.get("ch"));
  selectChapter(ch).then(() => {
    if (params.get("verse")) selectVerse(ch, Number(params.get("verse")));
  });
}
