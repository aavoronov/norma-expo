import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export const useKeyboardEvents = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true); // or some other action
      //   console.log(isKeyboardVisible); //doesn't work as intended, wrap in useEffect in parent component to debug
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false); // or some other action
      //   console.log(isKeyboardVisible);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return isKeyboardVisible; //import this
};
