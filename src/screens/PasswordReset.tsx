import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import TextField from "../components/TextField";
import { useAppDispatch, useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { THEME } from "../theme";
import { axiosQuery } from "../utilities";

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
    email: "",
  };
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { isDirty, errors },
  } = useForm({ defaultValues, mode: "onChange", criteriaMode: "all" });

  const onSubmit = async (data: typeof defaultValues) => {
    // dispatch(setIsLoading(true));
    try {
      const res = await axiosQuery({ url: "/users/request-restoration", method: "post", payload: { email: data.email }, noAuth: true });
      // console.log("res.data", res);
      navigation.navigate(Screens.MailSent);
    } catch (e) {
      console.log("e", e);
      setNoSuchAccount(true);
      setError("email", { type: "manual", message: "Аккаунт с этой почтой не зарегистрирован" });
    }
    // dispatch(setIsLoading(false));
  };

  useBackButton();

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
                  value={value.trim()}
                  onBlur={onBlur}
                  setValue={onChange}
                  placeholder='Адрес электронной почты'
                  error={!!errors.email}
                  blurOnSubmit={true}
                  keyboardType='email-address'
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
                  navigation.reset({ index: 0, routes: [{ name: Screens.SignUp }] });
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
