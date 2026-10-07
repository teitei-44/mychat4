import Link from "next/link";
import { Grid3x3Icon, LogOutIcon } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur print:hidden">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Link
          href={user ? "/mandalarts" : "/"}
          className="mr-auto flex items-center gap-2 font-bold"
        >
          <Grid3x3Icon className="text-primary size-5" aria-hidden />
          만다라트
        </Link>
        <ThemeToggle />
        {user ? (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link href="/mandalarts">내 만다라트</Link>
            </Button>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                <LogOutIcon aria-hidden />
                <span className="hidden sm:inline">로그아웃</span>
                <span className="sr-only sm:hidden">로그아웃</span>
              </Button>
            </form>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">로그인</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">회원가입</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
