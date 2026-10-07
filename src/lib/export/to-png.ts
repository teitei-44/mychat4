"use client";

/**
 * DOM 노드를 PNG data URL로 캡처한다.
 * html-to-image는 필요할 때만 동적으로 불러온다.
 */
export async function nodeToPng(node: HTMLElement): Promise<string> {
  // 한글 웹폰트가 로드되기 전에 캡처하면 대체 글꼴로 찍히므로 기다린다.
  await document.fonts.ready;
  const { toPng } = await import("html-to-image");
  const options = {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    cacheBust: true,
  };
  // 일부 브라우저(Safari)는 첫 캡처에서 폰트가 빠지는 경우가 있어 한 번 예열한다.
  await toPng(node, options);
  return toPng(node, options);
}

/** Blob URL로 내려받기 (data URL보다 큰 파일·한글 파일명에 안정적) */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadPng(node: HTMLElement, filename: string) {
  const dataUrl = await nodeToPng(node);
  const blob = await (await fetch(dataUrl)).blob();
  downloadBlob(blob, filename);
}
