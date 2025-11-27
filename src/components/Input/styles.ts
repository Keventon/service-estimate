import { colors } from "@/types/colors";
import { fontFamily } from "@/types/fontFamily";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderRadius: 44,
    backgroundColor: colors.base.gray100,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    paddingHorizontal: 24,
  },
  input: {
    paddingStart: 8,
    fontSize: 16,
    height: 48,
    fontFamily: fontFamily.regular,
    color: colors.base.gray500,
  },
});
