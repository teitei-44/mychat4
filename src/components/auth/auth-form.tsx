"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { login, signup, type AuthResult } from "@/app/(auth)/actions";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "@/lib/auth-schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props =
  { mode: "login"; next?: string; initialError?: string } | { mode: "signup" };

export function AuthForm(props: Props) {
  const isLogin = props.mode === "login";
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">
          {isLogin ? "로그인" : "회원가입"}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? "이메일과 비밀번호로 로그인하세요."
            : "이메일로 가입하고 나만의 만다라트를 만들어 보세요."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {props.mode === "login" ? (
          <LoginForm next={props.next} initialError={props.initialError} />
        ) : (
          <SignupForm />
        )}
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center text-sm">
        {isLogin ? (
          <>
            계정이 없으신가요?
            <Link href="/signup" className="text-primary ml-1 underline">
              회원가입
            </Link>
          </>
        ) : (
          <>
            이미 계정이 있으신가요?
            <Link href="/login" className="text-primary ml-1 underline">
              로그인
            </Link>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function ResultMessage({ result }: { result: AuthResult | null }) {
  if (!result) return null;
  if (result.error) {
    return (
      <p role="alert" className="text-destructive text-sm">
        {result.error}
      </p>
    );
  }
  if (result.message) {
    return (
      <p role="status" className="text-primary text-sm">
        {result.message}
      </p>
    );
  }
  return null;
}

function LoginForm({
  next,
  initialError,
}: {
  next?: string;
  initialError?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<AuthResult | null>(
    initialError ? { error: initialError } : null,
  );
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginInput) =>
    startTransition(async () => {
      const res = await login(values, next);
      setResult(res ?? null);
    });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ResultMessage result={result} />
        <Button type="submit" disabled={pending}>
          {pending && <Loader2Icon className="animate-spin" />}
          로그인
        </Button>
      </form>
    </Form>
  );
}

function SignupForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<AuthResult | null>(null);
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", passwordConfirm: "" },
  });

  const onSubmit = (values: SignupInput) =>
    startTransition(async () => {
      const res = await signup(values);
      setResult(res ?? null);
      if (res?.message) form.reset();
    });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ResultMessage result={result} />
        <Button type="submit" disabled={pending}>
          {pending && <Loader2Icon className="animate-spin" />}
          회원가입
        </Button>
      </form>
    </Form>
  );
}
