import { colors } from "@/styles/colors";
import { ActivityIndicator } from "react-native";

export function Loading() {
  return <ActivityIndicator color={colors.principal.purpleBase} size="large" />;
}
