import { useEffect } from "react";
import { Image, TouchableOpacity } from "react-native";
import { useAppNavigation } from "../hooks";

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
