import {
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormInstance,
  ProFormSegmented,
} from "@ant-design/pro-components";
import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  StepsForm,
} from "@ant-design/pro-components";
import { Alert } from "antd";
import { useRef } from "react";
import { addToast, closeAll } from "@heroui/react";

import { OrganizationType } from "@/api/organization.ts";
import OrgUserSelect from "@/pages/CreateCollection/OrgUserSelect.tsx";
import { CollectionItemType, createCollection } from "@/api/collection.ts";
import RichEditor from "@/components/RichEditor.tsx";

type Props = {
  onClose: () => void;
  refreshList: () => void;
  formMapRef: React.MutableRefObject<Record<string, any>>;
};

const resolveData = (
  list: OrganizationType[],
): (
  | {
      label: string;
      value: number;
      children: (
        | { label: string; value: null; children: any[] }
        | { label: string; value: number }
      )[];
    }
  | {
      label: string;
      value: number;
      children: { label: string; value: number }[];
    }
)[] => {
  return list.map((item: OrganizationType) => {
    const us = item.users.map((item: { id: number; username: string }) => ({
      label: item.username,
      value: item.id,
    }));

    if (item.children) {
      return {
        label: item.org_name,
        value: -item.id,
        children: [...resolveData(item.children), ...us],
      };
    } else {
      return {
        label: item.org_name,
        value: -item.id,
        children: [...us],
      };
    }
  });
};

const CreationForm = ({ onClose, refreshList, formMapRef }: Props) => {
  const formRef = useRef<ProFormInstance>();

  const onFinish = async (values: CollectionItemType) => {
    const req = {
      ...values,
      end_time: values.end_time,
      pinned: Number(values.pinned === "true"),
      submitters: values.submitters
        ? values.submitters
            .map((item: string) => {
              const [type, id] = item.split("-");

              return type === "user" ? Number(id) : null;
            })
            .filter(Boolean)
        : null,
      reviewers: values.reviewers
        .map((item: string) => {
          const [type, id] = item.split("-");

          return type === "user" ? Number(id) : null;
        })
        .filter(Boolean),
      file_type: JSON.stringify(values.file_type),
    };

    createCollection(req)
      .then((response) => {
        closeAll();
        if (response.code === 200) {
          onClose();
          refreshList();
          addToast({
            color: "success",
            title: "创建成功",
            description: response.msg,
          });
        } else {
          addToast({
            color: "danger",
            title: "创建失败",
            description: response.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <StepsForm formMapRef={formMapRef} formRef={formRef} onFinish={onFinish}>
      <StepsForm.StepForm
        name={"task-info"}
        style={{ width: 600, paddingBottom: 80 }}
        title={"任务信息"}
      >
        {/* 标题 */}
        <ProFormText
          label="标题"
          name="title"
          placeholder="请输入任务标题"
          rules={[{ required: true, message: "请输入任务标题!" }]}
        />
        {/* 要求描述 */}
        <ProForm.Item
          label="要求"
          name="content"
          rules={[{ required: true, message: "请输入要求描述!" }]}
          tooltip={"文档描述支持富文本格式!"}
        >
          {/*<QuillEditor height={300} />*/}
          <RichEditor />
        </ProForm.Item>
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name={"config"}
        style={{ width: 600, minHeight: 500 }}
        title={"基本配置"}
      >
        {/* 文件类型 and 截止时间 */}
        <ProForm.Group>
          <ProFormSelect
            label="类型"
            mode={"multiple"}
            name="file_type"
            rules={[{ required: true, message: "请选择文档类型!" }]}
            style={{ width: 300 }}
            tooltip={"文档类型支持多选!"}
            valueEnum={{
              all: "任意类型",
              image: "图片文件",
              word: "Word 文档",
              excel: "Excel 表格",
              pdf: "PDF 文档",
              ppt: "PPT 幻灯片",
              zip: "ZIP 压缩包",
            }}
          />
          <ProFormDigit
            initialValue={1}
            label="文件数量"
            min={1}
            name="file_number"
            tooltip={"文件数量限制, 默认为 1"}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDateTimePicker
            fieldProps={{
              format: "YYYY-MM-DD HH:mm:ss",
            }}
            label="截止时间"
            name="end_time"
            rules={[{ required: true, message: "请选择截止时间!" }]}
            style={{ width: 300 }}
            tooltip={"收集任务的截止时间"}
            width={300}
          />
          {/* 是否置顶 */}
          <ProFormSegmented
            initialValue={"false"}
            label="置顶"
            name="pinned"
            valueEnum={{
              true: "是",
              false: "否",
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          {/* 访问权限 */}
          <ProFormSegmented
            initialValue={"public"}
            label="访问权限"
            name="access"
            valueEnum={{
              public: "公共",
              private: "私有",
              some: "指定人员",
            }}
          />
        </ProForm.Group>
        <ProFormDependency name={["access"]}>
          {({ access }) => {
            if (access === "private") {
              return (
                <ProFormText
                  allowClear
                  label="访问密码"
                  name="access_pwd"
                  rules={[{ required: true, message: "请私有访问访问密码!" }]}
                />
              );
            } else if (access === "some") {
              return <OrgUserSelect multiple />;
            }

            return (
              <Alert
                showIcon
                description="您选择的公开访问权限任何人员均可进行提交"
                message="公开访问权限"
                type="info"
              />
            );
          }}
        </ProFormDependency>
        {/* 审核人*/}
        <OrgUserSelect
          multiple
          label="审核人"
          maxCount={1}
          name="reviewers"
          rules={[{ required: true, message: "请选择审核人" }]}
          tooltip="按照选择顺序进行审核"
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default CreationForm;
