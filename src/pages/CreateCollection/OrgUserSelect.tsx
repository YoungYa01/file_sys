import { useEffect, useState } from "react";
import { ProFormTreeSelect } from "@ant-design/pro-components";

import { getOrgUserTree } from "@/api/organization.ts";

const convertToTreeSelectData = (departments) => {
  if (!departments) return [];

  return departments.map(
    (dept: { org_name: any; id: any; users: any[]; children: any }) => {
      // 转换部门节点
      const departmentNode = {
        title: dept.org_name,
        value: `dept-${dept.id}`,
        selectable: false,
        children: [],
        isLeaf: false,
      };
      // 转换用户节点
      const userNodes = dept.users.map((user) => ({
        title: user.nickname + "-" + user.username,
        value: `user-${user.id}`,
        isLeaf: true,
      }));
      // 递归转换子部门
      const childrenDepartments = convertToTreeSelectData(dept.children || []);

      // 合并用户节点和子部门节点
      departmentNode.children = [...userNodes, ...childrenDepartments];
      if (!departmentNode.children.length) {
        departmentNode["disable"] = true;
      }

      return departmentNode;
    },
  );
};

/**
 * @description: 组织及人员
 * @author: YoungYa
 */
export default function OrgUserSelect({ multiple = false, ...props }) {
  const [treeData, setTreeData] = useState([]);
  /**
   * @description: 获取用户列表
   * @author: YoungYa
   */
  const getData = async () => {
    const response = await getOrgUserTree();
    const orgUserList = convertToTreeSelectData(response.data);

    setTreeData(orgUserList);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ProFormTreeSelect
      colProps={{ span: 24 }}
      fieldProps={{
        treeData,
        showSearch: true,
        treeCheckable: multiple,
        treeNodeFilterProp: "title",
        virtual: true,
        treeExpandAction: "click",
        fieldNames: {
          label: "title",
          value: "value",
          children: "children",
        },
        maxTagCount: 5,
        ...props,
      }}
      label={"指定人员"}
      name="submitters"
      placeholder={"指定人员"}
      rules={[
        {
          required: true,
          message: "请选择需提交材料的人员",
        },
      ]}
      width={500}
      {...props}
    />
  );
}
