"use client";

import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center"
    >
      <TriangleAlertIcon className="text-destructive size-12" aria-hidden />
      <h1 className="text-xl font-semibold">문제가 발생했어요</h1>
      <p className="text-muted-foreground text-sm">잠시 후 다시 시도하세요.</p>
      <Button onClick={reset}>다시 시도</Button>
    </main>
  );
}
