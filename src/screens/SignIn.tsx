import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import TextField from "../components/TextField";
import { useAppDispatch, useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { updateProfile } from "../store/userSlice";
import { THEME } from "../theme";

const FormHeader = styled.Text`
  font-size: 22px;
  line-height: 29px;
  color: ${THEME.BLACKISH_2D2D31};
  margin-bottom: 32px;
  font-family: ${THEME.FONTS.SFProDisplay700};
`;

const FieldWrap = styled.View`
  margin-bottom: 24px;
`;

const ErrorMessage = styled.Text`
  color: ${THEME.ERROR_RED};
  margin-top: 8px;
  font-family: ${THEME.FONTS.SFProText500};
`;

export default function SignIn() {
  const [secure, setSecure] = useState(true);
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const defaultValues = {
    email: "",
    password: "",
  };
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ defaultValues, mode: "onChange" });
  const watchAllFields = watch();

  const onSubmit = async (data: typeof defaultValues) => {
    try {
      const res = await axios.post(`${THEME.API_URL}/users/auth`, data);
      dispatch(
        updateProfile({
          name: res.data.user.name,
          subscriptionThrough: res.data.user.subscriptionThrough,
          // role: res.data.user.role,
          role: "user",
          email: res.data.user.email,
          subscriptionCancelled: res.data.user.subscriptionCancelled,
          emailConfirmed: res.data.user.emailConfirmed,
        })
      );
      await AsyncStorage.setItem("norma-token", res.data.token);
    } catch (e) {
      console.log("e", e.response.data.message);
      setError("email", { type: "manual", message: "" });
      setError("password", { type: "manual", message: e.response.data.message });
    }
  };

  useBackButton();

  const ref_input2 = useRef<TextInput>(null);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ height: "100%", justifyContent: "space-between", paddingVertical: 100 }}>
        {/* <Modal /> */}
        <View>
          <FormHeader>Войдите в аккаунт</FormHeader>

          <FieldWrap>
            <Controller
              control={control}
              rules={{
                required: "Вы не указали почту",
                pattern: {
                  value: /.+@.+\.[A-Za-z]+$/,
                  message: "Неверный адрес электронной почты",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  value={value.trim()}
                  onBlur={onBlur}
                  setValue={(value: string) => {
                    onChange(value);
                    clearErrors();
                  }}
                  placeholder='Адрес электронной почты'
                  returnKeyType='next'
                  onSubmitEditing={() => ref_input2.current.focus()}
                  error={!!errors.email}
                  keyboardType='email-address'
                />
              )}
              name='email'
            />
            {errors.email?.message && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FieldWrap>

          <FieldWrap>
            <Controller
              control={control}
              rules={{
                required: "Вы не указали пароль",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  value={value.trim()}
                  onBlur={onBlur}
                  setValue={(value: string) => {
                    onChange(value);
                    clearErrors();
                  }}
                  placeholder='Пароль'
                  returnKeyType='done'
                  ref={ref_input2}
                  withEye={true}
                  secure={secure}
                  setSecure={setSecure}
                  error={!!errors.password}
                  blurOnSubmit={true}
                />
              )}
              name='password'
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FieldWrap>

          <ButtonPrimary
            onPress={handleSubmit(onSubmit)}
            text='Войти'
            disabled={!(!!getValues("password") && !!getValues("email") && !Object.keys(errors).length)}
            style={{ marginBottom: 32 }}
          />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text
              style={{
                verticalAlign: "middle",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                fontSize: 14,
                lineHeight: 14,
                fontFamily: THEME.FONTS.SFProText500,
              }}>
              Забыли пароль?{" "}
            </Text>
            <ButtonSecondary
              text='Восстановить'
              onPress={() => {
                navigation.navigate(Screens.PasswordReset);
              }}
              style={{ width: "auto" }}
              textStyle={{ color: THEME.MAIN_RED, lineHeight: 15, fontFamily: THEME.FONTS.SFProText500 }}
            />
          </View>
        </View>
        <ButtonSecondary
          text='У меня нет аккаунта'
          onPress={() => {
            navigation.navigate(Screens.SignUp);
          }}
          style={{ width: "auto" }}
          textStyle={{ color: THEME.MAIN_RED, lineHeight: 15, fontFamily: THEME.FONTS.SFProText500 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
