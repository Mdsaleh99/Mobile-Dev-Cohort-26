import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

type AppTextProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
};

export function AppText({ children, style }: AppTextProps) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "#E5EDF8",
    fontSize: 15,
    lineHeight: 22,
  },
});
