import { colors } from "@/types/colors";
import { TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles";

export function Input({ ...rest }: TextInputProps) {
  return (
    <View style={styles.container}>
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
