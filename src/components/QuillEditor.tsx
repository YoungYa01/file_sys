/**
 * @description: 富文本编辑器
 * @author: YoungYa
 * @date 2024/11/24
 */
import "react-quill/dist/quill.snow.css";

import { debounce } from "lodash-es";
import { FC } from "react";
import ReactQuill from "react-quill";

type IProps = {
  value?: string;
  onChange?: (value: string) => void;
  height?: number | string;
};

const QuillEditor: FC<IProps> = ({ value, onChange, height = 450 }) => {
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题字号
    [{ size: ["small", false, "large", "huge"] }], // 内容字号
    [{ font: [] }], // 字体

    [{ align: [] }], // 对齐方式

    ["bold", "italic", "underline", "strike"], // 文字样式
    ["blockquote", "code-block"], // 引用和代码
    ["link", "image", "video"], // 链接、图片、视频

    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // 列表
    [{ script: "sub" }, { script: "super" }], // 上标、下标
    [{ indent: "-1" }, { indent: "+1" }], // 缩进
    [{ direction: "rtl" }], // 文本方向

    [{ color: [] }, { background: [] }], // 文本颜色、背景色

    ["clean"], // 清除样式
  ];
  // 自定义工具栏
  const modules: ReactQuill.ReactQuillProps["modules"] = {
    // 方式1: 可以是简单的一维数组配置
    // toolbar: ["bold", "italic", "underline", "strike", "blockquote"]
    // 方式2: 可以配置二维数组，进行多个选项的配置
    // 或者针对某一个配置项的key值，进行配置
    toolbar: toolbarOptions,
    //   [
    //   // 默认的
    //   // [{ header: [1, 2, 3, false] }],
    //   // ['bold', 'italic', 'underline', 'link'],
    //   // [{ list: 'ordered' }, { list: 'bullet' }],
    //   // ['clean'],
    //   // 掘金的富文本编辑器
    //   'bold',
    //   'italic',
    //   'underline',
    //   { header: 1 },
    //   { header: 2 },
    //   'blockquote',
    //   'code-block',
    //   'code',
    //   { list: 'ordered' },
    //   { list: 'bullet' },
    //   'clean',
    // ],
    // 方式3: 可以自己指定工具栏的容器
    // toolbar: "#rq-toolbar"
  } as ReactQuill.ReactQuillProps["modules"];

  // 文本框改变时的回调
  const handleChangeValue = debounce((content: string) => {
    onChange?.(content);
  }, 500);

  return (
    <ReactQuill
      modules={modules}
      style={{ height, display: "flex", flexDirection: "column" }}
      theme="snow"
      value={value}
      onChange={handleChangeValue}
    />
  );
};

export default QuillEditor;
