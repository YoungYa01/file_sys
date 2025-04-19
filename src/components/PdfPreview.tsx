/**
 * @description: Pdf 文件预览
 * @author: YoungYa
 * @date 2024/11/24
 */
import jsPreviewPdf, { JsPdfPreview } from "@js-preview/pdf";
import { useMount } from "ahooks";
import { Spin } from "antd";
import { FC, useRef, useState } from "react";

type Props = {
  filePath: string; // 更改变量名为 URL
};

const PdfPreview: FC<Props> = ({ filePath = "/office/test.pdf" }: Props) => {
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const pdfPreviewerRef = useRef<JsPdfPreview | null>(null); // 保存 myPdfPreviewer 的引用
  const [isLoading, setIsLoading] = useState<boolean>(true); // 是否加载中

  // 挂载回调
  useMount(() => {
    const containerElement = pdfContainerRef.current;

    if (containerElement && !pdfPreviewerRef.current) {
      // 初始化 myPdfPreviewer，并保存引用
      const myPdfPreviewer = jsPreviewPdf.init(containerElement, {
        onError: () => {
          setIsLoading(false);
        },
        onRendered: () => {
          setIsLoading(false);
        },
      });

      pdfPreviewerRef.current = myPdfPreviewer;
      console.log("myPdfPreviewer", filePath)
      myPdfPreviewer.preview(import.meta.env["VITE_API_URL"] + filePath);
    }
  });

  return (
    <Spin spinning={isLoading}>
      <div ref={pdfContainerRef} style={{ height: "calc(100vh - 300px)" }} />
    </Spin>
  );
};

export default PdfPreview;
