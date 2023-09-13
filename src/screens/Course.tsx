import { useEffect, useState } from "react";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import BackButton from "../components/BackButton";
import Files from "../components/Files";
import { CoursePreview, LockSmall } from "../components/svgs";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import { THEME } from "../theme";
import { RegularText, Title, axiosQuery, checkSubscriptionValidity, videoLength } from "../utilities";
import { setIsLoading } from "../store/loaderSlice";

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

// interface Lesson {
//   id: number;
//   order: number;
//   isPaid: boolean;
//   title: string;
//   duration: number;
//   files:
//     | {
//         title: string;
//         link: string;
//       }[]
//     | [];
// }

interface File {
  title: string;
  url: string;
  order: number;
}

interface SingleLessonFiles {
  isPaid: boolean;
  files: File[];
}

interface Preview {
  url: string;
}

interface Lesson {
  id: number;
  title: string;
  duration: number;
  isPaid: boolean;
  order: number;
  preview: Preview;
  files: File[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  preview?: Preview;
  lessons: Lesson[];
}

const LessonThumb = ({ lesson, index }: { lesson: Lesson; index: number }) => {
  const { id, order, isPaid, title, duration, preview } = lesson;
  const navigation = useAppNavigation();
  const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);
  const hasAccess = checkSubscriptionValidity(subscriptionThrough) || !isPaid;
  const noAccess = !hasAccess;

  // useEffect(() => {

  // },[])
  // const checkForPaidAction = usePaidAction();

  // const handlePress = () => {
  //   isPaid
  //     ? checkForPaidAction(() => navigation.navigate({ name: Screens.Lesson, params: {} }))
  //     : navigation.navigate({ name: Screens.Lesson, params: {} });
  // };

  return (
    <TouchableOpacity
      style={{ flex: 1, marginBottom: 16, flexDirection: "row" }}
      onPress={() => navigation.navigate({ name: Screens.Lesson, params: { id: id } })}>
      <View
        style={[
          {
            backgroundColor: THEME.WHITISH_F2F3F8,
            width: 150,
            height: 84,
            borderRadius: 12,
            // alignItems: "flex-end",
            // justifyContent: "space-between",
            alignItems: !preview?.url && !noAccess ? "flex-end" : "center",
            justifyContent: !preview?.url && !noAccess ? "space-between" : "center",
            // justifyContent: "center",
            flexDirection: "row",
            overflow: "hidden",
            marginBottom: 12,
            marginRight: 12,
          },
          !preview?.url &&
            !noAccess && {
              paddingTop: 13,
              paddingLeft: 21,
              padding: 8,
            },
        ]}>
        {!!preview?.url ? (
          <ImageBackground
            source={{ uri: `${THEME.API_URL}/uploads/previews/${preview.url}` }}
            resizeMode='cover'
            style={{ display: "flex", width: 150, height: 84, borderRadius: 12, overflow: "hidden" }}>
            {!noAccess && (
              <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 9, position: "absolute", bottom: 8, right: 8 }}>
                {videoLength(duration)}
              </Text>
            )}
            {noAccess && (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  backgroundColor: "#000000a0",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <LockSmall />
              </View>
            )}
          </ImageBackground>
        ) : (
          <>
            <View style={{ marginBottom: 5 }}>{/* <CoursePreview /> */}</View>
            {noAccess && (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  backgroundColor: "#000000a0",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <LockSmall />
              </View>
            )}
            {!noAccess && <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 9 }}>{videoLength(duration)}</Text>}
          </>
        )}
      </View>

      <View style={{ justifyContent: "flex-start", flex: 1 }}>
        <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 12, color: THEME.BLACKISH_2D2D31 }}>Урок {index + 1}</Text>
        <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 12, color: THEME.BLACKISH_2D2D31 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Course = ({ route }) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const data = route.params;

  const [courseData, setCourseData] = useState<Course>(null);
  const [files, setFiles] = useState<SingleLessonFiles[]>([]);

  useEffect(() => {
    (async () => {
      if (!!route.params.id) {
        // dispatch(setIsLoading(true));
        try {
          const res = await axiosQuery({ url: `/courses/${route.params.id}` });
          setCourseData(res.data);
          const files: SingleLessonFiles[] = res.data.lessons
            .map((item: Lesson) => {
              return { files: item.files.sort((a, b) => a.order - b.order), isPaid: item.isPaid };
            })
            .filter((item: SingleLessonFiles) => !!item.files.length);
          setFiles(files);
        } catch (e) {
          console.log(e.response.data.message);
        }
        // dispatch(setIsLoading(false));
      }
    })();
  }, [route]);

  return (
    <Container>
      <BackButton navigation={navigation} />
      {courseData?.preview?.url ? (
        <Image
          source={{ uri: `${THEME.API_URL}/uploads/previews/${courseData.preview.url}` }}
          style={{ marginBottom: 28, height: 220 }}
          resizeMode='cover'
        />
      ) : (
        // <Image source={require("../../assets/temp/Group514111.png")} style={{ marginBottom: 28, width: "100%" }} resizeMode='cover' />
        <View style={{ marginBottom: 28, width: "100%", height: 220, backgroundColor: THEME.WHITISH_F2F3F8 }}></View>
      )}

      {!!courseData && (
        <MainContentContainerWithPadding>
          <Title style={{ textAlign: "left", marginBottom: 16 }}>{courseData.title}</Title>

          <RegularText style={{ lineHeight: 22, marginBottom: 35 }}>{courseData.description}</RegularText>

          <Section style={{ flex: 1 }}>
            <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Уроки</Title>
            {courseData.lessons
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <LessonThumb lesson={item} key={item.id} index={index} />
              ))}
          </Section>

          {!!files.length && (
            <Section>
              <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Файлы курса</Title>
              {files.map((item: SingleLessonFiles, index: number) => (
                <Files files={item.files} isPaid={item.isPaid} key={index} />
              ))}
            </Section>
          )}
        </MainContentContainerWithPadding>
      )}
    </Container>
  );
};

export default Course;
