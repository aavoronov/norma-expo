import { AVPlaybackStatus, ResizeMode, Video, VideoFullscreenUpdateEvent } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const VideoPlayer = forwardRef((props, ref: ForwardedRef<Video>) => {
  const [hasExpanded, setHasExpanded] = useState(0);
  const [hasCollapsed, setHasCollapsed] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!!hasExpanded) {
      ScreenOrientation.lockAsync(5);
      timeout = setTimeout(() => ScreenOrientation.unlockAsync(), 2000);
      console.log("expanded");
    }

    return () => timeout && clearTimeout(timeout);
  }, [hasExpanded]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!!hasCollapsed) {
      ScreenOrientation.lockAsync(3);
      timeout = setTimeout(() => ScreenOrientation.unlockAsync(), 2000);
      console.log("collapsed");
    }

    return () => timeout && clearTimeout(timeout);
  }, [hasCollapsed]);

  //@ts-ignore
  const [status, setStatus] = useState<AVPlaybackStatus>({});
  const [inFullscreen, setInFullscreen] = useState(false);

  const handleManualOrientationChange = (e: VideoFullscreenUpdateEvent) => {
    const expanded = e.fullscreenUpdate === 1;
    const collapsed = e.fullscreenUpdate === 3;

    if (expanded) {
      // TODO
      setHasExpanded((prev) => prev + 1);
      console.log("hasExpanded", hasExpanded);
      // ScreenOrientation.lockAsync(5);
      // setTimeout(() => ScreenOrientation.unlockAsync(), 200);
    }
    if (collapsed) {
      // TODO
      setHasCollapsed((prev) => prev + 1);
      console.log("hasCollapsed", hasCollapsed);
      // ScreenOrientation.lockAsync(3);
      // setTimeout(() => ScreenOrientation.unlockAsync(), 200);
    }
  };

  useEffect(() => {
    ScreenOrientation.addOrientationChangeListener(async () => console.log(await ScreenOrientation.getOrientationLockAsync()));
    return () => ScreenOrientation.removeOrientationChangeListeners();
  }, []);

  // const handleRotationOrientationChange = () => {

  // }

  return (
    <View style={{ width: "100%", height: "40%", marginBottom: 0, flex: 1 }}>
      <Video
        style={{ width: "100%", height: "80%" }}
        ref={ref}
        onFullscreenUpdate={handleManualOrientationChange}
        // style={styles.video}
        source={{
          uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        }}
        posterSource={require("../../assets/temp/Group514111.png")}
        posterStyle={{ opacity: 0.3, resizeMode: "cover" }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        usePoster
        onPlaybackStatusUpdate={(status) => {
          setStatus(status);
          // console.log("status", status);
        }}
      />
      <View>
        <TouchableOpacity
          //@ts-ignore
          onPress={() => (!!status.isPlaying ? ref.current.pauseAsync() : ref.current.playAsync())}>
          <Text>
            {/* @ts-ignore */}
            {!!status.isPlaying ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          //@ts-ignore
          onPress={() => (!!status.isPlaying ? ref.current.presentFullscreenPlayer() : ref.current.dismissFullscreenPlayer())}>
          <Text>
            {/* @ts-ignore */}
            Fullscreen
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default VideoPlayer;

//  <VideoPlayer
// videoProps={{
//     shouldPlay: false,
//     resizeMode: ResizeMode.CONTAIN,
//     source: {
//       uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     },
//     ref: videoRef,
//   }}
//   fullscreen={{
//     enterFullscreen: () => {
//       setInFullscreen(!inFullscreen);
//       videoRef.current.setStatusAsync({
//         shouldPlay: true,
//       });
//     },
//     exitFullscreen: () => {
//       setInFullscreen(!inFullscreen);
//       videoRef.current.setStatusAsync({
//         shouldPlay: false,
//       });
//     },
//     inFullscreen,
//   }}
//   style={{
//     videoBackgroundColor: "black",
//     height: inFullscreen ? Dimensions.get("window").width : 160,
//     width: inFullscreen ? Dimensions.get("window").height : 320,
//   }}
// />
