let activeCategory = "All";
let answerLang = "en";

function renderSearchResults(query) {
  const resultsBox = document.getElementById("search-results");
  const browseSection = document.getElementById("browse-section");
  const { matches } = searchProblems(query);
  const usedFallback = matches.length === 0;
  const shown = usedFallback ? FALLBACK_ENTRIES() : matches;

  browseSection.style.display = "none";
  document.getElementById("answer-panel").innerHTML = "";

  resultsBox.innerHTML = `
    <div class="search-results-head">
      <div>
        <p class="eyebrow" style="margin-bottom:6px;">${usedFallback ? "A place to start" : "Closest matches"}</p>
        <h3>“${query}”</h3>
      </div>
      <button class="clear-search" type="button" id="clear-search">← Back to all problems</button>
    </div>
    ${usedFallback ? `<p style="color:var(--sandstone); margin-top:10px; max-width:60ch;">That's not an exact phrase in the 41 entries below yet — but the Gita's whole premise is that there's a way through whatever you're carrying. Here are a few verses to start with, and you're welcome to browse the full list below too.</p>` : ""}
    <div class="problem-grid" style="margin-top:24px;">
      ${shown.map((s, i) => `
        <button class="problem-card" type="button" data-idx="${i}">
          <span class="cat">${s.category}</span><h3>${s.title}</h3>
        </button>
      `).join("")}
    </div>
  `;
  resultsBox.querySelectorAll(".problem-card").forEach((card, i) => {
    card.addEventListener("click", () => showAnswer(shown[i]));
  });
  document.getElementById("clear-search").addEventListener("click", () => {
    resultsBox.innerHTML = "";
    browseSection.style.display = "";
    document.getElementById("problem-search").value = "";
  });
  resultsBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderFilters() {
  const row = document.getElementById("filter-row");
  const cats = ["All", ...CATEGORIES];
  row.innerHTML = "";
  cats.forEach(cat => {
    const chip = document.createElement("button");
    chip.className = "chip" + (cat === activeCategory ? " active" : "");
    chip.type = "button";
    chip.textContent = cat;
    chip.addEventListener("click", () => {
      activeCategory = cat;
      renderFilters();
      renderGrid();
    });
    row.appendChild(chip);
  });
}

function renderGrid() {
  const grid = document.getElementById("problem-grid");
  grid.innerHTML = "";
  const list = SOLUTIONS.filter(s => activeCategory === "All" || s.category === activeCategory);
  list.forEach((s, idx) => {
    const card = document.createElement("button");
    card.className = "problem-card";
    card.type = "button";
    card.innerHTML = `<span class="cat">${s.category}</span><h3>${s.title}</h3>`;
    card.addEventListener("click", () => showAnswer(s));
    grid.appendChild(card);
  });
  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--sandstone); padding:20px;">No entries in this category yet.</p>`;
  }
}

async function showAnswer(entry) {
  const panel = document.getElementById("answer-panel");
  panel.innerHTML = `
    <p class="ref">Loading verses for “${entry.title}”…</p>
  `;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const verses = await Promise.all(entry.refs.map(r => fetchVerse(r.ch, r.verse)));
    renderAnswer(entry, verses);
  } catch (e) {
    panel.innerHTML = `<p class="ref">Couldn't load these verses right now. Check your connection and try again.</p>`;
  }
}

function answerTranslation(data, ref, lang) {
  if (lang === "te") {
    const te = teluguFor(ref.ch, ref.verse);
    if (te) return { text: te, author: "ఈ వెబ్‌సైట్ కోసం అనువదించబడింది", fallback: false };
    const en = pickTranslation(data, "en");
    return { text: en.text, author: en.author, fallback: true };
  }
  return pickTranslation(data, lang);
}

function renderAnswer(entry, verses) {
  const panel = document.getElementById("answer-panel");
  const cards = verses.map((data, i) => {
    const ref = entry.refs[i];
    const t = answerTranslation(data, ref, answerLang);
    return `
      <div class="verse-card" style="margin-top:20px;">
        <span class="ref">Bhagavad Gita ${ref.ch}.${ref.verse}</span>
        <p class="verse-sanskrit">${data.slok || ""}</p>
        <p class="verse-translit">${data.transliteration || ""}</p>
        ${answerLang === "te" && t.fallback ? `<p class="ref" style="margin-top:12px; color:var(--vermillion-2);">తెలుగు అనువాదం ఇంకా జోడించలేదు — ఆంగ్లంలో చూపిస్తోంది</p>` : ""}
        <p class="verse-translation">${t.text}</p>
        <div class="verse-meta">
          <span class="ref">${t.author ? "— " + t.author : ""}</span>
          <a class="ref" href="chapters.html?ch=${ref.ch}&verse=${ref.verse}" style="color:var(--marigold-2);">Read in full chapter →</a>
        </div>
      </div>
    `;
  }).join("");

  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
      <div>
        <p class="eyebrow" style="margin-bottom:6px;">${entry.category}</p>
        <h3 style="font-size:26px;">${entry.title}</h3>
      </div>
      <div class="lang-toggle">
        <button type="button" data-lang="en" class="${answerLang === "en" ? "active" : ""}">English</button>
        <button type="button" data-lang="hi" class="${answerLang === "hi" ? "active" : ""}">Hindi</button>
        <button type="button" data-lang="te" class="${answerLang === "te" ? "active" : ""}">తెలుగు</button>
      </div>
    </div>
    <div class="why-box" style="margin-top:22px;"><p>${entry.why}</p></div>
    ${cards}
  `;
  panel.querySelectorAll(".lang-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
      answerLang = btn.dataset.lang;
      renderAnswer(entry, verses);
    });
  });
}

renderFilters();
renderGrid();

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("problem-search").value.trim();
  if (query.length === 0) return;
  renderSearchResults(query);
});
