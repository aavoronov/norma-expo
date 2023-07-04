import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ImageBackground, Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Text } from "react-native";
import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import TextField from "../components/TextField";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { countVisit } from "../store/visitSlice";
import { THEME } from "../theme";
import { SignUpFormValidate } from "../utilities";
import CheckboxItem from "../components/CheckboxItem";
import ButtonSecondary from "../components/ButtonSecondary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
import { updateRole } from "../store/userSlice";

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

export default function PasswordReset() {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const [noSuchAccount, setNoSuchAccount] = useState(false);

  const defaultValues = {
    email: "test@test.ru",
  };
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { isDirty, errors },
  } = useForm({ defaultValues, mode: "onChange", criteriaMode: "all" });

  const onSubmit = (data: typeof defaultValues) => {
    console.log("data", JSON.stringify(data));
    // navigation.navigate("Quiz");
    // dispatch(updateRole({ role: "user" }));
    if (data.email === "test@test.ru") {
      navigation.navigate("MailSent");
    } else {
      setNoSuchAccount(true);
      setError("email", { type: "manual", message: "Аккаунт с этой почтой не зарегистрирован" });
    }
  };

  useEffect(() => {
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ height: "100%", justifyContent: "space-between", paddingVertical: 100 }}>
        {/* <Modal /> */}
        <View>
          <FormHeader>Укажите адрес электронной почты, указанный при регистрации</FormHeader>

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
                  error={!!errors.email}
                  blurOnSubmit={true}
                />
              )}
              name='email'
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FieldWrap>

          <ButtonPrimary
            onPress={handleSubmit(onSubmit)}
            text={"Восстановить пароль"}
            disabled={!(!!getValues("email") && !Object.keys(errors).length)}
            style={{ marginBottom: 32 }}
          />
          {!!noSuchAccount && (
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <ButtonSecondary
                text='Зарегистрироваться'
                onPress={() => {
                  navigation.reset({ index: 0, routes: [{ name: "SignUp" }] });
                }}
                style={{ width: "auto" }}
                textStyle={{ color: THEME.MAIN_RED, lineHeight: 15, fontFamily: THEME.FONTS.SFProText500 }}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
