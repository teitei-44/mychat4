import type { Metadata } from "next";
import { MandalartEditor } from "@/components/mandalart/mandalart-editor";

export const metadata: Metadata = { title: "새 만다라트" };

export default function NewMandalartPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">새 만다라트</h1>
      <MandalartEditor mode="create" />
    </div>
  );
}
