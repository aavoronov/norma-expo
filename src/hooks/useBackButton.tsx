import { useEffect } from "react";
import { useAppNavigation } from "../hooks";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";

const useBackButton = () => {
  const navigation = useAppNavigation();

  return useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        navigation.canGoBack() ? (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={require("../../assets/backIcon.png")} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        ) : null,
    });
  }, []);
};

export default useBackButton;
