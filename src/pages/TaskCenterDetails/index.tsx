import { Card, Typography } from "antd";
import { BarsOutlined, HomeOutlined } from "@ant-design/icons";
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
      <Card className={"p-10 mb-5 border-2"}>
        <Requirements data={data.content} />
      </Card>
      <Card className={"px-10 mb-5 border-2"}>
        <MySubmit {...data} onRefresh={getData} />
      </Card>
    </>
  );
};

export default TCDetails;
