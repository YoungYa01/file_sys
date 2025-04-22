import { addToast, closeAll, Form, Input } from "@heroui/react";
import { Button } from "@heroui/button";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { login, LoginResponse } from "@/api/public.ts";
import { ThemeCtx } from "@/provider.tsx";
import { HttpResponse } from "@/utils/types";
import { TOKEN, USER_INFO } from "@/utils/const.ts";
import LoginCarousel from "@/components/LoginCarousel.tsx";

const Login = () => {
  const navigate = useNavigate();

  const { setToastPlacement } = useContext(ThemeCtx);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onPress = async () => {
    const response = await login({ username, password });
    console.log("response", response)
    if (response.code === 200) {
      handleLogin(response);
    } else {
      setToastPlacement("top-center");
      closeAll();
      addToast({
        title: "登录失败",
        description: response.msg,
        color: "danger",
      });
    }
  };

  const handleLogin = (response: HttpResponse<LoginResponse>) => {
    setToastPlacement("top-right");
    closeAll();
    addToast({
      title: "登录成功",
      description: response.msg,
      color: "success",
    });

    localStorage.setItem(TOKEN, response.data.token);
    localStorage.setItem(USER_INFO, JSON.stringify(response.data));

    navigate("/dashboard");
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-200 md:flex-row">
      <LoginCarousel />
      <div className="w-full max-w-md px-6 py-32 flex justify-around items-center flex-col bg-white rounded-2xl shadow-md drop-shadow dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:shadow-gray-800/40">
        <div className="flex w-full justify-center">
          <img alt="Logo" className="w-10 h-10 mb-10" src="/logo.png" />
          <h3 className="text-3xl mb-5">文件管理系统</h3>
        </div>
        <Form className="w-96 max-w-xs">
          <Input
            label="账号"
            name="email"
            variant="bordered"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="密码"
            name="password"
            type="password"
            variant="bordered"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button color="primary" variant="shadow" onPress={onPress}>
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
