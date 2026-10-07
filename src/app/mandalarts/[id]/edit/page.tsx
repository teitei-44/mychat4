import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMandalart } from "@/lib/mandalart/queries";
import { mandalartToForm } from "@/lib/mandalart/mapper";
import { MandalartEditor } from "@/components/mandalart/mandalart-editor";

export const metadata: Metadata = { title: "만다라트 수정" };

export default async function EditMandalartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = await getMandalart(id);
  if (!m) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">만다라트 수정</h1>
      <MandalartEditor mode="edit" id={m.id} initial={mandalartToForm(m)} />
    </div>
  );
}
