import { ProTable } from "@ant-design/pro-components";
import {
  AppleOutlined,
  LinuxOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { Tooltip } from "antd";

import { getLogList, LogType } from "@/api/log.ts";
import { getUserList } from "@/api/users.ts";
import {
  AndroidIcon,
  ChromeIcon,
  EdgeLogo,
  FireFoxIcon,
  OperaIcon,
  SafariIcon,
} from "@/components/icons";

const LogManage = () => {
  const userList = useMemo(
    () =>
      getUserList({ current: 1, pageSize: 999999 }).then((res) =>
        res.data.data
          .map((item: any) => ({
            label: `${item.nickname}-${item.username}`,
            value: item.id,
          }))
          .sort((a, b) => a.value - b.value),
      ),
    [],
  );
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
    },
    {
      title: "用户名",
      dataIndex: "user_id",
      valueType: "select",
      virtual: true,
      request: async () => {
        return userList;
      },
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "操作系统",
      dataIndex: "os",
      align: "center",
      render: (text: string) => {
        const os = text.split(" ")[0];

        return (
          <Tooltip title={os}>
            {os === "Windows" ? (
              <WindowsOutlined style={{ color: "#1890ff" }} />
            ) : os === "Mac" ? (
              <AppleOutlined />
            ) : os === "Linux" ? (
              <LinuxOutlined />
            ) : os === "Android" ? (
              <AndroidIcon />
            ) : (
              os
            )}
          </Tooltip>
        );
      },
    },
    {
      title: "参数",
      dataIndex: "params",
      key: "params",
      ellipsis: true,
      search: false,
    },
    {
      title: "方法",
      dataIndex: "method",
      valueType: "select",
      align: "center",
      valueEnum: {
        POST: {
          text: "POST",
          status: "Success",
        },
        PUT: {
          text: "PUT",
          status: "Default",
        },
        DELETE: {
          text: "DELETE",
          status: "Error",
        },
      },
    },
    {
      title: "接口地址",
      dataIndex: "api_url",
    },
    {
      title: "浏览器",
      dataIndex: "browser",
      search: false,
      render: (text: string) => {
        const b = text.toLowerCase();

        return (
          <Tooltip title={b}>
            {b.includes("edge") ? (
              <EdgeLogo />
            ) : b.includes("chrome") ? (
              <ChromeIcon />
            ) : b.includes("firefox") ? (
              <FireFoxIcon />
            ) : b.includes("safari") ? (
              <SafariIcon />
            ) : b.includes("opera") ? (
              <OperaIcon />
            ) : b.includes("android") ? (
              <AndroidIcon />
            ) : (
              b
            )}
          </Tooltip>
        );
      },
    },
    {
      title: "地点",
      search: false,
      render: (_: string, record: LogType) => {
        return record.province + record.city;
      },
    },
    {
      title: "时间",
      dataIndex: "created_at",
      search: false,
      render: (text: string) => {
        return new Date(text).toLocaleString();
      },
    },
  ];

  return (
    <>
      <ProTable
        columns={columns}
        pagination={{
          pageSize: 10, // 每页显示10条
        }}
        request={async (params) => {
          const response = await getLogList(params);

          console.log({
            data: response.data.data,
            success: true,
            total: response.data.total,
          });

          return {
            data: response.data.data,
            success: true,
            total: response.data.total,
          };
        }}
      />
    </>
  );
};

export default LogManage;
