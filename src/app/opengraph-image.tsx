import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "만다라트 — 하나의 목표를 81칸으로 설계하세요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await readFile(
    join(process.cwd(), "assets/Pretendard-Bold.ttf"),
  );

  const cells = Array.from({ length: 9 }, (_, i) => i);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: 80,
        background: "#ffffff",
        fontFamily: "Pretendard",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: 360,
          height: 360,
          gap: 12,
        }}
      >
        {cells.map((i) => (
          <div
            key={i}
            style={{
              width: 112,
              height: 112,
              borderRadius: 16,
              background: i === 4 ? "#3b4fd8" : "#e3e8ff",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 88, color: "#171717" }}>만다라트</div>
        <div style={{ fontSize: 40, color: "#4b5563", lineHeight: 1.4 }}>
          핵심 목표 1개, 세부 목표 8개,
        </div>
        <div style={{ fontSize: 40, color: "#4b5563", lineHeight: 1.4 }}>
          실천 과제 64개로 설계하세요
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Pretendard", data: font, style: "normal", weight: 700 }],
    },
  );
}
