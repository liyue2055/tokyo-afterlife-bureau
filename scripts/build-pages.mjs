import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const out = path.join(root, "dist-pages");
const requestedBase = process.env.PAGES_BASE_PATH ?? "/tokyo-afterlife-bureau/";
const base = `/${requestedBase.split("/").filter(Boolean).join("/")}/`.replace(
  /^\/\/$/,
  "/",
);
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) {
  throw new Error(
    "PAGES_BASE_PATH must be a URL pathname containing plain path segments.",
  );
}

function run(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    env: { ...process.env, PAGES_BASE_PATH: base },
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run([path.join(root, "scripts/build-workshop.mjs")]);
run([
  path.join(root, "node_modules/vite/bin/vite.js"),
  "build",
  "--config",
  path.join(root, "vite.pages.config.ts"),
]);

for (const name of ["spirits.png", "favicon.svg", "icon.svg"]) {
  const source = path.join(root, "public", name);
  if (!lstatSync(source).isFile())
    throw new Error(`Expected a regular public asset: ${name}`);
  copyFileSync(source, path.join(out, name));
}

writeFileSync(
  path.join(out, "manifest.webmanifest"),
  JSON.stringify(
    {
      name: "Tokyo Afterlife Bureau",
      short_name: "Afterlife Bureau",
      description: "Give forgotten objects a second chance.",
      start_url: base,
      scope: base,
      display: "standalone",
      background_color: "#f5f0e6",
      theme_color: "#f5f0e6",
      icons: [
        {
          src: `${base}icon.svg`,
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
      ],
    },
    null,
    2,
  ),
);
writeFileSync(path.join(out, ".nojekyll"), "");
copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"));

const mediaSource = process.env.PAGES_MEDIA_DIRECTORY;
if (mediaSource) {
  const directory = path.resolve(root, mediaSource);
  if (!lstatSync(directory).isDirectory())
    throw new Error("PAGES_MEDIA_DIRECTORY must be a real directory.");
  const allowed = new Set([
    "bureau-trailer.mp4",
    "bureau-trailer.vtt",
    "bureau-score.mp3",
    "bureau-narration.mp3",
    "umbrella-awakening.mp4",
    "umbrella-poster.jpg",
  ]);
  const copied = new Set();
  const mediaOut = path.join(out, "media");
  mkdirSync(mediaOut, { recursive: true });
  for (const filename of allowed) {
    const source = path.join(directory, filename);
    if (!existsSync(source)) continue;
    if (!lstatSync(source).isFile())
      throw new Error(`Expected a regular media asset: ${filename}`);
    copyFileSync(source, path.join(mediaOut, filename));
    copied.add(filename);
  }
  const sourceManifest = path.join(directory, "manifest.json");
  let assets = [];
  if (existsSync(sourceManifest)) {
    if (!lstatSync(sourceManifest).isFile())
      throw new Error("Expected a regular media manifest.");
    const manifest = JSON.parse(readFileSync(sourceManifest, "utf8"));
    if (!Array.isArray(manifest.assets))
      throw new Error("Media manifest needs an assets array.");
    assets = manifest.assets
      .filter((asset) => {
        if (!asset || typeof asset.path !== "string") return false;
        return [...copied].some(
          (name) =>
            asset.path === `/media/${name}` ||
            asset.path === `${base}media/${name}`,
        );
      })
      .map((asset) => ({
        kind: typeof asset.kind === "string" ? asset.kind : "media",
        path: `${base}media/${path.basename(asset.path)}`,
        ...(typeof asset.provider === "string"
          ? { provider: asset.provider }
          : {}),
        ...(typeof asset.duration === "number"
          ? { duration: asset.duration }
          : {}),
      }));
  }
  writeFileSync(
    path.join(mediaOut, "manifest.json"),
    JSON.stringify({ assets }, null, 2),
  );
  console.log(`Copied ${copied.size} explicitly selected presentation assets.`);
} else {
  mkdirSync(path.join(out, "media"), { recursive: true });
  writeFileSync(
    path.join(out, "media/manifest.json"),
    JSON.stringify({ assets: [] }, null, 2),
  );
  console.log(
    "No presentation media selected; publishing the interactive sample experience.",
  );
}
console.log(`Static Pages build ready at ${out} (base ${base}).`);
