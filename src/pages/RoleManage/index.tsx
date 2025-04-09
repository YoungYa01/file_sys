import { ProTable } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { Avatar, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { getRoleList, RoleType } from "@/api/role.ts";
import CreateRole from "@/pages/RoleManage/CreateRole.tsx";
import UpdateRole from "@/pages/RoleManage/UpdateRole.tsx";
import { randomColor } from "@/utils/randomColor.ts";

const RoleManage = () => {
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
    },
    {
      title: "角色",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "权限标识",
      dataIndex: "permission",
      key: "permission",
      search: false,
      render: (_, record) => {
        return JSON.parse(record.permission || "[]").join(",");
      },
    },
    {
      title: "权限描述",
      dataIndex: "description",
      key: "description",
      search: false,
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
      search: false,
      render: (text: string) => (
        <Avatar size={"small"} style={{ backgroundColor: randomColor() }}>{text}</Avatar>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        0: { text: "禁用", status: "Error" },
        1: { text: "正常", status: "Success" },
      },
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (_: string, record: RoleType) => {
        return (
          <>
            <Button
              type={"link"}
              onClick={() => {
                setRecord(record);
                setIsEditOpen(true);
              }}
            >
              编辑
            </Button>
          </>
        );
      },
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [record, setRecord] = useState<RoleType>({});
  const actionRef = useRef();
  const handleReload = () => {
    if (actionRef.current) {
      setRecord({});
      actionRef.current?.reload();
    }
  };

  return (
    <>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const response = await getRoleList(params);

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
              console.log("新建");
              setIsOpen(true);
            }}
          >
            新建
          </Button>,
        ]}
      />
      <CreateRole
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onReload={handleReload}
      />
      <UpdateRole
        isOpen={isEditOpen}
        record={record}
        setIsOpen={setIsEditOpen}
        onReload={handleReload}
      />
    </>
  );
};

export default RoleManage;
