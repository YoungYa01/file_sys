import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { ToastProvider } from "@heroui/react";
import { createContext, useState } from "react";
import { ConfigProvider, theme } from "antd";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

type ToastPlacement =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center";

export const ThemeCtx = createContext({
  mode: "light",
  toastPlacement: "top-center",
  setMode: (mode: string) => {
    mode;
  },
  setToastPlacement: (placement: ToastPlacement) => {
    placement;
  },
});

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("light");
  const [toastPlacement, setToastPlacement] =
    useState<ToastPlacement>("top-center");

  return (
    <ThemeCtx.Provider
      value={{ toastPlacement, mode, setMode, setToastPlacement }}
    >
      <ConfigProvider
        theme={{
          algorithm:
            mode === "dark"
              ? [theme.darkAlgorithm, theme.compactAlgorithm]
              : [],
          components: {
            Segmented: {
              itemSelectedBg: "rgb(26,122,255)",
              itemSelectedColor: "rgba(255,255,255,0.88)",
            },
          },
        }}
      >
        <HeroUIProvider navigate={navigate} useHref={useHref}>
          <ToastProvider placement={toastPlacement} />
          {children}
        </HeroUIProvider>
      </ConfigProvider>
    </ThemeCtx.Provider>
  );
}
