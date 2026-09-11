/* ==========================================================================
   Gita API helpers
   Free, open, no-key REST API: https://vedicscriptures.github.io
   Endpoints used:
     GET /chapters            -> array of 18 chapter summaries
     GET /chapter/:ch         -> single chapter summary
     GET /slok/:ch/:verse     -> single verse: Sanskrit + transliteration +
                                  ~20 commentator translations (Hindi/English)
   ========================================================================== */

const GITA_API = "https://vedicscriptures.github.io";

/* Commentators available on each verse object, grouped by language,
   so the UI can offer a real "pick your language" control. */
const COMMENTATORS = {
  en: [
    { key: "siva",   label: "Swami Sivananda" },
    { key: "purohit", label: "Shri Purohit Swami" },
    { key: "chinmay", label: "Swami Chinmayananda" },
    { key: "adi",     label: "Swami Adidevananda" },
    { key: "gambir",  label: "Swami Gambirananda" },
    { key: "san",     label: "Dr. S. Sankaranarayan" },
  ],
  hi: [
    { key: "tej",    label: "Swami Tejomayananda" },
    { key: "rams",   label: "Swami Ramsukhdas" },
    { key: "raman",  label: "Swami Ramanuja" },
    { key: "chinmay", label: "Swami Chinmayananda" },
  ],
};

async function fetchChapters() {
  const res = await fetch(`${GITA_API}/chapters/`);
  if (!res.ok) throw new Error("Could not load chapter list");
  return res.json();
}

async function fetchChapter(ch) {
  const res = await fetch(`${GITA_API}/chapter/${ch}/`);
  if (!res.ok) throw new Error("Could not load chapter " + ch);
  return res.json();
}

async function fetchVerse(ch, verse) {
  const res = await fetch(`${GITA_API}/slok/${ch}/${verse}/`);
  if (!res.ok) throw new Error(`Could not load BG ${ch}.${verse}`);
  return res.json();
}

/** Pick the best available translation text for a verse object, given a
 *  preferred language ("en" | "hi") — falls back gracefully. */
function pickTranslation(verseData, lang) {
  const pool = COMMENTATORS[lang] || COMMENTATORS.en;
  for (const c of pool) {
    const block = verseData[c.key];
    if (!block) continue;
    const text = lang === "hi" ? block.ht : (block.et || block.ht);
    if (text) return { text: cleanText(text), author: block.author || c.label };
  }
  // last resort: scan every key on the object for any usable text
  for (const key of Object.keys(verseData)) {
    const block = verseData[key];
    if (block && typeof block === "object") {
      const text = block.et || block.ht;
      if (text) return { text: cleanText(text), author: block.author || key };
    }
  }
  return { text: "Translation not available for this verse yet.", author: "" };
}

function cleanText(t) {
  return t.replace(/\|\|.*?\|\|/g, "").replace(/^\s*।।.*?।।/, "").trim();
}

function randomVerseRef() {
  // weighted-simple: pick a random chapter (1-18) then a plausible verse number
  const maxByChapter = {1:47,2:72,3:43,4:42,5:29,6:47,7:30,8:28,9:34,10:42,11:55,12:20,13:35,14:27,15:20,16:24,17:28,18:78};
  const ch = 1 + Math.floor(Math.random() * 18);
  const verse = 1 + Math.floor(Math.random() * maxByChapter[ch]);
  return { ch, verse };
}
