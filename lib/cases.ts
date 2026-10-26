export type Category = "umbrella" | "kettle" | "lamp" | "headphones" | "other";

export type SpiritCase = {
  id: string;
  name: string;
  object: string;
  category: Category;
  title: string;
  quote: string;
  story: string;
  traits: string[];
  wish: string;
  actions: {
    kind: "repair" | "reuse" | "pass-on";
    title: string;
    detail: string;
  }[];
  photo?: string;
  memory?: string;
  mode: "sample" | "ai";
  createdAt: string;
  pledge?: string;
};

const now = "2026-10-26T00:00:00.000Z";

export const samples: SpiritCase[] = [
  {
    id: "sample-ame",
    name: "Amé",
    object: "a red umbrella",
    category: "umbrella",
    title: "The little roof that waited",
    quote: "I kept a dry place for you, even on the days you forgot the sky.",
    story:
      "Amé remembers rainy crossings and the small pause beneath a doorway. One bent rib made the handle lean, but it still felt proud of every walk home it sheltered.",
    traits: ["patient", "watchful", "gentle"],
    wish: "I hope someone carries me again when the clouds gather.",
    actions: [
      {
        kind: "repair",
        title: "Ask about a rib repair",
        detail:
          "A repair shop may be able to replace or straighten the bent rib.",
      },
      {
        kind: "reuse",
        title: "Give me a second use",
        detail:
          "If I cannot open safely, turn the fabric into a small cover or keep me for craft reuse.",
      },
      {
        kind: "pass-on",
        title: "Pass me along",
        detail:
          "If it still opens securely, offer it to a neighbor or a local reuse shelf.",
      },
    ],
    mode: "sample",
    createdAt: now,
  },
  {
    id: "sample-mugi",
    name: "Mugi",
    object: "a little electric kettle",
    category: "kettle",
    title: "A warm minute, shared",
    quote: "I liked the quiet before the first cup was poured.",
    story:
      "Mugi remembers a kitchen window fogging as someone made tea before sunrise. Its switch grew unreliable, so it learned to treasure the warmth it had already helped make.",
    traits: ["steady", "thoughtful", "warm-hearted"],
    wish: "Please let a qualified repairer decide whether I can safely work again.",
    actions: [
      {
        kind: "repair",
        title: "Ask a qualified repairer",
        detail:
          "For an electrical fault, unplug the kettle and take it to a qualified repair service. Do not open or repair it yourself.",
      },
      {
        kind: "reuse",
        title: "Recycle it safely",
        detail:
          "If repair is not practical, use your local small-appliance recycling service.",
      },
      {
        kind: "pass-on",
        title: "Pass on only if safe",
        detail:
          "Only offer it to someone if it has been checked and works safely.",
      },
    ],
    mode: "sample",
    createdAt: now,
  },
  {
    id: "sample-hikari",
    name: "Hikari",
    object: "a small desk lamp",
    category: "lamp",
    title: "A circle of light",
    quote: "Even a tiny pool of light can make a late page feel less lonely.",
    story:
      "Hikari remembers sketches, folded notes, and one patient evening at a time. The light flickered near the end, but the little pool it made still felt like a place to begin.",
    traits: ["curious", "calm", "encouraging"],
    wish: "I hope my next chapter is bright and safe.",
    actions: [
      {
        kind: "repair",
        title: "Ask a repair shop",
        detail:
          "Have a qualified repairer check the lamp and its cable before using it again.",
      },
      {
        kind: "reuse",
        title: "Reuse the shade",
        detail:
          "If the electrical parts cannot be reused, consider whether the shade can become a safe non-electrical display.",
      },
      {
        kind: "pass-on",
        title: "Pass it on after a check",
        detail:
          "Offer it only after confirming it works safely and the cable is undamaged.",
      },
    ],
    mode: "sample",
    createdAt: now,
  },
];

const templates: Record<Category, SpiritCase> = {
  umbrella: samples[0],
  kettle: samples[1],
  lamp: samples[2],
  headphones: {
    ...samples[0],
    category: "headphones",
    name: "Mimi",
    title: "A song between stops",
    quote: "I kept the little soundtrack of your ordinary days.",
    story:
      "These headphones remember familiar songs on unremarkable journeys. A quiet channel is not the end of the music; perhaps a new listener can find a way to hear it again.",
    wish: "Let me bring a little music to someone’s day again.",
    actions: [
      {
        kind: "repair",
        title: "Ask about a cable repair",
        detail: "A repair shop can assess the cable, connection or cushions.",
      },
      {
        kind: "reuse",
        title: "Recycle electronics",
        detail:
          "If repair is not practical, use a local electronics collection service.",
      },
      {
        kind: "pass-on",
        title: "Pass them along",
        detail:
          "If they work safely, clean them and offer them to a new listener.",
      },
    ],
  },
  other: {
    ...samples[2],
    category: "other",
    name: "Kiko",
    title: "A thing with a story",
    quote: "Thank you for letting me be part of your days.",
    story:
      "This well-used object remembers the small routines around it. Its story is still being written, and a careful next step may give it another useful chapter.",
    wish: "Help me find a useful place in someone’s everyday life.",
    actions: [
      {
        kind: "repair",
        title: "Ask a local repairer",
        detail: "Find out whether a professional can safely restore it.",
      },
      {
        kind: "reuse",
        title: "Imagine another use",
        detail:
          "Choose a practical, safe purpose that suits the material and condition.",
      },
      {
        kind: "pass-on",
        title: "Find a new owner",
        detail:
          "Offer it honestly if it is safe and useful; explain any known damage.",
      },
    ],
  },
};

export function makeSample(
  category: Category,
  object: string,
  memory: string,
  photo?: string,
): SpiritCase {
  const template = templates[category];
  return {
    ...template,
    id: `sample-${crypto.randomUUID()}`,
    object: object.trim(),
    memory: memory.trim() || undefined,
    photo,
    mode: "sample",
    createdAt: new Date().toISOString(),
  };
}
