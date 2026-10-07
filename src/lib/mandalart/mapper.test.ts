import { describe, expect, it } from "vitest";
import {
  countFilled,
  formToRow,
  normalizeSubGoals,
  rowToMandalart,
} from "./mapper";
import { emptyMandalart, mandalartFormSchema } from "./schema";

describe("normalizeSubGoals", () => {
  it("빈 값이나 잘못된 값은 8×8 빈 배열로 만든다", () => {
    for (const raw of [[], null, "x", { a: 1 }, [{ title: 3 }]]) {
      const subs = normalizeSubGoals(raw);
      expect(subs).toHaveLength(8);
      subs.forEach((s) => {
        expect(s.title).toBe("");
        expect(s.actions).toEqual(Array(8).fill(""));
      });
    }
  });

  it("넘치는 항목은 잘라낸다", () => {
    const raw = Array.from({ length: 10 }, (_, i) => ({
      title: `t${i}`,
      actions: Array.from({ length: 10 }, (_, j) => `a${j}`),
    }));
    const subs = normalizeSubGoals(raw);
    expect(subs).toHaveLength(8);
    expect(subs[7].title).toBe("t7");
    expect(subs[0].actions).toHaveLength(8);
  });
});

describe("row ↔ form", () => {
  it("왕복 변환이 값을 보존한다", () => {
    const form = emptyMandalart();
    form.title = "제목";
    form.coreGoal = "핵심";
    form.subGoals[2].title = "세부";
    form.subGoals[2].actions[4] = "과제";

    const row = {
      id: "id",
      user_id: "u",
      created_at: "2026-01-01",
      updated_at: "2026-01-02",
      ...formToRow(form),
    };
    const m = rowToMandalart(row);
    expect(m.title).toBe("제목");
    expect(m.coreGoal).toBe("핵심");
    expect(m.subGoals).toEqual(form.subGoals);
    expect(m.updatedAt).toBe("2026-01-02");
  });
});

describe("countFilled", () => {
  it("공백이 아닌 칸만 센다", () => {
    const form = emptyMandalart();
    expect(countFilled(form)).toBe(0);
    form.coreGoal = "핵심";
    form.subGoals[0].title = "a";
    form.subGoals[0].actions[0] = "b";
    form.subGoals[1].actions[7] = "   ";
    expect(countFilled(form)).toBe(3);
  });
});

describe("mandalartFormSchema", () => {
  it("제목과 핵심 목표만 있으면 통과한다", () => {
    const form = { ...emptyMandalart(), title: "t", coreGoal: "c" };
    expect(mandalartFormSchema.safeParse(form).success).toBe(true);
  });

  it("필수값이 비면 실패한다", () => {
    const r = mandalartFormSchema.safeParse(emptyMandalart());
    expect(r.success).toBe(false);
  });

  it("50자를 넘는 칸은 실패한다", () => {
    const form = { ...emptyMandalart(), title: "t", coreGoal: "c" };
    form.subGoals[0].actions[0] = "가".repeat(51);
    expect(mandalartFormSchema.safeParse(form).success).toBe(false);
  });
});
