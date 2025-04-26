import React, { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./hotmap.css";

const HotMap = ({
  values = [
    { date: "2024-03-01", count: 5 },
    { date: "2024-01-22", count: 2 },
    { date: "2024-01-30", count: 3 },
  ],
}) => {
  console.log(values)
  const [tooltipData, setTooltipData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 处理鼠标进入事件
  const handleMouseEnter = (event, value) => {
    if (value) {
      setTooltipData(value);
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  return (
    <div>
      <CalendarHeatmap
        showMonthLabels
        showWeekdayLabels
        classForValue={(value) => {
          if (!value) return "color-empty";

          return value.count < 10
            ? `color-scale-${value.count}`
            : "color-scale-10";
        }}
        endDate={Date.now()}
        gutterSize={1.5}
        monthLabels={[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]}
        startDate={new Date("2024-01-01")}
        transformDayElement={(element, value) =>
          React.cloneElement(element, {
            onMouseMove: (e) => handleMouseEnter(e, value),
            onMouseLeave: handleMouseLeave,
            style: { cursor: value ? "pointer" : "default" },
          })
        }
        values={values}
        weekdayLabels={["周一", "周二", "周三", "周四", "周五", "周六", "周日"]}
      />
      <svg
        className={"react-calendar-heatmap"}
        height={24}
        style={{ transform: "translate(0, -100%)" }}
        viewBox="0 0 500 20"
        width={500}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <text fontSize={20} style={{ fontSize: 20 }} x="0" y="15">
            提交次数
          </text>
        </g>
        <g>
          <rect className="color-empty" height={18} width={18} x={100} y={0} />
        </g>
        <g>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((item, i) => (
            <rect
              key={item}
              className={`color-scale-${item}`}
              height={18}
              width={18}
              x={20 * (i + 6)}
            />
          ))}
        </g>
      </svg>

      {/* 自定义提示框 */}
      {tooltipData && (
        <div
          style={{
            position: "fixed",
            left: position.x + 15,
            top: position.y + 15,
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 999,
            transition: "all 0.1s ease",
          }}
        >
          <div>日期：{tooltipData.date}</div>
          <div>次数：{tooltipData.count}次</div>
        </div>
      )}
    </div>
  );
};

export default HotMap;
