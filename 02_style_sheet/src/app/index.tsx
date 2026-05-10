import { Text, View, StyleSheet } from "react-native";
import UnsafeScreen from "./components/UnsafeScreen";
import SafeScreen from "./components/SafeScreen";
import StatusBarOne from "./components/StatusBarOne";
import StatusBarTwo from "./components/StatusBarTwo";
import StyleCompose from "./components/StyleCompose";
import FlattenStyle from "./components/FlattenStyle";
import ScreenOrientationScreen from "./components/ScreenOrientation";
import DarkAndLightMode from "./components/DarkAndLightMode";

export default function Index() {
  return (
    <View style={styles.container}>
      {/* <UnsafeScreen /> */}
      {/* <SafeScreen /> */}
      {/* <StatusBarOne /> // this status bar is from react native */}
      {/* <StatusBarTwo /> // this status bar is from expo */}
      {/* <StyleCompose /> */}
      {/* <FlattenStyle /> */}
      {/* <ScreenOrientationScreen/> */}
      <DarkAndLightMode />

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
