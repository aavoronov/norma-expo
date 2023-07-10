import { TouchableOpacity, Text } from "react-native";
import useBackButton from "../hooks/useBackButton";
import { styled } from "styled-components/native";
import { Title } from "../utilities";
import { THEME } from "../theme";

const Container = styled.View`
  height: 100%;
  width: 100%;
  padding: 80px 0;
`;

interface Document {
  title: string;
  link: string;
}

const documents: Document[] = [
  { title: "Политика конфиденциальности", link: "http://norma.policy.url" },
  { title: "Договор оферты", link: "http://norma.offer.url" },
];

const Document = ({ title, link }: Document) => {
  return (
    <TouchableOpacity
      style={{ padding: 20, marginBottom: 16, backgroundColor: THEME.WHITISH_F2F3F8, borderRadius: 8 }}
      onPress={() => alert(link)}>
      <Text style={{ fontFamily: THEME.FONTS.SFProText500 }}>{title}</Text>
    </TouchableOpacity>
  );
};

const LegalDocuments = () => {
  useBackButton();
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
