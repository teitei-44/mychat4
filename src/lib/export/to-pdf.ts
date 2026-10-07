"use client";

import { downloadBlob, nodeToPng } from "./to-png";

const MARGIN_MM = 10;

/**
 * 노드를 PNG로 캡처해 A4 가로 PDF 한 장에 비율을 유지하며 가운데 배치한다.
 * 이미지 방식이므로 한글 폰트 임베딩이 필요 없다.
 */
export async function downloadPdf(node: HTMLElement, filename: string) {
  const [dataUrl, { jsPDF }] = await Promise.all([
    nodeToPng(node),
    import("jspdf"),
  ]);

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const { width, height } = pdf.getImageProperties(dataUrl);

  const scale = Math.min(
    (pageW - MARGIN_MM * 2) / width,
    (pageH - MARGIN_MM * 2) / height,
  );
  const w = width * scale;
  const h = height * scale;
  pdf.addImage(dataUrl, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
  downloadBlob(pdf.output("blob"), filename);
}
