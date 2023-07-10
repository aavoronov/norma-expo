import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import TextField from "../components/TextField";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { updateRole } from "../store/userSlice";
import { THEME } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useBackButton from "../hooks/useBackButton";
import { Screens } from "../Screens";

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
    formState: { isDirty, errors },
  } = useForm({ defaultValues, mode: "onChange" });
  const watchAllFields = watch();

  const onSubmit = async (data: typeof defaultValues) => {
    console.log("data", JSON.stringify(data));
    // navigation.navigate("Quiz");
    dispatch(updateRole({ role: "user" }));
    await AsyncStorage.setItem("role", "user");
  };

  useBackButton();

  // const dispatch = useAppDispatch();
  // const signUpHandler = async (values) => {
  //   try {
  //     const res = await axios.post(`${THEME.API_URL}/users/`, { ...values });

  //     // setModal(false);
  //     setEmail("");
  //     setPassword("");
  //     setPasswordRepeat("");
  //     navigation.navigate("SignInByEmail");
  //     dispatch(toggle({ text: "Аккаунт создан. Проверьте почту", type: "success" }));
  //   } catch (e) {
  //     dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
  //     // console.log(e);
  //   }
  // };

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
                  value={value}
                  onBlur={onBlur}
                  setValue={onChange}
                  placeholder='Адрес электронной почты'
                  returnKeyType='next'
                  onSubmitEditing={() => ref_input2.current.focus()}
                  error={!!errors.email}
                  keyboardType='email-address'
                />
              )}
              name='email'
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FieldWrap>

          <FieldWrap>
            <Controller
              control={control}
              rules={{
                required: "Вы не указали пароль",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  value={value}
                  onBlur={onBlur}
                  setValue={onChange}
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
