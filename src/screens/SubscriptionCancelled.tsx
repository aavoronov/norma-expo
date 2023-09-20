import { useEffect } from "react";
import { Image } from "react-native";
import { useAppNavigation } from "../hooks";
import { Title } from "../utilities";

const SubscriptionCancelled = () => {
  const navigation = useAppNavigation();

  useEffect(() => {
    setTimeout(() => navigation.popToTop(), 3000);
  }, []);

  return (
    <>
      <Image
        source={require("../../assets/subscriptionCancelled.png")}
        style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 0 }]}
      />
      <Title style={{ marginBottom: 16 }}>Подписка отменена!</Title>
    </>
  );
};

export default SubscriptionCancelled;
