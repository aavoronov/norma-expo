import { Linking, Text, TouchableOpacity } from "react-native";
import { styled } from "styled-components/native";
import useBackButton from "../hooks/useBackButton";
import { THEME } from "../theme";
import { Title, axiosQuery } from "../utilities";
import { useEffect, useState } from "react";

const Container = styled.View`
  height: 100%;
  width: 100%;
  padding: 80px 0;
`;

interface Document {
  title: string;
  link: string;
}

const Document = ({ title, link }: Document) => {
  return (
    <TouchableOpacity
      style={{ padding: 20, marginBottom: 16, backgroundColor: THEME.WHITISH_F2F3F8, borderRadius: 8 }}
      onPress={() => Linking.openURL(link)}>
      <Text style={{ fontFamily: THEME.FONTS.SFProText500 }}>{title}</Text>
    </TouchableOpacity>
  );
};

const LegalDocuments = () => {
  useBackButton();
  const [documents, setDocuments] = useState<Document[]>([]);
  const getDocuments = async () => {
    // dispatch(setIsLoading(true));
    const policy = (await axiosQuery({ url: `/generic-data/policy-link` })).data.value;
    const offer = (await axiosQuery({ url: `/generic-data/offer-link` })).data.value;
    setDocuments([
      { title: "Политика конфиденциальности", link: policy },
      { title: "Договор оферты", link: offer },
    ]);
    // setDocuments(res.data.value);
    // dispatch(setIsLoading(false));
  };

  useEffect(() => {
    getDocuments();
  }, []);
  return (
    <Container>
      <Title style={{ textAlign: "left", marginBottom: 32 }}>Правовые документы</Title>
      {documents.map((item: Document) => (
        <Document title={item.title} link={item.link} key={item.title} />
      ))}
    </Container>
  );
};
export default LegalDocuments;
