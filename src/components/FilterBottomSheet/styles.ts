import { colors } from "@/types/colors";
import { fontFamily } from "@/types/fontFamily";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.base.gray700,
  },
  closeButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.base.gray300,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.4,
    borderColor: colors.base.gray400,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  checkboxSelected: {
    backgroundColor: colors.principal.purpleBase,
    borderColor: colors.principal.purpleBase,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statusText: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: colors.base.gray700,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1.4,
    borderColor: colors.base.gray400,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.principal.purpleBase,
  },
  radioLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.base.gray600,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 8,
  },
  resetButton: {
    flex: 1,
    height: 48,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    backgroundColor: colors.base.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.principal.purpleBase,
  },
  applyButton: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.principal.purpleBase,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  applyText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.white,
  },
});
