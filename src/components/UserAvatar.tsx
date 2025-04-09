import { Avatar } from "@heroui/react";
import { Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { TOKEN, USER_INFO } from "@/utils/const.ts";
import { LoginResponse } from "@/api/public.ts";

const UserAvatar = () => {
  const navigate = useNavigate();

  const userInfo: LoginResponse = JSON.parse(
    localStorage.getItem(USER_INFO) || "{}",
  );

  const logout = () => {
    localStorage.removeItem(USER_INFO);
    localStorage.removeItem(TOKEN);
    navigate("/login", { replace: true });
  };

  const items = [
    {
      key: "0",
      label: (
        <div className="cursor-default text-black flex">
          <div className="flex justify-center items-center border-r-1 border-gray-200 pr-2 mr-1">
            {userInfo.username}
          </div>
          <div>
            <div>{userInfo.email}</div>
            <div>{userInfo.phone}</div>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "1",
      label: <div onClick={() => navigate("/user-info")}>个人中心</div>,
      extra: <UserOutlined />,
    },
    {
      key: "2",
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      label: <div onClick={logout}>退出登录</div>,
      danger: true,
    },
  ];

  return (
    <div className="flex items-center justify-center">
      <Dropdown menu={{ items }}>
        <Avatar
          size={"md"}
          src={import.meta.env["VITE_API_URL"] + userInfo.avatar}
        />
      </Dropdown>
    </div>
  );
};

export default UserAvatar;
