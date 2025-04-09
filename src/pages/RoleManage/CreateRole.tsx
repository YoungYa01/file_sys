import { Form, Modal } from "antd";
import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { addToast, closeAll } from "@heroui/react";

import routes from "@/routes";
import { createRole } from "@/api/role.ts";

type PropsType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onReload: () => void;
};

const CreateRole = ({ isOpen, setIsOpen, onReload }: PropsType) => {
  const [form] = Form.useForm();
  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    values.permission = JSON.stringify(values.permission);

    createRole(values).then((response) => {
      if (response.code === 200) {
        closeAll();
        addToast({
          color: "success",
          title: "创建成功",
          description: response.msg,
        });
        form.resetFields();
        onReload();
        setIsOpen(false);
      } else {
        addToast({
          color: "danger",
          title: "创建失败",
          description: response.msg,
        });
      }
    });
    console.log(values);
  };

  return (
    <>
      <Modal
        maskClosable={false}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={handleSubmit}
      >
        <ProForm
          form={form}
          initialValues={{
            role_name: "",
            description: "",
            sort: 1,
            permission: [],
            status: "1",
          }}
          submitter={false}
        >
          <ProFormText label={"角色"} name={"role_name"} />
          <ProFormTextArea label={"描述"} name={"description"} />
          <ProFormDigit label={"排序"} min={1} name={"sort"} />
          <ProFormSelect
            label={"权限"}
            mode="multiple"
            name={"permission"}
            options={routes
              .filter((route) => route.path === "/")?.[0]
              .children.map((item) => {
                return {
                  label: item.name,
                  value: item.path,
                };
              })}
          />
          <ProFormSelect
            label={"状态"}
            name={"status"}
            valueEnum={{
              0: { text: "禁用", status: "Error" },
              1: { text: "正常", status: "Success" },
            }}
          />
        </ProForm>
      </Modal>
    </>
  );
};

export default CreateRole;
