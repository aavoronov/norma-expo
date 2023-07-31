import { Screens } from "../Screens";
import { useAppNavigation, useAppSelector } from "../hooks";
import { checkSubscriptionValidity } from "../utilities";

const usePaidAction = () => {
  const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);
  const isActive = checkSubscriptionValidity(subscriptionThrough);
  const navigation = useAppNavigation();

  return (callback: () => void) => {
    if (!isActive) {
      return navigation.navigate(Screens.Subscription);
    }
    return callback();
  };
};

export default usePaidAction;
