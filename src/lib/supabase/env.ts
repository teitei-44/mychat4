export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // 새 publishable key(sb_publishable_...)를 우선 사용하고,
  // 예전 방식의 anon key(JWT)도 하위 호환으로 허용한다. 두 키의 역할은 같다.
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !publishableKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 환경 변수가 설정되지 않았습니다.",
    );
  }
  return { url, publishableKey };
}
