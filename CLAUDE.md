@AGENTS.md

# 만다라트(Mandal-Art) 목표 설계 웹사이트

9×9(81칸) 만다라트를 등록·수정·삭제하고 PNG/PDF로 저장하는 Next.js + Supabase 앱.

## 명령어

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint |
| `npm test` | Vitest 단위 테스트 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier |

## 만다라트 구조 규칙 (반드시 지킬 것)

- 전체는 3×3 블록, 각 블록은 3×3 칸. `grid[블록][칸]`, 인덱스 0~8, 가운데 = 4
- 블록4의 칸4 = 핵심 목표, 블록4의 `[0,1,2,3,5,6,7,8]` = 세부 목표 0~7
- 세부 목표 i는 바깥 블록 `OUTER_POSITIONS[i]`의 가운데 칸에 **읽기 전용**으로 복사된다
- 바깥 블록 주변 8칸 = 해당 세부 목표의 실천 과제 0~7
- 데이터 원본은 `{ title, coreGoal, subGoals: [{ title, actions[8] }] × 8 }`,
  81칸은 `src/lib/mandalart/grid.ts`의 `toGrid()`로 계산해 렌더링한다

## 구조

- `src/lib/mandalart/` — `schema.ts`(zod), `mapper.ts`(DB↔폼, 채운 칸 수), `grid.ts`(81칸 매핑), `queries.ts`(서버 조회)
- `src/app/mandalarts/actions.ts` — Server Actions(create/update/delete). 항상 `auth.getUser()` 확인 + zod 재검증
- `src/components/mandalart/` — 그리드(셀/블록/모바일), 편집기, 카드, 내보내기, 삭제 다이얼로그
- `src/lib/export/` — `to-png.ts`(html-to-image), `to-pdf.ts`(jsPDF), `filename.ts`
- `src/proxy.ts` + `src/lib/supabase/middleware.ts` — 세션 갱신, `/mandalarts/*` 보호
- `supabase/migrations/0001_init.sql` — 테이블·트리거·RLS

## 코딩 규칙

- TypeScript strict, `any` 금지
- 조회는 Server Component, 변경은 Server Actions
- `"use client"`는 편집기·내보내기·다이얼로그 등 꼭 필요한 곳에만
- Server Action 실패 시 사용자 친화적 한국어 메시지 반환
- UI 문구는 모두 한국어
- 접근성: 각 칸 textarea에 `aria-label`(예: "세부 목표 3의 실천 과제 5"), 키보드만으로 편집·저장 가능(Tab 이동, Ctrl/⌘+S 저장)
- `service_role` 키는 사용하지 않는다. 모든 접근은 RLS로 보호

## 원 명세와 다른 점 (의도적)

- **Next.js 16**: `middleware.ts`가 `proxy.ts`로 이름이 바뀌어 `src/proxy.ts`를 사용한다.
  `cacheComponents`는 끄고(기본 동적 렌더링) 사용한다 — 모든 페이지가 세션 쿠키를 읽기 때문.
- **shadcn/ui**: 컴포넌트 소스를 `src/components/ui/`에 직접 두었다(new-york 스타일, `radix-ui` 패키지).
  새 컴포넌트는 `npx shadcn@latest add <name>`으로 추가 가능.
- **폰트**: Pretendard를 npm 패키지에서 가져와 `next/font/local`로 셀프 호스팅한다(빌드 시 외부 네트워크 불필요).
- **Supabase 키**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`(새 publishable key)를 사용한다. 예전 이름 `NEXT_PUBLIC_SUPABASE_ANON_KEY`도 대체값으로 허용한다.
- **내보내기**: data URL 대신 Blob URL로 내려받는다(큰 파일·한글 파일명에 안정적).
