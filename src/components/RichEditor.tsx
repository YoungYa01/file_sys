import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";

import { TOKEN } from "../utils/const.js";

function RichEditor({ value, onChange, height = 450 }) {
  // editor 实例
  const [editor, setEditor] = useState(null); // JS 语法

  // 工具栏配置
  const toolbarConfig = {}; // JS 语法

  // 编辑器配置
  const editorConfig = {
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        base64LimitSize: 5 * 1024 * 1024,
      },
    },
  };

  editorConfig.MENU_CONF["uploadImage"] = {
    server: "/api/upload",
    fieldName: "file",
    headers: {
      token: localStorage.getItem(TOKEN),
    },
    customInsert(res, insertFn) {
      // res 即服务端的返回结果
      // 从 res 中找到 url alt href ，然后插入图片
      insertFn(
        import.meta.env["VITE_API_URL"] + res.data,
        res.msg.split("/").pop(),
        import.meta.env["VITE_API_URL"] + res.data,
      );
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ zIndex: 100, height: height }}>
        <Toolbar
          defaultConfig={toolbarConfig}
          editor={editor}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          mode="default"
          style={{ height: height, border:"1px solid #ccc" }}
          value={value}
          onChange={(editor) => onChange(editor.getHtml())}
          onCreated={setEditor}
        />
      </div>
    </>
  );
}

export default RichEditor;
