import { deleteService, getServiceById } from "@/service/storage";
import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/fontFamily";
import { ServiceDetail, ServiceStatus } from "@/types/service";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import {
  ChevronLeft,
  ClipboardList,
  Copy,
  Pencil,
  Send,
  Store,
  Trash2,
  Wallet,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { FeedbackModal } from "@/components/FeedbackModal";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function getStatusData(status: ServiceStatus) {
  switch (status) {
    case "sent":
      return {
        label: "Enviado",
        background: colors.feedback.infoLight,
        text: colors.feedback.infoDark,
        dot: colors.feedback.infoBase,
      };
    case "approved":
      return {
        label: "Aprovado",
        background: colors.feedback.successLight,
        text: colors.feedback.successDark,
        dot: colors.feedback.successBase,
      };
    case "rejected":
      return {
        label: "Recusado",
        background: colors.feedback.dangerLight,
        text: colors.feedback.dangerDark,
        dot: colors.feedback.dangerBase,
      };
    default:
      return {
        label: "Rascunho",
        background: colors.base.gray300,
        text: colors.base.gray600,
        dot: colors.base.gray400,
      };
  }
}

export default function ServiceDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const paramId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [data, setData] = useState<ServiceDetail | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const hasDiscount =
    data != null &&
    (data.discountPercent ?? 0) > 0 &&
    (data.discountAmount ?? 0) > 0;

  const handleConfirmDelete = useCallback(async () => {
    if (!data || isDeleting) return;
    setIsDeleting(true);
    await deleteService(data.id);
    setIsDeleting(false);
    setShowDeleteModal(false);
    router.back();
  }, [data, isDeleting, router]);

  const handleShare = useCallback(async () => {
    if (!data) return;
    if (isSharing) return;

    const servicesHtml = data.services
      .map(
        (item) => `
          <tr>
            <td style="padding:6px 0;">
              <div style="font-size:14px;font-weight:700;color:#0F0F0F;">${item.title}</div>
              <div style="font-size:12px;color:#676767;margin-top:2px;">${item.description}</div>
            </td>
            <td style="padding:6px 0;text-align:right;font-size:14px;font-weight:700;color:#0F0F0F;">${formatCurrency(
              item.amount
            )}</td>
            <td style="padding:6px 0;text-align:right;font-size:12px;color:#676767;">Qt: ${
              item.qty
            }</td>
          </tr>
        `
      )
      .join("");

    const hasDiscount =
      (data.discountPercent ?? 0) > 0 && (data.discountAmount ?? 0) > 0;

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
        </head>
        <body style="font-family:'Helvetica', sans-serif; color:#0F0F0F; padding:16px;">
          <h2 style="margin:0 0 12px 0;">Orçamento ${data.id}</h2>
          <div style="margin-bottom:16px;">
            <div style="font-size:16px;font-weight:700;">${data.title}</div>
            <div style="font-size:12px;color:#676767;margin-top:4px;">Cliente</div>
            <div style="font-size:14px;">${data.client}</div>
            <div style="display:flex; gap:16px; margin-top:8px; font-size:12px;color:#676767;">
              <div>Criado em: ${formatDate(data.createdAt)}</div>
              <div>Atualizado em: ${formatDate(data.updatedAt)}</div>
            </div>
          </div>

          <div style="border:1px solid #E6E5E5; border-radius:8px; padding:12px;">
            <div style="font-size:13px;color:#4A4A4A;margin-bottom:8px;">Serviços inclusos</div>
            <table style="width:100%; border-collapse:collapse;">
              <tbody>
                ${servicesHtml}
              </tbody>
            </table>
          </div>

          <div style="border:1px solid #E6E5E5; border-radius:8px; padding:12px; margin-top:12px;">
            <table style="width:100%; border-collapse:collapse;">
              <tbody>
                <tr>
                  <td style="font-size:12px;color:#676767;">Subtotal</td>
                  <td style="text-align:right; font-size:12px; color:${
                    hasDiscount ? "#676767" : "#0F0F0F"
                  }; ${hasDiscount ? "text-decoration: line-through;" : ""}">
                    ${formatCurrency(data.subtotal)}
                  </td>
                </tr>
                ${
                  hasDiscount
                    ? `<tr>
                        <td style="font-size:12px;color:#676767;">Desconto</td>
                        <td style="text-align:right; font-size:12px; color:#2E7D32;">
                          - ${formatCurrency(data.discountAmount)}
                        </td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="font-size:14px;font-weight:700;">Investimento total</td>
                  <td style="text-align:right; font-size:16px;font-weight:700;">
                    ${formatCurrency(data.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    setIsSharing(true);
    try {
      const { uri } = await Print.printToFileAsync({ html });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Compartilhar", "O compartilhamento não está disponível neste dispositivo.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
    } finally {
      setIsSharing(false);
    }
  }, [data, isSharing]);

  const handleCopy = useCallback(async () => {
    if (!data || isCopying) return;
    setIsCopying(true);

    const servicesText = data.services
      .map(
        (item) =>
          `- ${item.title} (Qt: ${item.qty}) - ${formatCurrency(item.amount)}`
      )
      .join("\n");

    const hasDiscount =
      (data.discountPercent ?? 0) > 0 && (data.discountAmount ?? 0) > 0;

    const text = [
      `Orçamento ${data.id}`,
      `Título: ${data.title}`,
      `Cliente: ${data.client}`,
      `Status: ${getStatusData(data.status).label}`,
      `Criado em: ${formatDate(data.createdAt)}`,
      `Atualizado em: ${formatDate(data.updatedAt)}`,
      "",
      "Serviços:",
      servicesText,
      "",
      `Subtotal: ${formatCurrency(data.subtotal)}`,
      hasDiscount
        ? `Desconto: - ${formatCurrency(data.discountAmount)} (${data.discountPercent}% off)`
        : "Desconto: nenhum",
      `Total: ${formatCurrency(data.total)}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Copiado", "Orçamento copiado para a área de transferência.");
    } catch {
      Alert.alert("Erro", "Não foi possível copiar o orçamento.");
    } finally {
      setIsCopying(false);
    }
  }, [data, isCopying]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function load() {
        if (!paramId) return;
        const normalized = paramId.startsWith("#") ? paramId : `#${paramId}`;
        const response = await getServiceById(normalized);
        if (!isActive) return;
        setData(response);
      }
      load();
      return () => {
        isActive = false;
      };
    }, [paramId])
  );

  if (!data) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.fallbackText}>Serviço não encontrado.</Text>
      </View>
    );
  }

  const statusData = getStatusData(data.status);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.6}
          style={styles.backButton}
        >
          <ChevronLeft
            size={24}
            strokeWidth={1.5}
            color={colors.base.gray700}
          />
          <Text style={styles.headerTitle}>Orçamento {data.id}</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusData.background },
          ]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: statusData.dot }]}
          />
          <Text style={[styles.statusBadgeText, { color: statusData.text }]}>
            {statusData.label}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <Store
                size={20}
                strokeWidth={1.5}
                color={colors.principal.purpleBase}
              />
            </View>
            <Text style={styles.summaryTitle}>{data.title}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRowSingle}>
            <Text style={styles.summaryLabel}>Cliente</Text>
            <Text style={styles.summaryValue}>{data.client}</Text>
          </View>

          <View style={[styles.summaryRow, { marginTop: 12 }]}>
            <View>
              <Text style={styles.summaryLabel}>Criado em</Text>
              <Text style={styles.summaryValue}>
                {formatDate(data.createdAt)}
              </Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Atualizado em</Text>
              <Text style={styles.summaryValue}>
                {formatDate(data.updatedAt)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ClipboardList
              size={18}
              strokeWidth={1.4}
              color={colors.principal.purpleBase}
            />
            <Text style={styles.cardHeaderTitle}>Serviços inclusos</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.servicesList}>
            {data.services.map((item) => (
              <View key={item.id} style={styles.serviceRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                  <Text style={styles.serviceDescription}>
                    {item.description}
                  </Text>
                </View>

                <View style={styles.serviceRight}>
                  <Text style={styles.serviceAmount}>
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={styles.serviceQty}>Qt: {item.qty}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.resumeContent}>
            <View style={styles.resumeRow}>
              <View style={styles.resumeLabelWithIcon}>
                <View style={styles.summaryIcon}>
                  <Wallet
                    size={18}
                    strokeWidth={1.4}
                    color={colors.principal.purpleBase}
                  />
                </View>
                <View>
                  <Text style={styles.resumeLabel}>Subtotal</Text>
                  {data.discountAmount > 0 && (
                    <View style={styles.discountInline}>
                      <Text style={styles.resumeLabel}>Desconto</Text>
                      <View style={styles.discountChip}>
                        <Text style={styles.discountChipText}>
                          {data.discountPercent}% off
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <Text
                  style={
                    data.discountAmount > 0
                      ? styles.resumeStriked
                      : styles.resumeSubtotal
                  }
                >
                  {formatCurrency(data.subtotal)}
                </Text>
                {data.discountAmount > 0 && (
                  <Text style={styles.resumeDiscount}>
                    - {formatCurrency(data.discountAmount)}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.resumeTotalRow}>
              <Text style={[styles.resumeTotalLabel, styles.resumeTotalOffset]}>
                Investimento total
              </Text>
              <Text style={styles.resumeTotal}>
                {formatCurrency(data.total)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            activeOpacity={0.2}
            style={styles.footerIconButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <Trash2
              size={18}
              strokeWidth={1.6}
            color={colors.feedback.dangerBase}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.2}
          style={styles.footerIconButton}
          onPress={handleCopy}
        >
          <Copy size={18} strokeWidth={1.6} color={colors.base.gray600} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.2}
          style={styles.footerIconButton}
          onPress={() =>
            router.push({
              pathname: "/editService",
              params: { id: data.id.replace("#", "") },
            })
          }
        >
          <Pencil
            size={18}
            strokeWidth={1.6}
            color={colors.principal.purpleBase}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.footerShareButton}
        onPress={handleShare}
      >
        <Send size={24} strokeWidth={1.8} color={colors.white} />
        <Text style={styles.footerShareText}>Compartilhar</Text>
      </TouchableOpacity>
      </View>

      <FeedbackModal
        visible={showDeleteModal}
        type="danger"
        title="Excluir orçamento"
        description="Essa ação removerá o orçamento e seus serviços. Deseja continuar?"
        confirmLabel={isDeleting ? "Removendo..." : "Excluir"}
        cancelLabel="Cancelar"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 40 : 68,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray700,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusBadgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.principal.purpleLight,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryTitle: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.base.gray700,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.base.gray300,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryRowSingle: {
    flexDirection: "column",
    gap: 4,
  },
  summaryLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
  },
  summaryValue: {
    marginTop: 4,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.base.gray700,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 12,
  },
  cardHeaderTitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.base.gray600,
  },
  divisor: {
    height: 1,
    backgroundColor: colors.base.gray300,
    marginHorizontal: -16,
    alignSelf: "stretch",
  },
  servicesList: {
    paddingVertical: 12,
    gap: 12,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  serviceTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray700,
  },
  serviceDescription: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
    marginTop: 2,
  },
  serviceRight: {
    alignItems: "flex-end",
    gap: 4,
    minWidth: 96,
  },
  serviceAmount: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray700,
  },
  serviceQty: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
  },
  resumeContent: {
    paddingVertical: 12,
    gap: 12,
  },
  resumeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  resumeLabelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  discountInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  resumeRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  resumeLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.base.gray600,
  },
  resumeStriked: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
    textDecorationLine: "line-through",
  },
  resumeSubtotal: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray700,
  },
  discountChip: {
    backgroundColor: colors.feedback.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountChipText: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: colors.feedback.successDark,
  },
  resumeDiscount: {
    fontFamily: fontFamily.bold,
    fontSize: 12,

    color: colors.feedback.successDark,
    marginTop: 4,
  },
  resumeTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumeTotalLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray700,
  },
  resumeTotalOffset: {
    paddingLeft: 46, // align with icon + gap from above rows
  },
  resumeTotal: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.base.gray700,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  footerIconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    backgroundColor: colors.base.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  footerShareButton: {
    flex: 1,
    marginLeft: 40,
    height: 52,
    borderRadius: 99,
    backgroundColor: colors.principal.purpleBase,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  footerShareText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.white,
  },
  fallbackText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.base.gray600,
  },
});
