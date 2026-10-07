"use client";

import { useRef, useState } from "react";
import { FileDownIcon, ImageIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { exportFileName } from "@/lib/export/filename";
import { Button } from "@/components/ui/button";
import type { MandalartData } from "./mandalart-grid";
import { MandalartPrint } from "./mandalart-print";

type Format = "png" | "pdf";

export function ExportButtons({
  title,
  data,
}: {
  title: string;
  data: MandalartData;
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<Format | null>(null);

  const run = async (format: Format) => {
    const node = printRef.current;
    if (!node || busy) return;
    setBusy(format);
    try {
      const filename = exportFileName(title, format);
      if (format === "png") {
        const { downloadPng } = await import("@/lib/export/to-png");
        await downloadPng(node, filename);
      } else {
        const { downloadPdf } = await import("@/lib/export/to-pdf");
        await downloadPdf(node, filename);
      }
      toast.success(
        format === "png" ? "이미지를 저장했습니다." : "PDF를 저장했습니다.",
      );
    } catch (e) {
      console.error(e);
      toast.error("파일을 만들지 못했습니다. 다시 시도하세요.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => run("png")}
        disabled={busy !== null}
      >
        {busy === "png" ? (
          <Loader2Icon className="animate-spin" aria-hidden />
        ) : (
          <ImageIcon aria-hidden />
        )}
        이미지 저장
      </Button>
      <Button
        variant="outline"
        onClick={() => run("pdf")}
        disabled={busy !== null}
      >
        {busy === "pdf" ? (
          <Loader2Icon className="animate-spin" aria-hidden />
        ) : (
          <FileDownIcon aria-hidden />
        )}
        PDF 저장
      </Button>
      {/* 화면 밖에 렌더링한 출력 전용 그리드 */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: -100000,
          top: 0,
          pointerEvents: "none",
        }}
      >
        <MandalartPrint ref={printRef} title={title} data={data} />
      </div>
    </>
  );
}
