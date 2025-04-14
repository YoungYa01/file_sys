import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Form, Image, Avatar, Upload, Popconfirm } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  addToast,
  closeAll,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useRef, useState } from "react";

import { CarouselItemType, getCarouselList } from "@/api/public.ts";
import { uploadFile } from "@/api/utils.ts";
import {
  createCarousel,
  deleteCarousel,
  updateCarousel,
} from "@/api/carousel.ts";
import { randomColor } from "@/utils/randomColor.ts";

const CarouselManage = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [form] = Form.useForm();

  const actionRef = useRef();

  const [header, setHeader] = useState("");
  const [filePath, setFilePath] = useState("");
  const [type, setType] = useState("edit");

  const handleDelete = (id: number) => {
    deleteCarousel(id).then((response) => {
      if (response.code === 200) {
        closeAll();
        addToast({
          color: "success",
          title: "删除成功",
          description: response.msg,
        });
        actionRef.current?.reload();
        onClose();
      } else {
        addToast({
          color: "danger",
          title: "删除失败",
          description: response.msg,
        });
      }
    });
  };

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
    },
    {
      title: "轮播图",
      dataIndex: "img",
      search: false,
      render: (_: any, record: { url: string }) => (
        <div className="h-[100px] w-[150px] overflow-hidden">
          <Image
            alt="轮播图"
            src={import.meta.env["VITE_API_URL"] + record.url}
            style={{ height: "100px" }}
          />
        </div>
      ),
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "排序",
      dataIndex: "sort",
      search: false,
      render: (text: string) => (
        <Avatar style={{ backgroundColor: randomColor() }}>{text}</Avatar>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      search: false,
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (_: string, record: CarouselItemType) => (
        <>
          <Button
            type={"link"}
            onClick={() => {
              onOpen();
              setType("edit");
              setHeader("编辑幻灯片");
              form.setFieldsValue(record);
              setFilePath(record.url);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            cancelText="取消"
            description="确定删除吗？"
            okText="确定"
            title={null}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button key="delete" type={"link"}>
              <span className={"text-red-500"}>删除</span>
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleAddNew = () => {
    const values = { ...form.getFieldsValue(), url: filePath };

    createCarousel(values).then((response) => {
      if (response.code === 200) {
        closeAll();
        addToast({
          color: "success",
          title: "添加成功",
          description: response.msg,
        });
        form.resetFields();
        actionRef.current?.reload();
        setFilePath("");
        onClose();
      } else {
        addToast({
          color: "danger",
          title: "添加失败",
          description: response.msg,
        });
      }
    });
  };

  const handleEdit = () => {
    const values = { ...form.getFieldsValue(), url: filePath };

    updateCarousel(values).then((response) => {
      if (response.code === 200) {
        closeAll();
        addToast({
          color: "success",
          title: "修改成功",
          description: response.msg,
        });
        form.resetFields();
        actionRef.current?.reload();
        setFilePath("");
        onClose();
      } else {
        addToast({
          color: "danger",
          title: "修改失败",
          description: response.msg,
        });
      }
    });
  };

  return (
    <>
      <ProTable
        cardBordered
        actionRef={actionRef}
        columns={columns}
        headerTitle="首页幻灯片"
        pagination={{
          pageSize: 5,
        }}
        request={async (params) => {
          const response = await getCarouselList(params);

          return {
            data: response.data.data,
            success: true,
            total: response.data.total,
          };
        }}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="primary"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setType("add");
              setHeader("新建幻灯片");
              onOpen();
            }}
          >
            新建
          </Button>,
        ]}
      />
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {header}
              </ModalHeader>
              <ModalBody>
                <ProForm
                  form={form}
                  initialValues={{
                    title: "",
                    description: "",
                    sort: 1,
                  }}
                  submitter={false}
                >
                  <ProFormText hidden name={"id"} />
                  <Form.Item label={"图片"}>
                    {filePath && (
                      <div className="relative">
                        <Image
                          height={200}
                          src={import.meta.env["VITE_API_URL"] + filePath}
                        />
                        <Button
                          className="absolute left-0 top-0 text-red-500"
                          type={"text"}
                          onClick={() => setFilePath("")}
                        >
                          <CloseOutlined />
                        </Button>
                      </div>
                    )}
                    <Upload
                      beforeUpload={(file) => {
                        const formData = new FormData();

                        formData.append("file", file);
                        uploadFile(formData).then((res) => {
                          if (res.code === 200) {
                            setFilePath(res.data);

                            return;
                          }
                          addToast({
                            color: "danger",
                            title: "上传失败",
                            description: res.msg,
                          });
                        });

                        return false;
                      }}
                    >
                      <Button>上传图片</Button>
                    </Upload>
                  </Form.Item>
                  <ProFormText label={"标题"} name={"title"} />
                  <ProFormText label={"描述"} name={"description"} />
                  <ProFormDigit
                    label={"排序"}
                    min={1}
                    name={"sort"}
                    tooltip={"默认为1，数字越小越靠前"}
                  />
                </ProForm>
              </ModalBody>
              <ModalFooter>
                <Button
                  type={"primary"}
                  onClick={type === "edit" ? handleEdit : handleAddNew}
                >
                  确定
                </Button>
                <Button type={"text"} onClick={onClose}>
                  关闭
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CarouselManage;
