import test, { after } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { unlinkSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// Bundle the worker's TypeScript for Node 22 so these tests exercise the real
// request handler without needing Vinext's runtime or a live provider.
const bundlePath = `${process.cwd()}/.backend-test-${process.pid}.mjs`;
const result = await build({
  entryPoints: ["worker/index.ts"],
  outfile: bundlePath,
  write: false,
  bundle: true,
  platform: "node",
  format: "esm",
  define: { "import.meta.env.DEV": "false" },
  plugins: [
    {
      name: "empty-preview-bindings",
      setup(build) {
        build.onResolve({ filter: /^virtual:/ }, (args) => ({
          path: args.path,
          namespace: "empty-preview",
        }));
        build.onLoad({ filter: /.*/, namespace: "empty-preview" }, () => ({
          contents: "export default undefined;",
          loader: "js",
        }));
      },
    },
  ],
});
writeFileSync(bundlePath, result.outputFiles[0].text);
const { handleApiRequest } = await import(pathToFileURL(bundlePath).href);
const { generateCase } = await import("../lib/generate.ts");
after(() => unlinkSync(bundlePath));

function awakenRequest(
  body,
  { origin = "https://bureau.example", headers = {} } = {},
) {
  return new Request("https://bureau.example/api/awaken", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("status reports key presence and rejects other methods", async () => {
  const response = await handleApiRequest(
    new Request("https://bureau.example/api/status"),
    {},
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { aiAvailable: false });

  const method = await handleApiRequest(
    new Request("https://bureau.example/api/status", { method: "POST" }),
    {},
  );
  assert.equal(method.status, 405);
});

test("awaken returns honest 503 when no provider key is configured", async () => {
  const response = await handleApiRequest(
    awakenRequest({
      category: "umbrella",
      object: "Old umbrella",
      memory: "Rainy day",
    }),
    {},
  );
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /not configured/i);
});

test("awaken rejects cross-origin requests", async () => {
  const response = await handleApiRequest(
    awakenRequest(
      { category: "lamp", object: "Desk lamp" },
      { origin: "https://attacker.example" },
    ),
    {},
  );
  assert.equal(response.status, 403);
});

test("awaken rejects malformed image data and oversized streamed bodies", async () => {
  const badImage = await handleApiRequest(
    awakenRequest({
      category: "lamp",
      object: "Desk lamp",
      photo: "data:image/jpeg;base64,AAAA",
    }),
    { OPENROUTER_API_KEY: "test-only" },
  );
  assert.equal(badImage.status, 400);

  const oversized = awakenRequest(" ".repeat(1_500_001));
  const tooLarge = await handleApiRequest(oversized, {
    OPENROUTER_API_KEY: "test-only",
  });
  assert.equal(tooLarge.status, 413);
});

test("generation uses the approved model, validates provider JSON, and supplies safe curated actions", async () => {
  let sent;
  const fakeFetch = async (url, init) => {
    assert.equal(url, "https://openrouter.ai/api/v1/chat/completions");
    assert.equal(init.headers.Authorization, "Bearer test-only");
    sent = JSON.parse(init.body);
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                name: "Mugi",
                title: "A small warm pause",
                quote: "I remember the quiet.",
                story: "A fictional story for an ordinary kettle.",
                traits: ["patient", "kind"],
                wish: "I hope to be useful again.",
              }),
            },
          },
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };
  const result = await generateCase(
    { category: "kettle", object: "Little kettle", memory: "Tea at dawn" },
    "test-only",
    "google/gemini-3.8-flash",
    fakeFetch,
  );
  assert.equal(sent.model, "google/gemini-3.8-flash");
  assert.equal(result.mode, "ai");
  assert.equal(result.object, "Little kettle");
  assert.equal(result.actions.length, 3);
  assert.match(result.actions[0].detail, /qualified repair service/i);
  assert.match(result.actions[0].detail, /Do not open or repair it yourself/);
  assert.equal(result.actions[0].kind, "repair");
});

test("generation rejects malformed provider output", async () => {
  const fakeFetch = async () =>
    new Response(
      JSON.stringify({
        choices: [{ message: { content: "<script>not json</script>" } }],
      }),
      { status: 200 },
    );
  await assert.rejects(
    generateCase(
      { category: "other", object: "Box", memory: "" },
      "test-only",
      undefined,
      fakeFetch,
    ),
    /Invalid model JSON/,
  );
});

test("generation accepts a fenced provider JSON envelope without relaxing field validation", async () => {
  const payload = {
    name: "Amé",
    title: "A dry corner",
    quote: "One more rainy walk.",
    story: "An invented umbrella remembers a rainy afternoon.",
    traits: ["patient", "kind"],
    wish: "A careful repair.",
  };
  const fakeFetch = async () =>
    new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: "```json\n" + JSON.stringify(payload) + "\n```",
            },
          },
        ],
      }),
    );
  const result = await generateCase(
    { category: "umbrella", object: "Umbrella", memory: "" },
    "test-only",
    undefined,
    fakeFetch,
  );
  assert.equal(result.name, "Amé");
});
