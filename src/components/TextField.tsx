import { useHeaderHeight } from "@react-navigation/elements";
import { Ref, forwardRef } from "react";
import { Image, StyleSheet, Text, TextInput } from "react-native";
import { styled } from "styled-components/native";
import { THEME } from "../theme";

const InputWrap = styled.View`
  width: 100%;
  align-items: flex-start;
`;

const ImgWrap = styled.TouchableOpacity`
  position: absolute;
  top: 13px;
  right: 16px;
`;

type KeyboardTypes =
  | "default"
  | "numeric"
  | "email-address"
  | "ascii-capable"
  | "numbers-and-punctuation"
  | "url"
  | "number-pad"
  | "phone-pad"
  | "name-phone-pad"
  | "decimal-pad"
  | "twitter"
  | "web-search"
  | "visible-password";

interface Props {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  returnKeyType?: "default" | "go" | "google" | "join" | "next" | "route" | "search" | "send" | "yahoo" | "done" | "emergency-call";
  textAlign?: "left" | "right" | "center";
  onSubmitEditing?: () => void;
  style?: any;
  autoCorrect?: boolean;
  blurOnSubmit?: boolean;
  withEye?: boolean;
  secure?: boolean;
  setSecure?: (value: boolean) => void;
  hasIcon?: boolean;
  placeholderTextColor?: string;
  multiline?: boolean;
  maxLength?: number;
  limitVisible?: boolean;
  containerStyle?: any;
  limitStyle?: any;
  disabled?: boolean;
  error?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  onBlur?: any;
  onChangeText?: any;
  keyboardType?: KeyboardTypes;
}

const TextField = forwardRef((props: Props, ref: Ref<TextInput>) => {
  const value = props.value;
  const setValue = props.setValue;
  const placeholder = props.placeholder;
  const returnKeyType = props.returnKeyType ?? "done";
  const textAlign = props.textAlign || "left";
  const onSubmitEditing = props.onSubmitEditing;
  const style = props.style;
  const autoCorrect = props.autoCorrect ?? false;
  const autoCapitalize = props.autoCapitalize ?? "none";
  const blurOnSubmit = props.blurOnSubmit ?? false;
  const withEye = props.withEye ?? false;
  const secure = props.secure ?? false;
  const setSecure = props.setSecure ?? null;
  const hasIcon = props.hasIcon ?? null;
  const placeholderTextColor = props.placeholderTextColor || THEME.GRAY_A8A8B1;
  const multiline = props.multiline ?? false;
  const maxLength = props.maxLength ?? 50;
  const limitVisible = props.limitVisible ?? multiline;
  const containerStyle = props.containerStyle;
  const limitStyle = props.limitStyle;
  const disabled = props.disabled ?? false;
  const error = props.error || false;
  const keyboardType = props.keyboardType || "default";

  const headerHeight = useHeaderHeight();

  return (
    <InputWrap style={{ borderRadius: 8, ...containerStyle }}>
      <TextInput
        style={[
          multiline && { textAlignVertical: "top" },
          { height: 50, paddingHorizontal: 16, borderRadius: 8, fontFamily: THEME.FONTS.SFProText500, ...styles.input, ...style },
          error && styles.error,
        ]}
        // autoComplete='tel'
        // keyboardType='phone-pad'
        keyboardType={keyboardType}
        textAlign={textAlign}
        blurOnSubmit={blurOnSubmit}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secure}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        placeholder={placeholder}
        value={value}
        placeholderTextColor={placeholderTextColor}
        multiline={multiline}
        maxLength={maxLength}
        editable={!disabled}
        onChangeText={(value) => {
          setValue(value);
        }}
        ref={ref}
      />
      {limitVisible && (
        <Text style={[{ alignSelf: "flex-end", color: "#c4c6d6", marginBottom: 5 }, limitStyle]}>
          {value.length}/{maxLength} символов
        </Text>
      )}
      {withEye && secure && (
        <ImgWrap
          onPress={() => {
            setSecure(!secure);
          }}>
          <Image source={require("../../assets/eyeOpen.png")} style={{ width: 24, height: 24 }} />
        </ImgWrap>
      )}
      {withEye && !secure && (
        <ImgWrap
          onPress={() => {
            setSecure(!secure);
          }}>
          <Image source={require("../../assets/eyeClosed.png")} style={{ width: 24, height: 24 }} />
        </ImgWrap>
      )}
    </InputWrap>
  );
});

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: THEME.GRAY_A8A8B1,
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 22,
    height: 50,
    width: "100%",

    color: THEME.BLACKISH_2D2D31,
  },
  error: {
    borderColor: THEME.ERROR_RED,
  },
});

export default TextField;
