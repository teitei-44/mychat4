import type { MandalartForm } from "./schema";

/** 블록/칸 인덱스 중 가운데(4)를 뺀 8개 위치. 세부 목표 i ↔ OUTER_POSITIONS[i] */
export const OUTER_POSITIONS = [0, 1, 2, 3, 5, 6, 7, 8] as const;
export const CENTER = 4;

export type CellKind = "core" | "sub" | "subMirror" | "action";

export type Cell = {
  value: string;
  kind: CellKind;
  /** 세부 목표 인덱스 (core 외) */
  subIndex?: number;
  /** 실천 과제 인덱스 (action 전용) */
  actionIndex?: number;
  readOnly: boolean;
};

/** 블록/칸 위치(0~8) → 세부 목표·실천 과제 인덱스(0~7). 가운데면 -1 */
export function positionToIndex(position: number): number {
  return OUTER_POSITIONS.indexOf(position as (typeof OUTER_POSITIONS)[number]);
}

/** react-hook-form 필드 경로 */
export type CellPath =
  | "coreGoal"
  | `subGoals.${number}.title`
  | `subGoals.${number}.actions.${number}`;

export function cellPath(cell: Cell): CellPath | null {
  switch (cell.kind) {
    case "core":
      return "coreGoal";
    case "sub":
      return `subGoals.${cell.subIndex!}.title`;
    case "action":
      return `subGoals.${cell.subIndex!}.actions.${cell.actionIndex!}`;
    case "subMirror":
      return null;
  }
}

/** 접근성 레이블: 예) "세부 목표 3의 실천 과제 5" */
export function cellLabel(cell: Cell): string {
  switch (cell.kind) {
    case "core":
      return "핵심 목표";
    case "sub":
      return `세부 목표 ${cell.subIndex! + 1}`;
    case "subMirror":
      return `세부 목표 ${cell.subIndex! + 1} (자동 복사)`;
    case "action":
      return `세부 목표 ${cell.subIndex! + 1}의 실천 과제 ${cell.actionIndex! + 1}`;
  }
}

/** 하나의 블록(0~8)을 3×3 칸 배열로 계산한다. */
export function toBlock(
  data: Pick<MandalartForm, "coreGoal" | "subGoals">,
  block: number,
): Cell[] {
  return Array.from({ length: 9 }, (_, pos): Cell => {
    if (block === CENTER) {
      if (pos === CENTER) {
        return { value: data.coreGoal, kind: "core", readOnly: false };
      }
      const subIndex = positionToIndex(pos);
      return {
        value: data.subGoals[subIndex]?.title ?? "",
        kind: "sub",
        subIndex,
        readOnly: false,
      };
    }

    const subIndex = positionToIndex(block);
    const sub = data.subGoals[subIndex];
    if (pos === CENTER) {
      return {
        value: sub?.title ?? "",
        kind: "subMirror",
        subIndex,
        readOnly: true,
      };
    }
    const actionIndex = positionToIndex(pos);
    return {
      value: sub?.actions[actionIndex] ?? "",
      kind: "action",
      subIndex,
      actionIndex,
      readOnly: false,
    };
  });
}

/** 81칸 그리드: grid[블록 인덱스][칸 인덱스] */
export function toGrid(
  data: Pick<MandalartForm, "coreGoal" | "subGoals">,
): Cell[][] {
  return Array.from({ length: 9 }, (_, block) => toBlock(data, block));
}

/** 블록/칸 인덱스 → 9×9 표의 (행, 열) 좌표 */
export function toRowCol(block: number, pos: number): [number, number] {
  return [
    Math.floor(block / 3) * 3 + Math.floor(pos / 3),
    (block % 3) * 3 + (pos % 3),
  ];
}
