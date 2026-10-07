import { describe, expect, it } from "vitest";
import {
  CENTER,
  OUTER_POSITIONS,
  cellLabel,
  cellPath,
  toGrid,
  toRowCol,
} from "./grid";
import { emptyMandalart, type MandalartForm } from "./schema";

function sample(): MandalartForm {
  const m = emptyMandalart();
  m.title = "올해 목표";
  m.coreGoal = "핵심";
  m.subGoals = m.subGoals.map((s, i) => ({
    title: `세부${i}`,
    actions: s.actions.map((_, j) => `과제${i}-${j}`),
  }));
  return m;
}

describe("toGrid", () => {
  const grid = toGrid(sample());

  it("9개 블록 × 9칸을 반환한다", () => {
    expect(grid).toHaveLength(9);
    grid.forEach((block) => expect(block).toHaveLength(9));
  });

  it("핵심 목표는 가운데 블록의 가운데 칸에 있다", () => {
    const cell = grid[CENTER][CENTER];
    expect(cell).toMatchObject({
      kind: "core",
      value: "핵심",
      readOnly: false,
    });
    expect(toRowCol(CENTER, CENTER)).toEqual([4, 4]);

    const coreCells = grid.flat().filter((c) => c.kind === "core");
    expect(coreCells).toHaveLength(1);
  });

  it("세부 목표는 가운데 블록의 주변 8칸에 순서대로 놓인다", () => {
    OUTER_POSITIONS.forEach((pos, i) => {
      expect(grid[CENTER][pos]).toMatchObject({
        kind: "sub",
        subIndex: i,
        value: `세부${i}`,
        readOnly: false,
      });
    });
  });

  it("세부 목표는 같은 순서의 바깥 블록 가운데 칸에 읽기 전용으로 복사된다", () => {
    OUTER_POSITIONS.forEach((block, i) => {
      expect(grid[block][CENTER]).toMatchObject({
        kind: "subMirror",
        subIndex: i,
        value: `세부${i}`,
        readOnly: true,
      });
    });
  });

  it("세부 목표를 바꾸면 미러 칸도 바뀐다", () => {
    const m = sample();
    m.subGoals[5].title = "변경됨";
    const g = toGrid(m);
    expect(g[CENTER][OUTER_POSITIONS[5]].value).toBe("변경됨");
    expect(g[OUTER_POSITIONS[5]][CENTER].value).toBe("변경됨");
  });

  it("실천 과제는 해당 바깥 블록의 주변 8칸에 놓인다", () => {
    OUTER_POSITIONS.forEach((block, i) => {
      OUTER_POSITIONS.forEach((pos, j) => {
        expect(grid[block][pos]).toMatchObject({
          kind: "action",
          subIndex: i,
          actionIndex: j,
          value: `과제${i}-${j}`,
          readOnly: false,
        });
      });
    });
    expect(grid.flat().filter((c) => c.kind === "action")).toHaveLength(64);
  });

  it("좌상단 블록의 좌상단 칸은 (0,0), 우하단은 (8,8)", () => {
    expect(grid[0][0].value).toBe("과제0-0");
    expect(toRowCol(0, 0)).toEqual([0, 0]);
    expect(grid[8][8].value).toBe("과제7-7");
    expect(toRowCol(8, 8)).toEqual([8, 8]);
    expect(toRowCol(5, 3)).toEqual([4, 6]);
  });
});

describe("cellPath / cellLabel", () => {
  const grid = toGrid(sample());

  it("편집 가능한 칸은 폼 경로를, 미러 칸은 null을 돌려준다", () => {
    expect(cellPath(grid[CENTER][CENTER])).toBe("coreGoal");
    expect(cellPath(grid[CENTER][0])).toBe("subGoals.0.title");
    expect(cellPath(grid[8][3])).toBe("subGoals.7.actions.3");
    expect(cellPath(grid[2][CENTER])).toBeNull();
  });

  it("접근성 레이블을 만든다", () => {
    expect(cellLabel(grid[CENTER][CENTER])).toBe("핵심 목표");
    expect(cellLabel(grid[CENTER][2])).toBe("세부 목표 3");
    expect(cellLabel(grid[2][5])).toBe("세부 목표 3의 실천 과제 5");
  });
});
