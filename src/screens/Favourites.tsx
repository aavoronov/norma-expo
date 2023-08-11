import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import { CoursePreview, LockSmall } from "../components/svgs";
import { useAppNavigation, useAppSelector } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { THEME } from "../theme";
import { Title, checkSubscriptionValidity, videoLength } from "../utilities";

const Container = styled.ScrollView`
  width: 100%;
  height: 100%;
  /* flex: 1; */
  /* padding: 80px 0; */
`;

interface Lesson {
  id: number;
  isPaid: boolean;
  title: string;
  duration: number;
  preview?: {
    url: string;
  };
}

// const lessons = courseContent.lessons;

const LessonThumb = ({ lesson }: { lesson: Lesson }) => {
  const { id, isPaid, title, duration, preview } = lesson;
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
    </Container>
  );
};
export default Favourites;
