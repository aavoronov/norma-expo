import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Check } from "./svgs";
import { THEME } from "../theme";

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
  // backgroundImage: string | NodeRequire;
  type?: string;
  //   backgroundImage = "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23333' stroke-width='2' stroke-dasharray='60%2c 8' stroke-dashoffset='67' stroke-linecap='round'/%3e%3c/svg%3e",
  // buttonStyle = {},
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
  //   backgroundImage = "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23333' stroke-width='2' stroke-dasharray='60%2c 8' stroke-dashoffset='67' stroke-linecap='round'/%3e%3c/svg%3e",
  // buttonStyle = {},
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

    case "orange":
      return (
        <TouchableOpacity
          style={[
            //buttonStyle,
            {
              borderRadius: 8,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#254A63",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            checked ? activeButtonStyle : inactiveButtonStyle,
            style,
          ]}
          onPress={onCheckmarkPress}>
          {checked && <Ionicons name='checkmark' size={15} color='#254A63' {...iconProps} />}
        </TouchableOpacity>
      );
  }
};

export default Checkbox;
