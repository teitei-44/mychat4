"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CELL_MAX } from "@/lib/mandalart/schema";
import {
  cellLabel,
  cellPath,
  type Cell,
  type CellPath,
} from "@/lib/mandalart/grid";

export type CellChangeHandler = (path: CellPath, value: string) => void;

const kindStyles: Record<Cell["kind"], string> = {
  core: "bg-core text-core-foreground font-bold",
  sub: "bg-sub text-sub-foreground font-semibold",
  subMirror: "bg-sub text-sub-foreground font-semibold",
  action: "bg-cell text-foreground",
};

type Props = {
  cell: Cell;
  editable: boolean;
  onChange?: CellChangeHandler;
  invalid?: boolean;
  /** "lg"는 모바일 블록 보기처럼 칸이 클 때 */
  size?: "sm" | "lg";
  /** 지정하면 칸 전체가 버튼이 된다 (모바일에서 블록 열기) */
  onSelect?: () => void;
  selectLabel?: string;
};

export function MandalartCell({
  cell,
  editable,
  onChange,
  invalid,
  size = "sm",
  onSelect,
  selectLabel,
}: Props) {
  const path = cellPath(cell);
  const label = cellLabel(cell);
  const canEdit = editable && !cell.readOnly && path !== null && !onSelect;

  const base = cn(
    "relative flex aspect-square min-w-0 items-center justify-center overflow-hidden p-1 text-center leading-snug break-words whitespace-pre-wrap",
    size === "sm" ? "text-[11px] lg:text-xs xl:text-sm" : "text-sm",
    kindStyles[cell.kind],
    cell.kind === "core" && size === "lg" && "text-base",
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-label={selectLabel ?? label}
        className={cn(
          base,
          "focus-visible:ring-ring cursor-pointer outline-none hover:brightness-95 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset",
        )}
      >
        <span className="line-clamp-4">
          {cell.value || (
            <span className="font-normal opacity-50">{label}</span>
          )}
        </span>
      </button>
    );
  }

  if (!canEdit) {
    return (
      <div
        className={base}
        aria-label={cell.value ? undefined : `${label} (비어 있음)`}
        title={
          cell.kind === "subMirror"
            ? "세부 목표에서 자동으로 복사됩니다"
            : undefined
        }
      >
        {cell.value}
      </div>
    );
  }

  return (
    <div
      className={cn(
        base,
        "focus-within:ring-ring cursor-text focus-within:z-10 focus-within:ring-2 focus-within:ring-inset",
        invalid && "ring-destructive ring-2 ring-inset",
      )}
    >
      <AutoTextarea
        value={cell.value}
        label={label}
        invalid={invalid}
        placeholder={cell.kind === "action" ? "" : label}
        onChange={(v) => onChange?.(path, v)}
      />
    </div>
  );
}

function AutoTextarea({
  value,
  label,
  invalid,
  placeholder,
  onChange,
}: {
  value: string;
  label: string;
  invalid?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // 내용에 맞춰 높이를 자동 조절 (칸 높이를 넘지 않도록 max-h-full)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      maxLength={CELL_MAX}
      aria-label={label}
      aria-invalid={invalid || undefined}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="block max-h-full w-full resize-none overflow-y-auto bg-transparent text-center outline-none placeholder:font-normal placeholder:text-current placeholder:opacity-50"
    />
  );
}
