# 만다라트 — 목표 설계 웹사이트

하나의 핵심 목표를 8개의 세부 목표와 64개의 실천 과제로 쪼개는 **만다라트(Mandal-Art)** 를
만들고, 수정·삭제하고, **PNG 이미지** 또는 **A4 PDF**로 저장할 수 있는 웹사이트입니다.

- Next.js 16 (App Router) · React 19 · TypeScript
- shadcn/ui · Tailwind CSS v4 · lucide-react
- Supabase (Postgres · Auth · RLS) · `@supabase/ssr`
- react-hook-form · zod · html-to-image · jsPDF · sonner · Vitest

## 로컬 실행

1. 의존성 설치

   ```bash
   npm install
   ```

2. Supabase 프로젝트를 만들고 SQL Editor에서 `supabase/migrations/0001_init.sql`을 실행합니다.
   (Supabase CLI를 쓴다면 `supabase db push`)

3. 환경 변수 설정

   ```bash
   cp .env.local.example .env.local
   # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 값을 채웁니다
   ```

   > 값은 Supabase 대시보드 → Project Settings → API Keys의 **Publishable key**(`sb_publishable_...`)입니다.
   > 예전 방식의 anon key(JWT)를 쓰는 프로젝트라면 `NEXT_PUBLIC_SUPABASE_ANON_KEY`로 넣어도 동작합니다.

4. Supabase 대시보드 → Authentication → URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

5. 개발 서버 실행

   ```bash
   npm run dev
   ```

## 스크립트

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run lint       # ESLint
npm test           # Vitest 단위 테스트
npm run typecheck  # 타입 체크
npm run format     # Prettier
```

## Vercel 배포

1. GitHub 저장소를 Vercel에 Import
2. Project Settings → Environment Variables에 등록
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://<your-app>.vercel.app`
3. Supabase → Authentication → URL Configuration
   - Site URL: `https://<your-app>.vercel.app`
   - Redirect URLs: `https://<your-app>.vercel.app/auth/callback`

`service_role` 키는 사용하지 않습니다. 모든 데이터 접근은 RLS로 본인 데이터만 허용됩니다.
