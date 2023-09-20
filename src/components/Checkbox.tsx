import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { THEME } from "../theme";
import { Check } from "./svgs";

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
  type?: string;
  activeButtonStyle?: {};
  inactiveButtonStyle?: {};
  activeIconProps?: {};
  inactiveIconProps?: {};
  style?: {};
}

const Checkbox = ({
  checked,
  onChange,
  // backgroundImage = null,
  type = "regular",
  activeButtonStyle = {},
  inactiveButtonStyle = {},
  activeIconProps = {},
  inactiveIconProps = {},
  style,
}: Props) => {
  function onCheckmarkPress() {
    onChange(!checked);
  }

  const iconProps = checked ? activeIconProps : inactiveIconProps;

  switch (type) {
    case "regular":
      return (
        <TouchableOpacity
          style={[
            //buttonStyle,
            {
              borderRadius: 4,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: THEME.GRAY_A8A8B1,
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            checked ? activeButtonStyle : inactiveButtonStyle,
            checked && { borderColor: THEME.MAIN_RED, backgroundColor: THEME.MAIN_RED, borderWidth: 0 },
            style,
          ]}
          onPress={onCheckmarkPress}>
          {checked && <Check />}
        </TouchableOpacity>
      );
  }
};

export default Checkbox;
