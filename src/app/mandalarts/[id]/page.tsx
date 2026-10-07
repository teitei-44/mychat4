import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { getMandalart } from "@/lib/mandalart/queries";
import { countFilled, TOTAL_CELLS } from "@/lib/mandalart/mapper";
import { formatDateTime } from "@/lib/format";
import { MandalartGrid } from "@/components/mandalart/mandalart-grid";
import { DeleteDialog } from "@/components/mandalart/delete-dialog";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const m = await getMandalart(id);
  return { title: m ? m.title : "만다라트를 찾을 수 없음" };
}

export default async function MandalartDetailPage({ params }: Props) {
  const { id } = await params;
  const m = await getMandalart(id);
  if (!m) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/mandalarts">
          <ArrowLeftIcon aria-hidden />
          목록
        </Link>
      </Button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold break-all">{m.title}</h1>
          <p className="text-muted-foreground text-sm">
            {countFilled(m)}/{TOTAL_CELLS}칸 · 수정일{" "}
            {formatDateTime(m.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/mandalarts/${m.id}/edit`}>
              <PencilIcon aria-hidden />
              수정
            </Link>
          </Button>
          <DeleteDialog id={m.id} title={m.title} />
        </div>
      </div>

      <MandalartGrid data={m} mode="readonly" />
    </div>
  );
}
