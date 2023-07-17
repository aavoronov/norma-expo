import { Text, TouchableOpacity, View } from "react-native";
import { Link, Lock, LockSmall } from "../components/svgs";
import { THEME } from "../theme";
import usePaidAction from "../hooks/usePaidAction";
import { useAppSelector } from "../hooks";
import { checkSubscriptionValidity } from "../utilities";

interface ILessonFile {
  title: string;
  link: string;
}

interface Props {
  files: ILessonFile[];
  isPaid: boolean;
}

const Files = ({ files, isPaid }: Props) => {
  const SingleFile = ({ item }) => {
    const checkForPaidAction = usePaidAction();
    const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);
    const isActive = checkSubscriptionValidity(subscriptionThrough);

    const handlePress = (link: string) => {
      isPaid ? checkForPaidAction(() => alert(link)) : alert(link);
    };

    return (
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Link />
        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => handlePress(item.link)}>
          <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 14, lineHeight: 22, color: THEME.BLACKISH_2D2D31 }}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {files.map((item) => {
        return <SingleFile item={item} key={item.title} />;
      })}
    </>
  );
};
export default Files;
