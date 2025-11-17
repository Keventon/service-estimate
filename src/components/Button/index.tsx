import { colors } from "@/types/colors";
import { Plus } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

export function Button() {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <Plus size={32} strokeWidth={1.4} color={colors.white} />
      <Text style={styles.text}>Novo</Text>
    </TouchableOpacity>
  );
}
