import { useMount } from "ahooks";
import { Avatar, Card, Col, Layout, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { groupBy } from "lodash-es";

import { getUserinfo } from "@/api/userinfo.ts";
import HotMap from "@/components/hotmap.tsx";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<any>({});

  const [hotmapData, setHotmapData] = useState<{date: string; count: number}[]>([]);

  useMount(async () => {
    const response = await getUserinfo();

    setUserInfo(response.data);
  });

  useEffect(() => {
    const hm = userInfo?.hot_map?.map((item: any) => ({
      date: new Date(item.submit_time).toLocaleDateString(),
      count: 1,
    }));
    const groupData = groupBy(hm, "date");

    setHotmapData(
      Object.values(groupData)?.map((item) => ({
        date: item[0].date,
        count: item?.reduce((acc, cur) => acc + cur.count, 0),
      })),
    );
  }, [userInfo]);

  return (
    <Layout style={{ width: "100%", height: "calc(100vh - 100px)" }}>
      <Row>
        <Col style={{ width: "100%", height: "150px", position: "relative" }}>
          <Avatar
            size={100}
            src={import.meta.env["VITE_API_URL"] + userInfo?.user?.avatar}
            style={{
              backgroundColor: "#fff",
              position: "absolute",
              top: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              border: "2px solid #acacac50",
              padding: "5px",
              zIndex: 1,
            }}
          >
            {userInfo?.user?.username}
          </Avatar>
        </Col>
        <Col style={{ width: "100%", padding: "0 5vw" }}>
          <Card className={"shadow text-center"}>
            <Typography.Title className={"mt-6"} level={3}>
              {userInfo?.user?.nickname} - {userInfo?.user?.username}
            </Typography.Title>
          </Card>
        </Col>
        <Col style={{ width: "100%", padding: "0 5vw" }}>
          <Card className={"shadow"}>
            <HotMap values={hotmapData} />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default UserInfo;
