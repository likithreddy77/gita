/* ==========================================================================
   Curated problem -> verse map.
   Each entry references real chapter.verse locations; the verse text itself
   is fetched live from the API (never hard-coded here) so translations stay
   accurate to source. "why" is a short original note on the relevance.
   ========================================================================== */

const SOLUTIONS = [
  {
    category: "Fear & Anxiety",
    title: "I'm anxious about something I can't control",
    refs: [{ ch: 2, verse: 47 }, { ch: 2, verse: 14 }],
    why: "Krishna's core teaching on karma yoga: your responsibility ends at right action, not at the outcome. Anxiety often comes from gripping the result — this verse is the classic antidote."
  },
  {
    category: "Fear & Anxiety",
    title: "I'm afraid of failing",
    refs: [{ ch: 2, verse: 40 }],
    why: "Krishna tells Arjuna that effort on this path is never wasted, even partially done — it removes the fear that failure erases what you attempted."
  },
  {
    category: "Fear & Anxiety",
    title: "I'm afraid of death or losing someone",
    refs: [{ ch: 2, verse: 20 }, { ch: 2, verse: 22 }],
    why: "The chapter's teaching on the eternal self, and the metaphor of changing worn-out clothes for new ones, addresses grief and mortality directly."
  },
  {
    category: "Anger & Reactivity",
    title: "I keep losing my temper",
    refs: [{ ch: 2, verse: 62 }, { ch: 2, verse: 63 }],
    why: "Krishna maps the exact chain: dwelling on something breeds attachment, attachment breeds desire, thwarted desire breeds anger, and anger clouds judgment. Seeing the chain is the first way to break it."
  },
  {
    category: "Anger & Reactivity",
    title: "Someone wronged me and I want revenge",
    refs: [{ ch: 16, verse: 21 }],
    why: "Krishna names anger, along with lust and greed, as one of three gates to self-destruction — worth naming plainly when revenge feels justified."
  },
  {
    category: "Grief & Loss",
    title: "I'm grieving and can't move forward",
    refs: [{ ch: 2, verse: 11 }, { ch: 2, verse: 27 }],
    why: "Krishna's opening rebuke to Arjuna's grief, followed by the observation that birth and death are certainties for the born — not to minimize loss, but to place it inside something larger."
  },
  {
    category: "Grief & Loss",
    title: "I feel like I've lost everything",
    refs: [{ ch: 2, verse: 13 }],
    why: "The verse on the self passing through childhood, youth, and old age within one life — used here to point at what in you hasn't actually been lost."
  },
  {
    category: "Purpose & Direction",
    title: "I don't know what I'm supposed to do with my life",
    refs: [{ ch: 3, verse: 35 }, { ch: 18, verse: 47 }],
    why: "The teaching on svadharma — your own imperfect path is better than someone else's perfected one. Useful when you're comparing your direction to others'."
  },
  {
    category: "Purpose & Direction",
    title: "I feel stuck and directionless",
    refs: [{ ch: 3, verse: 8 }],
    why: "A blunt instruction to act rather than stay motionless, since even keeping the body going requires action — aimed at the paralysis of overthinking."
  },
  {
    category: "Purpose & Direction",
    title: "I'm torn between duty and what I want",
    refs: [{ ch: 3, verse: 21 }, { ch: 2, verse: 31 }],
    why: "On leadership by example, and on facing one's own rightful duty — relevant when obligation and desire pull in different directions."
  },
  {
    category: "Failure & Setbacks",
    title: "I failed and feel like giving up",
    refs: [{ ch: 6, verse: 40 }],
    why: "Krishna's direct reassurance that one who strives sincerely on a good path is never destroyed, in this life or beyond — spoken to Arjuna's own fear of falling short."
  },
  {
    category: "Failure & Setbacks",
    title: "I'm comparing my progress to other people's",
    refs: [{ ch: 3, verse: 35 }],
    why: "Same verse as the purpose section, applied differently here: your own path, imperfectly walked, outranks someone else's path walked well."
  },
  {
    category: "Ego & Pride",
    title: "My ego keeps getting in the way",
    refs: [{ ch: 16, verse: 4 }, { ch: 18, verse: 58 }],
    why: "A description of the traits that mark egotism (16.4), paired with the instruction to act with awareness centered beyond the small self (18.58)."
  },
  {
    category: "Ego & Pride",
    title: "I take criticism too personally",
    refs: [{ ch: 2, verse: 38 }],
    why: "The instruction to treat gain and loss, praise and blame, as a pair to hold evenly — not to become indifferent, but to stop being steered by either."
  },
  {
    category: "Desire & Attachment",
    title: "I'm consumed by wanting something I don't have",
    refs: [{ ch: 2, verse: 70 }, { ch: 2, verse: 71 }],
    why: "The image of the ocean receiving rivers without being disturbed — a description of peace that comes from desires arising without being chased."
  },
  {
    category: "Desire & Attachment",
    title: "I'm too attached to outcomes at work",
    refs: [{ ch: 2, verse: 47 }, { ch: 2, verse: 48 }],
    why: "Karma yoga again, this time paired with the definition of yoga as evenness of mind — steady, unglamorous advice for results-obsessed effort."
  },
  {
    category: "Relationships",
    title: "I'm struggling to forgive someone",
    refs: [{ ch: 12, verse: 13 }, { ch: 12, verse: 14 }],
    why: "Krishna's description of the devotee free of ill will, friendly and compassionate, forbearing — read as a working definition of what forgiveness looks like in practice."
  },
  {
    category: "Relationships",
    title: "I feel isolated or unseen",
    refs: [{ ch: 6, verse: 30 }, { ch: 9, verse: 29 }],
    why: "Two of the Gita's clearest statements of being met and known — used here for the specific ache of feeling unseen, not as a general theology lesson."
  },
  {
    category: "Stress & Overwhelm",
    title: "I'm overwhelmed and can't focus",
    refs: [{ ch: 6, verse: 35 }, { ch: 6, verse: 26 }],
    why: "Krishna concedes the mind is genuinely hard to control, then gives the practical method: whenever it wanders, gently bring it back — repeatedly, without drama."
  },
  {
    category: "Stress & Overwhelm",
    title: "I can't switch off from work",
    refs: [{ ch: 2, verse: 50 }],
    why: "The definition of yoga as skill in action — doing the work fully while not being inwardly gripped by it, which is different from not caring."
  },
  {
    category: "Self-doubt",
    title: "I don't believe in myself",
    refs: [{ ch: 6, verse: 5 }, { ch: 6, verse: 6 }],
    why: "\"One must elevate, not degrade, oneself by one's own mind\" — the Gita's clearest statement that you are your own ally or your own obstacle, no one else's."
  },
  {
    category: "Self-doubt",
    title: "I keep procrastinating on things that matter to me",
    refs: [{ ch: 3, verse: 8 }, { ch: 18, verse: 23 }],
    why: "The instruction to act, plus the description of action performed as duty, without attachment or aversion, as the mark of clear-headed doing."
  },
  {
    category: "Change & Impermanence",
    title: "Everything feels like it's changing too fast",
    refs: [{ ch: 2, verse: 14 }],
    why: "Cold and heat, pleasure and pain, come and go like the seasons — the instruction is to endure them, not to expect them to stop coming."
  },
  {
    category: "Change & Impermanence",
    title: "I'm scared of starting over",
    refs: [{ ch: 2, verse: 22 }],
    why: "The verse comparing the self shedding old, worn bodies for new ones, the way a person changes worn-out clothes — often read as a verse about any hard restart, not only death."
  },
  {
    category: "Uncertainty & the Unknown",
    title: "I'm scared of an uncertain future",
    refs: [{ ch: 2, verse: 47 }, { ch: 18, verse: 66 }],
    why: "The Gita's two-part answer to not knowing what's ahead: do the part that's actually yours — the effort — and hand over the part that was never yours to control."
  },
  {
    category: "Uncertainty & the Unknown",
    title: "I can't decide and keep putting it off",
    refs: [{ ch: 18, verse: 63 }, { ch: 3, verse: 8 }],
    why: "Krishna's own closing move after 700 verses of teaching: lay out everything, then say \"reflect on it fully, then do as you choose.\" Full information doesn't remove the choice — it just makes it yours to make."
  },
  {
    category: "Habits & Self-Control",
    title: "I can't break a bad habit",
    refs: [{ ch: 3, verse: 34 }, { ch: 6, verse: 26 }],
    why: "Two mechanics, not willpower alone: naming that attraction and aversion to things are natural pulls to watch for, and the plain instruction to keep bringing a wandering mind back — as many times as it takes."
  },
  {
    category: "Guilt & Regret",
    title: "I feel guilty about a mistake I made",
    refs: [{ ch: 4, verse: 36 }, { ch: 18, verse: 66 }],
    why: "One of the Gita's most direct promises of relief: even the heaviest wrongdoing is crossed by the boat of clear understanding — guilt is not a life sentence in this text."
  },
  {
    category: "Guilt & Regret",
    title: "I keep replaying past mistakes in my head",
    refs: [{ ch: 2, verse: 11 }, { ch: 4, verse: 36 }],
    why: "Krishna's opening move is to redirect Arjuna's spiral of self-recrimination toward clear-eyed action instead — grief over what's done doesn't undo it, but right action from here still counts."
  },
  {
    category: "Faith & Doubt",
    title: "I'm losing faith that things will work out",
    refs: [{ ch: 4, verse: 39 }, { ch: 9, verse: 22 }],
    why: "Faith paired with steadiness of purpose is what the Gita says leads to clarity — and a direct promise of being looked after for those who stay devoted to their path."
  },
  {
    category: "Faith & Doubt",
    title: "I feel spiritually empty or disconnected",
    refs: [{ ch: 6, verse: 30 }, { ch: 9, verse: 29 }],
    why: "Two of the clearest statements in the whole text of being met, not abandoned — worth reading slowly if disconnection is what you're sitting with."
  },
  {
    category: "Security & Providence",
    title: "I'm constantly worried about money",
    refs: [{ ch: 2, verse: 70 }, { ch: 9, verse: 22 }],
    why: "Not financial advice — a reframe: peace comes from not being churned by wanting, the way an ocean isn't disturbed by rivers flowing in, alongside Krishna's promise to sustain those steady in their devotion."
  },
  {
    category: "Aging & the Body",
    title: "I'm scared of getting older or losing my health",
    refs: [{ ch: 2, verse: 13 }, { ch: 2, verse: 20 }],
    why: "Not medical guidance — the Gita's philosophical ground for this fear: the self that moved through your childhood and youth is the same one moving through this stage, and was never, in its nature, subject to decay to begin with."
  },
  {
    category: "Patience & Progress",
    title: "I want results now and hate waiting",
    refs: [{ ch: 2, verse: 47 }, { ch: 6, verse: 35 }],
    why: "The right to action, never to the fruit of it — paired with Krishna's own admission that the mind is genuinely hard to steady, and that steadiness is built through practice, not immediately."
  },
  {
    category: "Patience & Progress",
    title: "I feel like giving up because progress is so slow",
    refs: [{ ch: 6, verse: 45 }, { ch: 6, verse: 40 }],
    why: "A direct statement that sustained effort — even across a long stretch — reaches the goal, followed by the reassurance that no sincere effort on this path is ever truly lost."
  },
  {
    category: "Perfectionism",
    title: "I'm a perfectionist and it's exhausting",
    refs: [{ ch: 18, verse: 48 }, { ch: 6, verse: 5 }],
    why: "\"Every action is covered by some flaw, as fire by smoke\" — the Gita's case for not withholding effort until it's flawless, because it never will be, and that was never the bar."
  },
  {
    category: "Performance & Exams",
    title: "I'm anxious about an exam or interview",
    refs: [{ ch: 2, verse: 47 }, { ch: 18, verse: 78 }],
    why: "The same instruction that opens the whole text applied to a single high-stakes day: the preparation is yours, the outcome was never fully yours to grip — do the first part completely."
  },
];

const CATEGORIES = [...new Set(SOLUTIONS.map(s => s.category))];
