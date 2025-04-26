import { useState, useEffect } from "react";

type ClockStyle = "classic" | "modern" | "minimalist";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [style, setStyle] = useState<ClockStyle>(
    (localStorage.getItem("clockStyle") as ClockStyle) || "classic",
  );

  useEffect(() => {
    localStorage.setItem("clockStyle", style);
  }, [style]);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 计算指针角度
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = seconds * 6; // 360/60
  const minuteDegrees = minutes * 6 + seconds * 0.1; // 每分钟增加0.1度
  const hourDegrees = hours * 30 + minutes * 0.5; // 每小时30度，每分钟增加0.5度

  // 风格配置
  const styles = {
    classic: {
      face: "bg-amber-50 border-4 border-amber-800",
      numbers: "text-amber-900 font-serif",
      hands: {
        hour: "bg-amber-900 w-1.5 h-20",
        minute: "bg-amber-700 w-1 h-24",
        second: "bg-red-500 w-0.5 h-28",
      },
    },
    modern: {
      face: "bg-slate-100 border-8 border-slate-300",
      numbers: "text-slate-600 font-mono",
      hands: {
        hour: "bg-slate-800 w-2 h-20",
        minute: "bg-slate-600 w-1.5 h-24",
        second: "bg-blue-500 w-1 h-28",
      },
    },
    minimalist: {
      face: "bg-white border-2 border-gray-200",
      numbers: "text-gray-400 font-sans",
      hands: {
        hour: "bg-black w-1 h-20",
        minute: "bg-gray-600 w-0.5 h-24",
        second: "bg-transparent w-0 h-28",
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-8 overflow-hidden">
      {/* 时钟主体 */}
      <div className={`relative w-64 h-64 rounded-full ${styles[style].face}`}>
        {/* 数字刻度 */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute inset-0 ${styles[style].numbers}`}
            style={{
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                transform: `translateY(20px) rotate(-${i * 30}deg)`,
              }}
            >
              {i === 0 ? 12 : i}
            </div>
          </div>
        ))}

        {/* 时针 */}
        <div
          className={`absolute left-1/2 bottom-1/2 origin-bottom ${styles[style].hands.hour} transition-transform duration-500 ease-out`}
          style={{ transform: `translateX(-50%) rotate(${hourDegrees}deg)` }}
        />

        {/* 分针 */}
        <div
          className={`absolute left-1/2 bottom-1/2 origin-bottom ${styles[style].hands.minute} transition-transform duration-500 ease-out`}
          style={{ transform: `translateX(-50%) rotate(${minuteDegrees}deg)` }}
        />

        {/* 秒针（极简风格隐藏） */}
        {style !== "minimalist" && (
          <div
            className={`absolute left-1/2 bottom-1/2 origin-bottom ${styles[style].hands.second} transition-transform duration-100 ease-linear`}
            style={{
              transform: `translateX(-50%) rotate(${secondDegrees}deg)`,
            }}
          />
        )}

        {/* 中心点 */}
        <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div
        className={`text-2xl p-1 -mt-6 ${styles[style].numbers} rounded-xl cursor-pointer transition duration-300 hover:bg-gray-200`}
        onClick={() =>
          setStyle(
            style === "classic"
              ? "modern"
              : style === "modern"
                ? "minimalist"
                : "classic",
          )
        }
      >
        {time.toLocaleTimeString()}
      </div>
      {/* 风格切换按钮 */}
      {/*<div className="flex gap-4">*/}
      {/*  {( as ClockStyle[]).map((s) => (*/}
      {/*    <button*/}
      {/*      key={s}*/}
      {/*      className={`px-4 py-2 rounded-full capitalize ${*/}
      {/*        style === s*/}
      {/*          ? "bg-blue-500 text-white"*/}
      {/*          : "bg-gray-200 hover:bg-gray-300"*/}
      {/*      }`}*/}
      {/*      onClick={() => setStyle(s)}*/}
      {/*    >*/}
      {/*      {s}*/}
      {/*    </button>*/}
      {/*  ))}*/}
      {/*</div>*/}
    </div>
  );
};

export default Clock;
