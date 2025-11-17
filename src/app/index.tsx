import { Button } from "@/components/Button";
import { colors } from "@/types/colors";
import { fontFamily } from "@/types/fontFamily";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          padding: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: fontFamily.bold,
                color: colors.principal.purpleBase,
                fontSize: 18,
              }}
            >
              Orçamentos
            </Text>

            <Text
              style={{
                fontFamily: fontFamily.regular,
                color: colors.base.gray500,
                fontSize: 14,
                marginTop: 8,
              }}
            >
              Você tem 1 item em rascunho
            </Text>
          </View>
          <Button />
        </View>
      </View>
    </SafeAreaView>
  );
}
