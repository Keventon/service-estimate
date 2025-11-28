import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/fontFamily";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FeedbackType = "info" | "success" | "warning" | "danger";

type FeedbackModalProps = {
  visible: boolean;
  type?: FeedbackType;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const typeStyles: Record<
  FeedbackType,
  { background: string; text: string; border: string }
> = {
  info: {
    background: colors.feedback.infoLight,
    text: colors.feedback.infoDark,
    border: colors.feedback.infoBase,
  },
  success: {
    background: colors.feedback.successLight,
    text: colors.feedback.successDark,
    border: colors.feedback.successBase,
  },
  warning: {
    background: colors.feedback.dangerLight,
    text: colors.feedback.dangerDark,
    border: colors.feedback.dangerBase,
  },
  danger: {
    background: colors.feedback.dangerLight,
    text: colors.feedback.dangerDark,
    border: colors.feedback.dangerBase,
  },
};

export function FeedbackModal({
  visible,
  type = "info",
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: FeedbackModalProps) {
  const palette = typeStyles[type];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: palette.background,
                borderColor: palette.border,
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: palette.text }]}>
              {type === "info"
                ? "Info"
                : type === "success"
                ? "Sucesso"
                : type === "warning"
                ? "Atenção"
                : "Confirmação"}
            </Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
              onPress={onCancel}
            >
              <Text style={styles.secondaryButtonText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: palette.border },
              ]}
              activeOpacity={0.7}
              onPress={onConfirm}
            >
              <Text style={styles.primaryButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: colors.white,
    padding: 20,
    gap: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.base.gray700,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.base.gray600,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    backgroundColor: colors.base.gray100,
  },
  secondaryButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray600,
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.white,
  },
});
