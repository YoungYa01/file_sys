import {Card, Flex, Typography} from "antd";
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
  const [data, setData] = useState<CollectionItemType | { templates: string }>({
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
    templates: "",
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
          {"  "}
          截止时间：{data.end_time}
        </Typography.Paragraph>
      </>
      <Card className={"py-10 px-52 mb-5 border-2"}>
        <Requirements data={data.content} />
        {data.templates && (
          <Flex justify={"start"} gap={16} style={{margin: "auto"}} wrap>
            <Typography.Paragraph style={{ textAlign: "center" }}>
              模板:
            </Typography.Paragraph>
            {JSON.parse((data?.templates as string) || "[]")?.map(
              (item: string) => (
                <Typography.Link
                  underline
                  style={{ textAlign: "center" }}
                  onClick={() =>
                    window.open(import.meta.env["VITE_API_URL"] + item)
                  }
                >
                  {item.split("/").pop()}
                </Typography.Link>
              ),
            )}
          </Flex>
        )}
      </Card>
      <Card className={"px-10 mb-5 border-2"}>
        <MySubmit {...data} onRefresh={getData} />
      </Card>
    </>
  );
};

export default TCDetails;
