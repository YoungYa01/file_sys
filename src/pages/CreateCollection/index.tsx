import { useEffect, useRef, useState } from "react";
import {
  Button,
  Tooltip,
  Progress,
  Tag,
  Typography,
  Dropdown,
  Popconfirm,
  Badge,
  Modal,
} from "antd";
import {
  ProCard,
  ProFormInstance,
  ProList,
  StatisticCard,
} from "@ant-design/pro-components";
import {
  EllipsisOutlined,
  ReloadOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { ListGridType } from "antd/es/list";
import { PaginationConfig } from "antd/es/pagination";
import { useNavigate } from "react-router-dom";
import { addToast } from "@heroui/react";

import {
  CollectionItemType,
  deleteCollection,
  getCollectionList,
} from "@/api/collection.ts";
import SearchForm from "@/pages/CreateCollection/SearchForm.tsx";
import CreationForm from "@/pages/CreateCollection/CreationForm.tsx";

export const TAG_COLOR = (key: string): string => {
  const colors = {
    word: "geekblue",
    ppt: "red",
    image: "blue",
    excel: "orange",
    pdf: "cyan",
    zip: "lime",
    all: "green",
    public: "green",
    some: "#faad14",
    private: "#ff4d4f",
  };

  return colors[key] as string;
};

const CreateCollection = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const formMapRef = useRef<
    React.MutableRefObject<ProFormInstance<any> | undefined>[]
  >([]);

  const [cardData, setCardData] = useState<CollectionItemType[]>([]);
  // 分页
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const getList = (
    page: number,
    pageSize: number,
    title?: string,
    file_type?: "all" | "image" | "word" | "excel" | "pdf" | "ppt" | "zip",
  ) => {
    getCollectionList({ current: page, pageSize, title, file_type }).then(
      (response) => {
        if (response.code === 200) {
          setCardData(response.data.data);
          setTotal(response.data.total);
        }
      },
    );
  };

  useEffect(() => {
    getList(1, 10);
  }, []);

  // const onEdit = (record: CollectionItemType) => {
  //   setIsOpen(true);
  //   console.log(record);
  //   // record.file_type = JSON.parse(record.file_type || "[]");
  //   record.pinned = String(Boolean(record.pinned));
  //   record.reviewers = record.reviewers.map(r=>({label:r.nickname + "-" + r.user_name,value:r.user_id}))
  //   formMapRef?.current?.forEach((formInstanceRef) => {
  //     formInstanceRef?.current?.setFieldsValue(record);
  //   });
  // };

  const onDelete = (id: number) => {
    deleteCollection(id)
      .then((response) => {
        if (response.code === 200) {
          addToast({
            color: "success",
            title: "删除成功",
            description: response.msg,
          });
          getList(current, pageSize);
        } else {
          addToast({
            color: "danger",
            title: "删除失败",
            description: response.msg,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <ProCard style={{ marginBottom: 16, textAlign: "right" }}>
        <SearchForm
          onFinish={(values) =>
            getList(current, pageSize, values.title, values.file_type)
          }
        />
      </ProCard>
      <ProList
        dataSource={cardData.map((item) => ({
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
                JSON.parse(item.file_type || "[]")?.map(
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
                  // {
                  //   label: (
                  //     <Typography.Text type={"success"}>详情</Typography.Text>
                  //   ),
                  //   key: "detail",
                  // },
                  // {
                  //   label: <div onClick={() => onEdit(item)}>编辑</div>,
                  //   key: "edit",
                  // },
                  {
                    label: (
                      <Popconfirm
                        cancelText="No"
                        description={`你确定要删除${item.title}这一项吗？`}
                        okText="Yes"
                        title={`删除${item.title}`}
                        onConfirm={() => onDelete(item.id)}
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
            key={"new"}
            color="primary"
            variant="solid"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            新建任务
          </Button>,
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
          return {
            onClick: () => {
              console.log(record);
              navigate(`/task-create/${record.id}`);
            },
          };
        }}
      />
      <Modal
        destroyOnClose
        footer={false}
        open={isOpen}
        title={"创建文件收集任务"}
        width={"800px"}
        onCancel={() => setIsOpen(false)}
      >
        <CreationForm
          formMapRef={formMapRef}
          refreshList={() => getList(current, pageSize)}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
};

export default CreateCollection;
