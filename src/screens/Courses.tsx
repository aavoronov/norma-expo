import { Text, ScrollView, View, Image, TouchableOpacity } from "react-native";
import { styled } from "styled-components/native";
import { RegularText, SetState, Title, valueOf, videoLength } from "../utilities";
import { THEME } from "../theme";
import { useState } from "react";
import { useAppNavigation, useAppSelector } from "../hooks";
import { coursesData } from "../components/data";
import { Screens } from "../Screens";
import { CoursePreview } from "../components/svgs";

type ActivityTypes = "fitness" | "restaurants" | "tourism";

const humanFriendlyFilterState = [
  { key: "fitness", humanFriendly: "Фитнес" },
  { key: "restaurants", humanFriendly: "Рестораны" },
  { key: "tourism", humanFriendly: "Туризм" },
] as const;

type HumanFriendlyFilterState = (typeof humanFriendlyFilterState)[number];

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

const Container = styled.ScrollView`
  width: 100%;
  flex: 1;
`;

const CourseThumb = ({ course }: { course: VideoLesson | Course }) => {
  const { duration } = course as VideoLesson;
  const { lessons } = course as Course;
  const { title, type } = course;

  const navigation = useAppNavigation();

  const isSingleLessonRatherThanCourse = !!duration && !lessons;

  const lessonsLength = (value: number) => {
    let suffix = "";
    if (value % 10 > 1 && value % 10 < 5) suffix = "а";
    if (value % 10 >= 5 || value % 10 === 0 || (value > 10 && value < 15)) suffix = "ов";
    return `${value} урок${suffix}`;
  };

  const maybeShortenTitle = (str: string) => {
    if (str.length > 50) return str.slice(0, 50) + "...";
    return str;
  };

  const timelapse = isSingleLessonRatherThanCourse ? videoLength(duration) : lessonsLength(lessons);
  return (
    <TouchableOpacity
      style={{ width: 150, marginRight: 16 }}
      onPress={() =>
        navigation.navigate(isSingleLessonRatherThanCourse ? { name: Screens.Lesson, params: {} } : { name: Screens.Course, params: {} })
      }>
      <View
        style={{
          backgroundColor: THEME.WHITISH_F2F3F8,
          borderRadius: 12,
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexDirection: "row",
          paddingTop: 13,
          paddingLeft: 21,
          padding: 8,
          marginBottom: 12,
        }}>
        {/* <Image source={require("../../assets/coursePreview.png")} style={{ marginBottom: 5 }} /> */}
        <View style={{ marginBottom: 5 }}>
          <CoursePreview />
        </View>
        <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 9 }}>{timelapse}</Text>
      </View>
      <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 12, color: THEME.BLACKISH_2D2D31 }}>{maybeShortenTitle(title)}</Text>
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
          return <CourseThumb course={item} key={index} />;
        })}
      </ScrollView>
    </View>
  );
};

const Filter = ({ filter, setFilter }: { filter: HumanFriendlyFilterState; setFilter: SetState<HumanFriendlyFilterState> }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 32 }}>
      {humanFriendlyFilterState.map((item) => {
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
  const userName = useAppSelector((state) => state.user.name);

  return (
    <Container>
      <Title style={{ textAlign: "left", marginTop: 50, marginBottom: 12, fontSize: 24 }}>{`Здравствуйте, ${userName}!`}</Title>
      <RegularText style={{ marginBottom: 32 }}>Давайте приступим к обучению</RegularText>
      <Filter filter={filter} setFilter={setFilter} />
      {coursesData.map((item: Category, index: number) => {
        return <SingleCategory singleCategory={item} key={index} filter={filter} />;
      })}
    </Container>
  );
};

export default Courses;
