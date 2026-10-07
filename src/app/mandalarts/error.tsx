"use client";

import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MandalartsError({
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
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-xl border px-6 py-16 text-center"
    >
      <TriangleAlertIcon className="text-destructive size-12" aria-hidden />
      <div className="space-y-1">
        <p className="font-semibold">문제가 발생했어요</p>
        <p className="text-muted-foreground text-sm">
          데이터를 불러오지 못했습니다. 잠시 후 다시 시도하세요.
        </p>
      </div>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
