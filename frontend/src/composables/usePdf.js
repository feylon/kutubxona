import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/** PDF hujjatni yuklab, sahifalarni canvas ga chizish uchun yordamchi */
export const createPdfRenderer = () => {
  let doc = null;
  let task = null;

  const open = async (url) => {
    doc?.destroy();
    doc = await pdfjs.getDocument({ url }).promise;
    return doc.numPages;
  };

  /** scale: 'width' bo'lsa konteyner kengligiga moslashadi, aks holda raqam (1 = 100%) */
  const render = async (canvas, pageNumber, { scale = 1, fitWidth = null } = {}) => {
    if (!doc) return;
    task?.cancel();
    const page = await doc.getPage(pageNumber);
    const base = page.getViewport({ scale: 1 });
    const finalScale = fitWidth ? (fitWidth / base.width) * scale : scale * 1.5;
    const viewport = page.getViewport({ scale: finalScale });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const ctx = canvas.getContext("2d");
    task = page.render({ canvasContext: ctx, viewport, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null });
    try {
      await task.promise;
    } catch (e) {
      if (e?.name !== "RenderingCancelledException") throw e;
    } finally {
      task = null;
    }
  };

  const destroy = () => {
    task?.cancel();
    doc?.destroy();
    doc = null;
  };

  return { open, render, destroy };
};
