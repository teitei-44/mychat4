/** 오픈 리다이렉트 방지: 같은 사이트 내부 경로만 허용 */
export function safeNextPath(next: unknown, fallback = "/mandalarts"): string {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  return next;
}
