import { Video } from "expo-av";
import { MutableRefObject, forwardRef, useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Cell, Table, TableWrapper } from "react-native-table-component";
import { styled } from "styled-components/native";
import BackButton from "../components/BackButton";
import Files from "../components/Files";
import VideoPlayer from "../components/VideoPlayer";
import { HeartActive, HeartInactive, Lock, PlayBtn } from "../components/svgs";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import { THEME } from "../theme";
import { RegularText, Title, axiosQuery, checkSubscriptionValidity } from "../utilities";
import * as ScreenOrientation from "expo-screen-orientation";
import usePaidAction from "../hooks/usePaidAction";
import { setFaves } from "../store/favesSlice";

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

const TimingsTable = forwardRef(({ lessonData }: { lessonData: Lesson }, ref: MutableRefObject<Video>) => {
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
                        ? checkForPaidAction(() => ref.current.playFromPositionAsync(hmsToMs(cellData[1])))
                        : ref.current.playFromPositionAsync(hmsToMs(cellData[1]));
                    }}>
                    <Text
                      style={{
                        color: THEME.MAIN_RED,
                        fontFamily: THEME.FONTS.SFProText500,
                      }}>
                      {cellData[1]}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  cellData[1]
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

const Lesson = ({ route }) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);
  const isActive = checkSubscriptionValidity(subscriptionThrough);

  const [lessonData, setLessonData] = useState(null);

  const faves = useAppSelector((state) => state.faves);

  const videoRef = useRef<Video>(null);

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

  useEffect(() => {
    (async () => {
      if (!!route.params.id) {
        try {
          const res = await axiosQuery({ url: `/lessons/${route.params.id}` });

          setLessonData(res.data);
        } catch (e) {
          console.log(e.response.data.message);
        }
      }
    })();
  }, []);

  const handleDeviceRotation = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();

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
    };
  }, []);

  return (
    <Container>
      <BackButton navigation={navigation} />

      {(!lessonData?.isPaid || isActive) && lessonData?.video && (
        <View style={{ width: "100%", height: 300, marginTop: 50, marginBottom: 100 }}>
          <VideoPlayer ref={videoRef} />
        </View>
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

      {!!lessonData && (
        <MainContentContainerWithPadding>
          <Title style={{ textAlign: "left", marginBottom: 16 }}>{lessonData.title}</Title>
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

          {lessonData.files?.length && (
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
