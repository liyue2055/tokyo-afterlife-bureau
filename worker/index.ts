import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";
import { generateCase, type AwakenInput } from "../lib/generate";
import type { Category } from "../lib/cases";

const MAX_REQUEST_BYTES = 1_500_000;
const categories = new Set<Category>([
  "umbrella",
  "kettle",
  "lamp",
  "headphones",
  "other",
]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}

async function readLimited(request: Request): Promise<Uint8Array | null> {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

function validatePhoto(value: unknown): string | undefined | null {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || value.length > 1_500_000) return null;
  const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match || match[1].length % 4 !== 0) return null;
  let decoded: string;
  try {
    decoded = atob(match[1]);
  } catch {
    return null;
  }
  if (
    decoded.length < 3 ||
    decoded.length > MAX_REQUEST_BYTES ||
    decoded.charCodeAt(0) !== 0xff ||
    decoded.charCodeAt(1) !== 0xd8 ||
    decoded.charCodeAt(2) !== 0xff
  )
    return null;
  return value;
}

function validOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function textField(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result.length <= max ? result : null;
}

async function api(
  request: Request,
  env: Cloudflare.Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname === "/api/status" && request.method === "GET") {
    return json({ aiAvailable: Boolean(env.OPENROUTER_API_KEY) });
  }
  if (url.pathname === "/api/status")
    return json({ error: "Method not allowed." }, 405);
  if (url.pathname !== "/api/awaken") return null;
  if (request.method !== "POST")
    return json({ error: "Method not allowed." }, 405);
  if (!validOrigin(request))
    return json({ error: "Request origin is not allowed." }, 403);
  if (
    !request.headers
      .get("Content-Type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return json({ error: "Expected JSON." }, 415);
  const declaredLength = Number(request.headers.get("Content-Length") ?? 0);
  if (declaredLength > MAX_REQUEST_BYTES)
    return json({ error: "Request is too large." }, 413);
  const bytes = await readLimited(request);
  if (!bytes) return json({ error: "Request is too large or empty." }, 413);
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("invalid body");
    data = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  const category =
    typeof data.category === "string" &&
    categories.has(data.category as Category)
      ? (data.category as Category)
      : null;
  const object = textField(data.object, 70);
  const memory = textField(data.memory ?? "", 700);
  const photo = validatePhoto(data.photo);
  if (
    !category ||
    !object ||
    object.length < 1 ||
    memory === null ||
    photo === null
  ) {
    return json(
      {
        error:
          "Please provide a valid object, category, memory, and JPEG photo.",
      },
      400,
    );
  }
  if (!env.OPENROUTER_API_KEY)
    return json({ error: "AI story generation is not configured." }, 503);
  const input: AwakenInput = { category, object, memory, photo };
  try {
    const spiritCase = await generateCase(
      input,
      env.OPENROUTER_API_KEY,
      env.AI_MODEL || "google/gemini-3.8-flash",
    );
    return json({ case: spiritCase });
  } catch {
    return json(
      { error: "The story service could not create a case. Please try again." },
      502,
    );
  }
}

export { api as handleApiRequest };

const worker = {
  async fetch(
    request: Request,
    env: Cloudflare.Env,
    ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>,
  ) {
    const apiResponse = await api(request, env);
    if (apiResponse) return apiResponse;
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt)
            return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return {
              status: "request_context_expired",
              message: "This request has expired. Please try again.",
            };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return runWithConnectorBinding(binding, () =>
      handler.fetch(request, env, ctx),
    );
  },
};

export default worker;
