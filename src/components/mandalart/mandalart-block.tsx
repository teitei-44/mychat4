"use client";

import { cn } from "@/lib/utils";
import type { Cell } from "@/lib/mandalart/grid";
import { MandalartCell, type CellChangeHandler } from "./mandalart-cell";

type Props = {
  cells: Cell[];
  editable: boolean;
  onChange?: CellChangeHandler;
  coreInvalid?: boolean;
  size?: "sm" | "lg";
  /** 칸별로 버튼 동작을 지정 (모바일 개요 화면) */
  getSelect?: (cell: Cell, position: number) => (() => void) | undefined;
  className?: string;
  label?: string;
};

/** 3×3 블록. 칸 사이 얇은 선, 블록 테두리는 부모 그리드가 굵게 그린다. */
export function MandalartBlock({
  cells,
  editable,
  onChange,
  coreInvalid,
  size,
  getSelect,
  className,
  label,
}: Props) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("bg-border grid grid-cols-3 gap-px", className)}
    >
      {cells.map((cell, pos) => {
        const onSelect = getSelect?.(cell, pos);
        return (
          <MandalartCell
            key={pos}
            cell={cell}
            editable={editable}
            onChange={onChange}
            invalid={cell.kind === "core" && coreInvalid}
            size={size}
            onSelect={onSelect}
            selectLabel={
              onSelect && cell.subIndex !== undefined
                ? `세부 목표 ${cell.subIndex + 1} 블록 열기${cell.value ? `: ${cell.value}` : ""}`
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
