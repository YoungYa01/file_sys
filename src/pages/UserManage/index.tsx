import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormUploadDragger,
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
import {
  CloseOutlined,
  CloudUploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

import {
  createUser,
  deleteUser,
  getUserList,
  updateUser,
  UserType,
} from "@/api/users.ts";
import { uploadFile } from "@/api/utils.ts";
import { getRoleList, RoleType } from "@/api/role.ts";
import { TOKEN } from "@/utils/const.ts";

const UserManage = () => {
  const [form] = Form.useForm();
  const [upForm] = Form.useForm();

  const actionRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [type, setType] = useState("edit");
  const [roleList, setRoleList] = useState<RoleType[]>([]);
  const [upOpen, setUpOpen] = useState(false);

  const onDelete = (record: UserType) => {
    console.log("record", record);
    Modal.confirm({
      title: "确认删除吗？",
      content: "删除后不可恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteUser(record.id).then((response) => {
          closeAll();
          if (response.code === 200) {
            addToast({
              color: "success",
              title: "删除成功",
              description: response.msg,
            });
            actionRef.current?.reload();
          } else {
            addToast({
              color: "danger",
              title: "删除失败",
              description: response.msg,
            });
          }
        });
      },
    });
  };

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
      render: (_: string, record: UserType) =>
        record.avatar ? (
          <Avatar
            isBordered
            alt={record.username}
            src={import.meta.env["VITE_API_URL"] + record.avatar}
          />
        ) : (
          <Avatar
            isBordered
            className="text-xl"
            name={record.nickname.slice(0, 1)}
          />
        ),
    },
    {
      title: "用户名",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "学号/工号",
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
      search: false,
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
                  {record.org_logo ? (
                    <Avatar
                      isBordered
                      alt={record.org_name}
                      src={import.meta.env["VITE_API_URL"] + record.org_logo}
                    />
                  ) : (
                    <Avatar
                      isBordered
                      className="text-xl"
                      name={record.org_name.slice(0, 1)}
                    />
                  )}
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
      search: false,
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
        <Button
          key="delete"
          color={"red"}
          variant={"link"}
          onClick={() => onDelete(record)}
        >
          删除
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
        columnsState={{
          value: {
            age: {
              show: false,
            },
            sex: {
              show: false,
            },
            permission: {
              show: false,
            },
            status: {
              show: false,
            },
            option: {
              fixed: "right",
            },
          },
        }}
        headerTitle="用户管理"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
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
              form.resetFields();
              setType("add");
              setIsOpen(true);
            }}
          >
            新建
          </Button>,
          <Button
            key="primary"
            icon={<CloudUploadOutlined />}
            onClick={() => setUpOpen(true)}
          >
            批量导入
          </Button>,
        ]}
      />

      <Modal
        destroyOnClose
        centered
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
            <ProFormText label={"昵称"} name={"nickname"} />
            <ProFormText label={"学号/工号"} name={"username"} />
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
                <ProFormText label={"昵称"} name={"nickname"} />
              </Col>
              <Col span={12}>
                <ProFormText label={"学号/工号"} name={"username"} />
              </Col>
            </Row>
            {/*<ProFormText label={"密码"} name={"password"} />*/}
            <Row gutter={16}>
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
              <Col span={12}>
                <ProFormDigit label={"年龄"} min={1} name={"age"} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormSelect
                  label={"角色"}
                  name={"role_id"}
                  options={roleList}
                />
              </Col>
              <Col span={12}>
                <ProFormText label={"手机号"} name={"phone"} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText label={"邮箱"} name={"email"} />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  label={"状态"}
                  name={"status"}
                  valueEnum={{
                    0: { text: "禁用", status: "Error" },
                    1: { text: "正常", status: "Success" },
                  }}
                />
              </Col>
            </Row>
          </ProForm>
        )}
      </Modal>
      <Modal
        centered
        footer={false}
        maskClosable={false}
        open={upOpen}
        width={500}
        onCancel={() => setUpOpen(false)}
      >
        <ProForm form={upForm} submitter={false}>
          <ProFormUploadDragger
            accept={".xlsx,.xls"}
            action={`/api/users/upload`}
            fieldProps={{
              headers: {
                token: localStorage.getItem(TOKEN),
              },
              listType: "picture-card",
              name: "file",
            }}
            label={"上传文件"}
            max={1}
            name={"file"}
            onChange={(info) => {
              if (info.file.status === "done") {
                if (info.file.response.code === 200) {
                  addToast({
                    color: "success",
                    title: "上传成功",
                    description: info.file.response.msg,
                  });
                  actionRef.current?.reload();
                  setUpOpen(false);
                  upForm.resetFields();

                  return;
                }
                addToast({
                  color: "danger",
                  title: "上传失败",
                  description: info.file.response.msg,
                });
              }
            }}
          />
          <div className="flex justify-end -mt-2">
            点击此处
            <Typography.Link
              style={{ color: "#1890ff" }}
              onClick={() => window.open("template.xlsx")}
            >
              下载模板
            </Typography.Link>
          </div>
        </ProForm>
      </Modal>
    </>
  );
};

export default UserManage;
