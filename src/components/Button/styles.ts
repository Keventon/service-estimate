import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/fontFamily";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.principal.purpleBase,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 99,
    paddingEnd: 24,
    gap: 8,
  },
  text: {
    color: colors.white,
    textAlign: "center",
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
});
