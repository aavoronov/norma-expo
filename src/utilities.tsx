import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
import { styled } from "styled-components/native";
import { THEME } from "./theme";

const HeaderBackImage = () => <Image source={require("../assets/backIcon.png")} style={{ width: 24, height: 24 }}></Image>;

export class ValidationError extends Error {
  options: { type: string; message: string };
  constructor({ name, message }: { name: string; message: string }) {
    super();
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = name;
    this.options = {
      type: "manual",
      message: message,
    };
    return this;
  }
}

interface SignUpFields {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

interface ValidationErrorOptions {
  type: string;
  message: string;
  noValidate?: boolean;
}

export const SignUpFormValidate = (
  data: SignUpFields,
  setError: (name: string, options: ValidationErrorOptions) => void,
  noValidate = false
) => {
  const length = 6;
  const numbers = /[0-9]/g;
  const upperCaseLetters = /[A-Z]/g;
  const upperLetters = /[a-z]/g;
  const reg = /.+@.+\.[A-Za-z]+$/;

  if (noValidate) {
    return;
  }
  try {
    const { name, email, password, passwordRepeat } = data;
    console.log("name", name);

    if (!name) throw new ValidationError({ name: "name", message: "Вы не указали имя" });
    if (!email) throw new ValidationError({ name: "email", message: "Вы не указали почту" });
    if (!password) throw new ValidationError({ name: "password", message: "Вы не указали пароль" });
    if (!passwordRepeat) throw new ValidationError({ name: "passwordRepeat", message: "Вы не указали пароль" });

    if (!email.match(reg)) throw new ValidationError({ name: "email", message: "Неверный адрес электронной почты" });
    if (password !== passwordRepeat) throw new ValidationError({ name: "passwordRepeat", message: "Пароли не совпадают" });

    // if (!password.match(upperLetters) || !password.match(upperCaseLetters) || !password.match(numbers))
    //   throw new Error("Пароль должен содержать заглавную букву, строчную букву и цифры.");

    if (!(password.length >= length))
      throw new ValidationError({ name: "password", message: `Пароль должен содержать минимум ${length} символов` });
    if (!(passwordRepeat.length >= length))
      throw new ValidationError({ name: "passwordRepeat", message: `Пароль должен содержать минимум ${length} символов` });

    console.log("success", JSON.stringify(data));

    // setModal(true);
  } catch (e) {
    console.log("e", JSON.stringify(e));
    // alert(e.options.message);
    setError(e.name, { type: e.type, message: e.options.message });
    // dispatch(toggle({ text: e.message, type: "error" }));
  }
};

export const Title = styled.Text`
  text-align: center;
  font-size: 22px;
  line-height: 28px;
  color: ${THEME.BLACKISH_2D2D31};
  font-family: ${THEME.FONTS.SFProDisplay700};
`;

export const RegularText = styled.Text`
  color: ${THEME.DARK_GRAY_5D5D69};
  font-family: ${THEME.FONTS.SFProText400};
  font-size: 14px;
  text-align: left;
`;
