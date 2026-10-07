import type { Metadata } from "next";
import Link from "next/link";
import { Grid3x3Icon, PlusIcon } from "lucide-react";
import { listMandalarts } from "@/lib/mandalart/queries";
import { MandalartCard } from "@/components/mandalart/mandalart-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "내 만다라트" };

export default async function MandalartsPage() {
  const mandalarts = await listMandalarts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">내 만다라트</h1>
        <Button asChild>
          <Link href="/mandalarts/new">
            <PlusIcon aria-hidden />새 만다라트
          </Link>
        </Button>
      </div>

      {mandalarts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed px-6 py-16 text-center">
          <Grid3x3Icon className="text-muted-foreground size-12" aria-hidden />
          <div className="space-y-1">
            <p className="font-semibold">아직 만든 만다라트가 없어요</p>
            <p className="text-muted-foreground text-sm">
              핵심 목표 하나를 정하고 8개의 세부 목표, 64개의 실천 과제로 쪼개
              보세요.
            </p>
          </div>
          <Button asChild>
            <Link href="/mandalarts/new">
              <PlusIcon aria-hidden />첫 만다라트 만들기
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mandalarts.map((m) => (
            <li key={m.id}>
              <MandalartCard mandalart={m} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
