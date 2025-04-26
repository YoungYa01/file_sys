/**
 * @author: 顶部布局
 * @author: YoungYa
 */
import { useRequest } from "ahooks";
import { Avatar, Card, Col, Row, Space, Typography } from "antd";
import { get, sample } from "lodash-es";
import { FC } from "react";
import {
  CloudOutlined, EnvironmentOutlined,
  QuestionOutlined,
  SunOutlined,
} from "@ant-design/icons";

import { USER_INFO } from "@/utils/const.ts";
import Clock from "@/pages/Admin/components/Clock.tsx";

const timeFix = (): string => {
  const time = new Date();
  const hour = time.getHours();

  return hour < 9
    ? "早上好"
    : hour <= 11
      ? "上午好"
      : hour <= 13
        ? "中午好"
        : hour < 20
          ? "下午好"
          : "夜深了";
};

const welcomeWords = (): string =>
  sample([
    "休息一会儿吧",
    "准备吃什么呢?",
    "继续加油💪",
    "我猜你可能累了",
    "认真工作吧",
    "今天又是充满活力的一天",
  ]);

const WeatherIcon = ({ code, ...props }) => {
  const iconMap = {
    "9": <CloudOutlined />, // 阴
    "1": <SunOutlined />, // 晴
    // '3': <CloudyOutlined />, // 多云
    // 其他天气代码映射...
  };

  return iconMap[code] || <QuestionOutlined {...props} />;
};

const { Title, Text } = Typography;

// https://www.seniverse.com/
const apiKey = "Sdcp14pKMKm0XNAMY"; // 心知天气 密钥

const RenderContent: FC = () => {
  // 获取全局状态
  const UserInfo = JSON.parse(localStorage.getItem(USER_INFO) || "{}");

  /**
   * @description: 查询天气实况
   */
  const { data: weatherInfo } = useRequest(async () => {
    const response = await fetch(
      `https://api.seniverse.com/v3/weather/now.json?key=${apiKey}&location=ip`,
    );

    if (response.status === 200) {
      return get(await response.json(), "results.[0]");
    }

    return {};
  });

  return (
    <>
      <Row
        align="middle"
        gutter={[36, 24]}
        justify="space-between"
        style={{ flex: 1 }}
      >
        {/* 左侧用户及天气信息 */}
        <Col flex="5">
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
            }}
          >
            <Row align="middle" gutter={[24, 8]} wrap={false}>
              {/* 用户头像 */}
              <Col>
                <Avatar
                  size={80}
                  src={import.meta.env["VITE_API_URL"] + UserInfo?.avatar}
                  style={{
                    border: "2px solid #e6f4ff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </Col>

              {/* 用户及天气信息 */}
              <Col>
                <Space direction="vertical" size={4}>
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      fontWeight: 500,
                      color: "rgba(0, 0, 0, 0.85)",
                    }}
                  >
                    {`${timeFix()}，${UserInfo?.nickname || UserInfo?.username}`}
                    <span
                      style={{
                        fontSize: 14,
                        color: "#999",
                        marginLeft: 8,
                      }}
                    >
                      {welcomeWords()}
                    </span>
                  </Title>

                  {/* 天气信息 */}
                  <Space direction="vertical" size={0}>
                    {weatherInfo && (
                      <Text className={"text-xl text-black"} type="secondary">
                        <EnvironmentOutlined style={{ color: "#1890ff" }} /> {"  "}
                        {get(weatherInfo, "location.name", "")}， 今日天气
                        {get(weatherInfo, "now.text", "")}，
                        {get(weatherInfo, "now.temperature", 0)}℃！
                      </Text>
                    )}
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 右侧统计信息 */}
        <Col flex={1}>
          <div className="flex items-center justify-center">
            <Clock />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default RenderContent;
