import { colors } from "@/types/colors";
import { Plus } from "lucide-react-native";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
};

export function Button({ title, ...rest }: Props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} {...rest}>
      <Plus size={24} strokeWidth={1.4} color={colors.white} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
