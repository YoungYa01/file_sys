import { ReactNode } from "react";
import {
  BarsOutlined,
  CarryOutOutlined,
  ControlOutlined,
  DeploymentUnitOutlined,
  GlobalOutlined,
  GoldOutlined,
  HomeOutlined,
  KeyOutlined,
  TeamOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

import Login from "@/pages/Login";
import AdminHome from "@/pages/Admin";
import DefaultLayout from "@/layouts/default.tsx";
import CarouselManage from "@/pages/CarouselManage";
import UserManage from "@/pages/UserManage";
import UserInfo from "@/pages/UserInfo";
import RoleManage from "@/pages/RoleManage";
import Notification from "@/pages/Notification";
import CreateCollection from "@/pages/CreateCollection";
import Organization from "@/pages/Organization";
import LogManage from "@/pages/LogManage";
import CollectionDetails from "@/pages/CollectionDetails";
import TaskCenter from "@/pages/TaskCenter";
import TCDetails from "@/pages/TaskCenterDetails";

export type RoutesType = {
  path: string;
  element: JSX.Element;
  name: string;
  key?: string;
  hidden?: boolean;
  redirect?: string;
  icon?: string | ReactNode;
  children?: RoutesType[];
};

const Routes: RoutesType[] = [
  {
    path: "/login",
    element: <Login />,
    name: "登录",
    hidden: true,
  },
  {
    path: "/",
    element: <DefaultLayout />,
    name: "/",
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        element: <AdminHome />,
        name: "首页",
        icon: <HomeOutlined />,
      },
      {
        path: "notification",
        element: <Notification />,
        name: "通知管理",
        icon: <BarsOutlined />,
      },
      {
        path: "carousel-manage",
        element: <CarouselManage />,
        name: "轮播图管理",
        icon: <WindowsOutlined />,
      },
      {
        path: "user-manage",
        element: <UserManage />,
        name: "用户管理",
        icon: <TeamOutlined />,
      },
      {
        path: "role-manage",
        element: <RoleManage />,
        name: "角色管理",
        icon: <KeyOutlined />,
      },
      {
        path: "organization-manage",
        element: <Organization />,
        name: "组织部门",
        icon: <GoldOutlined />,
      },
      {
        path: "log-manage",
        element: <LogManage />,
        name: "操作日志",
        icon: <ControlOutlined />,
      },
      {
        path: "task-center",
        element: <TaskCenter/>,
        name: "任务中心",
        icon: <DeploymentUnitOutlined />,
      },
      {
        path: "task-center/:id",
        element: <TCDetails/>,
        name: "任务详情",
        icon: <DeploymentUnitOutlined />,
      },
      {
        path: "task-create",
        element: <CreateCollection />,
        name: "发布任务",
        icon: <CarryOutOutlined />,
      },
      {
        path: "task-create/:id",
        element: <CollectionDetails />,
        name: "收集任务详情",
        icon: <CarryOutOutlined />,
      },
      {
        path: "audit-center",
        element: <div>审核中心</div>,
        name: "审核中心",
        icon: <GlobalOutlined />,
      },
      {
        path: "my-task",
        element: <div>我的任务</div>,
        name: "我的任务",
        icon: <BarsOutlined />,
      },
      {
        path: "user-info",
        element: <UserInfo />,
        name: "用户信息",
        hidden: true,
      },
    ],
  },
];

export default Routes;
