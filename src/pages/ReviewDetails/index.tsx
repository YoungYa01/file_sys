import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { Breadcrumb, Button, Modal, Space, Table, Tooltip } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { addToast } from "@heroui/react";

import {
  exportReviewFile,
  getReviewDetailsList,
  updateReviewStatus,
} from "@/api/review.ts";
import FilePreview from "@/pages/CollectionDetails/FilePreview.tsx";

const ReviewDetails = () => {
  const navigate = useNavigate();
  const actionRef = useRef();
  // 获取query参数
  const tn = new URLSearchParams(window.location.search).get("tn");
  const ro = new URLSearchParams(window.location.search).get("ro");
  // 获取路由参数
  const taskId = useParams().id;
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
  ];

  const handleExport = (ids: number[]) => {
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

  const ExpandedRender = ({ data }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const handlePass = (id: number, status: number, recommend: string) => {
      updateReviewStatus({
        id,
        review_status: status,
        recommend,
      }).then((response) => {
        if (response.code === 200) {
          addToast({
            color: "success",
            description: response.msg,
          });
          actionRef.current?.reload();
        } else {
          addToast({
            color: "danger",
            description: response.msg,
          });
        }
      });
    };

    return (
      <ProTable
        actionRef={actionRef}
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
            title: "下载",
            align: "center",
            width: 50,
            render: (_, record) => [
              <Button
                key={"preview"}
                disabled={!record.file_path}
                icon={<DownloadOutlined />}
                type={"link"}
                onClick={() => {
                  window.open(
                    import.meta.env["VITE_API_URL"] + record.file_path,
                    "_blank",
                  );
                }}
              />,
            ],
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
            title: "审核时间",
            width: 200,
            render: (_, record) => {
              return record.review_time === "0001-01-01T00:00:00Z" ? (
                "未审核"
              ) : (
                <Tooltip title={record.recommend}>
                  {new Date(record.review_time).toLocaleString()}
                </Tooltip>
              );
            },
          },
          {
            title: "审核",
            key: "action",
            align: "center",
            render: (_, record) => (
              <>
                {record.review_status == Number(ro) && (
                  <Button key={"tips"} disabled type="link">
                    已审核
                  </Button>
                )}
                {record.review_status < Number(ro) - 1 && (
                  <Button key={"tips"} disabled type="link">
                    上级未审核无法操作
                  </Button>
                )}
                {record.review_status == Number(ro) - 1 && (
                  <>
                    <Button
                      key={"pass"}
                      color={"green"}
                      icon={<CheckOutlined />}
                      variant={"link"}
                      onClick={() =>
                        handlePass(record.id, Number(ro), "审核通过")
                      }
                    >
                      通过
                    </Button>
                    <Button
                      key={"reject"}
                      color={"red"}
                      icon={<CloseOutlined />}
                      variant={"link"}
                      onClick={() => console.log("驳回")}
                    >
                      驳回
                    </Button>
                  </>
                )}
              </>
            ),
          },
        ]}
        dataSource={data.submits}
        headerTitle={false}
        options={false}
        pagination={false}
        rowKey={(record) => record.id}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
          selectedRowKeys,
        }}
        search={false}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Button
                key={"export"}
                color={"blue"}
                icon={<DownloadOutlined />}
                variant={"filled"}
                onClick={() => handleExport(selectedRowKeys.map(Number))}
              >
                导出
              </Button>
              <Button
                key={"pass"}
                color={"green"}
                icon={<CheckOutlined />}
                variant={"filled"}
                onClick={() => console.log("通过")}
              >
                批量通过
              </Button>
              <Button
                key={"reject"}
                color={"red"}
                icon={<CloseOutlined />}
                variant={"filled"}
                onClick={() => console.log("驳回")}
              >
                批量驳回
              </Button>
            </Space>
          );
        }}
        tableAlertRender={() => {
          return (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a
                  style={{ marginInlineStart: 8 }}
                  onClick={() => setSelectedRowKeys([])}
                >
                  取消选择
                </a>
              </span>
            </Space>
          );
        }}
      />
    );
  };

  const expandedRowRender = (data: any) => {
    return <ExpandedRender data={data} />;
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <HomeOutlined />,
          },
          {
            title: <span style={{ cursor: "pointer" }}>审核中心</span>,
            onClick: () => {
              navigate("/review-center");
            },
          },
          {
            title: "任务详情",
          },
        ]}
      />
      <ProTable
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        headerTitle={tn}
        pagination={{
          pageSize: 10,
        }}
        request={async (params = {}) => {
          const res = await getReviewDetailsList(Number(taskId), params);
          const tmp: number[] = [];

          res.data.data.map((item) => {
            tmp.push(...item.submits.map((sub: any) => sub.id));
          });
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
              icon={<DownloadOutlined />}
              variant={"filled"}
              onClick={() => handleExport(ids)}
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
            <Button icon={<CloseOutlined />} type={"primary"} />
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
              <FullscreenOutlined />
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
            <FilePreview key={1} filePath={filePath} fullscreen={fullscreen} />
          ) : (
            <FilePreview key={2} filePath={filePath} fullscreen={fullscreen} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ReviewDetails;
