import type { EventInput } from "@fullcalendar/core";
import type { ModalProps } from "antd/es/modal/interface";
import type { Dayjs } from "dayjs";

import { Button } from "antd";
import { faker } from "@faker-js/faker";
import { ColorPicker, DatePicker, Form, Input, Modal, Switch } from "antd";
import { useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";

export type CalendarEventFormFieldType = Pick<
  EventInput,
  "title" | "allDay" | "color"
> & {
  id: string;
  description?: string;
  start?: Dayjs;
  end?: Dayjs;
};

type Props = {
  type: "edit" | "add";
  open: boolean;
  onCancel: VoidFunction;
  onEdit: (event: CalendarEventFormFieldType) => void;
  onCreate: (event: CalendarEventFormFieldType) => void;
  onDelete: (id: string) => void;
  initValues: CalendarEventFormFieldType;
};

const COLORS = [
  "#00a76f",
  "#8e33ff",
  "#00b8d9",
  "#003768",
  "#22c55e",
  "#ffab00",
  "#ff5630",
  "#7a0916",
];

export default function CalendarEventForm({
  type,
  open,
  onCancel,
  initValues = { id: faker.string.uuid() },
  onEdit,
  onCreate,
  onDelete,
}: Props) {
  const title = type === "add" ? "添加待办" : "编辑待办";
  const [form] = Form.useForm();

  useEffect(() => {
    // 当 initValues 改变时，手动更新表单的值
    const { color = COLORS[0], ...others } = initValues;

    form.setFieldsValue({ ...others, color });
  }, [initValues, form]);

  // eslint-disable-next-line react/no-unstable-nested-components, react/function-component-definition
  const ModalFooter: ModalProps["footer"] = (_, { OkBtn, CancelBtn }) => {
    return (
      <div>
        {type === "edit" ? (
          <div className="flex justify-between">
            <Button
              danger
              size="small"
              type="primary"
              onClick={() => {
                onDelete(initValues.id);
                onCancel();
              }}
            >
              <CloseOutlined />
              删除
              {/*<Icon*/}
              {/*  className="text-error!"*/}
              {/*  icon="fluent:delete-16-filled"*/}
              {/*  size={20}*/}
              {/*/>*/}
            </Button>
            <div className="flex gap-2">
              <CancelBtn />
              <OkBtn />
            </div>
          </div>
        ) : (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      </div>
    );
  };

  return (
    <Modal
      centered
      footer={ModalFooter}
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();

            const { id } = initValues;
            const event = { ...values, id };

            if (type === "add") onCreate(event);
            if (type === "edit") onEdit(event);
            onCancel();
          })
          .catch((info) => {
            console.error("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        initialValues={initValues}
        labelCol={{ span: 5 }}
        size="small"
        wrapperCol={{ span: 18 }}
      >
        <Form.Item<CalendarEventFormFieldType>
          label="标题"
          name="title"
          rules={[{ required: true, message: "请输入标题!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<CalendarEventFormFieldType> label="描述" name="description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item<CalendarEventFormFieldType>
          label="全天"
          name="allDay"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item<CalendarEventFormFieldType>
          label="开始时间"
          name="start"
          rules={[{ required: true, message: "Please input start date!" }]}
        >
          <DatePicker
            showTime
            className="w-full"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        <Form.Item<CalendarEventFormFieldType>
          label="结束时间"
          name="end"
          rules={[{ required: true, message: "Please input end date!" }]}
        >
          <DatePicker
            showTime
            className="w-full"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        <Form.Item<CalendarEventFormFieldType>
          getValueFromEvent={(e) => e.toHexString()}
          label="颜色"
          name="color"
        >
          <ColorPicker
            presets={[
              {
                label: "Recommended",
                colors: COLORS,
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
