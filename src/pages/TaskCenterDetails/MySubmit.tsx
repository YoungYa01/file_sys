import { Button, Col, Flex, Form, Result, Row, Statistic } from "antd";
import {
  ProForm,
  ProFormText,
  ProFormUploadDragger,
} from "@ant-design/pro-components";
import { addToast, Card, closeAll } from "@heroui/react";
import { useState } from "react";

import { CollectionItemType, submitCollection } from "@/api/collection.ts";
import { TOKEN, USER_INFO } from "@/utils/const";
import { ForbidIcon, SubmittedIcon, TimeEndIcon } from "@/components/icons.tsx";

type Props ={
  onRefresh: () => void;
} & CollectionItemType;

const MySubmit = (props: Props) => {
  const UserInfo = JSON.parse(localStorage.getItem(USER_INFO) || "{}");
  const [passed, setPassed] = useState(false);

  const fileType = JSON.parse(props.file_type || "[]");

  const timeNow = new Date().getTime();

  // 判断时间是否已经截止
  if (timeNow > new Date(props.end_time).getTime()) {
    return (
      <Result
        icon={
          <Flex align={"center"} justify={"center"}>
            <TimeEndIcon size={400} />
          </Flex>
        }
        title="时间已截止, 无法提交"
      />
    );
  }

  if (
    (props.access === "some" &&
      props.submitters &&
      !props.submitters?.map((item) => item.user_id).includes(UserInfo.id)) ||
    (props.access === "some" && !props.submitters)
  ) {
    return (
      <Result
        icon={
          <Flex align={"center"} justify={"center"}>
            <ForbidIcon />
          </Flex>
        }
        title="不好意思，您没有权限访问"
      />
    );
  }

  if (props.access === "private" && !passed) {
    return (
      <Flex justify={"center"} style={{ width: "100%", padding: "50px" }}>
        <Card style={{ padding: "28px" }}>
          <ProForm
            submitter={false}
            onFinish={(value) => {
              closeAll();
              if (value.access_pwd === props.access_pwd) {
                addToast({
                  color: "success",
                  title: "密码正确",
                });
                setPassed(true);
              } else {
                addToast({
                  color: "danger",
                  title: "密码错误",
                });
              }
            }}
          >
            <ProFormText.Password
              fieldProps={{
                size: "large",
              }}
              label={"访问密码"}
              name={"access_pwd"}
              placeholder={"请输入访问密码"}
              width={"lg"}
            />
            <Form.Item style={{ textAlign: "center", padding: "0 50px" }}>
              <Button block htmlType={"submit"} size={"large"} type={"primary"}>
                提交
              </Button>
            </Form.Item>
          </ProForm>
        </Card>
      </Flex>
    );
  }

  type ValueType = {
    file: { name: string; response: { data: string }; url: string }[];
  };
  const onFinish = (value: ValueType) => {
    submitCollection({
      collection_id: props.id,
      file: value.file.map((item) => ({
        file_name: item.name,
        file_path: item.url || item.response.data,
      })),
    }).then((response) => {
      closeAll();
      if (response.code === 200) {
        addToast({
          color: "success",
          title: "提交成功",
        });
        props.onRefresh?.();
      } else {
        addToast({
          color: "danger",
          title: "提交失败",
        });
      }
    });
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="文件类型"
            value={fileType.includes("all") ? "任意类型" : fileType.join("、")}
          />
        </Col>
        <Col span={8}>
          <Statistic title="数量" value={props.file_number} />
        </Col>
        {props.submitted_files.filter((item) => item.task_status === 2)
          .length === props.file_number && (
          <>
            <Col span={8}>
              <Statistic
                title="提交时间"
                value={new Date(
                  props.submitted_files[0].submit_time,
                ).toLocaleString()}
              />
            </Col>
          </>
        )}
      </Row>
      {props.submitted_files.filter((item) => item.task_status === 2)
        .length && (
        <div className="flex justify-center items-center flex-col my-12">
          <SubmittedIcon size={200} />
          <div className="text-2xl">
            您已经成功提交了
            {
              props.submitted_files.filter((item) => item.task_status === 2)
                .length
            }
            个文件
          </div>
        </div>
      )}
      {props.submitted_files.filter((item) => item.task_status === 2).length !==
        props.file_number && (
        <ProForm
          style={{ padding: "30px 20px" }}
          submitter={false}
          onFinish={onFinish}
        >
          <ProFormUploadDragger
            action={`/api/upload`}
            disabled={
              props.submitted_files.filter((item) => item.task_status === 2)
                .length === props.file_number
            }
            fieldProps={{
              defaultFileList: props.submitted_files
                .filter((item) => item.task_status === 2)
                .map((item) => ({
                  uid: item.id,
                  name: item.file_name,
                  status: "done",
                  url: item.file_path,
                  thumbUrl: import.meta.env["VITE_API_URL"] + item.file_path,
                })),
              headers: {
                token: localStorage.getItem(TOKEN),
              },
              listType: "picture-card",
              name: "file",
              onChange: (info) => {
                if (info.file.status === "done") {
                  if (
                    info.file.response.code === 200 &&
                    info.file.response.data
                  ) {
                    addToast({
                      color: "success",
                      description: info.file.response.msg,
                    });
                  } else {
                    addToast({
                      color: "danger",
                      description: info.file.response.msg,
                    });
                  }
                }
              },
            }}
            help={`支持${fileType.includes("all") ? "所有" : fileType.join("、")}格式，不超过1GB`}
            max={props.file_number}
            name={"file"}
          />
          <div className={"w-full flex"}>
            <Button
              className="sm:w-full w-1/2"
              htmlType={"submit"}
              type={"primary"}
            >
              提交
            </Button>
          </div>
        </ProForm>
      )}
    </div>
  );
};

export default MySubmit;
