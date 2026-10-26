import { fileURLToPath } from "node:url";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));
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

export default defineConfig({
  root: path.join(root, "pages"),
  base,
  publicDir: false,
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^next\/dynamic$/,
        replacement: path.join(root, "pages/next-dynamic.tsx"),
      },
      {
        find: /^next\/image$/,
        replacement: path.join(root, "pages/next-image.tsx"),
      },
      { find: "@", replacement: root },
    ],
  },
  define: {
    __STATIC_PREVIEW__: "true",
    __PUBLIC_BASE_PATH__: JSON.stringify(base.replace(/\/$/, "")),
  },
  build: {
    outDir: path.join(root, "dist-pages"),
    emptyOutDir: true,
    sourcemap: false,
  },
});
