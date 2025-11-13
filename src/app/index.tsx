import { Wallet } from "lucide-react-native";
import { Text, View } from "react-native";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Olá mundo</Text>

      <Wallet size={24} strokeWidth={1.8} />
    </View>
  );
}
