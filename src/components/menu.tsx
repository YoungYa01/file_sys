import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import clsx from "clsx";
import { useContext } from "react";

import routes, { RoutesType } from "@/routes";
import { ThemeCtx } from "@/provider.tsx";
import { ThemeSwitch } from "@/components/theme-switch.tsx";
import UserAvatar from "@/components/UserAvatar.tsx";
import { USER_INFO } from "@/utils/const.ts";

type MenuItem = {
  key: string;
  label: string;
  icon?: string | React.ReactNode;
  children?: MenuItem[] | null;
  onClick?: () => void;
} | null;

const MenuBar = () => {
  const navigate = useNavigate();

  const { mode } = useContext(ThemeCtx);

  const userInfo = JSON.parse(localStorage.getItem(USER_INFO) || "{}");
  const permission = JSON.parse(userInfo.permission || "{}");


  function generateMenuItems(routes: RoutesType[] | undefined):
    | ({
        key: string;
        label: string;
        icon?: string | React.ReactNode;
        children?: MenuItem[] | null;
        onClick?: () => void;
      } | null)[]
    | undefined {
    return routes?.map((item: RoutesType): MenuItem | null => {
      if (item.hidden || !permission.includes(item.path)) {
        return null;
      }
      if (!item.children) {
        return {
          key: item.path,
          label: item.name,
          icon: item.icon,
          onClick: () => {
            navigate(item.path);
          },
        };
      } else {
        return {
          key: item.path,
          label: item.name,
          icon: item.icon,
          children: generateMenuItems(item.children),
        };
      }
    });
  }

  return (
    <div className="mr-4 w-52">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-xl mt-2">
          <img alt="Logo" className="w-10 h-10 block m-auto" src="/logo.png" />
          <span>文件管理系统</span>
        </h1>
      </div>
      <Menu
        className={clsx(
          "h-3/4 p-2",
          mode === "dark" ? "bg-black text-white" : "bg-white",
        )}
        items={generateMenuItems(
          routes.filter((route) => route.path === "/")?.[0].children,
        )}
        mode="inline"
        theme={mode === "dark" ? "dark" : "light"}
      />
      <div className="flex justify-center flex-row gap-5 border-t-1 border-t-gray-200 m-2 pt-4">
        <UserAvatar />
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default MenuBar;
