import { useRef, useState, useEffect, forwardRef, MutableRefObject } from "react";
import { Button, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { Cell, Table, TableWrapper } from "react-native-table-component";
import { styled } from "styled-components/native";
import { HeartActive, HeartInactive, Link, Lock, PlayBtn } from "../components/svgs";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import { THEME } from "../theme";
import { RegularText, SetState, Title, checkSubscriptionValidity } from "../utilities";
import BackButton from "../components/BackButton";
import Files from "../components/Files";
import { lessonData } from "../components/data";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import VideoPlayer from "../components/VideoPlayer";
// import VideoPlayer from "expo-video-player";
// import VideoPlayer from "../components/VideoPlayer";
import * as ScreenOrientation from "expo-screen-orientation";
import usePaidAction from "../hooks/usePaidAction";

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

const FaveBtn = ({ isFaved, setIsFaved }: { isFaved: boolean; setIsFaved: SetState<boolean> }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 37 }}>
      <TouchableOpacity hitSlop={10} style={{ marginRight: 8 }} onPress={() => setIsFaved((prev) => !prev)}>
        {isFaved ? <HeartActive /> : <HeartInactive />}
      </TouchableOpacity>
      <Text style={{ color: THEME.BLACKISH_2D2D31, fontFamily: THEME.FONTS.SFProText500, fontSize: 14 }}>
        {isFaved ? "В избранном" : "Добавить в избранное"}
      </Text>
    </View>
  );
};

function hmsToMs(str: string) {
  var p = str.split(":"),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }

  return s * 1000;
}

const TimingsTable = forwardRef((props: {}, ref: MutableRefObject<Video>) => {
  const checkForPaidAction = usePaidAction();
  return (
    <Table>
      {Object.entries(lessonData.timing).map((rowData, rowIndex) => (
        <TableWrapper key={rowIndex} style={{ flexDirection: "row" }}>
          {rowData.map((cellData, cellIndex) => (
            <Cell
              key={cellIndex}
              data={
                cellIndex === 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      checkForPaidAction(() => ref.current.playFromPositionAsync(hmsToMs(cellData)));
                    }}>
                    <Text
                      style={{
                        color: THEME.MAIN_RED,
                        fontFamily: THEME.FONTS.SFProText500,
                      }}>
                      {cellData}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  cellData
                )
              }
              style={[{ justifyContent: "flex-start", marginBottom: 4 }, cellIndex === 0 ? { flex: 4 } : { flex: 15 }]}
              textStyle={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 14, lineHeight: 22, color: THEME.DARK_GRAY_5D5D69 }}
            />
          ))}
        </TableWrapper>
      ))}
    </Table>
  );
});

const Lesson = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);
  const isActive = checkSubscriptionValidity(subscriptionThrough);

  const [isFaved, setIsFaved] = useState(false);
  const [paidShown, setPaidShown] = useState(true);

  const videoRef = useRef<Video>(null);

  const handleDeviceRotation = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    console.log("orientation", orientation);
    const becameHorizontal = orientation === 3 || orientation === 4;
    const becameVertical = orientation === 1;

    if (becameHorizontal) {
      !!videoRef.current && videoRef.current.presentFullscreenPlayer();
    }
    if (becameVertical) {
      !!videoRef.current && videoRef.current.dismissFullscreenPlayer();
    }
  };

  useEffect(() => {
    ScreenOrientation.lockAsync(0);
    ScreenOrientation.addOrientationChangeListener(handleDeviceRotation);

    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
      ScreenOrientation.lockAsync(3);
      console.log("cleanup");
    };
  }, []);

  return (
    <Container>
      <BackButton navigation={navigation} />

      {/* <Image source={require("../../assets/temp/Group514111.png")} style={{ marginBottom: 28 }} /> */}
      {(!lessonData.isPaid || isActive) && (
        <View style={{ width: "100%", height: 300, marginTop: 50, marginBottom: 100 }}>
          <VideoPlayer ref={videoRef} />
        </View>
      )}
      {!!lessonData.isPaid && !isActive && (
        <View
          style={{
            width: "100%",
            marginBottom: 28,
            height: 220,
            backgroundColor: THEME.WHITISH_F2F3F8,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Image source={require("../../assets/coursePreviewLarge.png")} style={{ height: "70%" }} resizeMode='contain' />
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

      <MainContentContainerWithPadding>
        <Title style={{ textAlign: "left", marginBottom: 16 }}>{lessonData.title}</Title>
        {!!lessonData.isPaid && !isActive && <IsPaid />}
        <FaveBtn isFaved={isFaved} setIsFaved={setIsFaved} />

        <Section>
          <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Описание</Title>
          <RegularText style={{ lineHeight: 22 }}>{lessonData.description}</RegularText>
        </Section>

        <Section>
          <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Тайминг</Title>
          <TimingsTable ref={videoRef} />
        </Section>

        <Section>
          <Title style={{ textAlign: "left", marginBottom: 12, fontSize: 18 }}>Файлы</Title>
          <Files files={lessonData.files} isPaid={lessonData.isPaid && paidShown} />
        </Section>
      </MainContentContainerWithPadding>
    </Container>
  );
};

export default Lesson;
