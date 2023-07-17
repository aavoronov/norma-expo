import { Image, Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import BackButton from "../components/BackButton";
import Files from "../components/Files";
import { courseContent } from "../components/data";
import { CoursePreview, LockSmall } from "../components/svgs";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import { THEME } from "../theme";
import { RegularText, Title, axiosQuery, checkSubscriptionValidity, videoLength } from "../utilities";
import { useEffect } from "react";

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
  const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);
  const hasAccess = checkSubscriptionValidity(subscriptionThrough) || !isPaid;
  const noAccess = !hasAccess;
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
            alignItems: noAccess ? "center" : "flex-end",
            justifyContent: noAccess ? "center" : "space-between",
            flexDirection: "row",
            paddingTop: 13,
            paddingLeft: 21,
            padding: 8,
            marginRight: 12,
          },
          noAccess && { paddingTop: 0, paddingLeft: 0, padding: 0 },
        ]}>
        {noAccess ? (
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

const Course = ({ route }) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const data = route.params;
  console.log("data", data);

  useEffect(() => {
    (async () => {
      if (!!route.params.id) {
        try {
          const res = await axiosQuery({ url: `/courses/${route.params.id}` });
          console.log("res.data", res.data);
        } catch (e) {
          console.log(e.response.data.message);
        }
      }
    })();
  }, [route]);

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
