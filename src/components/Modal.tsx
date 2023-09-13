import { styled } from "styled-components/native";
import React, { useState } from "react";
import { Modal, StyleSheet, useWindowDimensions, View } from "react-native";
import SwipeUpDownModal from "react-native-swipe-modal-up-down";
import { useKeyboardEvents } from "../hooks/useKeyboardEvents";

const Overlay = styled.TouchableOpacity`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.6;
`;

type SetState<T> = (value: T | ((value: T) => T)) => void;

interface Props {
  state: boolean;
  setState: SetState<boolean>;
  heightFactor?: number;
  children: JSX.Element;
  contentContainerStyle?: {};
  gestureControlled?: boolean;
  overlayOpacity?: number;
  handleClose?: () => void;
  avoidKeyboard?: boolean;
}

const ModalCustom = ({
  state,
  setState,
  heightFactor = 0.5,
  children,
  contentContainerStyle,
  gestureControlled = true,
  overlayOpacity = 0.5,
  handleClose,
  avoidKeyboard = true,
}: Props) => {
  const [animateModal, setanimateModal] = useState(false);
  const { width, height } = useWindowDimensions();
  const isKeyboardVisible = useKeyboardEvents();

  const Main = styled.View`
    position: absolute;
    bottom: 0;
    width: 100%;
    /* height: 50%; */
    border-radius: 24px 24px 0 0;
    z-index: 1;
    background-color: #fff;
    margin-top: 10px;
  `;

  return (
    <>
      {gestureControlled ? (
        <SwipeUpDownModal
          modalVisible={state}
          setModalVisible={setState}
          PressToanimate={animateModal}
          onRequestClose={() => setState(false)}
          // MainContainerModal={MainContainerModal}
          overlayOpacity={overlayOpacity}
          //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
          HeaderStyle={[
            styles.headerContent,
            { marginTop: isKeyboardVisible && avoidKeyboard ? height - height * heightFactor - 200 : height - height * heightFactor },
          ]}
          HeaderContent={
            <View style={styles.containerHeader}>
              <View style={{ width: 65, height: 3, borderRadius: 3, backgroundColor: "#254A63" }}></View>
            </View>
          }
          ContentModalStyle={[
            styles.Modal,
            { marginTop: isKeyboardVisible && avoidKeyboard ? height - height * heightFactor - 200 : height - height * heightFactor },
          ]}
          ContentModal={
            <View style={[styles.containerContent, contentContainerStyle]}>
              {children}
              {/* <FlatList data={data} renderItem={({ item, index }) => <item key={index} Data={item} />} keyExtractor={(item) => item.id} /> */}
            </View>
          }
          onClose={() => {
            setState(false);
            setanimateModal(false);
            handleClose && handleClose();
          }}
        />
      ) : (
        <Modal
          animationType='slide'
          transparent={true}
          visible={state}
          onRequestClose={() => {
            setState(false);
          }}>
          <Main style={{ height: height * heightFactor }}>{children}</Main>
          {state && (
            <Overlay
              onPress={() => {
                setState(false);
              }}></Overlay>
          )}
        </Modal>
      )}
    </>
  );
};

export default ModalCustom;

const styles = StyleSheet.create({
  containerContent: {
    marginTop: 40,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 42,
    paddingVertical: 12,
  },
  containerHeader: {
    // flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 24,
  },
  headerContent: {
    // marginTop: "100%",
    marginTop: 0,
  },
  Modal: {
    backgroundColor: "#fff",
    // marginTop: "100%",
    // marginTop: "50%",

    marginTop: 0,
    borderRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
