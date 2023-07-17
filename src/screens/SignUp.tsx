import axios from "axios";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import CheckboxItem from "../components/CheckboxItem";
import TextField from "../components/TextField";
import { useAppDispatch, useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
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

const CheckboxText = styled.Text`
  font-size: 12px;
  font-family: ${THEME.FONTS.SFProText400};
  flex: 1;
  line-height: 18px;
  color: ${THEME.BLACKISH_2D2D31};
`;

export default function SignUp() {
  const [secure, setSecure] = useState(true);
  const [agreement, setAgreement] = useState(false);
  const [promo, setPromo] = useState(false);

  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const defaultValues = {
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  };
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    watch,
    formState: { isDirty, errors },
  } = useForm({ defaultValues, mode: "onChange", criteriaMode: "all" });
  const watchAllFields = watch();

  const onSubmit = async (data: typeof defaultValues) => {
    try {
      const res = await axios.post(`${THEME.API_URL}/users/check`, data);
      if (res) {
        console.log("res", JSON.stringify(res));
        navigation.navigate(Screens.Quiz, {
          ...data,
          promoAgreement: promo,
        });
      }
      // setModal(false);

      // dispatch(toggle({ text: "Аккаунт создан. Проверьте почту", type: "success" }));
    } catch (e) {
      // dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
      setError("email", { type: "manual", message: e.response?.data?.message });
    }
  };

  useBackButton();

  // const dispatch = useAppDispatch();

  const ref_input2 = useRef<TextInput>(null);
  const ref_input3 = useRef<TextInput>(null);
  const ref_input4 = useRef<TextInput>(null);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ width: "100%" }}>
        {/* <Modal /> */}
        <FormHeader>Регистрация</FormHeader>

        <FieldWrap>
          <Controller
            control={control}
            rules={{ required: "Вы не указали имя" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                value={value}
                onBlur={onBlur}
                setValue={onChange}
                placeholder='Имя'
                returnKeyType='next'
                onSubmitEditing={() => ref_input2.current.focus()}
                error={!!errors.name}
                autoCapitalize='words'
              />
            )}
            name='name'
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FieldWrap>

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
                onSubmitEditing={() => ref_input3.current.focus()}
                ref={ref_input2}
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
              minLength: { value: 6, message: "Пароль должен содержать минимум 6 символов" },
              validate: (value) => {
                const { passwordRepeat } = getValues();
                clearErrors("passwordRepeat");
                return passwordRepeat === value || "Пароли не совпадают";
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                value={value}
                onBlur={onBlur}
                setValue={onChange}
                placeholder='Пароль'
                returnKeyType='next'
                onSubmitEditing={() => ref_input4.current.focus()}
                ref={ref_input3}
                withEye={true}
                secure={secure}
                setSecure={setSecure}
                error={!!errors.password}
              />
            )}
            name='password'
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </FieldWrap>

        <FieldWrap style={{ marginBottom: 48 }}>
          <Controller
            control={control}
            rules={{
              required: "Вы не указали пароль",
              minLength: { value: 6, message: "Пароль должен содержать минимум 6 символов" },
              validate: (value) => {
                const { password } = getValues();
                clearErrors("password");
                return password === value || "Пароли не совпадают";
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                value={value}
                onBlur={onBlur}
                setValue={onChange}
                placeholder='Повторите пароль'
                ref={ref_input4}
                blurOnSubmit={true}
                secure={secure}
                error={!!errors.passwordRepeat}
              />
            )}
            name='passwordRepeat'
          />
          {errors.passwordRepeat && <ErrorMessage>{errors.passwordRepeat.message}</ErrorMessage>}
        </FieldWrap>

        <View style={{ marginBottom: 36 }}>
          <CheckboxItem text='test' state={agreement} setState={setAgreement}>
            <CheckboxText style={{ verticalAlign: "middle", alignItems: "flex-end", justifyContent: "flex-end" }}>
              Я принимаю{" "}
              <CheckboxText style={{ color: THEME.MAIN_RED }} onPress={() => alert("Политика")}>
                Политику конфиденциальности
              </CheckboxText>{" "}
              и{" "}
              <CheckboxText style={{ color: THEME.MAIN_RED }} onPress={() => alert("Согласие")}>
                Согласие на обработку персональных данных
              </CheckboxText>
            </CheckboxText>
          </CheckboxItem>
          <CheckboxItem
            text='Я хочу получать информацию о новых курсах и специальные предложения на электронную почту'
            state={promo}
            setState={setPromo}
          />
        </View>

        <ButtonPrimary
          onPress={handleSubmit(onSubmit)}
          text='Зарегистрироваться'
          disabled={!agreement || !isDirty || !!Object.keys(errors).length}
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
            Уже есть аккаунт?{" "}
          </Text>
          <ButtonSecondary
            text='Войти'
            onPress={() => {
              navigation.navigate(Screens.SignIn);
            }}
            style={{ width: "auto" }}
            textStyle={{ color: THEME.MAIN_RED, lineHeight: 15, fontFamily: THEME.FONTS.SFProText500 }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
