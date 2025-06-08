import {
  Button,
  Form,
  Image,
  Modal,
  Popconfirm,
  TreeSelect,
  Upload,
} from "antd";
import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { addToast, Avatar, closeAll } from "@heroui/react";
import { CloseOutlined } from "@ant-design/icons";

import {
  createOrg,
  deleteOrg,
  getOrgList,
  OrganizationType,
  updateOrg,
} from "@/api/organization.ts";
import { getUserList } from "@/api/users.ts";
import { uploadFile } from "@/api/utils.ts";

const Organization = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>("");
  const [treeData, setTreeData] = useState<OrganizationType[]>([]);
  const [type, setType] = useState("edit");
  const actionRef = useRef();

  const [form] = Form.useForm();
  const handeEdit = (record: OrganizationType) => {
    setType("edit");
    form.setFieldsValue(record);
    setFilePath(record.org_logo);
    setOpen(true);
  };

  const handleDel = (id) => {
    deleteOrg(Array.isArray(id) ? id : [id]).then((response) => {
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
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
    },
    {
      title: "组织logo",
      dataIndex: "org_logo",
      key: "org_logo",
      search: false,
      render: (text: string) => {
        return (
          <Image
            alt=""
            src={import.meta.env["VITE_API_URL"] + text}
            style={{ width: 50, height: 50 }}
          />
        );
      },
    },
    {
      title: "名称",
      dataIndex: "org_name",
      key: "org_name",
    },
    {
      title: "描述",
      dataIndex: "description",
      ellipsis: true,
      search: false,
      key: "description",
    },
    {
      title: "组织负责人",
      dataIndex: "leader",
      search: false,
    },
    {
      title: "排序",
      dataIndex: "sort",
      search: false,
    },
    {
      title: "操作",
      render: (_, record: OrganizationType) => (
        <>
          <Button type={"link"} onClick={() => handeEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            cancelText="取消"
            description={`你确定要删除${record.org_name}这一项吗？`}
            okText="确定"
            title={`删除${record.org_name}`}
            onConfirm={() => handleDel(record.id)}
          >
            <Button danger type={"link"}>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setFilePath("");
    form.resetFields();
    setOpen(true);
    setType("add");
    console.log("add");
  };

  const renderTreeData = (data) => {
    if (data) {
      return data.map((item) => {
        return {
          title: item.org_name,
          value: item.id,
          key: item.id,
          children: renderTreeData(item.children),
        };
      });
    } else {
      return [];
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const data = { ...values, org_logo: filePath };

      if (type === "add") {
        createOrg(data).then((response) => {
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
            setOpen(false);
          } else {
            addToast({
              color: "danger",
              title: "添加失败",
              description: response.msg,
            });
          }
        });
      } else {
        updateOrg(data).then((response) => {
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
            setOpen(false);
          } else {
            addToast({
              color: "danger",
              title: "修改失败",
              description: response.msg,
            });
          }
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
          const response = await getOrgList(params);

          setTreeData(response.data);

          return {
            data: response.data,
            success: true,
            total: 0,
          };
        }}
        rowKey={"id"}
        search={false}
        toolBarRender={() => [
          <Button key={"primary"} type={"primary"} onClick={handleAdd}>
            新建
          </Button>,
        ]}
      />
      <Modal footer={false} open={open} onCancel={() => setOpen(false)}>
        <ProForm form={form} submitter={false}>
          <ProFormText hidden name={"id"} />
          <Form.Item label={"LOGO"} name={"org_logo"}>
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
          <Form.Item
            initialValue={0}
            label={"父级部门"}
            name={"parent_id"}
            rules={[{ required: true }]}
            tooltip={"如果不选父级部门，则默认为根部门"}
          >
            <TreeSelect
              allowClear
              treeDefaultExpandAll
              treeData={[
                {
                  title: "根部门",
                  value: 0,
                  key: 0,
                  children: renderTreeData(treeData),
                },
              ]}
              onClear={() => {
                requestAnimationFrame(() => form.setFieldValue("parent_id", 0));
              }}
            />
          </Form.Item>
          <ProFormText
            label={"名称"}
            name={"org_name"}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            label={"负责人"}
            name={"leader"}
            request={async () => {
              const response = await getUserList({
                current: 1,
                pageSize: 9999,
              });

              return response.data.data?.map((item: any) => {
                return {
                  label: item.username,
                  value: item.username,
                };
              });
            }}
          />
          <ProFormDigit label="排序" min={1} name="sort" />
          <ProFormTextArea label={"描述"} name={"description"} />
          <Form.Item style={{ textAlign: "right" }}>
            <Button
              htmlType={"submit"}
              style={{ marginRight: 16 }}
              type={"primary"}
              onClick={handleSubmit}
            >
              {type === "add" ? "新建" : "编辑"}
            </Button>
            <Button
              type={"default"}
              onClick={() => {
                setOpen(false);
              }}
            >
              取消
            </Button>
          </Form.Item>
        </ProForm>
      </Modal>
    </>
  );
};

export default Organization;
