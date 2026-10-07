import { describe, expect, it } from "vitest";
import { exportFileName } from "./filename";

describe("exportFileName", () => {
  const date = new Date(2026, 0, 5);

  it("규칙대로 파일명을 만든다", () => {
    expect(exportFileName("올해 목표", "png", date)).toBe(
      "만다라트_올해 목표_20260105.png",
    );
    expect(exportFileName("올해 목표", "pdf", date)).toBe(
      "만다라트_올해 목표_20260105.pdf",
    );
  });

  it("파일명에 쓸 수 없는 문자를 바꾼다", () => {
    expect(exportFileName('a/b:c*?"<>|', "png", date)).toBe(
      "만다라트_a_b_c_______20260105.png",
    );
  });

  it("빈 제목은 '제목없음'으로 대체한다", () => {
    expect(exportFileName("   ", "png", date)).toBe(
      "만다라트_제목없음_20260105.png",
    );
  });
});
