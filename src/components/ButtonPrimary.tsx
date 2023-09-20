import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { styled } from "styled-components/native";
import { THEME } from "../theme";

// import { ArrowIcon } from "../components/svgs";

const Btn = styled.TouchableOpacity`
  background: ${THEME.MAIN_RED};
  /* border-radius: 15px; */
  width: 100%;
  height: 51px;
  border-radius: 8px;
`;

const TextCustom = styled.Text`
  font-size: 16px;

  /* identical to box height, or 26px */
  /* width: 100%; */
  text-align: center;

  color: #fff;
  /* font-family: SF Pro Text; */
  font-weight: 600;
  line-height: 18px;
  color: #ffffff;
  margin: auto 0;
  font-family: ${THEME.FONTS.SFProText600};
`;

const Icon = styled.Image`
  /* position: absolute; */
  /* left: 10px; */
  /* top: 0px; */
  margin-right: 10px;
  /* padding: 10px; */
`;

const TextWrap = styled.View`
  /* width: 50%; */
  /* height: 100%; */
  margin: auto auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface Props {
  hasArrow?: string;
  hasIcon?: string;
  text: string;
  onPress: () => any;
  style?: {};
  textStyle?: {};
  disabled?: boolean;
}

const ButtonPrimary = ({ hasArrow, hasIcon, text, onPress, style, textStyle, disabled = false }: Props) => {
  return (
    <Btn
      as={disabled ? View : TouchableOpacity}
      onPress={onPress}
      style={disabled ? [{ backgroundColor: THEME.GRAY_A8A8B1 }, style] : [style]}>
      <TextWrap>
        <TextCustom style={[!hasIcon && { width: "100%" }, disabled && { color: THEME.LIGHT_GRAY_DADBE3 }, textStyle]}>{text}</TextCustom>
      </TextWrap>
    </Btn>
  );
};

export default ButtonPrimary;
