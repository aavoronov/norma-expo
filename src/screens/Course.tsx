import { Text, TouchableOpacity, View } from "react-native";
import { RegularText, Title, videoLength } from "../utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { updateRole } from "../store/userSlice";
import { useEffect } from "react";
import { Image } from "react-native";
import { styled } from "styled-components/native";
import BackButton from "../components/BackButton";
import Files from "../components/Files";
import { THEME } from "../theme";
import { CoursePreview, Lock, LockSmall } from "../components/svgs";
import { courseContent } from "../components/data";
import usePaidAction from "../hooks/usePaidAction";
import { Screens } from "../Screens";

const Container = styled.ScrollView`
  width: 100%;
  flex: 1;
`;

const MainContentContainerWithPadding = styled.View`
  padding: 0 5%;
`;

const Section = styled.View`
  margin-bottom: 35px;
`;

interface Lesson {
  id: number;
  order: number;
  isPaid: boolean;
  title: string;
  duration: number;
  files:
    | {
        title: string;
        link: string;
      }[]
    | [];
}

interface SingleLessonFiles {
  isPaid: boolean;
  files: {
    title: string;
    link: string;
  }[];
}

const files: SingleLessonFiles[] = courseContent.lessons
  .map((item) => {
    return { files: item.files, isPaid: item.isPaid };
  })
  .filter((item) => !!item.files.length);

const LessonThumb = ({ lesson }: { lesson: Lesson }) => {
  const { id, order, isPaid, title, duration } = lesson;
  const navigation = useAppNavigation();
  // const checkForPaidAction = usePaidAction();

  // const handlePress = () => {
  //   isPaid
  //     ? checkForPaidAction(() => navigation.navigate({ name: Screens.Lesson, params: {} }))
  //     : navigation.navigate({ name: Screens.Lesson, params: {} });
  // };

  return (
    <TouchableOpacity
      style={{ flex: 1, marginBottom: 16, flexDirection: "row" }}
      onPress={() => navigation.navigate({ name: Screens.Lesson, params: {} })}>
      <View
        style={[
          {
            backgroundColor: THEME.WHITISH_F2F3F8,
            width: 150,
            height: 84,
            borderRadius: 12,
            alignItems: isPaid ? "center" : "flex-end",
            justifyContent: isPaid ? "center" : "space-between",
            flexDirection: "row",
            paddingTop: 13,
            paddingLeft: 21,
            padding: 8,
            marginRight: 12,
          },
          isPaid && { paddingTop: 0, paddingLeft: 0, padding: 0 },
        ]}>
        {isPaid ? (
          <LockSmall />
        ) : (
          <>
            {/* <Image source={require("../../assets/coursePreview.png")} style={{ marginBottom: 5 }} /> */}
            <View style={{ marginBottom: 5 }}>
              <CoursePreview />
            </View>
            <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 9 }}>{videoLength(duration)}</Text>
          </>
        )}
      </View>
      <View style={{ justifyContent: "flex-start", flex: 1 }}>
        <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 12, color: THEME.BLACKISH_2D2D31 }}>Урок {order}</Text>
        <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 12, color: THEME.BLACKISH_2D2D31 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Course = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  return (
    <Container>
      <BackButton navigation={navigation} />

      <Image source={require("../../assets/temp/Group514111.png")} style={{ marginBottom: 28, width: "100%" }} resizeMode='cover' />

      <MainContentContainerWithPadding>
        <Title style={{ textAlign: "left", marginBottom: 16 }}>{courseContent.title}</Title>

        <RegularText style={{ lineHeight: 22, marginBottom: 35 }}>{courseContent.description}</RegularText>

        <Section style={{ flex: 1 }}>
          <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Уроки</Title>
          {courseContent.lessons.map((item) => (
            <LessonThumb lesson={item} key={item.id} />
          ))}
        </Section>

        <Section>
          <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Файлы курса</Title>
          {files.map((item: SingleLessonFiles, index: number) => (
            <Files files={item.files} isPaid={item.isPaid} key={index} />
          ))}
        </Section>
      </MainContentContainerWithPadding>
    </Container>
  );
};

export default Course;
