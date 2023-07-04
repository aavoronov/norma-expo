import { styled } from "styled-components/native";
import { View } from "react-native";
import Checkbox from "./Checkbox";
import { THEME } from "../theme";

const Wrap = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;
const Main = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CheckboxText = styled.Text`
  font-size: 12px;
  font-family: ${THEME.FONTS.SFProText400};
  color: ${THEME.BLACKISH_2D2D31};
  flex: 1;
  line-height: 18px;
`;

const CheckboxWrap = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 13px;
  height: 25px;
`;

interface Props {
  state: boolean;
  setState: (value: boolean) => void;
  text: string;
  children?: JSX.Element;
  style?: {};
}

const CheckboxItem = ({ state, setState, text, children, style }: Props) => {
  return (
    <Wrap style={style}>
      <Main onPress={() => setState(!state)}>
        <View style={{ flexDirection: "row" }}>
          <CheckboxWrap>
            <Checkbox checked={state} onChange={() => setState(!state)} />
          </CheckboxWrap>
          {children ? children : <CheckboxText>{text}</CheckboxText>}
        </View>
      </Main>
    </Wrap>
  );
};

export default CheckboxItem;
