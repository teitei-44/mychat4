import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <AuthForm
      mode="login"
      next={next}
      initialError={
        error === "callback"
          ? "인증 링크가 만료되었거나 올바르지 않습니다. 다시 로그인하세요."
          : undefined
      }
    />
  );
}
