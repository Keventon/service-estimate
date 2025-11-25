import { colors } from "@/types/colors";
import { fontFamily } from "@/types/fontFamily";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.base.gray100,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.base.gray200,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    paddingRight: 40,
    color: colors.base.gray700,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexShrink: 0,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  statusText: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: colors.base.gray700,
  },
  client: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.base.gray600,
  },
  amount: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.base.gray700,
  },
});
