import { ProCard } from "@ant-design/pro-components";
import { Tabs, Typography } from "antd";
import {
  BarsOutlined,
  FileSearchOutlined,
  HomeOutlined,
  MessageOutlined,
  MutedOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Requirements from "@/components/Requirements";
import { CollectionItemType, getCollectionDetails } from "@/api/collection.ts";
import MySubmit from "@/pages/TaskCenterDetails/MySubmit.tsx";

const TCDetails = () => {
  // 获取路由参数
  const location = useLocation();
  const taskId = location.pathname.split("/").pop();
  // 数据
  const [data, setData] = useState<CollectionItemType>({
    title: "",
    content: "",
    file_type: "",
    access: "",
    access_pwd: "",
    file_number: 0,
    status: 0,
    pinned: "",
    submitted_number: 0,
    total_number: 0,
    founder: 0,
    Founder: {
      username: "",
    },
  });

  const getData = () => {
    getCollectionDetails(Number(taskId))
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const items = [
    {
      key: "1",
      label: "工作要求",
      icon: <HomeOutlined />,
      children: (
        <Requirements
          data={data.content}
          style={{ height: "calc(100vh - 250px)", overflowY: "scroll" }}
        />
      ),
    },
    {
      key: "2",
      label: "材料提交",
      icon: <BarsOutlined />,
      children: <MySubmit {...data} onRefresh={getData} />,
    },
    // {
    //   key: "3",
    //   label: "审核记录",
    //   icon: <FileSearchOutlined />,
    //   children: (
    //     <ProCard>
    //       <Typography.Paragraph>暂无审核记录</Typography.Paragraph>
    //     </ProCard>
    //   ),
    // },
    // {
    //   key: "4",
    //   label: "公告",
    //   icon: <MutedOutlined />,
    //   children: (
    //     <ProCard>
    //       <Typography.Paragraph>暂无公告</Typography.Paragraph>
    //     </ProCard>
    //   ),
    // },
    // {
    //   key: "5",
    //   label: "评论",
    //   icon: <MessageOutlined />,
    //   children: (
    //     <ProCard>
    //       <Typography.Paragraph>暂无评论</Typography.Paragraph>
    //     </ProCard>
    //   ),
    // },
  ];

  return (
    <>
      <>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          {data.title}
        </Typography.Title>
        <Typography.Paragraph style={{ textAlign: "center" }}>
          发布人：{data.founder?.username}
          {"  "}
          审核人：
          {data.reviewers?.map((item: any) => item.user_name).join(", ")}
        </Typography.Paragraph>
      </>
      <Tabs items={items} size={"large"} />
    </>
  );
};

export default TCDetails;
