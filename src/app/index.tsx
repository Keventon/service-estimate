import { Button } from "@/components/Button";
import {
  FilterBottomSheet,
  SortOption,
  StatusFilter,
} from "@/components/FilterBottomSheet";
import { SearchInput } from "@/components/SearchInput";
import { Service } from "@/components/Service";
import { getServices } from "@/service/storage";
import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/fontFamily";
import BottomSheet from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Index() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<StatusFilter[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [servicesData, setServicesData] = useState<
    Array<{
      id: string;
      title: string;
      client: string;
      amount: string;
      statusLabel: string;
      statusBackgroundColor: string;
      statusDotColor: string;
    }>
  >([]);

  const snapPoints = useMemo(() => ["65%"], []);

  const handleOpenFilters = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleCloseFilters = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleToggleStatus = useCallback((status: StatusFilter) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  }, []);

  const handleSelectSort = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSortOption("recent");
  }, []);

  const handleApplyFilters = useCallback(() => {
    // Conecte aqui a aplicação dos filtros na lista, se necessário
    bottomSheetRef.current?.close();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        const data = await getServices();
        if (!isActive) return;
        const mapped = data.map((item) => ({
          id: item.id,
          title: item.title,
          client: item.client,
          amount: item.total
            ? item.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : "",
          statusLabel:
            item.status === "approved"
              ? "Aprovado"
              : item.status === "sent"
              ? "Enviado"
              : item.status === "rejected"
              ? "Recusado"
              : "Rascunho",
          statusBackgroundColor:
            item.status === "approved"
              ? colors.feedback.successLight
              : item.status === "sent"
              ? colors.feedback.infoLight
              : item.status === "rejected"
              ? colors.feedback.dangerLight
              : colors.base.gray300,
          statusDotColor:
            item.status === "approved"
              ? colors.feedback.successBase
              : item.status === "sent"
              ? colors.feedback.infoBase
              : item.status === "rejected"
              ? colors.feedback.dangerBase
              : colors.base.gray400,
        }));
        setServicesData(mapped);
      }

      load();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <View style={styles.header}>
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
            <Button
              title="Novo"
              onPress={() => router.navigate("/newService")}
            />
          </View>
        </View>

        <View style={styles.divisor} />

        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <SearchInput placeholder="Título ou cliente" />
          </View>

          <TouchableOpacity
            style={styles.buttonFilter}
            activeOpacity={0.7}
            onPress={handleOpenFilters}
          >
            <SlidersHorizontal
              color={colors.principal.purpleBase}
              strokeWidth={1.8}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={servicesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Service
              id={item.id}
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
            paddingTop: 12,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>
              Nenhum serviço listado. Adicione um novo para começar.
            </Text>
          )}
        />

        <FilterBottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          selectedStatuses={selectedStatuses}
          onToggleStatus={handleToggleStatus}
          sortOption={sortOption}
          onSelectSort={handleSelectSort}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
          onRequestClose={handleCloseFilters}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: 24,
    marginTop: Platform.OS === "android" ? 24 : 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divisor: {
    width: "100%",
    height: 1,
    backgroundColor: colors.base.gray300,
    marginHorizontal: -16,
    alignSelf: "stretch",
  },
  inputContainer: {
    marginTop: 24,
    marginBottom: 24,
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 12,
  },
  buttonFilter: {
    backgroundColor: colors.base.gray100,
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: colors.base.gray200,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.base.gray500,
  },
});
