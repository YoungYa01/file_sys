import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useLocation } from "react-router-dom";

import { getCollectionSubmitDetails } from "@/api/collection.ts";

const SubmitDetailTable = () => {
  // 获取路由参数
  const location = useLocation();
  const taskId = location.pathname.split("/").pop();

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
    },
    {
      title: "提交人",
      dataIndex: "user_name",
    },
    // {
    //   title: "文件类型",
    //   dataIndex: "file_type",
    //   key: "file_type",
    //   align: "center",
    //   search: false,
    //   valueEnum: {
    //     all: "任意类型",
    //     image: "图片文件",
    //     word: "Word 文档",
    //     excel: "Excel 表格",
    //     pdf: "PDF 文档",
    //     ppt: "PPT 幻灯片",
    //     zip: "ZIP 压缩包",
    //   },
    // },
  ];

  const expandedRowRender = (data: any) => {
    console.log(data);
    return (
      <ProTable
        columns={[
          { title: "序号", dataIndex: "index", valueType: "indexBorder" },
          { title: "文件名", dataIndex: "file_name", key: "file_name" },
          {
            title: "文件",
            dataIndex: "file_path",
            render: (_, record) =>
              record.file_path ? (
                <a
                  href={record.file_path}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {record.file_path.split("/").pop()}
                </a>
              ) : (
                "未提交"
              ),
          },
          {
            title: "状态",
            dataIndex: "task_status",
            valueEnum: {
              1: {
                text: "未审核",
                status: "default",
              },
              2: {
                text: "审核通过",
                status: "success",
              },
              3: {
                text: "审核未通过",
                status: "error",
              },
            },
          },
          {
            title: "提交时间",
            dataIndex: "submit_time",
            key: "submit_time",
            search: false,
            render: (text: string) =>
              text === "0001-01-01T00:00:00Z"
                ? "未提交"
                : new Date(text).toLocaleString(),
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (_, record) => [
              <Button
                key={"download"}
                disabled={!record.file_path}
                type={"text"}
                onClick={() => window.open(record.file_path)}
              >
                下载
              </Button>,
              <Button
                key={"preview"}
                disabled={!record.file_path}
                type={"text"}
                onClick={() => window.open(record.file_path)}
              >
                预览
              </Button>,
            ],
          },
        ]}
        dataSource={data.submits}
        headerTitle={false}
        options={false}
        pagination={false}
        search={false}
      />
    )
  };

  return (
    <ProTable
      columns={columns}
      expandable={{ expandedRowRender }}
      pagination={{
        pageSize: 10,
      }}
      rowKey={"user_id"}
      request={async (params = {}) => {
        const res = await getCollectionSubmitDetails(Number(taskId), params);

        return {
          data: res.data.data,
          success: true,
          total: res.data.total,
        };
      }}
    />
  );
};

export default SubmitDetailTable;
