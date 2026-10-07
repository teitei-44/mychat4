import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** 현재 로그인 사용자 (요청 단위로 캐시). 없으면 null */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
