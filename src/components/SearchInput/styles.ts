import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/fontFamily";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderRadius: 99,
    backgroundColor: colors.base.gray100,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.base.gray200,
    flex: 1,
    height: 48,
    paddingEnd: 16,
  },
  icon: {
    marginStart: 16,
  },
  input: {
    flex: 1,
    paddingStart: 8,
    height: 48,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.base.gray500,
  },
});
