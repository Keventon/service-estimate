import { colors } from "@/types/colors";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Check, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export type StatusFilter = "Rascunho" | "Enviado" | "Aprovado" | "Recusado";

export type SortOption = "recent" | "old" | "higher" | "lower";

type Props = Omit<BottomSheetProps, "children"> & {
  selectedStatuses: StatusFilter[];
  onToggleStatus: (status: StatusFilter) => void;
  sortOption: SortOption;
  onSelectSort: (value: SortOption) => void;
  onReset: () => void;
  onApply: () => void;
  onRequestClose: () => void;
};

const statusOptions: Array<{
  label: StatusFilter;
  backgroundColor: string;
  dotColor: string;
}> = [
  {
    label: "Rascunho",
    backgroundColor: colors.base.gray300,
    dotColor: colors.base.gray400,
  },
  {
    label: "Enviado",
    backgroundColor: colors.feedback.infoLight,
    dotColor: colors.feedback.infoBase,
  },
  {
    label: "Aprovado",
    backgroundColor: colors.feedback.successLight,
    dotColor: colors.feedback.successBase,
  },
  {
    label: "Recusado",
    backgroundColor: colors.feedback.dangerLight,
    dotColor: colors.feedback.dangerBase,
  },
];

const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: "Mais recente", value: "recent" },
  { label: "Mais antigo", value: "old" },
  { label: "Maior valor", value: "higher" },
  { label: "Menor valor", value: "lower" },
];

export const FilterBottomSheet = forwardRef<BottomSheet, Props>(
  (
    {
      selectedStatuses,
      onToggleStatus,
      sortOption,
      onSelectSort,
      onReset,
      onApply,
      onRequestClose,
      ...rest
    },
    ref
  ) => {
    const snapPoints = useMemo(() => ["65%"], []);

    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.3}
          {...backdropProps}
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={-1}
        handleComponent={null}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: colors.base.gray300 }}
        onClose={onRequestClose}
        {...rest}
      >
        <BottomSheetView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar e ordenar</Text>

            <TouchableOpacity
              style={styles.closeButton}
              hitSlop={8}
              onPress={onRequestClose}
            >
              <X color={colors.base.gray600} size={24} strokeWidth={1.8} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={{ gap: 12 }}>
              {statusOptions.map((status) => {
                const isSelected = selectedStatuses.includes(status.label);

                return (
                  <TouchableOpacity
                    key={status.label}
                    style={styles.statusRow}
                    activeOpacity={0.7}
                    onPress={() => onToggleStatus(status.label)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && (
                        <Check color={colors.white} size={14} strokeWidth={2} />
                      )}
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: status.backgroundColor },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: status.dotColor },
                        ]}
                      />
                      <Text style={styles.statusText}>{status.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordenação</Text>

            <View style={{ gap: 12 }}>
              {sortOptions.map((option) => {
                const isSelected = sortOption === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.radioRow}
                    activeOpacity={0.7}
                    onPress={() => onSelectSort(option.value)}
                  >
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              activeOpacity={0.7}
              onPress={onReset}
            >
              <Text style={styles.resetText}>Resetar filtros</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              activeOpacity={0.7}
              onPress={onApply}
            >
              <Check color={colors.white} size={24} strokeWidth={1.8} />
              <Text style={styles.applyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

FilterBottomSheet.displayName = "FilterBottomSheet";
