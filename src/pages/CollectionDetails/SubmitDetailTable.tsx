import {ProTable} from "@ant-design/pro-components";
import {Button, Modal, Tooltip} from "antd";
import {useLocation} from "react-router-dom";
import {useState} from "react";
import {
  CloseOutlined,
  DownloadOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";

import {getCollectionSubmitDetails} from "@/api/collection.ts";
import FilePreview from "@/pages/CollectionDetails/FilePreview.tsx";
import {exportReviewFile} from "@/api/review.ts";

const SubmitDetailTable = () => {
  // 获取路由参数
  const location = useLocation();
  const taskId = location.pathname.split("/").pop();
  const [open, setOpen] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [ids, setIds] = useState<number[]>([]);

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
    {
      title: "昵称",
      dataIndex: "nickname",
      search: false,
    },
    {
      title: "状态",
      search: false,
      render: (_: string, record) =>(
        <>
          {record.submits?.[0]?.task_status === 1 && <span className={"text-gray-500"}>未提交</span>}
          {record.submits?.[0]?.task_status === 2 && <span className={"text-green-500"}>已提交</span>}
        </>
      )
    },
    {
      title: "提交时间",
      dataIndex: "submit_time",
      key: "submit_time",
      search: false,
      width: 200,
      align: "center",
      render: (_: string, record) =>
        record.submits?.[0]?.submit_time === "0001-01-01T00:00:00Z"
          ? "未提交"
          : new Date(record.submits?.[0]?.submit_time).toLocaleString(),
    },
  ];

  const expandedRowRender = (data: any) => {
    return (
      <ProTable
        columns={[
          {
            title: "序号",
            align: "center",
            dataIndex: "index",
            width: 120,
            valueType: "indexBorder",
          },
          // { title: "文件名", dataIndex: "file_name", key: "file_name" },
          {
            title: "文件",
            dataIndex: "file_path",
            align: "center",
            render: (_, record) =>
              record.file_path ? (
                <Button
                  disabled={!record.file_path}
                  type="link"
                  onClick={() => {
                    setFilePath(
                      record.file_path,
                      // import.meta.env["VITE_API_URL"] + record.file_path,
                    );
                    setOpen(true);
                  }}
                >
                  {record.file_name}
                </Button>
              ) : (
                "未提交"
              ),
          },
          {
            title: "状态",
            dataIndex: "task_status",
            width: 150,
            valueEnum: {
              1: {
                text: "未审核",
                status: "default",
              },
              2: {
                text: "已提交",
                status: "warning",
              },
              3: {
                text: "审核通过",
                status: "success",
              },
              4: {
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
            width: 200,
            align: "center",
            render: (text: string) =>
              text === "0001-01-01T00:00:00Z"
                ? "未提交"
                : new Date(text).toLocaleString(),
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            width: 150,
            render: (_, record) => [
              <Button
                key={"preview"}
                disabled={!record.file_path}
                type={"link"}
                onClick={() => {
                  window.open(
                    import.meta.env["VITE_API_URL"] + record.file_path,
                    "_blank",
                  );
                }}
              >
                下载
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
    );
  };

  const handleExport = () => {
    exportReviewFile(ids.join(","))
      .then((response) => {
        // 创建一个下载链接
        const link = document.createElement("a");

        link.href = window.URL.createObjectURL(response);
        document.body.appendChild(link);
        link.click();
        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ProTable
        columns={columns}
        expandable={{expandedRowRender}}
        pagination={{
          pageSize: 10,
        }}
        request={async (params = {}) => {
          const res = await getCollectionSubmitDetails(Number(taskId), params);
          const tmp: number[] = [];
          res.data.data.map((item) => tmp.push(...item.submits.map((sub: any) => sub.id)))
          console.log(tmp);
          setIds(tmp);

          return {
            data: res.data.data,
            success: true,
            total: res.data.total,
          };
        }}
        rowKey={"user_id"}
        toolBarRender={() => {
          return [
            <Button
              key={"export"}
              color={"blue"}
              icon={<DownloadOutlined/>}
              variant={"filled"}
              onClick={(...p) => handleExport(p)}
            >
              导出所有文件
            </Button>,
          ];
        }}
      />
      <Modal
        centered
        destroyOnClose
        bodyStyle={{
          position: "relative",
        }}
        closeIcon={
          <Tooltip title={"关闭"}>
            <Button icon={<CloseOutlined/>} type={"primary"}/>
          </Tooltip>
        }
        footer={false}
        maskClosable={false}
        open={open}
        width={fullscreen ? "100vw" : 1000}
        onCancel={() => {
          setOpen(false);
          setFullscreen(false);
        }}
      >
        <Button
          color="default"
          icon={
            <Tooltip title={fullscreen ? "退出全屏" : "全屏"}>
              <FullscreenOutlined/>
            </Tooltip>
          }
          style={{
            position: "absolute",
            top: -8,
            right: 25,
            zIndex: 999,
          }}
          variant="outlined"
          onClick={() => setFullscreen(!fullscreen)}
        />
        <div
          style={{
            width: "100%",
            height: "90vh",
            overflowY: "scroll",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {fullscreen ? (
            <FilePreview key={1} filePath={filePath} fullscreen={fullscreen}/>
          ) : (
            <FilePreview key={2} filePath={filePath} fullscreen={fullscreen}/>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SubmitDetailTable;
