import { MutableRefObject, forwardRef, useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Cell, Table, TableWrapper } from "react-native-table-component";
import { styled } from "styled-components/native";
import Files from "../components/Files";
// import VideoPlayer from "../components/VideoPlayer";
import Constants from "expo-constants";
import * as NavigationBar from "expo-navigation-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import VideoPlayer from "react-native-video-controls";
import { HeartActive, HeartInactive, Lock, PlayBtn } from "../components/svgs";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import usePaidAction from "../hooks/usePaidAction";
import { setFaves } from "../store/favesSlice";
import { setTabBarVisible } from "../store/tabBarStateSlice";
import { THEME } from "../theme";
import { RegularText, Title, axiosQuery, checkSubscriptionValidity } from "../utilities";
import BackButton from "../components/BackButton";
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

interface File {
  title: string;
  url: string;
  order: number;
}
interface Lesson {
  id: number;
  title: string;
  video: string;
  description?: string;
  duration: number;
  isPaid: boolean;
  timings?: string;
  preview: {
    url?: string;
  };
  files: File[];
}

interface Timing {
  time: string;
  content: string;
}

const IsPaid = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 26 }}>
      <View style={{ marginRight: 8, marginLeft: -1 }}>
        <Lock />
      </View>
      <Text style={{ color: THEME.MAIN_RED, fontFamily: THEME.FONTS.SFProText500, fontSize: 14 }}>Это видео доступно по подписке</Text>
    </View>
  );
};

const FaveBtn = ({ isFaved, toggleFave, id }: { isFaved: boolean; toggleFave: (id: number) => Promise<void>; id: number }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 37 }}>
      <TouchableOpacity hitSlop={10} style={{ marginRight: 8 }} onPress={() => toggleFave(id)}>
        {isFaved ? <HeartActive /> : <HeartInactive />}
      </TouchableOpacity>
      <Text style={{ color: THEME.BLACKISH_2D2D31, fontFamily: THEME.FONTS.SFProText500, fontSize: 14 }}>
        {isFaved ? "В избранном" : "Добавить в избранное"}
      </Text>
    </View>
  );
};

function hmsToSeconds(str: string) {
  var p = str.split(":"),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }

  console.log(s);

  return s;
}

const TimingsTable = forwardRef(({ lessonData }: { lessonData: Lesson }, ref: MutableRefObject<VideoPlayer>) => {
  const checkForPaidAction = usePaidAction();
  const timings: Timing[] = JSON.parse(lessonData.timings);
  return (
    <Table>
      {timings.map((rowData, rowIndex) => (
        <TableWrapper key={rowIndex} style={{ flexDirection: "row" }}>
          {Object.entries(rowData).map((cellData, cellIndex) => (
            <Cell
              key={cellIndex}
              data={
                cellIndex === 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      lessonData.isPaid
                        ? checkForPaidAction(() => ref.current?.seekTo(hmsToSeconds(cellData[1])))
                        : ref.current?.seekTo(hmsToSeconds(cellData[1]));
                    }}
                    // onPress={() => {
                    //   lessonData.isPaid
                    //     ? checkForPaidAction(() => ref.current?.player.ref.seek(hmsToSeconds(cellData[1])))
                    //     : ref.current?.player.ref.seek(hmsToSeconds(cellData[1]));
                    // }}
                  >
                    <Text
                      style={{
                        color: THEME.MAIN_RED,
                        fontFamily: THEME.FONTS.SFProText500,
                        lineHeight: 20,
                      }}>
                      {cellData[1]}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  cellData[1]
                )
              }
              style={[{ justifyContent: "flex-start", marginBottom: 4 }, cellIndex === 0 ? { flex: 4 } : { flex: 15 }]}
              textStyle={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 14, lineHeight: 20, color: THEME.DARK_GRAY_5D5D69 }}
            />
          ))}
        </TableWrapper>
      ))}
    </Table>
  );
});

const Lesson = ({ route }) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);
  const isActive = checkSubscriptionValidity(subscriptionThrough);

  const [lessonData, setLessonData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  const faves = useAppSelector((state) => state.faves);

  const videoRef = useRef<VideoPlayer>(null);

  const data = route.params;
  const isFaved = faves.map((item) => item.id).includes(data.id);

  const toggleFave = async (id: number) => {
    try {
      const res = await axiosQuery({ url: `/favourites`, method: "post", payload: { id: id } });

      const lessons = res.data.map((item) => item.lesson);

      dispatch(setFaves(lessons));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };

  const enterFullscreen = () => {
    try {
      dispatch(setTabBarVisible(false));
      setIsFullscreen(true);
      NavigationBar.setVisibilityAsync("hidden");
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    } catch (e) {
      console.log(e);
    }
  };

  const exitFullscreen = () => {
    try {
      dispatch(setTabBarVisible(true));
      setIsFullscreen(false);
      NavigationBar.setVisibilityAsync("visible");
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setScreenWidth(Dimensions.get("screen").width);
  }, []);

  useEffect(() => {
    (async () => {
      if (!!route.params.id) {
        try {
          dispatch(setIsLoading(true));
          const res = await axiosQuery({ url: `/lessons/${route.params.id}` });

          setLessonData(res.data);
        } catch (e) {
          console.log(e.response.data.message);
        }
        // dispatch(setIsLoading(false));
      }
    })();
  }, []);

  // const handleDeviceRotation = async () => {
  //   const orientation = await ScreenOrientation.getOrientationAsync();

  //   const becameHorizontal = orientation === 3 || orientation === 4;
  //   const becameVertical = orientation === 1;

  //   console.log("first");

  //   if (becameHorizontal) {
  //     !!videoRef.current && videoRef.current.presentFullscreenPlayer();
  //   }
  //   if (becameVertical) {
  //     !!videoRef.current && videoRef.current.dismissFullscreenPlayer();
  //   }
  // };

  return (
    <Container as={isFullscreen ? View : ScrollView} style={{ marginTop: isFullscreen ? 0 : Constants.statusBarHeight }}>
      <StatusBar hidden={isFullscreen} translucent />

      {(!lessonData?.isPaid || isActive) && lessonData?.video && (
        <VideoPlayer
          style={{ margin: 0, paddingBottom: 0, overflow: "visible" }}
          // screenWidth={Dimensions.get("screen").width}
          screenWidth={screenWidth}
          source={{ uri: lessonData.video }}
          onBack={() => navigation.goBack()}
          paused
          controlTimeout={10000}
          scrubbing={1000}
          onEnterFullscreen={enterFullscreen}
          onExitFullscreen={exitFullscreen}
          disableVolume
          ref={videoRef}
          isFullscreen={isFullscreen}
          // ref={(ref) => (ref = videoRef)}
          seekColor={THEME.MAIN_RED}
          // thumbnailUri={lessonData.preview?.url ? `${THEME.API_URL}/uploads/previews/${lessonData.preview?.url}` : void 0}
          thumbnailUri={`${THEME.API_URL}/uploads/previews/${lessonData.preview?.url}`}
          fontFamily={THEME.FONTS.SFProDisplay700}
          timeFontFamily={THEME.FONTS.SFProDisplay500}
          header={lessonData.title}
          onLoad={() => dispatch(setIsLoading(false))}
        />
      )}
      {!!lessonData?.isPaid && !isActive && (
        <View
          style={{
            width: "100%",
            marginBottom: 28,
            height: 220,
            backgroundColor: THEME.WHITISH_F2F3F8,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <BackButton navigation={navigation} />
          {/* <Image source={require("../../assets/coursePreviewLarge.png")} style={{ height: "70%" }} resizeMode='contain' /> */}
          <TouchableOpacity
            style={{
              height: 64,
              width: 64,
              backgroundColor: "#00000064",
              position: "absolute",
              borderRadius: 32,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Subscription")}>
            <View style={{ paddingLeft: 5 }}>
              <PlayBtn />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {!!lessonData && (
        <MainContentContainerWithPadding>
          <Title style={{ textAlign: "left", marginBottom: 16, marginTop: 28 }}>{lessonData.title}</Title>
          {!!lessonData.isPaid && !isActive && <IsPaid />}
          <FaveBtn isFaved={isFaved} toggleFave={toggleFave} id={data.id} />

          {lessonData.description && (
            <Section>
              <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Описание</Title>
              <RegularText style={{ lineHeight: 22 }}>{lessonData.description}</RegularText>
            </Section>
          )}

          {!!lessonData.timings && lessonData.timings !== "[]" && (
            <Section>
              <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Тайминг</Title>
              <TimingsTable lessonData={lessonData} ref={videoRef} />
            </Section>
          )}

          {!!lessonData.files?.length && (
            <Section>
              <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Файлы</Title>
              <Files files={lessonData.files} isPaid={lessonData.isPaid} />
            </Section>
          )}
        </MainContentContainerWithPadding>
      )}
    </Container>
  );
};

export default Lesson;
