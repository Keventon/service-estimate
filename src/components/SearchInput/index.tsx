import { colors } from "@/styles/colors";
import { Search } from "lucide-react-native";
import { TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles";

export function SearchInput({ ...rest }: TextInputProps) {
  return (
    <View style={styles.container}>
      <Search
        style={styles.icon}
        color={colors.base.gray600}
        strokeWidth={1.3}
      />

      <TextInput
        style={styles.input}
        cursorColor={colors.principal.purpleBase}
        selectionColor={colors.principal.purpleBase}
        placeholderTextColor={colors.base.gray500}
        {...rest}
      />
    </View>
  );
}
