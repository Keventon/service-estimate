import { colors } from "@/styles/colors";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export type ServiceProps = {
  title: string;
  client: string;
  amount: string;
  statusLabel: string;
  statusBackgroundColor?: string;
  statusDotColor?: string;
};

export function Service({
  title,
  client,
  amount,
  statusLabel,
  statusBackgroundColor = colors.feedback.successLight,
  statusDotColor = colors.feedback.successBase,
}: ServiceProps) {
  return (
    <TouchableOpacity activeOpacity={0.3} style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusBackgroundColor,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: statusDotColor,
              },
            ]}
          />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.client}>{client}</Text>
        <Text style={styles.amount}>{amount}</Text>
      </View>
    </TouchableOpacity>
  );
}
