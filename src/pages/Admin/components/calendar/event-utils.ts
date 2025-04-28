import type { EventInput } from "@fullcalendar/core";

import dayjs from "dayjs";

export const INITIAL_EVENTS: EventInput[] =
  JSON.parse(localStorage.getItem("todo_list_events") || "[]") || [];

export const saveDataToLocalStorage = (data: any) => {
  localStorage.setItem("todo_list_events", JSON.stringify(data));
};

export const addData2LS = (values: EventInput) => {
  const newData = {
    id: values.id,
    title: values.title,
    start: dayjs(values.start as string).toISOString(),
    end: dayjs(values.end as string).toISOString(),
    color: values.color,
    allDay: values.allDay,
  };

  const index = INITIAL_EVENTS.findIndex((item) => item.id === values.id);

  if (index >= 0) {
    INITIAL_EVENTS[index] = newData;
  } else {
    INITIAL_EVENTS.push(newData);
  }
  saveDataToLocalStorage(INITIAL_EVENTS);
};

export const deleteDataFromLocalStorage = (id: string) => {
  const newData = INITIAL_EVENTS.filter((item) => item.id !== id);

  saveDataToLocalStorage(newData);
};

// {
// 	id: faker.string.uuid(),
// 	title: faker.lorem.words({ min: 2, max: 5 }),
// 	start: dayjs().toISOString(),
// 	end: dayjs().add(10, "hour").toISOString(),
// 	color: "#7a0916",
// },
// {
// 	id: faker.string.uuid(),
// 	title: faker.lorem.words({ min: 2, max: 5 }),
// 	start: dayjs().add(1, "day").toISOString(),
// 	end: dayjs().add(3, "day").toISOString(),
// 	allDay: faker.datatype.boolean(),
// 	color: "#00b8d9",
// },
// {
// 	id: faker.string.uuid(),
// 	title: faker.lorem.words({ min: 2, max: 5 }),
// 	start: dayjs().add(3, "day").toISOString(),
// 	end: dayjs().add(5, "day").toISOString(),
// 	allDay: faker.datatype.boolean(),
// 	color: "#ff5630",
// },
// {
// 	id: faker.string.uuid(),
// 	title: faker.lorem.words({ min: 2, max: 5 }),
// 	start: dayjs().add(7, "day").toISOString(),
// 	end: dayjs().add(8, "day").toISOString(),
// 	allDay: faker.datatype.boolean(),
// 	color: "#ffab00",
// },
// {
// 	id: faker.string.uuid(),
// 	title: faker.lorem.words({ min: 2, max: 5 }),
// 	start: dayjs().add(7, "day").toISOString(),
// 	end: dayjs().add(8, "day").toISOString(),
// 	allDay: faker.datatype.boolean(),
// 	color: "#ffab00",
// },
// {
// 	id: faker.string.uuid(),
// 	title: faker.lorem.words({ min: 2, max: 5 }),
// 	start: dayjs().add(8, "day").toISOString(),
// 	end: dayjs().add(9, "day").toISOString(),
// 	allDay: faker.datatype.boolean(),
// 	color: "#8e33ff",
// },
// {
// 	id: faker.string.uuid(),
// 	title: faker.lorem.words({ min: 2, max: 5 }),
// 	start: dayjs().add(10, "day").toISOString(),
// 	end: dayjs().add(11, "day").toISOString(),
// 	color: "#00a76f",
// },
