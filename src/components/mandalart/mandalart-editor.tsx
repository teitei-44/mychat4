"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import {
  createMandalart,
  updateMandalart,
  type ActionResult,
} from "@/app/mandalarts/actions";
import {
  TITLE_MAX,
  emptyMandalart,
  mandalartFormSchema,
  type MandalartForm,
} from "@/lib/mandalart/schema";
import { countFilled, TOTAL_CELLS } from "@/lib/mandalart/mapper";
import type { CellPath } from "@/lib/mandalart/grid";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MandalartGrid } from "./mandalart-grid";

type Props =
  { mode: "create" } | { mode: "edit"; id: string; initial: MandalartForm };

export function MandalartEditor(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<MandalartForm>({
    resolver: zodResolver(mandalartFormSchema),
    defaultValues: props.mode === "edit" ? props.initial : emptyMandalart(),
    shouldFocusError: false,
  });

  const [coreGoal, subGoals] = useWatch({
    control: form.control,
    name: ["coreGoal", "subGoals"],
  });
  const { isDirty, errors, isSubmitted } = form.formState;

  // 저장하지 않은 변경사항이 있으면 새로고침/탭 닫기 전에 경고
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const onCellChange = useCallback(
    (path: CellPath, value: string) => {
      form.setValue(path, value, {
        shouldDirty: true,
        shouldValidate: isSubmitted,
      });
    },
    [form, isSubmitted],
  );

  const onSubmit = (values: MandalartForm) =>
    startTransition(async () => {
      let result: ActionResult;
      try {
        result =
          props.mode === "edit"
            ? await updateMandalart(props.id, values)
            : await createMandalart(values);
      } catch {
        result = {
          ok: false,
          error: "네트워크 오류가 발생했습니다. 다시 시도하세요.",
        };
      }
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      form.reset(values);
      toast.success(
        props.mode === "edit"
          ? "수정 내용을 저장했습니다."
          : "만다라트를 등록했습니다.",
      );
      router.push(`/mandalarts/${result.id}`);
      router.refresh();
    });

  const onInvalid = () => {
    toast.error("필수 항목을 확인하세요.");
    if (form.formState.errors.title) form.setFocus("title");
  };

  const submit = form.handleSubmit(onSubmit, onInvalid);

  // Ctrl/Cmd + S 로 저장
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!pending) void submit();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [submit, pending]);

  const cancelHref =
    props.mode === "edit" ? `/mandalarts/${props.id}` : "/mandalarts";
  const filled = countFilled({ coreGoal, subGoals });

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-6" noValidate>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>제목</FormLabel>
                <FormControl>
                  <Input
                    placeholder="예: 2026년 나의 만다라트"
                    maxLength={TITLE_MAX}
                    autoFocus={props.mode === "create"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" asChild>
              <Link
                href={cancelHref}
                onClick={(e) => {
                  if (
                    isDirty &&
                    !window.confirm(
                      "저장하지 않은 변경사항이 사라집니다. 나가시겠어요?",
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                취소
              </Link>
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2Icon className="animate-spin" aria-hidden />
              ) : (
                <SaveIcon aria-hidden />
              )}
              저장
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="text-muted-foreground">
              가운데 칸에 핵심 목표, 주변 8칸에 세부 목표를 적고 바깥 블록에
              실천 과제를 채우세요. 각 칸은 최대 50자, Tab 키로 다음 칸으로
              이동합니다.
            </p>
            <span className="text-muted-foreground tabular-nums">
              {filled}/{TOTAL_CELLS}칸
            </span>
          </div>
          {errors.coreGoal && (
            <p role="alert" className="text-destructive text-sm">
              {errors.coreGoal.message}
            </p>
          )}
          {errors.subGoals && (
            <p role="alert" className="text-destructive text-sm">
              각 칸은 50자 이내로 입력하세요.
            </p>
          )}
          <MandalartGrid
            data={{ coreGoal, subGoals }}
            mode="edit"
            onCellChange={onCellChange}
            coreInvalid={!!errors.coreGoal}
          />
        </div>
      </form>
    </Form>
  );
}
