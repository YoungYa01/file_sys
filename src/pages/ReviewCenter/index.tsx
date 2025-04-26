import { useEffect, useState } from "react";
import {
  ProFormText,
  ProList,
  QueryFilter,
  StatisticCard,
} from "@ant-design/pro-components";
import {
  Badge,
  Button,
  Dropdown,
  Popconfirm,
  Progress,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  EllipsisOutlined,
  ReloadOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { ListGridType } from "antd/es/list";
import { PaginationConfig } from "antd/es/pagination";
import { useNavigate } from "react-router-dom";

import { TAG_COLOR } from "../CreateCollection";

import { getReviewList } from "@/api/review.ts";
import { CollectionItemType } from "@/api/collection.ts";

const ReviewCenter = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState<CollectionItemType[]>([]);
  // 分页
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const getList = async (
    page: number,
    pageSize: number,
    title?: string,
    file_type?: "all" | "image" | "word" | "excel" | "pdf" | "ppt" | "zip",
  ) => {
    const response = await getReviewList({
      current: page,
      pageSize,
      title,
      file_type,
    });

    console.log(response);
    setCardData(response.data.data);
    setTotal(response.data.total);
  };

  useEffect(() => {
    getList(current, pageSize);
  }, []);

  return (
    <>
      <QueryFilter
        defaultCollapsed
        split
        onFinish={(values) =>
          getList(current, pageSize, values.title, values.file_type)
        }
        onReset={() => getList(current, pageSize)}
      >
        <ProFormText label="任务名" name="title" />
      </QueryFilter>
      <ProList
        dataSource={cardData?.map((item) => ({
          ...item,
          key: item.id,
          avatar: (
            <StatisticCard
              chart={
                <div style={{ position: "relative" }}>
                  <Progress
                    format={(value) => Math.round(value as number) + "%"}
                    percent={
                      (item?.submitted_number / item?.total_number) * 100
                    }
                    size={"small"}
                    style={{ backgroundColor: "transparent" }}
                    type="circle"
                  />
                  {Boolean(item.pinned) && (
                    <Tooltip title={"置顶"}>
                      <VerticalAlignTopOutlined
                        size={24}
                        style={{
                          color: "red",
                          position: "absolute",
                          top: -20,
                          left: -10,
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
              }
              size={"small"}
              style={{ backgroundColor: "transparent" }}
            />
          ),
          content: (
            <div
              style={{ width: 250, margin: "-40px -10px -10px", height: 150 }}
            >
              {item.file_type.includes("all") ? (
                <Tag color={TAG_COLOR("all")}>全部文件</Tag>
              ) : (
                JSON.parse(item.file_type || "[]").map(
                  (fileType: string, index: number) => (
                    <Tag key={index} color={TAG_COLOR(fileType)}>
                      {fileType}
                    </Tag>
                  ),
                )
              )}
              <StatisticCard.Group
                direction={"row"}
                size={"small"}
                style={{ backgroundColor: "transparent" }}
              >
                <StatisticCard
                  statistic={{
                    title: "已提交",
                    value: item.submitted_number ?? 0,
                    suffix: "个",
                  }}
                  style={{ backgroundColor: "transparent" }}
                />
                <StatisticCard
                  statistic={{
                    title: "总数",
                    value: item.total_number ?? 0,
                    suffix: "个",
                  }}
                  style={{ backgroundColor: "transparent" }}
                />
              </StatisticCard.Group>
              <Typography>
                截止时间:{" "}
                {item.end_time
                  ? String(new Date(item.end_time).toLocaleString())
                  : "长期有效"}
              </Typography>
            </div>
          ),
          extra: (
            <Dropdown
              menu={{
                onClick: ({ domEvent }) => {
                  domEvent.stopPropagation();
                  console.log(item);
                },
                items: [
                  {
                    label: (
                      <Typography.Text type={"success"}>详情</Typography.Text>
                    ),
                    key: "detail",
                  },
                  { label: "编辑", key: "edit" },
                  {
                    label: (
                      <Popconfirm
                        cancelText="No"
                        description={`你确定要删除${item.title}这一项吗？`}
                        okText="Yes"
                        title={`删除${item.title}`}
                      >
                        <Typography.Text type={"danger"}>删除</Typography.Text>
                      </Popconfirm>
                    ),
                    key: "delete",
                  },
                ],
              }}
              placement="bottomCenter"
            >
              <Badge
                color={TAG_COLOR(item.access)}
                count={
                  item.access === "public"
                    ? "公开"
                    : item.access === "some"
                      ? "指定人员"
                      : "私有"
                }
                offset={[-35, -10]}
              >
                <Button
                  icon={
                    <EllipsisOutlined
                      style={{ fontSize: 22, color: "rgba(0,0,0,0.5)" }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  }
                  type={"link"}
                />
              </Badge>
            </Dropdown>
          ),
        }))}
        grid={
          {
            columns: 4,
            xs: "100%",
            sm: "50%",
            md: "40%",
            lg: "20%",
            xl: "10%",
          } as unknown as ListGridType
        }
        metas={{
          title: {
            render: (text) => (
              <Tooltip title={text}>
                <div
                  style={{
                    width: 150,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {text}
                </div>
              </Tooltip>
            ),
          },
          subTitle: {},
          type: {},
          avatar: {},
          content: {},
          actions: { cardActionProps: "extra", dataIndex: "extra" },
          extra: {},
        }}
        pagination={
          {
            current,
            total,
            pageSize,
            position: "bottom",
            onChange: (page, pageSize) => {
              setPageSize(pageSize);
              setCurrent(page);
              getList(page, pageSize);
            },
            style: {
              marginRight: 30,
              marginBottom: 20,
            },
          } as false & PaginationConfig
        }
        toolBarRender={() => [
          <Button
            key={"refresh"}
            color={"default"}
            variant={"link"}
            onClick={() => getList(1, 10)}
          >
            <Tooltip title={"刷新"}>
              <ReloadOutlined />
            </Tooltip>
          </Button>,
        ]}
        onItem={(record: any) => {
          const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
          const ro = record.reviewers.find(
            (item: any) => item.user_id === userInfo.id,
          ).review_order;

          return {
            onClick: () => {
              navigate(
                `/review-center/${record.id}?tn=${record.title}&ro=${ro}`,
              );
            },
          };
        }}
      />
    </>
  );
};

export default ReviewCenter;
