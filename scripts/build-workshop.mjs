import { writeFileSync } from "node:fs";
import * as k from "../vendor/anatomy/iso-kit.mjs";

// Precompute the Anatomy isometric SVG once at build time. Dynamic state is
// limited to transforms around a few real machine components.
const WIDTH = 640;
const HEIGHT = 390;
const BASE = { x: -18, y: -56, w: 214, d: 112, r: 8 };
const P = k.fitProjection(
  [...k.boxCorners(BASE, -12, 0), [125, -4, 73]],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: 53, elevation: 29 },
);
const out = {
  base: [],
  intake: [],
  memory: [],
  press: [],
  docket: [],
  moving: {},
  outputs: {},
};
const part = (into, name, shape, tone = "mid", options = {}) => {
  into.push(
    `<g data-workshop-part="${name}">${k.solidSvg(shape, { tone, ...options })}</g>`,
  );
};
const slab = (into, name, plan, z, h, tone = "mid", bevel = 0.5, steps = 5) =>
  part(into, name, k.slabOf(plan, z, h, P, steps, bevel), tone);
const cyl = (into, name, x, y, r, z, h, tone = "mid", n = 28) =>
  part(into, name, k.cylinder(x, y, r, z, h, P, n), tone);
const line = (d, tone = "lo") => k.lineSvg(d, { tone });
const dots = (points, size = 0.48, tone = "mid") =>
  k.dotsSvg(points, { size, tone });
const byDepth = (points) =>
  [...points].sort(
    (a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P),
  );

// Feet, base, inset groove, feet collars, corner screws and a real ruler strip.
out.base.push(`<path class="iso-halo" d="${k.haloOf(BASE, -12, 12, P)}"/>`);
for (const [i, [x, y]] of byDepth(k.corners(BASE, 18)).entries()) {
  cyl(out.base, `foot-flange-${i}`, x, y, 6.3, -12, 1.2, "lo");
  cyl(out.base, `foot-${i}`, x, y, 4.6, -10.8, 3.6, "mid");
}
slab(out.base, "bedplate", BASE, -7.2, 7.2, "mid", 1.2, 7);
out.base.push(line(k.planOutline(k.insetPlan(BASE, 5), 0, P, 7), "lo"));
const screwPoints = k.corners(BASE, 9);
out.base.push(
  line(
    screwPoints.map(([x, y]) => k.ring(x, y, 1.9, 0, P, 14)).join(""),
    "faint",
  ),
);
out.base.push(
  dots(
    screwPoints.map(([x, y]) => k.iso([x, y, 0], P)),
    0.48,
  ),
);
const ruler = { x: -6, y: -48, w: 182, d: 6, r: 1 };
slab(out.base, "ruler-strip", ruler, 0, 0.7, "lo", 0.1, 3);
const ticks = k.topTicks(
  ruler.x + 3,
  ruler.x + ruler.w - 3,
  4,
  5,
  ruler.y + 0.7,
  0.7,
  [1.6, 3],
  P,
);
out.base.push(line(ticks.minor, "lo"), line(ticks.major, "mid"));
out.base.push(
  dots(
    [
      [ruler.x + 2, ruler.y + 3, 0.7],
      [ruler.x + ruler.w - 2, ruler.y + 3, 0.7],
    ].map(([x, y, z]) => k.iso([x, y, z], P)),
    0.42,
    "lo",
  ),
);

// A low, sturdy frame with two rails, end stops, uprights, bracing and fasteners.
for (const [i, y] of [-35, 35].entries())
  slab(
    out.base,
    `guide-rail-${i}`,
    { x: 0, y, w: 166, d: 5, r: 1 },
    1,
    3,
    "mid",
    0.35,
    3,
  );
for (const [i, x] of [-4, 164].entries()) {
  slab(
    out.base,
    `end-stop-${i}`,
    { x, y: -39, w: 5, d: 78, r: 1 },
    1,
    8,
    "mid",
    0.5,
    3,
  );
  out.base.push(
    dots(
      [
        [x + 2.5, -32, 9],
        [x + 2.5, 32, 9],
      ].map(([a, b, z]) => k.iso([a, b, z], P)),
      0.45,
    ),
  );
}
for (const [i, [x, y]] of [
  [13, 0],
  [75, 0],
  [139, 0],
].entries()) {
  cyl(out.base, `frame-upright-${i}`, x, y, 2.4, 3.6, 48, "mid");
  out.base.push(
    line(
      k.sideArc(x, y, 2.4, 15, P, 16) + k.sideArc(x, y, 2.4, 42, P, 16),
      "faint",
    ),
  );
}
slab(
  out.base,
  "rear-tie",
  { x: 6, y: 39, w: 156, d: 4, r: 1 },
  41,
  5,
  "lo",
  0.4,
  4,
);
slab(
  out.base,
  "front-apron",
  { x: 9, y: -46, w: 150, d: 3.2, r: 0.8 },
  1,
  4,
  "lo",
  0.3,
  3,
);
out.base.push(
  dots(
    [
      [17, -44, 5],
      [149, -44, 5],
    ].map(([x, y, z]) => k.iso([x, y, z], P)),
    0.45,
  ),
);

// Photo inlet: a real guide frame, slot, clamp rollers and a shuttle that advances.
slab(
  out.intake,
  "inlet-bed",
  { x: 5, y: -25, w: 47, d: 40, r: 3 },
  4,
  4,
  "lo",
  0.55,
  4,
);
slab(
  out.intake,
  "inlet-housing",
  { x: 8, y: -21, w: 42, d: 32, r: 2.5 },
  8,
  10,
  "mid",
  0.7,
  4,
);
slab(
  out.intake,
  "photo-slot-cavity",
  { x: 11, y: -18, w: 36, d: 2, r: 0.8 },
  18,
  0.5,
  "lo",
  0.1,
  3,
);
for (const [i, x] of [15, 42].entries()) {
  cyl(out.intake, `inlet-roller-${i}`, x, -13, 2.6, 10, 7, "mid");
}
const photoShuttle = [];
slab(
  photoShuttle,
  "photo-shuttle",
  { x: 12, y: -10, w: 33, d: 24, r: 1.7 },
  11,
  1.4,
  "hi",
  0.35,
  4,
);
photoShuttle.push(
  `<g data-workshop-part="photo-card"><path d="${k.planOutline({ x: 16, y: -7, w: 25, d: 18, r: 1 }, 12.5, P, 4)}" class="iso-line" data-tone="red"/></g>`,
);
out.moving.photo = photoShuttle.join("");
slab(
  out.intake,
  "inlet-clamp",
  { x: 13, y: 11, w: 31, d: 4, r: 1.2 },
  20,
  2,
  "mid",
  0.3,
  3,
);
out.intake.push(
  dots(
    [
      [16, 13, 22],
      [41, 13, 22],
    ].map(([x, y, z]) => k.iso([x, y, z], P)),
    0.45,
  ),
);
out.intake.push(
  line(
    k.planOutline(
      k.insetPlan({ x: 8, y: -21, w: 42, d: 32, r: 2.5 }, 2),
      18,
      P,
      4,
    ),
    "faint",
  ),
);

// Memory reel: two flanged spools on an axle, bracket cheeks, tension arm, dial and screws.
slab(
  out.memory,
  "reel-bracket-base",
  { x: 57, y: -25, w: 40, d: 40, r: 2 },
  4,
  3,
  "lo",
  0.4,
  4,
);
for (const [i, x] of [62, 92].entries()) {
  slab(
    out.memory,
    `reel-cheek-${i}`,
    { x, y: -21, w: 3, d: 32, r: 1 },
    7,
    33,
    "mid",
    0.45,
    4,
  );
  out.memory.push(
    dots(
      [
        [x + 1.5, -17, 39],
        [x + 1.5, 7, 39],
      ].map(([a, b, z]) => k.iso([a, b, z], P)),
      0.45,
    ),
  );
}
const reel = [];
cyl(reel, "reel-axle", 77.5, -5, 2.1, 14, 23, "lo");
cyl(reel, "reel-hub", 77.5, -5, 8.8, 19, 12, "mid", 40);
cyl(reel, "reel-flange-back", 77.5, -5, 10.5, 17, 1.4, "lo", 40);
cyl(reel, "reel-flange-front", 77.5, -5, 10.5, 31.2, 1.4, "hi", 40);
cyl(reel, "reel-knob", 77.5, -5, 3.2, 32.6, 3.2, "mid", 24);
reel.push(line(k.ring(77.5, -5, 7, 32.6, P, 32), "faint"));
out.moving.reel = reel.join("");
slab(
  out.memory,
  "tension-arm",
  { x: 66, y: 12, w: 22, d: 3, r: 1 },
  23,
  2,
  "mid",
  0.3,
  3,
);
cyl(out.memory, "tension-wheel", 68, 12, 3.2, 20, 6, "hi", 28);
out.memory.push(line(k.knurl(68, 12, 3.2, 20, 26, 20, P), "lo"));
out.memory.push(
  dots(
    [
      [64, -19, 41],
      [64, 7, 41],
      [90, -19, 41],
      [90, 7, 41],
    ].map(([x, y, z]) => k.iso([x, y, z], P)),
    0.43,
  ),
);

// Letterpress press: twin guides, cap beam, bearings, platen, press screw and a lever.
slab(
  out.press,
  "press-foot",
  { x: 101, y: -24, w: 48, d: 38, r: 3 },
  4,
  4,
  "lo",
  0.5,
  4,
);
for (const [i, x] of [106, 144].entries()) {
  cyl(out.press, `press-guide-collar-${i}`, x, -4, 3.5, 8, 2, "lo");
  cyl(out.press, `press-guide-${i}`, x, -4, 2.2, 10, 39, "mid");
  out.press.push(line(k.sideArc(x, -4, 2.2, 22, P, 16), "faint"));
}
slab(
  out.press,
  "press-crown",
  { x: 101, y: -20, w: 48, d: 31, r: 3 },
  49,
  8,
  "hi",
  0.85,
  5,
);
slab(
  out.press,
  "press-bearing",
  { x: 117, y: -14, w: 16, d: 19, r: 2 },
  57,
  5,
  "mid",
  0.5,
  4,
);
cyl(out.press, "press-screw", 125, -4, 2.2, 62, 13, "lo");
cyl(out.press, "press-hub", 125, -4, 5.4, 69, 4, "hi", 32);
out.press.push(line(k.ring(125, -4, 4.2, 73, P, 24), "lo"));
slab(
  out.press,
  "press-platen",
  { x: 112, y: -14, w: 26, d: 22, r: 2 },
  10,
  4,
  "hi",
  0.6,
  4,
);
out.press.push(
  line(
    k.planOutline({ x: 115, y: -11, w: 20, d: 16, r: 1 }, 14, P, 4),
    "faint",
  ),
);
// Handle is grouped around the press hub for the small live rotation.
const lever = [];
slab(
  lever,
  "lever-arm",
  { x: 125, y: -5.4, w: 27, d: 2.8, r: 1.2 },
  70,
  2,
  "mid",
  0.3,
  4,
);
cyl(lever, "lever-grip", 151, -4, 2.8, 70, 4, "lit", 24);
const hubAt = k.iso([125, -4, 71], P);
out.moving.lever = lever.join("");
// The ram, its face and its two guide collars are a single moving assembly.
const ram = [];
cyl(ram, "ram", 125, -4, 2.2, 18, 42, "mid");
cyl(ram, "ram-collar", 125, -4, 3.4, 17, 2, "lo");
slab(
  ram,
  "ram-shoe",
  { x: 120, y: -9, w: 10, d: 10, r: 1.5 },
  16,
  3,
  "lit",
  0.35,
  4,
);
out.moving.ram = ram.join("");
out.press.push(
  dots(
    [
      [105, -18, 57],
      [145, -18, 57],
      [105, 9, 57],
      [145, 9, 57],
    ].map(([x, y, z]) => k.iso([x, y, z], P)),
    0.45,
  ),
);

// Docket drawer shell, rails, label frame, pull and a removable docket card.
slab(
  out.docket,
  "docket-case",
  { x: 151, y: -24, w: 40, d: 39, r: 2 },
  4,
  4,
  "lo",
  0.5,
  4,
);
for (const [i, y] of [-17, 7].entries())
  slab(
    out.docket,
    `docket-runner-${i}`,
    { x: 156, y, w: 30, d: 3, r: 0.8 },
    8,
    2,
    "mid",
    0.25,
    3,
  );
const drawer = [];
slab(
  drawer,
  "docket-tray-floor",
  { x: 154, y: -19, w: 32, d: 27, r: 1.2 },
  9,
  1,
  "mid",
  0.2,
  4,
);
for (const [i, y] of [-19, 6].entries())
  slab(
    drawer,
    `docket-wall-${i}`,
    { x: 154, y, w: 32, d: 1.8, r: 0.6 },
    10,
    5,
    "hi",
    0.2,
    3,
  );
slab(
  drawer,
  "docket-front",
  { x: 151, y: -22, w: 38, d: 4, r: 1.2 },
  9,
  12,
  "hi",
  0.5,
  4,
);
slab(
  drawer,
  "docket-label-frame",
  { x: 160, y: -20.6, w: 20, d: 1.6, r: 0.6 },
  13,
  4,
  "lo",
  0.2,
  3,
);
slab(
  drawer,
  "docket-card",
  { x: 162, y: -20.2, w: 16, d: 0.8, r: 0.3 },
  13.7,
  2.2,
  "mid",
  0.1,
  3,
);
cyl(drawer, "docket-pull-left", 163, -22, 1.2, 11, 5, "lo", 16);
cyl(drawer, "docket-pull-right", 177, -22, 1.2, 11, 5, "lo", 16);
slab(
  drawer,
  "docket-pull-bar",
  { x: 163, y: -23.3, w: 14, d: 2.6, r: 1.2 },
  15,
  1.4,
  "mid",
  0.4,
  4,
);
drawer.push(
  dots(
    [
      [155, -19, 21],
      [185, -19, 21],
      [155, 6, 21],
      [185, 6, 21],
    ].map(([x, y, z]) => k.iso([x, y, z], P)),
    0.42,
  ),
);
out.moving.docket = drawer.join("");

// Three real output trays, one per action kind, with board, rails, rim and contents stops.
for (const [index, kind] of ["repair", "reuse", "pass-on"].entries()) {
  const x = 5 + index * 54;
  const tray = [];
  slab(
    tray,
    `${kind}-tray-base`,
    { x, y: 42, w: 48, d: 22, r: 2 },
    5,
    2,
    "mid",
    0.35,
    4,
  );
  slab(
    tray,
    `${kind}-tray-back`,
    { x, y: 60, w: 48, d: 3, r: 1 },
    7,
    5,
    "hi",
    0.3,
    3,
  );
  for (const [sideIndex, [side, sx]] of [
    ["left", x],
    ["right", x + 45],
  ].entries())
    slab(
      tray,
      `${kind}-tray-side-${side}-${sideIndex}`,
      { x: sx, y: 44, w: 3, d: 16, r: 0.8 },
      7,
      4,
      "mid",
      0.25,
      3,
    );
  slab(
    tray,
    `${kind}-output-card`,
    { x: x + 11, y: 51, w: 26, d: 8, r: 0.8 },
    9,
    0.8,
    "lit",
    0.1,
    3,
  );
  tray.push(
    dots(
      [
        [x + 4, 46, 11],
        [x + 44, 46, 11],
      ].map(([a, b, z]) => k.iso([a, b, z], P)),
      0.4,
    ),
  );
  out.outputs[kind] = tray.join("");
}

// Compact frame summary around the working stations.
out.base.push(
  line(k.planOutline({ x: 2, y: -39, w: 188, d: 102, r: 5 }, 0, P, 6), "faint"),
);
const motions = {
  photoAdvance: k.translateAlong(P, [18, 0, 0]),
  pressDown: k.translateAlong(P, [0, 0, -15]),
  docketOpen: k.translateAlong(P, [0, -18, 0]),
};
const src = `// Generated by scripts/build-workshop.mjs from the vendored Anatomy MIT kit.\nexport const WORKSHOP_ART = ${JSON.stringify(out, null, 2)};\nexport const WORKSHOP_VIEWBOX = ${JSON.stringify(`0 0 ${WIDTH} ${HEIGHT}`)};\nexport const WORKSHOP_STATIONS = ${JSON.stringify({ photo: k.iso([30, -13, 22], P), memory: k.iso([77.5, -5, 36], P), story: hubAt, next: k.iso([103, 43, 12], P) })};\nexport const WORKSHOP_MOTION = ${JSON.stringify(motions)};\n`;
const serialized = JSON.stringify(out);
if (
  /NaN|(?:^|[^a-z])(?:Infinity|-Infinity)(?:$|[^a-z])|undefined/.test(
    serialized,
  )
)
  throw new Error(
    "Workshop geometry contains a non-finite or missing coordinate.",
  );
const partCount = (JSON.stringify(out).match(/data-workshop-part=/g) ?? [])
  .length;
if (partCount < 40 || partCount > 80)
  throw new Error(
    `Workshop should contain 40–80 purposeful solids; generated ${partCount}.`,
  );
writeFileSync(
  new URL("../components/spirit-workshop.geometry.ts", import.meta.url),
  src,
);
console.log(
  `Wrote workshop SVG geometry (${partCount} solids, ${Object.values(out).flat().length} fragments).`,
);
