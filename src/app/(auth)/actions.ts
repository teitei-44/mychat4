"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "@/lib/auth-schema";
import { safeNextPath } from "@/lib/safe-next";

export type AuthResult = { error?: string; message?: string };

function authErrorMessage(code: string | undefined, fallback: string) {
  switch (code) {
    case "invalid_credentials":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case "email_not_confirmed":
      return "이메일 인증이 완료되지 않았습니다. 메일함을 확인하세요.";
    case "user_already_exists":
    case "email_exists":
      return "이미 가입된 이메일입니다.";
    case "weak_password":
      return "비밀번호가 너무 약합니다. 더 복잡한 비밀번호를 사용하세요.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "요청이 너무 많습니다. 잠시 후 다시 시도하세요.";
    default:
      return fallback;
  }
}

export async function login(
  input: LoginInput,
  next?: string,
): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: "입력값을 확인하세요." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: authErrorMessage(error.code, "로그인에 실패했습니다.") };
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(next));
}

async function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function signup(input: SignupInput): Promise<AuthResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return { error: "입력값을 확인하세요." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${await siteUrl()}/auth/callback` },
  });
  if (error) {
    return { error: authErrorMessage(error.code, "회원가입에 실패했습니다.") };
  }

  // 이메일 인증을 끈 프로젝트라면 바로 세션이 생긴다.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/mandalarts");
  }

  return {
    message: "인증 메일을 보냈습니다. 메일의 링크를 눌러 가입을 완료하세요.",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
