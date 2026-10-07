import type { Json, MandalartRow } from "@/lib/supabase/database.types";
import type { MandalartForm, SubGoal } from "./schema";

/** 상세/목록 화면에서 쓰는 만다라트 도메인 객체 */
export type Mandalart = MandalartForm & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

const asString = (v: unknown) => (typeof v === "string" ? v : "");

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** DB의 jsonb 값을 항상 8×8 모양의 세부 목표 배열로 정규화한다. */
export function normalizeSubGoals(raw: unknown): SubGoal[] {
  const list = Array.isArray(raw) ? raw : [];
  return Array.from({ length: 8 }, (_, i) => {
    const item: unknown = list[i];
    const obj = isRecord(item) ? item : {};
    const actions = Array.isArray(obj.actions) ? obj.actions : [];
    return {
      title: asString(obj.title),
      actions: Array.from({ length: 8 }, (_, j) => asString(actions[j])),
    };
  });
}

export function rowToMandalart(row: MandalartRow): Mandalart {
  return {
    id: row.id,
    title: row.title,
    coreGoal: row.core_goal,
    subGoals: normalizeSubGoals(row.sub_goals),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mandalartToForm(m: Mandalart): MandalartForm {
  return { title: m.title, coreGoal: m.coreGoal, subGoals: m.subGoals };
}

/** 폼 값 → DB insert/update 컬럼 (user_id 제외) */
export function formToRow(form: MandalartForm): {
  title: string;
  core_goal: string;
  sub_goals: Json;
} {
  return {
    title: form.title,
    core_goal: form.coreGoal,
    sub_goals: form.subGoals.map((s) => ({
      title: s.title,
      actions: [...s.actions],
    })),
  };
}

/** 채운 칸 수 (핵심 1 + 세부 8 + 과제 64 = 73칸 중) */
export const TOTAL_CELLS = 73;

export function countFilled(
  data: Pick<MandalartForm, "coreGoal" | "subGoals">,
): number {
  const filled = (s: string) => (s.trim() ? 1 : 0);
  return (
    filled(data.coreGoal) +
    data.subGoals.reduce(
      (acc, s) =>
        acc + filled(s.title) + s.actions.reduce((a, x) => a + filled(x), 0),
      0,
    )
  );
}
