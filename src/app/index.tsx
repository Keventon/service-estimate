import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { Service } from "@/components/Service";
import { colors } from "@/types/colors";
import { fontFamily } from "@/types/fontFamily";
import { SlidersHorizontal } from "lucide-react-native";
import {
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const services = [
  {
    id: "1",
    title: "Desenvolvimento de aplicativo de loja online",
    client: "Soluções Tecnológicas Beta",
    amount: "R$ 22.300,00",
    statusLabel: "Aprovado",
    statusBackgroundColor: colors.feedback.successLight,
    statusDotColor: colors.feedback.successBase,
  },
  {
    id: "2",
    title: "Consultoria em marketing digital",
    client: "Marketing Wizards",
    amount: "R$ 4.000,00",
    statusLabel: "Rascunho",
    statusBackgroundColor: colors.base.gray300,
    statusDotColor: colors.base.gray400,
  },
  {
    id: "3",
    title: "Serviços de SEO",
    client: "SEO Masters",
    amount: "R$ 3.500,00",
    statusLabel: "Enviado",
    statusBackgroundColor: colors.feedback.infoLight,
    statusDotColor: colors.feedback.infoBase,
  },
  {
    id: "4",
    title: "Criação de conteúdo",
    client: "Content Creators",
    amount: "R$ 2.500,00",
    statusLabel: "Rascunho",
    statusBackgroundColor: colors.base.gray300,
    statusDotColor: colors.base.gray400,
  },
];

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
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

      <View
        style={{
          width: "100%",
          height: 1,
          backgroundColor: colors.base.gray300,
        }}
      />

      <View
        style={{
          marginTop: 24,
          marginBottom: 24,
          marginHorizontal: 24,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            marginRight: 12,
          }}
        >
          <SearchInput placeholder="Título ou cliente" />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.base.gray100,
            width: 48,
            height: 48,
            borderWidth: 1,
            borderColor: colors.base.gray200,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SlidersHorizontal
            color={colors.principal.purpleBase}
            strokeWidth={1.8}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Service
            title={item.title}
            client={item.client}
            amount={item.amount}
            statusLabel={item.statusLabel}
            statusBackgroundColor={item.statusBackgroundColor}
            statusDotColor={item.statusDotColor}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 48,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}
