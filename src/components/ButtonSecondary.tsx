import { styled } from "styled-components/native";
import * as React from "react";
import { THEME } from "../theme";
// import { Mail, Phone } from "../components/svgs";

const BtnWhite = styled.TouchableOpacity`
  background: #ffffff;
  width: 100%;
  /* height: 46px; */
`;

const BtnText = styled.Text`
  color: #000;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  font-family: ${THEME.FONTS.SFProText700};
`;

const TextWrap = styled.View`
  display: flex;
  flex-direction: row;

  /* width: 50%; */
  margin: auto auto;
`;
// const iconStyles = "position: absolute;right: 15px;top: 10px;margin-right: 100px;";

interface Props {
  hasIcon?: string;
  text: string;
  onPress: () => any;
  style?: {};
  textStyle?: {};
  disabled?: boolean;
}

const ButtonSecondary = ({ hasIcon, text, onPress, style, textStyle, disabled }: Props) => {
  return (
    <BtnWhite onPress={onPress} style={style}>
      <TextWrap>
        <BtnText style={textStyle}>{text}</BtnText>
      </TextWrap>
    </BtnWhite>
  );
};

export default ButtonSecondary;
