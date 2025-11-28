import { Loading } from "@/components/Loading";
import { colors } from "@/styles/colors";
import {
  Lato_400Regular,
  Lato_700Bold,
  useFonts,
} from "@expo-google-fonts/lato";
import { Stack } from "expo-router";
import { View } from "react-native";
import "react-native-gesture-handler";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.base.gray100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="newService" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
