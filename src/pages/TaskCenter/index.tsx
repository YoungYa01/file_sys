import {LockOutlined, VerticalAlignTopOutlined} from "@ant-design/icons";
import { PageContainer, ProList } from "@ant-design/pro-components";
import {
  Avatar,
  Flex,
  Progress,
  Space,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { PaginationConfig } from "antd/es/pagination";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTCCollectionList } from "@/api/collection.ts";

const TaskCenter = () => {
  const navigate = useNavigate();
  // 下划线
  const [underline, setUnderline] = useState(0);

  return (
    <PageContainer header={{ title: null }}>
      <ProList
        metas={{
          title: {
            dataIndex: "title",
            title: "标题",
            render: (_, record) => (
              <Typography.Title
                ellipsis={{ rows: 1 }}
                level={3}
                underline={underline === record.id}
                onClick={() => navigate(`/task-center/${record.id}`)}
                onMouseEnter={() => setUnderline(record.id)}
                onMouseLeave={() => setUnderline(0)}
              >
                {record.title}
                {record.access !== "public" && (
                  <LockOutlined style={{ color: "#e0534f", fontSize: 18 }} />
                )}
              </Typography.Title>
            ),
          },
          avatar: {
            dataIndex: "title",
            search: false,
            render: (_, record) => (
              <Flex align={"center"} justify={"center"} style={{ position: "relative" }}>
                <div
                  style={{
                    display: "inline-block",
                    width: 1,
                    height: 120,
                    backgroundColor:
                      new Date(record.end_time).getTime() < Date.now()
                        ? "red"
                        : "#52c41a",
                  }}
                />
                <Avatar size={80} style={{ marginLeft: 20, fontSize: 35 }}>
                  {record.title
                    ?.match(/[\u4e00-\u9fa5A-Za-z]/)?.[0]
                    .toUpperCase()}
                </Avatar>
                {Boolean(record.pinned) && (
                  <Tooltip title={"置顶"}>
                    <VerticalAlignTopOutlined
                      style={{
                        color: "red",
                        position: "absolute",
                        top: 0,
                        left: 10,
                        fontSize: 24,
                      }}
                    />
                  </Tooltip>
                )}
              </Flex>
            ),
          },
          description: {
            dataIndex: "content",
            search: false,
            render: (_, record) => (
              <>
                <Typography.Paragraph ellipsis={{ rows: 3 }}>
                  {
                    new DOMParser().parseFromString(record.content, "text/html")
                      .body.textContent
                  }
                </Typography.Paragraph>
                <Space wrap size={"large"}>
                  <Typography.Text>
                    创建人：
                    <Typography.Text code>
                      {record.Founder.username}
                    </Typography.Text>
                  </Typography.Text>
                  <Typography.Text type={"secondary"}>
                    提交人数：{record.submitted_number ?? 0}
                    {record.access === "some" && <span>/{" "} {record.total_number ?? 0}</span>}
                  </Typography.Text>
                  <Typography.Text strong>
                    截止时间：
                    {record.end_time
                      ? new Date(record.end_time).toLocaleString()
                      : "长期有效"}
                  </Typography.Text>
                </Space>
                {record.end_time && (
                  <Tooltip>
                    <Progress
                      format={(value) => Math.round(value as number) + "%"}
                      percent={
                        Date.now() > new Date(record.end_time).getTime()
                          ? 100
                          : ((Date.now() -
                              new Date(record.created_at).getTime()) /
                              (new Date(record.end_time).getTime() -
                                new Date(record.created_at).getTime())) *
                            100
                      }
                      showInfo={false}
                      size={{ height: 3 }}
                      status={
                        Date.now() > new Date(record.end_time).getTime()
                          ? "success"
                          : "active"
                      }
                    />
                  </Tooltip>
                )}
              </>
            ),
          },
          subTitle: {
            render: (_, record) => (
              <Space size={0}>
                {record.access === "public" ? (
                  <Tag color={"green"}>公开</Tag>
                ) : record.access === "private" ? (
                  <Tag color={"red"}>私有</Tag>
                ) : (
                  <Tag color={"orange"}>指定人员</Tag>
                )}
              </Space>
            ),
            search: false,
          },
          actions: {
            render: (_, record) =>
              new Date(record.end_time).getTime() < Date.now() ? (
                <Tag color={"red"}>已结束</Tag>
              ) : (
                <Tag color={"green"}>进行中</Tag>
              ),
            search: false,
          },
        }}
        pagination={
          {
            defaultCurrent: 1,
            defaultPageSize: 10,
          } as
            | (false & PaginationConfig)
            | false
            | (TablePaginationConfig & PaginationConfig)
            | (TablePaginationConfig & false)
            | undefined
        }
        request={async (params) => {
          const response = await getTCCollectionList(params);

          return {
            data: response.data.data,
            success: true,
            total: response.data.total,
          };
        }}
        search={{}}
      />
    </PageContainer>
  );
};

export default TaskCenter;
