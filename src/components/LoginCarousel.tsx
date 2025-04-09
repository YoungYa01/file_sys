import { Carousel } from "antd";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { CarouselItemType, getCarouselList } from "@/api/public.ts";

const LoginCarousel = () => {
  const [list, setList] = useState<CarouselItemType[]>([]);

  useEffect(() => {
    getCarouselList().then((res) => {
      setList(res.data.data);
    });
  }, []);

  return (
    <div className="w-1/2 m-6 hidden lg:block xl:block md:hidden shadow-2xl backdrop-blur-xl">
      <Carousel
        adaptiveHeight
        arrows
        autoplay
        draggable
        infinite
        autoplaySpeed={1500}
      >
        {list.map((item) => (
          <div
            key={item.id}
            className="relative w-full h-[500px] overflow-hidden group"
          >
            {/* 图片容器 */}
            <div className="relative w-full h-full">
              <img
                alt={item.title}
                className="object-cover w-full h-full"
                src={import.meta.env.VITE_API_URL + item.url}
              />
            </div>

            {/* 标题 */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/30 text-white text-center rounded-lg backdrop-blur-sm px-6 py-2 text-xl">
              {item.title}
            </div>

            {/* 描述 - 悬停动画部分 */}
            <div
              className={clsx(
                "absolute bottom-0 left-0 right-0",
                "bg-gradient-to-t from-black/80 to-transparent",
                "p-4 text-white transition-all duration-300",
                "translate-y-full group-hover:translate-y-0", // 悬停时上移
              )}
            >
              <div className="max-w-md mx-auto text-center">
                <p className="text-sm leading-5">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default LoginCarousel;
