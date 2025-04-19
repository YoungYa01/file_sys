import { Flex, Typography } from "antd";

import DocxPreview from "@/components/DocxPreview.tsx";
import ExcelPreview from "@/components/ExcelPreview.tsx";
import PPTPreview from "@/components/PPTPreview.tsx";

const FilePreview = (props: { filePath: string; fullscreen?: boolean }) => {
  const fileType = props.filePath.split(".").pop() || "";

  if (fileType === "pdf" || fileType === "txt") {
    // return <PdfPreview {...props}/>;
    return (
      // eslint-disable-next-line jsx-a11y/iframe-has-title
      <iframe
        frameBorder="0"
        height="100%"
        scrolling="no"
        src={import.meta.env["VITE_API_URL"] + props.filePath}
        width="100%"
      />
    );
  }

  if (fileType === "docx" || fileType === "doc") {
    return <DocxPreview {...props} />;
  }

  if (fileType === "xlsx" || fileType === "xls") {
    return <ExcelPreview {...props} />;
  }

  if (fileType === "pptx" || fileType === "ppt") {
    return (
      <PPTPreview
        {...props}
        height={props.fullscreen ? window.screen.availHeight - 220 : ''}
        width={props.fullscreen ? window.screen.availWidth - 250 : ''}
      />
    );
  }

  if (
    fileType === "png" ||
    fileType === "jpg" ||
    fileType === "jpeg" ||
    fileType === "gif" ||
    fileType === "bmp" ||
    fileType === "svg"
  ) {
    return (
      <img
        alt="图片预览"
        src={import.meta.env["VITE_API_URL"] + props.filePath}
      />
    );
  }

  return (
    <Flex align={"center"} justify={"center"}>
      <Typography>暂不支持该文件类型</Typography>
      Browser not support this file type
      <Typography.Link href={props.filePath}>下载</Typography.Link>
    </Flex>
  );
};

export default FilePreview;
