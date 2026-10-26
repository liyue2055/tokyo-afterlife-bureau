// Public build-time switches. Never put provider credentials in these values.
declare const __STATIC_PREVIEW__: boolean | undefined;
declare const __PUBLIC_BASE_PATH__: string | undefined;

export const isStaticPreview =
  typeof __STATIC_PREVIEW__ !== "undefined" && __STATIC_PREVIEW__;
const base =
  typeof __PUBLIC_BASE_PATH__ === "undefined" ? "" : __PUBLIC_BASE_PATH__;

export function assetUrl(path: string): string {
  if (/^(?:https?:|data:|blob:|#)/.test(path)) return path;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
