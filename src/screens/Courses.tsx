import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components/native";
import { useAppNavigation, useAppSelector } from "../hooks";
import { THEME } from "../theme";
import { RegularText, SetState, Title, axiosQuery, videoLength } from "../utilities";
// import { coursesData } from "../components/data";
import { useEffect } from "react";
import { Screens } from "../Screens";
import { CoursePreview } from "../components/svgs";

type ActivityTypes = "fitness" | "restaurants" | "tourism";

interface Filter {
  id: number;
  title: string;
}

interface StandaloneLesson {
  id: number;
  title: string;
  duration: number;
  createdAt: string;
  filterId: number;
}

type CourseLesson = Omit<StandaloneLesson, "filterId">[];

interface Course {
  id: number;
  title: string;
  filterId: number;
  createdAt: string;
  lessons: CourseLesson[];
}
interface Section {
  id: number;
  section: string;
  lessons: StandaloneLesson[];
  courses: Course[];
}

const Container = styled.ScrollView`
  width: 100%;
  flex: 1;
`;

const CourseThumb = ({ course }: { course: StandaloneLesson | Course }) => {
  const { duration } = course as StandaloneLesson;
  const { lessons } = course as Course;
  const { id, title, createdAt, filterId } = course;

  const navigation = useAppNavigation();

  const isStandaloneLessonRatherThanCourse = !!duration && !lessons;

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

  const timelapse = isStandaloneLessonRatherThanCourse ? videoLength(duration) : lessonsLength(lessons.length);
  return (
    <TouchableOpacity
      style={{ width: 150, marginRight: 16 }}
      onPress={() =>
        navigation.navigate(
          isStandaloneLessonRatherThanCourse ? { name: Screens.Lesson, params: { id: id } } : { name: Screens.Course, params: { id: id } }
        )
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

const SingleCategory = ({ singleCategory, filter }: { singleCategory: Section; filter: Filter }) => {
  const { section, lessons, courses } = singleCategory;

  const nonEmptyCourses = courses.filter((item) => !!item.lessons.length);
  const entitiesToDisplay = [...lessons, ...nonEmptyCourses].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));

  const eligibleEntities = entitiesToDisplay.filter((item) => item.filterId === filter.id);
  if (!eligibleEntities.length) return;
  return (
    <View style={{ marginBottom: 45 }}>
      <Title style={{ fontSize: 20, textAlign: "left", marginBottom: 16 }}>{section}</Title>
      <ScrollView horizontal style={{ paddingBottom: 5 }}>
        {eligibleEntities.map((item: StandaloneLesson | Course) => {
          return <CourseThumb course={item} key={item.id} />;
        })}
      </ScrollView>
    </View>
  );
};

const Filter = ({ filtersData, filter, setFilter }: { filtersData: Filter[]; filter: Filter; setFilter: SetState<Filter> }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 32 }}>
      {filtersData.map((item) => {
        const isSelected = filter === item;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => setFilter(item)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              backgroundColor: isSelected ? THEME.MAIN_RED : THEME.WHITISH_F2F3F8,
              borderRadius: 30,
              marginRight: 8,
            }}>
            <Text style={{ color: isSelected ? "#fff" : THEME.BLACKISH_2D2D31 }}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Courses = () => {
  const [filter, setFilter] = useState<Filter>(null);
  const userName = useAppSelector((state) => state.user.name);

  const [coursesData, setCoursesData] = useState<Section[]>([]);
  const [filtersData, setFiltersData] = useState<Filter[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosQuery({ url: "/course-sections" });
        setCoursesData(res.data);
      } catch (e) {
        console.log("e", e.response.data.message);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosQuery({ url: "/course-filter-options" });
        setFiltersData(res.data);
        setFilter(res.data[0]);
      } catch (e) {
        console.log("e", e.response.data.message);
      }
    })();
  }, []);

  return (
    <Container>
      <Title style={{ textAlign: "left", marginTop: 50, marginBottom: 12 }}>{`Здравствуйте, ${userName}!`}</Title>
      <RegularText style={{ marginBottom: 32 }}>Давайте приступим к обучению</RegularText>
      <Filter filtersData={filtersData} filter={filter} setFilter={setFilter} />
      {!!coursesData.length &&
        coursesData.map((item: Section) => {
          return <SingleCategory singleCategory={item} key={item.id} filter={filter} />;
        })}
    </Container>
  );
};

export default Courses;
