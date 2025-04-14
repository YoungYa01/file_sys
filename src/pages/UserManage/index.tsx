import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import {
  addToast,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  closeAll,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { Button, Col, Form, Modal, Row, Tag, Typography, Upload } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

import { createUser, getUserList, updateUser, UserType } from "@/api/users.ts";
import { uploadFile } from "@/api/utils.ts";
import { getRoleList, RoleType } from "@/api/role.ts";

const UserManage = () => {
  const [form] = Form.useForm();

  const actionRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [type, setType] = useState("edit");
  const [roleList, setRoleList] = useState<RoleType[]>([]);

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      search: false,
      render: (_: string, record: UserType) => (
        <Avatar
          isBordered
          alt={record.username}
          src={import.meta.env["VITE_API_URL"] + record.avatar}
        />
      ),
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      search: false,
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
      valueType: "select",
      valueEnum: {
        0: { text: "女", status: "Error" },
        1: { text: "男", status: "Success" },
      },
      search: false,
    },
    {
      title: "角色",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      search: false,
      render: (text: string, record: UserType) =>
        text === "-" ? (
          text
        ) : (
          <Typography.Link copyable href={`tel:${record.phone}`}>
            {record.phone}
          </Typography.Link>
        ),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      search: false,
      render: (text: string, record: UserType) =>
        text === "-" ? (
          text
        ) : (
          <Typography.Link copyable href={`mailto:${record.email}`}>
            {record.email}
          </Typography.Link>
        ),
    },
    {
      title: "所属",
      dataIndex: "org_name",
      key: "org_name",
      search: false,
      render: (_: string, record: UserType) => (
        <Popover backdrop={"opaque"} placement={"bottom"}>
          <PopoverTrigger>
            <Typography.Link>{record.org_name}</Typography.Link>
          </PopoverTrigger>
          <PopoverContent>
            <Card
              className="max-w-[300px] border-none bg-transparent"
              shadow="none"
            >
              <CardHeader className="justify-between">
                <div className="flex gap-3">
                  <Avatar
                    isBordered
                    src={import.meta.env["VITE_API_URL"] + record.org_logo}
                  />
                  <div className="flex flex-col items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {record.org_name}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-500">
                      {record.leader}
                    </h5>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-3 py-0">{record.description}</CardBody>
            </Card>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      valueType: "select",
      valueEnum: {
        0: { text: "禁用", status: "Error" },
        1: { text: "正常", status: "Success" },
      },
    },
    {
      title: "权限",
      dataIndex: "permission",
      key: "permission",
      search: false,
      elipsis: true,
      render: (_: string, record: UserType) => {
        const tags = JSON.parse(record.permission || "[]");

        return (
          <Popover>
            <PopoverTrigger>
              <Tag>{tags.length}项</Tag>
            </PopoverTrigger>
            <PopoverContent>
              <div className="grid grid-cols-2 gap-2">
                {tags.map((item: string) => (
                  <div
                    key={item}
                    className="text-sm text-gray-500 text-ellipsis overflow-hidden shadow p-1"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "updated_at",
      search: false,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (_: string, record: UserType) => [
        <Button
          key="editable"
          type={"link"}
          onClick={() => {
            setType("edit");
            setIsOpen(true);
            setFilePath(record.avatar);
            form.setFieldsValue(record);
          }}
        >
          编辑
        </Button>,
      ],
    },
  ];

  const handleAddNew = () => {
    const values = { ...form.getFieldsValue(), avatar: filePath };

    createUser(values).then((response) => {
      if (response.code === 200) {
        closeAll();
        addToast({
          color: "success",
          title: "添加成功",
          description: response.msg,
        });
        form.resetFields();
        setFilePath("");
        actionRef.current?.reload();
        setIsOpen(false);
      } else {
        addToast({
          color: "danger",
          title: "添加失败",
          description: response.msg,
        });
      }
    });
  };

  const handleEdit = () => {
    const values = { ...form.getFieldsValue(), avatar: filePath };

    updateUser(values).then((response) => {
      if (response.code === 200) {
        closeAll();
        addToast({
          color: "success",
          title: "修改成功",
          description: response.msg,
        });
        form.resetFields();
        setFilePath("");
        actionRef.current?.reload();
        setIsOpen(false);
      } else {
        addToast({
          color: "danger",
          title: "修改失败",
          description: response.msg,
        });
      }
    });
  };

  useEffect(() => {
    getRoleList({ current: 1, pageSize: 999 }).then((response) => {
      setRoleList(
        response.data.data.map((item) => {
          return {
            ...item,
            label: item.role_name,
            value: item.id,
          };
        }),
      );
    });
  }, []);

  return (
    <>
      <ProTable
        cardBordered
        actionRef={actionRef}
        columns={columns}
        headerTitle="用户管理"
        request={async (params) => {
          const response = await getUserList(params);

          return {
            data: response.data.data,
            success: true,
            total: response.data.total,
          };
        }}
        rowKey="id"
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
        width="800px"
        onCancel={() => setIsOpen(false)}
        onOk={() => {
          if (type === "add") {
            return handleAddNew();
          }
          handleEdit();
        }}
      >
        {type === "add" && (
          <ProForm
            form={form}
            initialValues={{
              role_name: "",
              description: "",
              sort: 1,
              status: "1",
            }}
            submitter={false}
          >
            <Form.Item label={"头像"}>
              {filePath && (
                <div className="relative inline-block w-24">
                  <Avatar
                    size={"lg"}
                    src={import.meta.env["VITE_API_URL"] + filePath}
                  />
                  <Button
                    className="absolute right-4 -top-2 text-red-500"
                    type={"text"}
                    onClick={() => setFilePath("")}
                  >
                    <CloseOutlined />
                  </Button>
                </div>
              )}
              <Upload
                beforeUpload={(file) => {
                  const formData = new FormData();

                  formData.append("file", file);
                  uploadFile(formData).then((res) => {
                    if (res.code === 200) {
                      setFilePath(res.data);

                      return;
                    }
                    addToast({
                      color: "danger",
                      title: "上传失败",
                      description: res.msg,
                    });
                  });

                  return false;
                }}
              >
                <Button>上传图片</Button>
              </Upload>
            </Form.Item>
            <ProFormText label={"用户名"} name={"username"} />
            <ProFormText.Password label={"密码"} name={"password"} />
            <ProFormDigit label={"年龄"} min={1} name={"age"} />
            <ProFormSelect label={"角色"} name={"role_id"} options={roleList} />
            <ProFormSelect
              label={"状态"}
              name={"status"}
              valueEnum={{
                0: { text: "禁用", status: "Error" },
                1: { text: "正常", status: "Success" },
              }}
            />
          </ProForm>
        )}
        {type === "edit" && (
          <ProForm form={form} submitter={false}>
            <ProFormText hidden name={"id"} />
            <Form.Item label={"头像"}>
              {filePath && (
                <div className="relative inline-block w-24">
                  <Avatar
                    size={"lg"}
                    src={import.meta.env["VITE_API_URL"] + filePath}
                  />
                  <Button
                    className="absolute right-4 -top-2 text-red-500"
                    type={"text"}
                    onClick={() => setFilePath("")}
                  >
                    <CloseOutlined />
                  </Button>
                </div>
              )}
              <Upload
                beforeUpload={(file) => {
                  const formData = new FormData();

                  formData.append("file", file);
                  uploadFile(formData).then((res) => {
                    if (res.code === 200) {
                      setFilePath(res.data);

                      return;
                    }
                    addToast({
                      color: "danger",
                      title: "上传失败",
                      description: res.msg,
                    });
                  });

                  return false;
                }}
              >
                <Button>上传图片</Button>
              </Upload>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText label={"用户名"} name={"username"} />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  label={"性别"}
                  name={"sex"}
                  options={[
                    {
                      label: "男",
                      value: "1",
                    },
                    {
                      label: "女",
                      value: "0",
                    },
                  ]}
                />
              </Col>
            </Row>
            {/*<ProFormText label={"密码"} name={"password"} />*/}
            <Row gutter={16}>
              <Col span={12}>
                <ProFormDigit label={"年龄"} min={1} name={"age"} />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  label={"角色"}
                  name={"role_id"}
                  options={roleList}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText label={"手机号"} name={"phone"} />
              </Col>
              <Col span={12}>
                <ProFormText label={"邮箱"} name={"email"} />
              </Col>
            </Row>
            <ProFormSelect
              label={"状态"}
              name={"status"}
              valueEnum={{
                0: { text: "禁用", status: "Error" },
                1: { text: "正常", status: "Success" },
              }}
            />
          </ProForm>
        )}
      </Modal>
    </>
  );
};

export default UserManage;
