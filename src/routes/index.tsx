import { ReactNode } from "react";
import {
  BarsOutlined,
  CarryOutOutlined,
  DeploymentUnitOutlined,
  GlobalOutlined,
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
        path: "task-center",
        element: <div>任务中心</div>,
        name: "任务中心",
        icon: <DeploymentUnitOutlined />,
      },
      {
        path: "task-create",
        element: <CreateCollection />,
        name: "创建收集任务",
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
