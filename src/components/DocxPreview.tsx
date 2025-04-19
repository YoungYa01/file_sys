/**
 * @description: Docx 文件预览
 * @author: YoungYa
 * @date 2024/11/24
 */
import "@js-preview/docx/lib/index.css";

import jsPreviewDocx, { JsDocxPreview } from "@js-preview/docx";
import { useMount } from "ahooks";
import { FC, useRef } from "react";

type Props = {
  filePath: string;
};

const DocxPreview: FC<Props> = ({ filePath = "" }: Props) => {
  const docxContainerRef = useRef<HTMLDivElement | null>(null);
  const docxPreviewerRef = useRef<JsDocxPreview | null>(null); // 保存 myDocxPreviewer 的引用

  // 挂载回调
  useMount(() => {
    const containerElement = docxContainerRef.current;

    if (containerElement && !docxPreviewerRef.current) {
      // 初始化 myDocxPreviewer，并保存引用
      const myDocxPreviewer = jsPreviewDocx.init(containerElement, {
        ignoreWidth: true,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
      });

      docxPreviewerRef.current = myDocxPreviewer;

      myDocxPreviewer
        .preview(import.meta.env["VITE_API_URL"] + filePath)
        .finally(() => {});
    }
  });

  return (
    <div ref={docxContainerRef} style={{ height: "90vh", width: "100%" }} />
  );
};

export default DocxPreview;
