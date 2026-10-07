"use client";

import { useState } from "react";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CENTER,
  OUTER_POSITIONS,
  toBlock,
  type Cell,
} from "@/lib/mandalart/grid";
import type { MandalartForm } from "@/lib/mandalart/schema";
import { Button } from "@/components/ui/button";
import { MandalartBlock } from "./mandalart-block";
import type { CellChangeHandler } from "./mandalart-cell";

type Props = {
  data: Pick<MandalartForm, "coreGoal" | "subGoals">;
  editable: boolean;
  onCellChange?: CellChangeHandler;
  coreInvalid?: boolean;
  className?: string;
};

/**
 * 모바일 블록 단위 보기.
 * 개요(가운데 블록)에서 세부 목표를 누르면 해당 블록을 크게 보여 주고,
 * 블록 화면에서는 가운데 칸(세부 목표)과 실천 과제 8개를 편집한다.
 */
export function MandalartMobile({
  data,
  editable,
  onCellChange,
  coreInvalid,
  className,
}: Props) {
  // null = 개요, 0~7 = 세부 목표 인덱스
  const [subIndex, setSubIndex] = useState<number | null>(null);

  if (subIndex === null) {
    const cells = toBlock(data, CENTER);
    return (
      <div className={cn("space-y-3", className)}>
        <p className="text-muted-foreground text-sm">
          세부 목표를 누르면 해당 블록을 {editable ? "편집" : "볼"} 수 있어요.
        </p>
        <MandalartBlock
          cells={cells}
          editable={editable}
          onChange={onCellChange}
          coreInvalid={coreInvalid}
          size="lg"
          label="핵심 목표 블록"
          className="border-foreground/70 overflow-hidden rounded-lg border-2"
          getSelect={(cell: Cell) =>
            cell.kind === "sub" && cell.subIndex !== undefined
              ? () => setSubIndex(cell.subIndex!)
              : undefined
          }
        />
      </div>
    );
  }

  // 블록 화면에서는 가운데 칸을 세부 목표 입력칸으로 사용
  const cells = toBlock(data, OUTER_POSITIONS[subIndex]).map(
    (cell, pos): Cell =>
      pos === CENTER ? { ...cell, kind: "sub", readOnly: false } : cell,
  );
  const go = (delta: number) => setSubIndex((subIndex + delta + 8) % 8);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setSubIndex(null)}
        >
          <ArrowLeftIcon aria-hidden />
          전체 보기
        </Button>
        <span className="mx-auto text-sm font-medium">
          세부 목표 {subIndex + 1} / 8
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => go(-1)}
          aria-label="이전 세부 목표"
        >
          <ChevronLeftIcon aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => go(1)}
          aria-label="다음 세부 목표"
        >
          <ChevronRightIcon aria-hidden />
        </Button>
      </div>
      <p className="text-muted-foreground truncate text-xs">
        핵심 목표: {data.coreGoal || "(미입력)"}
      </p>
      <MandalartBlock
        key={subIndex}
        cells={cells}
        editable={editable}
        onChange={onCellChange}
        size="lg"
        label={`세부 목표 ${subIndex + 1} 블록`}
        className="border-foreground/70 overflow-hidden rounded-lg border-2"
      />
    </div>
  );
}
