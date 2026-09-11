/* ==========================================================================
   Free-text problem matching against the 37-entry SOLUTIONS library.
   Shared by solutions.html (js/solutions.js) and the site-wide chatbot
   (js/chatbot.js). Requires data/solutions.js to be loaded first.
   ========================================================================== */

const STOPWORDS = new Set(["the","and","for","with","that","this","have","just","not","are","was","were",
  "feel","feeling","feels","about","from","into","like","when","what","how","can","get","got","don","doesn",
  "didn","really","very","much","some","any","because","been","being","who","whom","its","it's","i'm","im",
  "me","my","you","your","all","out","over","time","think","know","want","need","and","but","cant","can't"]);

const SYNONYMS = {
  anxious:["fear","anxiety","worry","control"], worried:["fear","anxiety","worry"],
  worry:["fear","anxiety"], scared:["fear","afraid"], nervous:["fear","anxiety"],
  panic:["fear","anxiety"], afraid:["fear","afraid"],
  angry:["anger","temper"], furious:["anger"], mad:["anger"], rage:["anger"], temper:["anger","temper"],
  irritated:["anger","reactivity"], annoyed:["anger"],
  sad:["grief","loss"], depressed:["grief","stress"], down:["grief","stress"], upset:["grief","anger"],
  crying:["grief"], heartbroken:["grief","relationships"],
  lonely:["isolated","relationships","unseen"], isolated:["relationships","isolated"], alone:["isolated","relationships"],
  jealous:["comparing","ego","envy"], envious:["comparing","ego"], comparing:["comparing","progress"],
  insecure:["self-doubt","confidence"], doubt:["self-doubt"], confidence:["self-doubt","believe"],
  lazy:["procrastinat","stuck"], procrastinating:["procrastinat"], procrastinate:["procrastinat"],
  stuck:["purpose","direction","stuck"], confused:["purpose","direction","confused"], lost:["purpose","direction"],
  overwhelmed:["stress","overwhelm"], stressed:["stress","overwhelm"], tired:["stress","overwhelm"],
  exhausted:["stress","overwhelm"], burnout:["stress","overwhelm"], "burnt-out":["stress"],
  failed:["failure","setback"], failing:["failure","setback"], failure:["failure","setback"],
  breakup:["relationship","forgive"], divorce:["relationship"], forgive:["forgive","relationship"],
  death:["death","impermanence","grief"], dying:["death"], grief:["grief","loss"], loss:["grief","loss"],
  change:["change","impermanence"], changing:["change","impermanence"],
  ego:["ego","pride"], proud:["ego","pride"], arrogant:["ego","pride"],
  criticism:["criticism","ego"], criticized:["criticism","ego"], judged:["criticism","ego"],
  attachment:["desire","attachment"], desire:["desire"], wanting:["desire","attachment"], craving:["desire"],
  purpose:["purpose","direction"], duty:["duty","purpose"], career:["purpose","direction"], job:["purpose","direction","work"],
  focus:["stress","overwhelm","focus"], distracted:["stress","focus"], "can't focus":["stress","focus"],
  work:["work","stress"], boss:["work","duty"], decision:["purpose","direction","duty"], torn:["duty","direction"],
  revenge:["anger","revenge"], hurt:["anger","grief"], betrayed:["anger","forgive"],
};

function tokenize(str) {
  return str.toLowerCase().replace(/[^a-z\s']/g, " ").split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function expandTokens(tokens) {
  const set = new Set(tokens);
  tokens.forEach(t => { if (SYNONYMS[t]) SYNONYMS[t].forEach(s => set.add(s)); });
  return [...set];
}

function scoreEntry(entry, tokens) {
  const title = entry.title.toLowerCase();
  const all = (entry.category + " " + entry.title + " " + entry.why).toLowerCase();
  let score = 0;
  tokens.forEach(t => {
    if (title.includes(t)) score += 3;
    else if (all.includes(t)) score += 1;
  });
  return score;
}

function searchProblems(query) {
  const tokens = expandTokens(tokenize(query));
  if (tokens.length === 0) return { tokens, matches: [] };
  const scored = SOLUTIONS.map(e => ({ entry: e, score: scoreEntry(e, tokens) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);
  return { tokens, matches: scored.slice(0, 4).map(r => r.entry), topScore: scored[0] ? scored[0].score : 0 };
}

// A small, broad fallback set so a typed problem never comes back empty-handed.
const FALLBACK_ENTRIES = () => SOLUTIONS.filter(s =>
  ["I'm overwhelmed and can't focus", "I don't believe in myself", "I'm anxious about something I can't control"].includes(s.title)
);
