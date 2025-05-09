import { Link } from "@heroui/link";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { WaterMark } from "@ant-design/pro-components";

import MenuBar from "@/components/menu.tsx";
import { TOKEN, USER_INFO } from "@/utils/const.ts";

export default function DefaultLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const UserInfo = JSON.parse(
    localStorage.getItem(USER_INFO) || '{"username":""}',
  );

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/dashboard");
    }
    const token = localStorage.getItem(TOKEN) || "";

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [location]);

  return (
    <div className="relative flex flex-col h-screen">
      <WaterMark content={UserInfo.username}>
        <main className="w-full mx-auto flex-grow flex flex-row">
          <MenuBar />
          <div className="flex-grow p-5 h-screen overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <Outlet />
            <footer className="w-full text-xs flex items-center justify-center py-3">
              <Link
                isExternal
                className="text-xs flex items-center gap-1 text-current"
                href="http://youngya.top"
                title="heroui.com homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">YoungYa</p>
                <span className="text-default-600">
                  Copyright © {new Date().getFullYear()}
                </span>{" "}
              </Link>
              <Link
                className="text-xs ml-2"
                href="https://beian.miit.gov.cn/"
                target={"_blank"}
              >
                蜀ICP备2023021028号-1
              </Link>
            </footer>
          </div>
        </main>
      </WaterMark>
    </div>
  );
}
