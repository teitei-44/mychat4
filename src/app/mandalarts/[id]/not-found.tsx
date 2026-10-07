import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MandalartNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border px-6 py-16 text-center">
      <SearchXIcon className="text-muted-foreground size-12" aria-hidden />
      <div className="space-y-1">
        <h1 className="font-semibold">만다라트를 찾을 수 없어요</h1>
        <p className="text-muted-foreground text-sm">
          삭제되었거나 접근 권한이 없는 만다라트입니다.
        </p>
      </div>
      <Button asChild>
        <Link href="/mandalarts">내 만다라트로</Link>
      </Button>
    </div>
  );
}
