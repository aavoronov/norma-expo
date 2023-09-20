import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Controller, UseFormSetError, useForm } from "react-hook-form";
import { Keyboard, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { Card, Currency } from "react-native-cloudpayments-sdk";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import ButtonPrimary from "../components/ButtonPrimary";
import CheckboxItem from "../components/CheckboxItem";
import TextField from "../components/TextField";
import { useAppNavigation, useAppSelector } from "../hooks";
import { THEME } from "../theme";
import { axiosQuery, sumToLocale } from "../utilities";
import { SubscriptionPlan } from "./Subscription";
// const Buffer = require("buffer").Buffer;

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
  font-size: 14px;
  font-family: ${THEME.FONTS.SFProText400};
  flex: 1;
  line-height: 18px;
  color: ${THEME.BLACKISH_2D2D31};
`;

interface Props {
  selectedPlan: SubscriptionPlan;
}

interface CardData {
  cardNumber: string;
  validThrough: string;
  cvv: string;
  email: string;
}

interface ChargePayload {
  Amount: number;
  Currency: string;
  CardCryptogramPacket: string;
  IpAddress: string;
  Description: string;
  Email?: string;
}

interface InitiateSubscritionPayload {
  Token: string;
  AccountId: string;
  Description: string;
  Email: string;
  Amount: number;
  Currency: string;
  RequireConfirmation: boolean;
  StartDate: string;
  Interval: string;
  Period: number;
}

const getPaymentInfo = async () => {
  try {
    const res = await axiosQuery({ url: "/users/payment-info" });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

const getIp = async () => {
  try {
    const res = await axios.get("https://api.ipify.org?format=json");
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

const checkDataValidity = async (data: CardData, setError: UseFormSetError<CardData>) => {
  if (parseInt(data.validThrough.split("/")[0]) > 12) {
    setError("validThrough", { message: "Некорректная дата" });
    throw new Error("date incorrect");
  }

  const isCardNumber = await Card.isCardNumberValid(data.cardNumber);
  if (!isCardNumber) {
    setError("cardNumber", { message: "Некорректный номер карты" });
    throw new Error("Некорректный номер карты");
  }
};

const makeCryptogramPacket = async (data: CardData, merchantId: string) => {
  const packet = await Card.makeCardCryptogramPacket({
    cardNumber: data.cardNumber.replace(/\D/g, ""),
    expDate: data.validThrough,
    cvv: data.cvv,
    merchantId,
  });

  return packet;
};

const charge = async (payload: ChargePayload, authorization: string, requestId: string) => {
  try {
    const res = await axios.post("https://api.cloudpayments.ru/payments/cards/charge", payload, {
      headers: {
        "X-Request-ID": requestId,
        "Content-Type": "application/json",
        Authorization: `Basic ${authorization}`,
      },
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

const completeTransaction = async (TransactionId: string, PaRes: string, authorization: string, requestId: string) => {
  const res = await axios.post(
    "https://api.cloudpayments.ru/payments/cards/post3ds",
    {
      TransactionId,
      PaRes,
    },
    {
      headers: {
        "X-Request-ID": requestId,
        "Content-Type": "application/json",
        Authorization: `Basic ${authorization}`,
      },
    }
  );
  return res.data;
};

const unsubscribe = async () => {
  const res = await axiosQuery({ url: `/users/unsubscribe` });
  return true;
};

const subscribe = async (payload: InitiateSubscritionPayload, requestId: string, authorization: string) => {
  const res = await axios.post("https://api.cloudpayments.ru/subscriptions/create", payload, {
    headers: {
      "X-Request-ID": requestId,
      "Content-Type": "application/json",
      Authorization: `Basic ${authorization}`,
    },
  });
};

const PaymentCardDetails = ({ selectedPlan }: Props) => {
  const [emailFieldActive, setEmailFieldActive] = useState(true);
  const [formError, setFormError] = useState("");
  const [requestId, setRequestId] = useState(`${Date.now()}${Math.random()}`.replace(".", ""));
  const [buttonText, setButtonText] = useState(`Оплатить ${sumToLocale(selectedPlan.price)} ₽`);

  const navigation = useAppNavigation();

  const email = useAppSelector((state) => state.user.email);
  const userId = useAppSelector((state) => state.user.id);

  // const defaultValues = {
  //   cardNumber: "4242 4242 4242 4242",
  //   validThrough: "11/22",
  //   cvv: "123",
  //   email: email,
  // };
  const defaultValues = {
    cardNumber: "",
    validThrough: "",
    cvv: "",
    email: email,
  };
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = useForm({ defaultValues, mode: "onChange", criteriaMode: "all" });
  const watchAllFields = watch();

  const onSubmit1 = async () => {
    navigation.navigate(Screens.SubscriptionComplete);
  };

  const onSubmit = async (data: CardData) => {
    setFormError("");
    setButtonText("Обработка...");

    unsubscribe();

    const { merchantId, authorization } = await getPaymentInfo();

    try {
      {
        //requestAuthenticationData
        //
      }
      const { ip } = await getIp();

      checkDataValidity(data, setError);

      const cryptogramPacket = await makeCryptogramPacket(data, merchantId);

      const payload = {
        Amount: selectedPlan.price,
        // Amount: 1,
        Currency: Currency.ruble,
        CardCryptogramPacket: cryptogramPacket,
        IpAddress: ip,
        Description: `Норма - подписка на ${selectedPlan.humanFriendlyTerm}`,
        AccountId: userId,
        Email: emailFieldActive ? data.email : void 0,
      };

      const chargeRes = await charge(payload, authorization, requestId);

      const { Message, Model, Success } = chargeRes;
      let token: string;

      if (!!Message) {
        setFormError(Message);
        throw new Error(Message);
      }

      if (Success) {
        token = Model.Token;
      }

      if (!Success) {
        if (!Model.AcsUrl) {
          throw new Error(Model.CardHolderMessage);
        }
        const { TransactionId, PaRes } = await Card.requestThreeDSecure({
          transactionId: Model.TransactionId,
          paReq: Model.PaReq,
          acsUrl: Model.AcsUrl,
        });

        const transaction = await completeTransaction(TransactionId, PaRes, authorization, requestId);
        if (!transaction.Success) {
          throw new Error(transaction.Model.CardHolderMessage);
        }
        token = transaction.Model.Token;
      }

      const getFirstPaymentDate = (x: number) => {
        const inXdays = (x: number) => new Date(Date.now() + x * 24 * 60 * 60 * 1000);
        const datetime = inXdays(x).toUTCString().substring(5, 25);
        const [day, month, year] = datetime.substring(0, 11).split(" ");
        const time = datetime.substring(12, 20);
        const monthNumberFromString = (str: string) => {
          return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(str) / 3 + 1;
        };
        const date = year + "-" + monthNumberFromString(month) + "-" + day;
        return date + " " + time;
      };

      // const mockFirstPaymentDate = "2023-09-12 22:13:00";

      const subscriptionPayload = {
        Token: token,
        AccountId: userId.toString(),
        Description: `Норма - подписка на ${selectedPlan.humanFriendlyTerm}`,
        Email: data.email,
        Amount: selectedPlan.price,
        Currency: Currency.ruble,
        RequireConfirmation: false,
        StartDate: getFirstPaymentDate(selectedPlan.term),
        // StartDate: mockFirstPaymentDate,
        Interval: "day",
        Period: selectedPlan.term,
      };

      subscribe(subscriptionPayload, requestId, authorization);

      navigation.navigate(Screens.SubscriptionComplete);
    } catch (e) {
      console.log(e.message);
      setFormError(e.message);
      // dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
      //   setError("email", { type: "manual", message: e.response?.data?.message });
    }
    setButtonText(`Оплатить ${sumToLocale(selectedPlan.price)} ₽`);
  };

  const ref_input1 = useRef<TextInput>(null);
  const ref_input2 = useRef<TextInput>(null);
  const ref_input3 = useRef<TextInput>(null);
  const ref_input4 = useRef<TextInput>(null);

  const handleNumberChange = (value: string) => {
    const buildCardNumber = (array: string[]) => {
      let cardNumber = array[1];
      array.slice(2, 6).map((item) => {
        if (item) {
          cardNumber = cardNumber + " " + item;
        }
      });
      return cardNumber;
    };

    let whitespacedValue = value;
    const cardValue = whitespacedValue.replace(/\D/g, "").match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
    if (cardValue) {
      whitespacedValue = buildCardNumber(cardValue);

      // setCard(numbers);
    }
    setValue("cardNumber", whitespacedValue);
  };

  const handleTermChange = (value: string) => {
    let sanitizedValue = value;
    const termValue = sanitizedValue.replace(/\D/g, "").match(/(\d{0,2})(\d{0,2})/);
    if (termValue) {
      sanitizedValue = !termValue[2] ? termValue[1] : `${termValue[1]}/${termValue[2]}`;
    }
    setValue("validThrough", sanitizedValue);
  };

  const handleCvvChange = (value: string) => {
    let sanitizedValue = value;
    const termValue = sanitizedValue.replace(/\D/g, "").match(/(\d{0,3})/);
    if (termValue) {
      sanitizedValue = termValue[1];
    }
    setValue("cvv", sanitizedValue);
  };

  const buttonEnabled =
    !!getValues("cardNumber") &&
    !!getValues("validThrough") &&
    !!getValues("cvv") &&
    (!emailFieldActive || !!getValues("email")) &&
    !Object.keys(errors).length;

  useEffect(() => {
    if (!emailFieldActive) {
      clearErrors("email");
    }
  }, [emailFieldActive]);

  return (
    <View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ width: "100%" }}>
          {/* <Modal /> */}
          <FormHeader>Оплата подписки</FormHeader>

          <FieldWrap>
            <Controller
              control={control}
              rules={{
                required: "Вы не указали номер карты",
                // minLength: { value: 16, message: "16 цифр" },
                validate: (value) => {
                  const numbers = value.replace(/(\D)/g, "");
                  return numbers.length >= 16 || "16 цифр";
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  ref={ref_input1}
                  value={value}
                  onBlur={onBlur}
                  setValue={(event) => {
                    onChange(event);
                    handleNumberChange(event);
                    if (event.length > 16) clearErrors();
                  }}
                  placeholder='Номер карты'
                  returnKeyType='next'
                  onSubmitEditing={() => ref_input2.current.focus()}
                  error={!!errors.cardNumber}
                  autoCapitalize='words'
                  keyboardType='numeric'
                />
              )}
              name='cardNumber'
            />
            {/* <Image source={{ uri: "https://static.cloudpayments.ru/banks/tinkoff.png" }} /> */}
            {errors.cardNumber && <ErrorMessage>{errors.cardNumber.message}</ErrorMessage>}
          </FieldWrap>

          <View style={{ flexDirection: "row", columnGap: 20 }}>
            <FieldWrap style={{ flex: 1 }}>
              <Controller
                control={control}
                rules={{
                  required: "Вы не указали почту",
                  //   pattern: {
                  //     value: /.+@.+\.[A-Za-z]+$/,
                  //     message: "Неверный адрес электронной почты",
                  //   },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    value={value.trim()}
                    onBlur={onBlur}
                    setValue={(event) => {
                      onChange(event);
                      handleTermChange(event);
                    }}
                    placeholder='Срок'
                    returnKeyType='next'
                    onSubmitEditing={() => ref_input3.current.focus()}
                    ref={ref_input2}
                    error={!!errors.validThrough}
                    keyboardType='numeric'
                  />
                )}
                name='validThrough'
              />
              {errors.validThrough && <ErrorMessage>{errors.validThrough.message}</ErrorMessage>}
            </FieldWrap>

            <FieldWrap style={{ flex: 1 }}>
              <Controller
                control={control}
                rules={{
                  required: "Вы не указали cvc",
                  minLength: { value: 3, message: "3 цифры" },
                  maxLength: { value: 3, message: "3 цифры" },
                  // validate: (value) => {
                  //   const { cvv } = getValues();
                  //   clearErrors("cvv");
                  //   return cvv === value || "Пароли не совпадают";
                  // },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    value={value.trim()}
                    onBlur={onBlur}
                    setValue={(event) => {
                      onChange(event);
                      handleCvvChange(event);
                    }}
                    placeholder='CVC'
                    returnKeyType='next'
                    onSubmitEditing={() => ref_input4.current.focus()}
                    ref={ref_input3}
                    secure
                    error={!!errors.cvv}
                    keyboardType='numeric'
                  />
                )}
                name='cvv'
              />
              {errors.cvv && <ErrorMessage>{errors.cvv.message}</ErrorMessage>}
            </FieldWrap>
          </View>

          <View style={{ marginBottom: 40 }}>
            <View>
              <CheckboxItem text='' state={emailFieldActive} setState={setEmailFieldActive}>
                <CheckboxText style={{ verticalAlign: "middle", alignItems: "flex-end", justifyContent: "flex-end" }}>
                  Отправить квитанцию на E-mail
                </CheckboxText>
              </CheckboxItem>
            </View>

            {emailFieldActive && (
              <FieldWrap style={{ marginTop: 16, marginBottom: 0 }}>
                <Controller
                  control={control}
                  rules={{
                    required: "Вы не указали почту",
                    pattern: {
                      value: /.+@.+\.[A-Za-z]+$/,
                      message: "Неверный адрес электронной почты",
                    },
                    validate: (value) => {
                      return !emailFieldActive || !!value || "Вы не указали почту";
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      value={value.trim()}
                      onBlur={onBlur}
                      setValue={onChange}
                      placeholder='Адрес электронной почты'
                      returnKeyType='next'
                      //   onSubmitEditing={() => ref_input3.current.focus()}
                      ref={ref_input4}
                      error={!!errors.email}
                      keyboardType='email-address'
                    />
                  )}
                  name='email'
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
              </FieldWrap>
            )}
          </View>

          <ButtonPrimary
            onPress={handleSubmit(onSubmit)}
            text={buttonText}
            // text={`Оплатить 1 ₽`}
            disabled={!buttonEnabled}
          />
          <View style={{ height: 40, paddingTop: 10 }}>
            {!!formError && <Text style={{ color: THEME.ERROR_RED, fontFamily: THEME.FONTS.SFProText500 }}>{formError}</Text>}
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ fontFamily: THEME.FONTS.StolzlRegular400, color: THEME.LIGHT_GRAY_DADBE3, letterSpacing: 0.2, fontSize: 12 }}>
              Secured by <Text style={{ fontFamily: THEME.FONTS.StolzlBold700, fontSize: 14 }}>cloud</Text>
              <Text style={{ fontSize: 14 }}>payments</Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default PaymentCardDetails;
