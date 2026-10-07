import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <SearchXIcon className="text-muted-foreground size-12" aria-hidden />
      <h1 className="text-xl font-semibold">페이지를 찾을 수 없어요</h1>
      <p className="text-muted-foreground text-sm">
        주소가 바뀌었거나 삭제된 페이지입니다.
      </p>
      <Button asChild>
        <Link href="/">처음으로</Link>
      </Button>
    </main>
  );
}
