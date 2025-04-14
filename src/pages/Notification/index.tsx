import {
  ProForm,
  ProFormSegmented,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Form, Modal, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import {
  addToast,
  closeAll,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";

import { createNotification, getNotificationList } from "@/api/notification.ts";
import { USER_INFO } from "@/utils/const.ts";
import QuillEditor from "@/components/QuillEditor.tsx";
import RichContainer from "@/components/RichContainer.tsx";

const Notification = () => {
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "内容",
      dataIndex: "content",
      search: false,
      render: (text: string) => {
        const domParser = new DOMParser();
        const content: string =
          domParser.parseFromString(text, "text/html").body.textContent || "";

        return (
          <Popover showArrow placement="bottom">
            <PopoverTrigger>
              <span className={"text-blue-700 border-b-1 border-blue-500"}>
                {content.length > 20 ? content.slice(0, 20) + "..." : content}
              </span>
            </PopoverTrigger>
            <PopoverContent className="p-1">
              <RichContainer className={"p-5"} data={text} />
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      search: false,
      valueEnum: {
        0: { text: "关闭", status: "Default" },
        1: { text: "发布", status: "Success" },
      },
      render: (text: string) => <Switch checked={Boolean(text)} />,
    },
    {
      title: "创建人",
      dataIndex: "user_name",
    },
    {
      title: "置顶",
      dataIndex: "pinned",
      types: "select",
      valueEnum: {
        0: { text: "否", status: "Default" },
        1: { text: "是", status: "Success" },
      },
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      search: false,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (_: string, record: any) => [
        <Button
          key="editable"
          type={"link"}
          onClick={() => {
            setIsOpen(true);
            form.setFieldsValue(record);
          }}
        >
          编辑
        </Button>,
      ],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem(USER_INFO) || "{}");
  const actionRef = useRef();

  const handleNew = () => {
    const values = form.getFieldsValue();

    createNotification({
      ...values,
      founder: userInfo.id,
    }).then((response) => {
      if (response.code === 200) {
        closeAll();
        addToast({
          color: "success",
          title: "创建成功",
          description: response.msg,
        });
        actionRef.current?.reload();
        form.resetFields();
        setIsOpen(false);
      } else {
        addToast({
          color: "danger",
          title: "创建失败",
          description: response.msg,
        });
      }
    });
  };

  return (
    <>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const response = await getNotificationList(params);

          return {
            data: response.data.data,
            success: true,
            total: response.data.total,
          };
        }}
        toolBarRender={() => [
          <Button
            key="primary"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            新建
          </Button>,
        ]}
      />
      <Modal
        maskClosable={false}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={handleNew}
      >
        <ProForm
          form={form}
          initialValues={{
            title: "",
            content: "",
            pinned: "0",
          }}
          submitter={false}
        >
          <ProForm.Group>
            <ProFormText label={"标题"} name={"title"} />
            <ProFormSegmented
              label={"置顶"}
              name={"pinned"}
              request={async () => [
                { label: "是", value: "1" },
                { label: "否", value: "0" },
              ]}
            />
          </ProForm.Group>
          {/*<ProFormText label={"内容"} name={"content"} />*/}
          <Form.Item label={"内容"} name={"content"}>
            <QuillEditor />
          </Form.Item>
        </ProForm>
      </Modal>
    </>
  );
};

export default Notification;
