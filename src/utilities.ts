import { styled } from "styled-components/native";
import { THEME } from "./theme";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Linking } from "react-native";

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

export type SetState<T> = (value: T | ((value: T) => T)) => void;
export type valueOf<T> = T[keyof T];
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
export type Not<T extends boolean> = T extends true ? false : true;

export const videoLength = (value: number) => {
  const isLongerThanAnHour = value >= 3600;
  const date = new Date(null);
  date.setSeconds(value); // specify value for SECONDS here
  return isLongerThanAnHour ? date.toISOString().slice(11, 19) : date.toISOString().slice(14, 19);
};

export const sumToLocale = (number: number) => {
  let res = new Intl.NumberFormat("ru-RU").format(number);
  return res;
};

export type NavigationProp = NativeStackNavigationProp<ParamListBase>;

export const notImplemented = () => {
  throw new Error("Not implemented. Please report");
};

export const mailto = (email: string) => {
  const link = `mailto:${email}`;

  Linking.canOpenURL(link)
    .then((supported) => {
      if (!supported) {
        console.log("Phone number is not available");
      } else {
        return Linking.openURL(link);
      }
    })
    .catch((err) => console.log(err));
};

export const getSubscriptionExpiryDate = (dateString: string) => {
  if (!dateString) return;

  const date = new Date(Date.parse(dateString));

  return (
    date.getDate().toString().padStart(2, "0") +
    "." +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "." +
    date.getFullYear().toString()
  );
};

export const subscriptionText = (subscriptionThrough: string) => {
  let text = "Оформите подписку и получите доступ ко всем урокам";

  if (!!subscriptionThrough) {
    const expirationDateText = getSubscriptionExpiryDate(subscriptionThrough);
    const today = new Date();
    const expirationDate = new Date(Date.parse(subscriptionThrough));
    if (expirationDate > today) {
      text = `Срок действия истекает ${expirationDateText}`;
    } else text = `Срок действия истек ${expirationDateText}`;
  }
  return text;
};

export const checkSubscriptionValidity = (subscriptionThrough: string) => {
  if (!subscriptionThrough) return false;

  const today = new Date();
  const expirationDate = new Date(Date.parse(subscriptionThrough));
  if (expirationDate > today) return true;
  else return false;
};
