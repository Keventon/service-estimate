import { Input } from "@/components/Input";
import { colors } from "@/types/colors";
import { fontFamily } from "@/types/fontFamily";
import { router } from "expo-router";
import { ChevronLeft, Store, Tag } from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewService() {
  type StatusOption = "draft" | "sent" | "approved" | "rejected";
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>("draft");

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.5}
        onPress={() => router.back()}
      >
        <ChevronLeft strokeWidth={1.3} size={32} color={colors.base.gray600} />
        <Text style={styles.title}>Orçamento</Text>
      </TouchableOpacity>

      <View style={styles.divisor} />

      <View style={styles.infoGeneralContainer}>
        <View style={styles.infoGeneralHeader}>
          <Store
            strokeWidth={1.3}
            size={18}
            color={colors.principal.purpleBase}
          />
          <Text style={styles.titleInfoGeneral}>Informações Gerais</Text>
        </View>

        <View style={styles.divisor} />

        <View style={styles.formContent}>
          <Input placeholder="Título" />
          <Input placeholder="Cliente" />
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <Tag
            strokeWidth={1.4}
            size={18}
            color={colors.principal.purpleBase}
          />
          <Text style={styles.statusTitle}>Status</Text>
        </View>

        <View style={styles.divisor} />

        <View style={styles.statusContent}>
          <View style={styles.statusRow}>
            <TouchableOpacity
              style={styles.statusItem}
              activeOpacity={0.7}
              onPress={() => setSelectedStatus("draft")}
            >
              <View
                style={[
                  styles.radio,
                  selectedStatus === "draft" && styles.radioSelected,
                ]}
              >
                {selectedStatus === "draft" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <View style={[styles.statusBadge, styles.draftBadge]}>
                <View style={[styles.badgeDot, styles.draftDot]} />
                <Text style={[styles.badgeText, styles.draftText]}>
                  Rascunho
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusItem}
              activeOpacity={0.7}
              onPress={() => setSelectedStatus("approved")}
            >
              <View
                style={[
                  styles.radio,
                  selectedStatus === "approved" && styles.radioSelected,
                ]}
              >
                {selectedStatus === "approved" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <View style={[styles.statusBadge, styles.approvedBadge]}>
                <View style={[styles.badgeDot, styles.approvedDot]} />
                <Text style={[styles.badgeText, styles.approvedText]}>
                  Aprovado
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.statusRow}>
            <TouchableOpacity
              style={styles.statusItem}
              activeOpacity={0.7}
              onPress={() => setSelectedStatus("sent")}
            >
              <View
                style={[
                  styles.radio,
                  selectedStatus === "sent" && styles.radioSelected,
                ]}
              >
                {selectedStatus === "sent" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <View style={[styles.statusBadge, styles.sentBadge]}>
                <View style={[styles.badgeDot, styles.sentDot]} />
                <Text style={[styles.badgeText, styles.sentText]}>Enviado</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusItem}
              activeOpacity={0.7}
              onPress={() => setSelectedStatus("rejected")}
            >
              <View
                style={[
                  styles.radio,
                  selectedStatus === "rejected" && styles.radioSelected,
                ]}
              >
                {selectedStatus === "rejected" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <View style={[styles.statusBadge, styles.rejectedBadge]}>
                <View style={[styles.badgeDot, styles.rejectedDot]} />
                <Text style={[styles.badgeText, styles.rejectedText]}>
                  Recusado
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: Platform.OS === "android" ? 40 : 68,
    marginBottom: 24,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray700,
  },
  divisor: {
    height: 1,
    backgroundColor: colors.base.gray300,
  },
  infoGeneralContainer: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderColor: colors.base.gray300,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 24,
  },
  titleInfoGeneral: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
  },
  infoGeneralHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
  },
  formContent: {
    padding: 20,
    gap: 16,
  },
  statusContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderColor: colors.base.gray300,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
  },
  statusTitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray600,
  },
  statusContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.base.gray400,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.principal.purpleBase,
    backgroundColor: colors.principal.purpleBase,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.white,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 25,
    borderRadius: 6,
    gap: 10,
  },
  badgeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  draftBadge: {
    backgroundColor: colors.base.gray300,
  },
  draftDot: {
    backgroundColor: colors.base.gray400,
  },
  draftText: {
    color: colors.base.gray600,
  },
  sentBadge: {
    backgroundColor: colors.feedback.infoLight,
  },
  sentDot: {
    backgroundColor: colors.feedback.infoBase,
  },
  sentText: {
    color: colors.feedback.infoDark,
  },
  approvedBadge: {
    backgroundColor: colors.feedback.successLight,
  },
  approvedDot: {
    backgroundColor: colors.feedback.successBase,
  },
  approvedText: {
    color: colors.feedback.successDark,
  },
  rejectedBadge: {
    backgroundColor: colors.feedback.dangerLight,
  },
  rejectedDot: {
    backgroundColor: colors.feedback.dangerBase,
  },
  rejectedText: {
    color: colors.feedback.dangerDark,
  },
});
