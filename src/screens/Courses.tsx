import { Text, ScrollView, View, Image, TouchableOpacity } from "react-native";
import { styled } from "styled-components/native";
import { RegularText, Title } from "../utilities";
import { THEME } from "../theme";
import { useState } from "react";

const Container = styled.ScrollView`
  /* margin: 60px 0; */
  width: 100%;
  flex: 1;
`;

type ActivityTypes = "fitness" | "restaurants" | "tourism";

const humanFriendlyFilterState = {
  0: { key: "fitness", humanFriendly: "Фитнес" },
  1: { key: "restaurants", humanFriendly: "Рестораны" },
  2: { key: "tourism", humanFriendly: "Туризм" },
} as const;

type ValueOf<T> = T[keyof T];

type HumanFriendlyFilterState = ValueOf<typeof humanFriendlyFilterState>;

// type HumanFriendlyFilterState =
//   | { key: "fitness"; humanFriendly: "Фитнес" }
//   | { key: "restaurants"; humanFriendly: "Рестораны" }
//   | { key: "tourism"; humanFriendly: "Туризм" };

interface VideoLesson {
  title: string;
  type: "video";
  lessons?: undefined;
  duration: number;
  activity: ActivityTypes;
}

interface Course {
  title: string;
  type: "course";
  lessons: number;
  duration?: undefined;
  activity: ActivityTypes;
}

interface Category {
  category: string;
  courses: Array<VideoLesson | Course>;
}

const data: Category[] = [
  {
    category: "Бесплатные материалы",
    courses: [
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "restaurants" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Онлайн-конференции",
    courses: [
      {
        title: "Как увеличить прибыль в два раза за три месяца и что-то там еще, заголовок будет сокращен",
        type: "video",
        duration: 2715,
        activity: "fitness",
      },
      { title: "Как продвигаться в соцсетях", type: "video", duration: 2715, activity: "restaurants" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Для руководителей",
    courses: [
      { title: "Как открыть фитнес-клуб с нуля", type: "course", lessons: 10, activity: "fitness" },
      { title: "Как подбирать персонал с помощью чего-то там длинного", type: "course", lessons: 10, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "restaurants" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Для собственников",
    courses: [
      { title: "Прокачиваем soft-skills", type: "video", duration: 2715, activity: "fitness" },
      { title: "Тактика продаж", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "tourism" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "tourism" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Для специалистов",
    courses: [
      { title: "Прокачиваем soft-skills", type: "video", duration: 2715, activity: "fitness" },
      { title: "Тактика продаж", type: "video", duration: 2715, activity: "tourism" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
  {
    category: "Для спикеров",
    courses: [
      { title: "Прокачиваем soft-skills", type: "video", duration: 2715, activity: "fitness" },
      { title: "Тактика продаж", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
      { title: "С чего начать обучение", type: "video", duration: 2715, activity: "fitness" },
    ],
  },
];

const Course = ({ course }: { course: VideoLesson | Course }) => {
  const { duration } = course as VideoLesson;
  const { lessons } = course as Course;
  const { title, type } = course;

  const timelapse = !!duration ? `${Math.floor(duration / 60)}:${duration % 60}` : `${lessons} уроков`;
  return (
    <TouchableOpacity style={{ width: 150, marginRight: 16 }}>
      <View
        style={{
          backgroundColor: THEME.WHITISH_F2F3F8,
          borderRadius: 12,
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexDirection: "row",
          padding: 8,
          marginBottom: 12,
        }}>
        <Image source={require("../../assets/coursePreview.png")} />
        <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 9 }}>{timelapse}</Text>
      </View>
      <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 12, color: THEME.BLACKISH_2D2D31 }}>{title}</Text>
    </TouchableOpacity>
  );
};

const SingleCategory = ({ singleCategory, filter }: { singleCategory: Category; filter: HumanFriendlyFilterState }) => {
  const { category, courses } = singleCategory;
  const eligibleCourses = courses.filter((item) => item.activity === filter.key);
  if (!eligibleCourses.length) return;
  return (
    <View style={{ marginBottom: 45 }}>
      <Title style={{ fontSize: 20, textAlign: "left", marginBottom: 16 }}>{category}</Title>
      <ScrollView horizontal style={{ paddingBottom: 5 }}>
        {eligibleCourses.map((item: VideoLesson | Course, index: number) => {
          return <Course course={item} key={index} />;
        })}
      </ScrollView>
    </View>
  );
};

const Filter = ({ filter, setFilter }: { filter: HumanFriendlyFilterState; setFilter: (value: HumanFriendlyFilterState) => void }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 32 }}>
      {Object.values(humanFriendlyFilterState).map((item) => {
        const isSelected = filter === item;
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => setFilter(item)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              backgroundColor: isSelected ? THEME.MAIN_RED : THEME.WHITISH_F2F3F8,
              borderRadius: 30,
              marginRight: 8,
            }}>
            <Text style={{ color: isSelected ? "#fff" : THEME.BLACKISH_2D2D31 }}>{item.humanFriendly}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Courses = () => {
  const [filter, setFilter] = useState<HumanFriendlyFilterState>(humanFriendlyFilterState[0]);
  return (
    <Container>
      <Title style={{ textAlign: "left", marginTop: 50, marginBottom: 12 }}>Здравствуйте, Юлия!</Title>
      <RegularText style={{ marginBottom: 32 }}>Давайте приступим к обучению</RegularText>
      <Filter filter={filter} setFilter={setFilter} />
      {data.map((item: Category, index: number) => {
        return <SingleCategory singleCategory={item} key={index} filter={filter} />;
      })}
    </Container>
  );
};

export default Courses;
