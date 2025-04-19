import { Spin } from "antd";
import { init } from "pptx-preview";
import { FC, useEffect, useRef, useState } from "react";

import css from "./PPTPreview.module.css";

type Props = {
  filePath: string;
  width?: number | string;
  height?: number | string;
};

const PPTPreview: FC<Props> = ({ filePath = "", width, height }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const pptContainerRef = useRef(null);

  useEffect(() => {
    if (!pptContainerRef.current) return;
    // 调用库的init方法生成一个预览器
    const pptxPreviewer = init(pptContainerRef.current!, {
      width: width || 955,
      height: height || 622,
    });

    setIsLoading(false);
    // 获取文件或者读取文件，获取文件的 ArrayBuffer格式数据，传给组件进行预览
    fetch(import.meta.env["VITE_API_URL"] + filePath)
      .then((response) => response.arrayBuffer())
      .then((res) => {
        // 调用预览器的preview方法
        pptxPreviewer.preview(res);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!filePath) {
    return <div className={"text-center text-3xl"}>暂无数据</div>;
  }

  return (
    <Spin spinning={isLoading}>
      <div ref={pptContainerRef} className={css.ppt_container} />
    </Spin>
  );
};

export default PPTPreview;
