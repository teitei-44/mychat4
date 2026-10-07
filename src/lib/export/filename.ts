/** 만다라트_{제목}_{YYYYMMDD}.{ext} — 파일명에 쓸 수 없는 문자는 _ 로 바꾼다. */
export function exportFileName(
  title: string,
  ext: "png" | "pdf",
  date: Date = new Date(),
): string {
  const safeTitle =
    title
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "제목없음";
  const ymd = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  return `만다라트_${safeTitle}_${ymd}.${ext}`;
}
