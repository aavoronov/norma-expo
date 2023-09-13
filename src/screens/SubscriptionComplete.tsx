import { useEffect } from "react";
import { Image } from "react-native";
import { useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { Title } from "../utilities";

const SubscriptionComplete = () => {
  const navigation = useAppNavigation();

  useEffect(() => {
    setTimeout(() => navigation.goBack(), 3000);
  }, []);

  return (
    <>
      <Image
        source={require("../../assets/subscriptionCancelled.png")}
        style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 0 }]}
      />
      <Title style={{ marginBottom: 16 }}>Подписка оформлена!</Title>
    </>
  );
};

export default SubscriptionComplete;
