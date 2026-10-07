import { forwardRef } from "react";
import { toGrid, type Cell } from "@/lib/mandalart/grid";
import type { MandalartData } from "./mandalart-grid";

// 출력물은 다크모드·테마와 무관하게 고정 색상(hex)을 사용한다.
const COLORS = {
  page: "#ffffff",
  text: "#171717",
  muted: "#6b7280",
  blockBorder: "#262626",
  cellBorder: "#d4d4d4",
  core: { bg: "#3b4fd8", fg: "#ffffff" },
  sub: { bg: "#e3e8ff", fg: "#1e2a7a" },
  action: { bg: "#ffffff", fg: "#171717" },
} as const;

function cellColors(cell: Cell) {
  if (cell.kind === "core") return COLORS.core;
  if (cell.kind === "action") return COLORS.action;
  return COLORS.sub;
}

const CELL = 116; // px

/** 이미지/PDF 저장 전용 그리드 (버튼 없음, 흰 배경 고정) */
export const MandalartPrint = forwardRef<
  HTMLDivElement,
  { title: string; data: MandalartData }
>(function MandalartPrint({ title, data }, ref) {
  const grid = toGrid(data);

  return (
    <div
      ref={ref}
      className="font-sans"
      style={{
        width: CELL * 9 + 4 * 2 + 48,
        padding: 24,
        background: COLORS.page,
        color: COLORS.text,
        colorScheme: "light",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px",
          fontSize: 26,
          fontWeight: 700,
          lineHeight: 1.3,
          wordBreak: "keep-all",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
          background: COLORS.blockBorder,
          border: `3px solid ${COLORS.blockBorder}`,
        }}
      >
        {grid.map((cells, block) => (
          <div
            key={block}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: COLORS.cellBorder,
            }}
          >
            {cells.map((cell, pos) => {
              const c = cellColors(cell);
              return (
                <div
                  key={pos}
                  style={{
                    height: CELL,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 6,
                    overflow: "hidden",
                    textAlign: "center",
                    background: c.bg,
                    color: c.fg,
                    fontSize: cell.kind === "core" ? 16 : 13,
                    fontWeight:
                      cell.kind === "core"
                        ? 800
                        : cell.kind === "action"
                          ? 400
                          : 700,
                    lineHeight: 1.35,
                    whiteSpace: "pre-wrap",
                    wordBreak: "keep-all",
                    overflowWrap: "anywhere",
                  }}
                >
                  {cell.value}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p
        style={{
          margin: "12px 0 0",
          fontSize: 12,
          color: COLORS.muted,
          textAlign: "right",
        }}
      >
        만다라트
      </p>
    </div>
  );
});
