/**
 * @author: YoungYa
 * @author: Excel 文件预览
 */
import "@js-preview/excel/lib/index.css";

import jsPreviewExcel, { JsExcelPreview } from "@js-preview/excel";
import { useMount } from "ahooks";
import { FC, useRef } from "react";

type Props = {
  filePath: string;
};

const ExcelPreview: FC<Props> = ({ filePath = "" }: Props) => {
  const excelContainerRef = useRef<HTMLDivElement | null>(null);
  const excelPreviewerRef = useRef<JsExcelPreview | null>(null); // 保存 myExcelPreviewer 的引用

  // 挂载回调
  useMount(() => {
    const containerElement = excelContainerRef.current;

    if (containerElement && !excelPreviewerRef.current) {
      // 初始化 myExcelPreviewer，并保存引用
      const myExcelPreviewer = jsPreviewExcel.init(containerElement, {
        showContextmenu: true,
      });

      excelPreviewerRef.current = myExcelPreviewer;

      myExcelPreviewer
        .preview(import.meta.env["VITE_API_URL"] + filePath)
        .finally(() => {});
    }
  });

  return (
    <div ref={excelContainerRef} style={{ height: "90vh", width: "100%" }} />
  );
};

export default ExcelPreview;
