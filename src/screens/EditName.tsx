import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import TextField from "../components/TextField";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { updateProfile } from "../store/userSlice";
import { THEME } from "../theme";
import { AxiosConfig, Title } from "../utilities";

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

  const onSubmit = async (data: typeof defaultValues) => {
    const res = await axios(await AxiosConfig.createAsync({ url: `/users/edit/`, method: "patch", payload: { name: data.name } }));

    // const res1 = await axios(await axiosConfig({ url: `/users/edit/`, method: "patch", payload: { name: data.name } }));

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
