import { useEffect, useState } from "react";
import ButtonPrimary from "../components/ButtonPrimary";
import useBackButton from "../hooks/useBackButton";
import { RegularText, Title, axiosQuery, mailto } from "../utilities";

const Support = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const getAdminEmail = async () => {
    // dispatch(setIsLoading(true));
    const res = await axiosQuery({ url: `/generic-data/email` });
    setAdminEmail(res.data.value);
    // dispatch(setIsLoading(false));
  };

  useEffect(() => {
    getAdminEmail();
  }, []);

  useBackButton();
  return (
    <>
      <Title style={{ marginBottom: 16 }}>Возникла проблема?</Title>
      <RegularText style={{ textAlign: "center", marginBottom: 32, lineHeight: 22 }}>
        {`Сообщите нам, и мы постараемся\nрешить ваш вопрос`}
      </RegularText>
      {!!adminEmail && (
        <>
          <ButtonPrimary text='Связаться с поддержкой' onPress={() => mailto(adminEmail)} style={{ marginBottom: 36 }} />
          <RegularText style={{ textAlign: "center" }}>{adminEmail}</RegularText>
        </>
      )}
    </>
  );
};
export default Support;
