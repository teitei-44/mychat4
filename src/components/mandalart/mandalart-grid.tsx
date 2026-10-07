"use client";

import { useMemo } from "react";
import { CENTER, positionToIndex, toGrid } from "@/lib/mandalart/grid";
import type { MandalartForm } from "@/lib/mandalart/schema";
import { MandalartBlock } from "./mandalart-block";
import type { CellChangeHandler } from "./mandalart-cell";
import { MandalartMobile } from "./mandalart-mobile";

export type MandalartData = Pick<MandalartForm, "coreGoal" | "subGoals">;

type Props = {
  data: MandalartData;
  mode: "readonly" | "edit";
  onCellChange?: CellChangeHandler;
  coreInvalid?: boolean;
  className?: string;
};

/**
 * 81칸 만다라트.
 * - 768px 이상: 9×9 전체 표
 * - 768px 미만: 블록 단위 보기 (MandalartMobile)
 */
export function MandalartGrid({
  data,
  mode,
  onCellChange,
  coreInvalid,
  className,
}: Props) {
  const grid = useMemo(() => toGrid(data), [data]);
  const editable = mode === "edit";

  return (
    <div className={className}>
      <div
        className="border-foreground/70 bg-foreground/70 hidden grid-cols-3 gap-1 overflow-hidden rounded-lg border-2 md:grid"
        role="group"
        aria-label="만다라트 표"
      >
        {grid.map((cells, block) => (
          <MandalartBlock
            key={block}
            cells={cells}
            editable={editable}
            onChange={onCellChange}
            coreInvalid={coreInvalid}
            label={
              block === CENTER
                ? "핵심 목표 블록"
                : `세부 목표 ${positionToIndex(block) + 1} 블록`
            }
          />
        ))}
      </div>
      <MandalartMobile
        className="md:hidden"
        data={data}
        editable={editable}
        onCellChange={onCellChange}
        coreInvalid={coreInvalid}
      />
    </div>
  );
}
