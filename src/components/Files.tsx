import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "../components/svgs";
import usePaidAction from "../hooks/usePaidAction";
import { THEME } from "../theme";

interface ILessonFile {
  title: string;
  url: string;
}

interface Props {
  files: ILessonFile[];
  isPaid: boolean;
}

const readFileAsync = (uri: string, res?) => {
  FileSystem.getContentUriAsync(uri)
    .then((cUri) => {
      IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: cUri,
        flags: 1,
        type: !!res ? res.headers["Content-Type"] : void 0,
      });
    })
    .catch((e) => console.log("e", e));
};

const openFileAsync = (url: string) => {
  let remoteUrl = `${THEME.API_URL}/uploads/lesson-files/${url}`;
  let localDir = `${FileSystem.documentDirectory}/norma`;
  FileSystem.readDirectoryAsync(localDir)
    .then((res) => {
      FileSystem.getInfoAsync(`${localDir}/${url}`).then((res) => {
        if (!!res.exists) {
          readFileAsync(`${localDir}/${url}`);
        } else {
          FileSystem.downloadAsync(remoteUrl, `${localDir}/${url}`).then((res) => {
            readFileAsync(res.uri, res);
          });
        }
      });
    })
    .catch((e) => {
      console.log("e.message", e.message);
      if ((e.message as string).includes("could not be read")) {
        FileSystem.makeDirectoryAsync(localDir);
        openFileAsync(url);
      }
    });
};

const Files = ({ files, isPaid }: Props) => {
  const SingleFile = ({ item }) => {
    const checkForPaidAction = usePaidAction();

    const handlePress = (url: string) => {
      // isPaid ? checkForPaidAction(() => downloadAndOpenFile(url)) : downloadAndOpenFile(url);
      isPaid ? checkForPaidAction(() => openFileAsync(url)) : openFileAsync(url);
    };

    return (
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Link />
        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => handlePress(item.url)}>
          <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 14, lineHeight: 22, color: THEME.BLACKISH_2D2D31 }}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {files.map((item) => {
        return <SingleFile item={item} key={item.title} />;
      })}
    </>
  );
};
export default Files;
