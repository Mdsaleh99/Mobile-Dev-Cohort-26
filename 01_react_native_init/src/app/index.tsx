import { Text, View, StyleSheet } from "react-native";
import HomeScreen from "./components/BasicComponent";
import { ButtonExample, TextInputExample } from "./components/FormComponent";
import ScrollViewExample from "./components/ScrollView";
import FlatListExample from "./components/FlatList";
import DarkMode from "./components/DarkMode";
import KeyboardAvoidView from "./components/KeyboardAvoidView";


export default function Index() {
  return (
    <View style={styles.container}>
      {/* <HomeScreen /> */}
      {/* <ButtonExample /> */}
      {/* <TextInputExample /> */}
      {/* <ScrollViewExample /> */}
      {/* <FlatListExample /> */}
      {/* <DarkMode /> */}
      <KeyboardAvoidView />


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
