import { Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import { CoursePreview, LockSmall } from "../components/svgs";
import { useAppNavigation, useAppSelector } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { THEME } from "../theme";
import { Title, videoLength } from "../utilities";

const Container = styled.ScrollView`
  width: 100%;
  height: 100%;
  /* flex: 1; */
  /* padding: 80px 0; */
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

// const lessons = courseContent.lessons;

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

const Favourites = () => {
  useBackButton();
  const faves = useAppSelector((state) => state.faves);
  return (
    <Container>
      <Title style={{ textAlign: "left", fontSize: 24, marginBottom: 24 }}>Избранное</Title>
      {!!faves.length &&
        faves.map((item) => {
          return <LessonThumb lesson={item} key={item.id} />;
        })}
      {!!faves.length &&
        faves.map((item) => {
          return <LessonThumb lesson={item} key={item.id} />;
        })}
    </Container>
  );
};
export default Favourites;
