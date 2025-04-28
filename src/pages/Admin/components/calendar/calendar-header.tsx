import { Button } from "antd";
import { Dropdown, type MenuProps } from "antd";
import dayjs from "dayjs";
import { type ReactNode, useMemo } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { useMediaQuery } from "@/hooks";
import { up } from "@/hooks";

export type HandleMoveArg = "next" | "prev" | "today";
export type ViewType =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listWeek";
type ViewTypeMenu = {
  key: string;
  label: string;
  view: ViewType;
  icon: ReactNode;
};

type Props = {
  now: Date;
  view: ViewType;
  onMove: (action: HandleMoveArg) => void;
  onCreate: VoidFunction;
  onViewTypeChange: (view: ViewType) => void;
};
export default function CalendarHeader({
  now,
  view,
  onMove,
  onCreate,
  onViewTypeChange,
}: Props) {
  const LgBreakPoint = useMediaQuery(up("lg"));

  const items = useMemo<ViewTypeMenu[]>(
    () =>
      [
        {
          key: "1",
          label: "月",
          view: "dayGridMonth",
          icon: "",
        },
        {
          key: "2",
          label: "周",
          view: "timeGridWeek",
          icon: "",
        },
        {
          key: "3",
          label: "日",
          view: "timeGridDay",
          icon: "",
        },
        {
          key: "4",
          label: "列表",
          view: "listWeek",
          icon: "",
        },
      ] as ViewTypeMenu[],
    [],
  );

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const selectedViewType = items.find((item) => item.key === e.key);

    if (selectedViewType) {
      onViewTypeChange(selectedViewType.view);
    }
  };

  const viewTypeMenu = (view: ViewType) => {
    const viewTypeItem = items.find((item) => item.view === view);

    if (!viewTypeItem) {
      return null;
    }
    const { icon, label } = viewTypeItem;

    return (
      <div className="flex items-center">
        {icon}
        <span className="mx-1 text-sm! font-medium">{label}</span>
      </div>
    );
  };

  return (
    <div className="relative flex items-center justify-between py-5">
      {LgBreakPoint && (
        <Dropdown menu={{ items, onClick: handleMenuClick }}>
          <Button size="small" type="default">
            {viewTypeMenu(view)}
          </Button>
        </Dropdown>
      )}

      <div className="flex cursor-pointer items-center justify-center">
        <Button size="small" type="link" onClick={() => onMove("prev")}>
          <LeftOutlined />
          {/*<Icon icon="solar:alt-arrow-left-outline" size={20} />*/}
        </Button>
        <span className="mx-2 text-base font-bold">
          {dayjs(now).format("DD MMM YYYY")}
        </span>
        <Button size="small" type="link" onClick={() => onMove("next")}>
          <RightOutlined />
          {/*<Icon icon="solar:alt-arrow-right-outline" size={20} />*/}
        </Button>
      </div>

      <div className="flex items-center">
        <Button onClick={() => onMove("today")}>今日</Button>
        <Button className="ml-2" onClick={() => onCreate()}>
          <div className=" flex items-center justify-center">
            {/*<Icon icon="material-symbols:add" size={24} />*/}
            新增待办
          </div>
        </Button>
      </div>
    </div>
  );
}
