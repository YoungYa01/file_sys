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

import {
  createNotification,
  deleteNotification,
  getNotificationList,
  updateNotification,
} from "@/api/notification.ts";
import { USER_INFO } from "@/utils/const.ts";
import RichContainer from "@/components/RichContainer.tsx";
import RichEditor from "@/components/RichEditor.tsx";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem(USER_INFO) || "{}");
  const actionRef = useRef();
  const [type, setType] = useState("edit");

  const onDelete = (id: number) => {
    deleteNotification(id).then((response) => {
      addToast({
        color: response.code === 200 ? "success" : "danger",
        title: response.code === 200 ? "删除成功" : "删除失败",
        description: response.msg,
      });
      actionRef.current?.reload();
    });
  };

  const onEdit = (values: any) => {
    updateNotification(values).then((response) => {
      closeAll();
      addToast({
        color: response.code === 200 ? "success" : "danger",
        title: response.code === 200 ? "编辑成功" : "编辑失败",
        description: response.msg,
      });
      actionRef.current?.reload();
      setIsOpen(false);
    });
  };

  const handleStatusChange = (values, status) => {
    onEdit({ ...values, status: String(Number(status)) });
  };

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
      render: (_: string, record: any) => (
        <Switch
          checked={record.status === "1"}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: "创建人",
      dataIndex: "user_name",
      search: false,
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
            setType("edit");
            form.setFieldsValue(record);
          }}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          color={"red"}
          variant={"link"}
          onClick={() => {
            Modal.confirm({
              title: "确认删除该通知吗？",
              onOk: () => onDelete(record.id),
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  const handleNew = () => {
    const values = form.getFieldsValue();

    if (type === "edit") {
      onEdit(values);
    } else {
      createNotification({
        ...values,
        founder: userInfo.id,
      }).then((response) => {
        closeAll();
        addToast({
          color: response.code === 200 ? "success" : "danger",
          title: response.code === 200 ? "创建成功" : "创建失败",
          description: response.msg,
        });
        if (response.code === 200) {
          actionRef.current?.reload();
          form.resetFields();
          setIsOpen(false);
        }
      });
    }
  };

  return (
    <>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
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
              setType("add");
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
        width={1200}
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
          <ProFormText hidden name={"id"} />
          <ProFormText hidden name={"created_at"} />
          <ProFormText hidden name={"founder"} />
          <ProFormText hidden name={"status"} />
          <ProFormText hidden name={"user_id"} />
          <ProFormText hidden name={"user_name"} />
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
          <Form.Item label={"内容"} name={"content"} style={{ height: 600 }}>
            {/*<QuillEditor />*/}
            <RichEditor height={500} />
          </Form.Item>
        </ProForm>
      </Modal>
    </>
  );
};

export default Notification;
