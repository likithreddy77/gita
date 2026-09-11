/* ==========================================================================
   Site-wide chatbot. Rule-based, not an LLM — instant, free, and accurate,
   at the cost of only handling what it's explicitly built to handle:
   - Gita facts (author, chapter/verse counts, who's who, key terms)
   - A specific verse or chapter ("what does 2.47 say", "chapter 6 summary")
   - Something you're going through (routes into the same 37-entry matcher
     used on the Find Your Answer page)
   Anything else gets an honest "I don't have that" instead of a guess.
   Requires: js/api.js, js/search.js, data/solutions.js (loaded before this file).
   ========================================================================== */

const MAX_VERSE_BY_CH = {1:47,2:72,3:43,4:42,5:29,6:47,7:30,8:28,9:34,10:42,11:55,12:20,13:35,14:27,15:20,16:24,17:28,18:78};

const FAQS = [
  { triggers: ["how many chapters"], a: "The Bhagavad Gita has 18 chapters." },
  { triggers: ["how many verses", "how many slokas", "how many shlokas", "how many slokams"], a: "700 verses in total, spread across 18 chapters." },
  { triggers: ["wrote", "author", "written", "composed"], a: "Tradition attributes the Bhagavad Gita to the sage Vyasa, as part of the epic Mahabharata." },
  { triggers: ["who is krishna"], a: "Krishna is Arjuna's charioteer and cousin — over the course of the Gita he reveals himself as the Supreme, and the whole text is his teaching to Arjuna on the battlefield of Kurukshetra." },
  { triggers: ["who is arjuna"], a: "Arjuna is a Pandava prince and warrior who, overcome with grief and doubt about fighting his own kin, turns to Krishna for guidance — the Gita is Krishna's answer to him." },
  { triggers: ["karma yoga", "what is karma"], a: "Karma yoga is the path of selfless action — doing your duty fully without attachment to the results. Chapter 2, verse 47 is its most famous statement. Ask me \"what does 2.47 say\" to read it." },
  { triggers: ["what is dharma", "meaning of dharma"], a: "Dharma means one's righteous duty or right action — what's appropriate to your role and situation. It runs through the whole text." },
  { triggers: ["free", "cost", "price", "sign up", "account", "pay"], a: "This whole site is free — no account, no ads, no cost. Check the About page for how it's built." },
  { triggers: ["telugu", "hindi", "sanskrit", "which language", "what language", "languages"], a: "The original is Sanskrit. This site also shows English and Hindi for every verse, and Telugu for a growing set of verses (full coverage in Find Your Answer and Chapter 2 — see About for the details)." },
  { triggers: ["what is the gita about", "gita about", "what's the gita", "summary of the gita", "story of the gita"], a: "It's a 700-verse dialogue between Krishna and the warrior Arjuna on the battlefield of Kurukshetra, covering duty, the nature of the self, action without attachment, and devotion." },
  { triggers: ["how do i use", "how does this work", "how to use", "how do i navigate"], a: "Use \"Read the Gita\" to browse all 18 chapters, or \"Find Your Answer\" for verses matched to something you're going through. Or just ask me — try a specific verse like \"2.47\", or tell me what's on your mind." },
  { triggers: ["kurukshetra"], a: "Kurukshetra is the battlefield where the Gita's dialogue takes place — right before the two armies clash, Arjuna asks Krishna to pause between them." },
];

function matchFAQ(query) {
  const q = query.toLowerCase();
  let best = null, bestScore = 0;
  FAQS.forEach(f => {
    const score = f.triggers.filter(t => q.includes(t)).length;
    if (score > bestScore) { bestScore = score; best = f; }
  });
  return bestScore > 0 ? best : null;
}

function parseVerseRef(query) {
  const patterns = [
    /chapter\s*(\d{1,2})\D+verse\s*(\d{1,3})/i,
    /verse\s*(\d{1,3})\D+chapter\s*(\d{1,2})/i,
    /\b(\d{1,2})\s*[.:]\s*(\d{1,3})\b/,
  ];
  for (const re of patterns) {
    const m = query.match(re);
    if (!m) continue;
    let ch, v;
    if (re === patterns[1]) { v = Number(m[1]); ch = Number(m[2]); }
    else { ch = Number(m[1]); v = Number(m[2]); }
    if (ch >= 1 && ch <= 18 && v >= 1 && v <= (MAX_VERSE_BY_CH[ch] || 999)) return { ch, v };
  }
  return null;
}

function parseChapterOnlyRef(query) {
  const m = query.match(/chapter\s*(\d{1,2})\b/i);
  if (!m) return null;
  const ch = Number(m[1]);
  return (ch >= 1 && ch <= 18) ? ch : null;
}

function isGreeting(q) { return /^\s*(hi|hello|hey|namaste|hola|yo)\b/i.test(q); }
function isThanks(q) { return /\b(thanks|thank you|thx)\b/i.test(q); }
function looksPersonal(q) {
  return /\b(i'm|im|i am|i've|ive|i feel|i can't|i cant|i don't|i dont|my|i keep|i need|i want|i wish|help me|i'm not|i just|i always|i never)\b/i.test(q);
}

/* ---------- UI ---------- */

let chatOpen = false, chatGreeted = false;

function chatAppend(html, who) {
  const body = document.getElementById("chat-body");
  const div = document.createElement("div");
  div.className = "chat-msg " + who;
  div.innerHTML = html;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return div;
}

function chatSuggestions(list) {
  const box = document.createElement("div");
  box.className = "chat-suggest";
  list.forEach(s => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = s;
    b.addEventListener("click", () => handleChatQuery(s));
    box.appendChild(b);
  });
  document.getElementById("chat-body").appendChild(box);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

async function handleChatQuery(query) {
  query = query.trim();
  if (!query) return;
  chatAppend(escapeHtml(query), "user");

  if (isGreeting(query)) {
    chatAppend("Hi! Ask me a Gita fact, a specific verse (like \"what does 2.47 say\"), a chapter summary, or tell me what's on your mind.", "bot");
    chatSuggestions(["How many chapters?", "What does 2.47 say?", "I'm anxious about something"]);
    return;
  }
  if (isThanks(query)) {
    chatAppend("You're welcome. Anything else?", "bot");
    return;
  }

  const verseRef = parseVerseRef(query);
  if (verseRef) {
    const loading = chatAppend("Looking that up…", "bot");
    try {
      const data = await fetchVerse(verseRef.ch, verseRef.v);
      const t = pickTranslation(data, "en");
      loading.innerHTML = `
        <div class="verse-ref-mini">Bhagavad Gita ${verseRef.ch}.${verseRef.v}</div>
        <div class="verse-sanskrit-mini">${data.slok || ""}</div>
        <div>${t.text}</div>
        <div style="margin-top:6px;"><a class="chat-link" href="chapters.html?ch=${verseRef.ch}&verse=${verseRef.v}">Open in full reader →</a></div>
      `;
    } catch (e) {
      loading.textContent = "Couldn't load that verse right now — check your connection.";
    }
    return;
  }

  const chOnly = parseChapterOnlyRef(query);
  if (chOnly) {
    const loading = chatAppend("Looking that up…", "bot");
    try {
      const data = await fetchChapter(chOnly);
      const summary = data.summary && data.summary.en ? data.summary.en.split(". ").slice(0, 2).join(". ") + "." : "";
      loading.innerHTML = `
        <div class="verse-ref-mini">Chapter ${chOnly} · ${data.verses_count} verses</div>
        <div class="verse-sanskrit-mini" style="font-size:18px;">${data.name || ""}</div>
        <div>${data.translation || data.transliteration || ""}</div>
        ${summary ? `<div style="margin-top:6px; color:var(--sandstone); font-size:13px;">${summary}</div>` : ""}
        <div style="margin-top:6px;"><a class="chat-link" href="chapters.html?ch=${chOnly}">Read this chapter →</a></div>
      `;
    } catch (e) {
      loading.textContent = "Couldn't load that chapter right now — check your connection.";
    }
    return;
  }

  const faq = matchFAQ(query);
  if (faq) {
    chatAppend(faq.a, "bot");
    return;
  }

  if (typeof searchProblems === "function" && typeof SOLUTIONS !== "undefined") {
    const { matches, topScore } = searchProblems(query);
    const isPersonal = looksPersonal(query);

    if (topScore > 0 || isPersonal) {
      const top = (topScore > 0 ? matches[0] : FALLBACK_ENTRIES()[Math.floor(Math.random() * FALLBACK_ENTRIES().length)]);
      const introLine = topScore > 0
        ? `This sounds closest to <strong>"${escapeHtml(top.title)}"</strong> — checking the verses…`
        : `That's not an exact phrase I've mapped yet, but the Gita's whole premise is that there's always a way through — here's a place to start while I keep learning yours…`;
      const loading = chatAppend(introLine, "bot");
      try {
        const verses = await Promise.all(top.refs.map(r => fetchVerse(r.ch, r.verse)));
        const cards = verses.map((data, i) => {
          const ref = top.refs[i];
          const t = pickTranslation(data, "en");
          return `<div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--line);">
            <div class="verse-ref-mini">Bhagavad Gita ${ref.ch}.${ref.verse}</div>
            <div>${t.text}</div>
          </div>`;
        }).join("");
        loading.innerHTML = `<strong>${escapeHtml(top.title)}</strong><div style="margin-top:6px; color:var(--sandstone); font-size:13px;">${top.why}</div>${cards}
          <div style="margin-top:8px;"><a class="chat-link" href="solutions.html">See more in Find Your Answer →</a></div>`;
      } catch (e) {
        loading.textContent = "Couldn't load those verses right now — check your connection.";
      }
      return;
    }
  }

  chatAppend("I don't have a confident answer for that — it doesn't look like something the Gita's text speaks to directly. I can help with Gita facts, a specific verse or chapter, or something you're going through.", "bot");
  chatSuggestions(["How many verses?", "What does 6.5 say?", "Chapter 4 summary"]);
}

function toggleChat(forceOpen) {
  const panel = document.getElementById("chat-panel");
  chatOpen = typeof forceOpen === "boolean" ? forceOpen : !chatOpen;
  panel.classList.toggle("open", chatOpen);
  if (chatOpen && !chatGreeted) {
    chatGreeted = true;
    chatAppend("Namaste. Ask me anything about the Gita — a fact, a specific verse, or something you're going through.", "bot");
    chatSuggestions(["How many chapters?", "What does 2.47 say?", "I feel stuck and don't know my purpose"]);
  }
  if (chatOpen) document.getElementById("chat-input").focus();
}

document.getElementById("chat-fab").addEventListener("click", () => toggleChat());
document.getElementById("chat-close").addEventListener("click", () => toggleChat(false));
document.getElementById("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("chat-input");
  const q = input.value;
  input.value = "";
  handleChatQuery(q);
});
