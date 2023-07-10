import { View, Text, TouchableOpacity } from "react-native";
import useBackButton from "../hooks/useBackButton";
import { styled } from "styled-components/native";
import { Title } from "../utilities";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import { THEME } from "../theme";
import ButtonPrimary from "../components/ButtonPrimary";
import { resetUser, updateProfile } from "../store/userSlice";
import { Screens } from "../Screens";
import { Controller, useForm } from "react-hook-form";
import TextField from "../components/TextField";

const Container = styled.View`
  height: 100%;
  width: 100%;
  padding: 80px 0;
`;

const ErrorMessage = styled.Text`
  color: ${THEME.ERROR_RED};
  margin-top: 8px;
  font-family: ${THEME.FONTS.SFProText500};
`;

const EditName = () => {
  useBackButton();
  const userName = useAppSelector((state) => state.user.name);
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  const defaultValues = {
    name: userName,
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
    dispatch(updateProfile({ name: data.name }));
    navigation.goBack();
  };

  return (
    <Container>
      <Title style={{ textAlign: "left", fontSize: 24, marginBottom: 36 }}>Изменить имя</Title>
      <Controller
        control={control}
        rules={{
          required: "Вы не указали имя",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            value={value}
            onBlur={onBlur}
            setValue={onChange}
            placeholder='Имя'
            error={!!errors.name}
            blurOnSubmit={true}
            keyboardType='email-address'
            autoCapitalize='words'
          />
        )}
        name='name'
      />
      {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

      <ButtonPrimary
        onPress={handleSubmit(onSubmit)}
        text={"Сохранить"}
        disabled={!(!!getValues("name") && !Object.keys(errors).length)}
        style={{ marginTop: Object.keys(errors).length ? 21 : 48 }}
      />
    </Container>
  );
};
export default EditName;
