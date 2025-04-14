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

import QuillEditor from "@/components/QuillEditor";

type Props = {
  onClose: () => void;
  refreshList: () => void;
};
//
const CreationForm = ({ onClose }: Props) => {
  const formRef = useRef<ProFormInstance>();

  //
  //   useImperativeHandle(ref, () => ({
  //     submit() {
  //       return formRef.current?.getFieldsValue?.();
  //     },
  //     setFormValues(values) {
  //       formRef.current?.setFieldsValue(values);
  //     },
  //   }));
  //   /**
  //    * @description: 获取用户列表
  //    * @author: YoungYa
  //    */
  //   const { data: userList } = useRequest(
  //     async (params) => get(await getUserList(params), "data.list", []),
  //     {
  //       defaultParams: [{ current: 1, pageSize: 99999 }],
  //     },
  //   );
  //   // 获取全局状态
  //   const {
  //     initialState: { CurrentUser },
  //   } = useModel("@@initialState");
  //
  //   useEffect(() => {
  //     console.log(CurrentUser);
  //   }, []);
  //
  return (
    <StepsForm
      formRef={formRef}
      onFinish={async (values) => {
        // try {
        //   const response = await createFileCollectionTask(
        //     values as FileCollectionProps,
        //   );
        //
        //   if (response.code === 200) {
        //     message.success("创建成功!");
        //     props.refreshList();
        //     props.onClose();
        //   }
        // } catch (err) {
        //   message.error("创建失败!");
        // }
      }}
    >
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
          <QuillEditor height={300} />
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
            label="截止时间"
            name="end_time"
            style={{ width: 300 }}
            tooltip={"收集任务的截止时间, 如果不设置则为长期有效"}
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
              return "<OrgUserSelect multiple />";
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
        {`<OrgUserSelect
          initialValue={CurrentUser.user_id}
          label="审核人"
          name="reviewer_id"
          rules={[{ required: true, message: "请选择审核人" }]}
        />`}
        {/*<ProFormSelect*/}
        {/*  name="reviewer_id" label="审核人"*/}
        {/*  mode="single" initialValue={CurrentUser.user_id}*/}
        {/*  options={userList?.map((u: API.USERMANAGEMENT) => ({label: u.cn_name, value: u.user_id})) || []}*/}
        {/*  fieldProps={{showSearch: true}}*/}
        {/*  rules={[{required: true, message: '请选择审核人'}]}*/}
        {/*/>*/}
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default CreationForm;
