"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { deleteMandalart } from "@/app/mandalarts/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";

export function DeleteDialog({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onConfirm = (e: React.MouseEvent) => {
    e.preventDefault(); // 처리 끝날 때까지 다이얼로그 유지
    startTransition(async () => {
      const result = await deleteMandalart(id).catch(() => ({
        ok: false as const,
        error: "네트워크 오류가 발생했습니다. 다시 시도하세요.",
      }));
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      toast.success("만다라트를 삭제했습니다.");
      router.push("/mandalarts");
      router.refresh();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !pending && setOpen(o)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-destructive">
          <Trash2Icon aria-hidden />
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>만다라트를 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            ‘{title}’을(를) 삭제하면 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={pending}
            className={buttonVariants({ variant: "destructive" })}
          >
            {pending && <Loader2Icon className="animate-spin" aria-hidden />}
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
