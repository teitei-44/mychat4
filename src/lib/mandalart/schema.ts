import { z } from "zod";

export const CELL_MAX = 50;
export const TITLE_MAX = 100;

const cell = z.string().max(CELL_MAX, `${CELL_MAX}자 이내로 입력하세요`);

export const subGoalSchema = z.object({
  title: cell,
  actions: z.array(cell).length(8),
});

export const mandalartFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력하세요")
    .max(TITLE_MAX, `제목은 ${TITLE_MAX}자 이내로 입력하세요`),
  coreGoal: z
    .string()
    .trim()
    .min(1, "핵심 목표를 입력하세요")
    .max(CELL_MAX, `핵심 목표는 ${CELL_MAX}자 이내로 입력하세요`),
  subGoals: z.array(subGoalSchema).length(8),
});

export type MandalartForm = z.infer<typeof mandalartFormSchema>;
export type SubGoal = z.infer<typeof subGoalSchema>;

export const emptyMandalart = (): MandalartForm => ({
  title: "",
  coreGoal: "",
  subGoals: Array.from({ length: 8 }, () => ({
    title: "",
    actions: Array<string>(8).fill(""),
  })),
});
