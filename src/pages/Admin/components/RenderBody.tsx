import { Card, Modal, Form, TimePicker } from "antd";
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProList,
} from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import moment from "moment";

import { getNotificationList } from "@/api/notification.ts";
import RichContainer from "@/components/RichContainer.tsx";
import Calendar from "../components/calendar/index.tsx"
const RenderBody = () => {
  const [todoList, setTodoList] = useState(
    JSON.parse(localStorage.getItem("todoList") || "[]"),
  );
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [richContent, setRichContent] = useState("");

  const onSelect = (value: any) => {
    const day = value.format("YYYY-MM-DD");

    setSelectedDay(day);
    setOpen(true);
    const target = todoList.find((item) => item.time === day);

    if (target) {
      form.setFieldsValue({
        // 转换字符串为moment对象
        range: [
          moment(target.range[0], "HH:mm"),
          moment(target.range[1], "HH:mm"),
        ],
        title: target.title,
        content: target.content,
      });
    } else {
      form.resetFields();
    }
  };

  // 将todoList渲染到对应天上
  const cellRender = (value: any) => {
    const target = todoList.find(
      (item) => item.time === value.format("YYYY-MM-DD"),
    );

    if (target) {
      return (
        <div className={"flex flex-col justify-center items-center w-10 h-30"}>
          <div
            className={
              "w-full h-full flex flex-col justify-center items-center"
            }
          >
            <div className={"text-blue-700 border-b-1 border-blue-500"}>
              {target.title}
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  return (
    <div
      className="w-full flex gap-5"
      style={{ height: "calc(100vh - 300px)" }}
    >
      <Card className={"flex-1 h-full border rounded-xl px-14 scroll-y"}>
        <Calendar/>
      </Card>
      <Card className={"flex-1"} title={"公告面板"}>
        <ProList
          metas={{
            title: {
              dataIndex: "title",
              title: "标题",
            },
            description: {
              dataIndex: "content",
              title: "内容",
              render: (text: string) => {
                const domParser = new DOMParser();
                const content: string =
                  domParser.parseFromString(text, "text/html").body
                    .textContent || "";

                return (
                  <span
                    className={"text-blue-700 border-b-1 border-blue-500"}
                    onClick={() => {
                      setRichContent(text);
                      setIsOpen(true);
                    }}
                  >
                    {content.length > 80
                      ? content.slice(0, 20) + "..."
                      : content}
                  </span>
                );
              },
            },
          }}
          pagination={{
            pageSize: 6,
          }}
          request={async (params) => {
            const response = await getNotificationList({
              ...params,
              status: '1',
            });

            return {
              data: response.data.data,
              success: true,
              total: response.data.total,
            };
          }}
          toolBarRender={false}
        />
      </Card>
      <Modal
        centered
        footer={false}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <ProForm
          form={form}
          title={"新增待办"}
          onFinish={(values) => {
            // 转换moment对象为字符串
            const formattedValues = {
              ...values,
              range: values.range.map((m) => moment(m).format("HH:mm")),
              time: selectedDay,
            };

            const target = todoList.find((item) => item.time === selectedDay);

            if (target) {
              setTodoList([
                ...todoList.filter((item) => item.time !== selectedDay),
                formattedValues,
              ]);
            } else {
              setTodoList([...todoList, formattedValues]);
            }
            setOpen(false);
          }}
        >
          <Form.Item label={"开始/结束时间"} name={"range"}>
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
          <ProFormText label={"标题"} name={"title"} />
          <ProFormTextArea label={"内容"} name={"content"} />
        </ProForm>
      </Modal>
      <Modal
        centered
        footer={null}
        open={isOpen}
        width={"80%"}
        onCancel={() => setIsOpen(false)}
      >
        <RichContainer className={"min-h-60 mt-5"} data={richContent} />
      </Modal>
    </div>
  );
};

export default RenderBody;
