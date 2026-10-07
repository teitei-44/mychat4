import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

const PROTECTED_PREFIX = "/mandalarts";
const AUTH_PAGES = ["/login", "/signup"];

/**
 * 요청마다 Supabase 세션을 갱신하고, 보호 라우트 접근을 제어한다.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers ?? {}).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  // createServerClient와 getUser 사이에 다른 로직을 넣지 말 것 (세션 갱신 보장)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const redirectTo = (path: string, keepNext = false) => {
    const target = request.nextUrl.clone();
    target.pathname = path;
    target.search = "";
    if (keepNext) target.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  if (!user && pathname.startsWith(PROTECTED_PREFIX)) {
    return redirectTo("/login", true);
  }

  if (user && AUTH_PAGES.includes(pathname)) {
    return redirectTo(PROTECTED_PREFIX);
  }

  return response;
}
