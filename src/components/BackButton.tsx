import { Image, TouchableOpacity, View } from "react-native";
import { NavigationProp } from "../utilities";

const BackButton = ({ navigation }: { navigation: NavigationProp }) =>
  navigation.canGoBack() ? (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        backgroundColor: "#ffffff80",
        borderRadius: 20,
        position: "absolute",
        zIndex: 3,
        top: 20,
        left: 15,
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image source={require("../../assets/backIcon.png")} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
    </View>
  ) : null;

export default BackButton;
