import { Input } from "@/components/Input";
import { colors } from "@/types/colors";
import { fontFamily } from "@/types/fontFamily";
import { router } from "expo-router";
import {
  Check,
  ChevronLeft,
  ClipboardList,
  Pencil,
  Plus,
  Store,
  Tag,
  Wallet,
} from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewService() {
  type StatusOption = "draft" | "sent" | "approved" | "rejected";
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>("draft");
  const [discountPercent, setDiscountPercent] = useState("0");

  const servicesIncluded = [
    {
      id: "1",
      title: "Design de interfaces",
      description: "Criação de wireframes e protóti...",
      amount: 3847.5,
      qty: 1,
    },
    {
      id: "2",
      title: "Implantação e suporte",
      description: "Publicação nas lojas de aplicativ...",
      amount: 3847.5,
      qty: 1,
    },
  ];

  const numericDiscount = Math.min(
    100,
    Math.max(0, Number(discountPercent) || 0)
  );
  const subtotal = servicesIncluded.reduce(
    (acc, service) => acc + service.amount * service.qty,
    0
  );
  const discountValue = subtotal * (numericDiscount / 100);
  const total = subtotal - discountValue;
  const totalItems = servicesIncluded.reduce(
    (acc, service) => acc + service.qty,
    0
  );

  function handleChangeDiscount(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");
    if (onlyNumbers === "") {
      setDiscountPercent("");
      return;
    }

    const clamped = Math.min(100, Number(onlyNumbers));
    setDiscountPercent(String(clamped));
  }

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
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
                  <Text style={[styles.badgeText, styles.sentText]}>
                    Enviado
                  </Text>
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

        <View style={styles.servicesContainer}>
          <View style={styles.servicesHeader}>
            <ClipboardList
              strokeWidth={1.4}
              size={18}
              color={colors.principal.purpleBase}
            />
            <Text style={styles.servicesTitle}>Serviços inclusos</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.servicesContent}>
            {servicesIncluded.map((service) => (
              <View key={service.id} style={styles.serviceRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                </View>

                <View style={styles.serviceRight}>
                  <Text style={styles.serviceAmount}>
                    {formatCurrency(service.amount)}
                  </Text>
                  <Text style={styles.serviceQty}>Qt: {service.qty}</Text>
                </View>

                <TouchableOpacity activeOpacity={0.7}>
                  <Pencil
                    strokeWidth={2}
                    size={18}
                    color={colors.principal.purpleBase}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.servicesFooter}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.addServiceButton}
            >
              <Plus
                size={22}
                strokeWidth={2}
                color={colors.principal.purpleBase}
              />
              <Text style={styles.addServiceText}>Adicionar serviço</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.investmentContainer}>
          <View style={styles.investmentHeader}>
            <Wallet
              strokeWidth={1.4}
              size={18}
              color={colors.principal.purpleBase}
            />
            <Text style={styles.investmentTitle}>Investimento</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.investmentBody}>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Subtotal</Text>

              <View style={styles.investmentRight}>
                <Text style={styles.investmentItems}>
                  {totalItems} {totalItems === 1 ? "item" : "itens"}
                </Text>
                <Text style={styles.investmentAmount}>
                  {formatCurrency(subtotal)}
                </Text>
              </View>
            </View>

            <View style={styles.investmentRow}>
              <View style={styles.discountLeft}>
                <Text style={styles.investmentLabel}>Desconto</Text>
                <View style={styles.discountBadge}>
                  <TextInput
                    style={styles.discountInput}
                    keyboardType="numeric"
                    maxLength={3}
                    value={discountPercent}
                    onChangeText={handleChangeDiscount}
                    placeholder="0"
                    placeholderTextColor={colors.base.gray400}
                  />
                  <Text style={styles.discountPercent}>%</Text>
                </View>
              </View>

              <Text style={styles.discountAmount}>
                - {formatCurrency(discountValue)}
              </Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.investmentFooter}>
            <Text style={styles.totalLabel}>Valor total</Text>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.totalOld}>{formatCurrency(subtotal)}</Text>
              <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButtonOutline}
          activeOpacity={0.8}
        >
          <Text style={styles.footerButtonOutlineText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButtonPrimary}
          activeOpacity={0.8}
        >
          <Check size={18} strokeWidth={2} color={colors.white} />
          <Text style={styles.footerButtonPrimaryText}>Salvar</Text>
        </TouchableOpacity>
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
    maxWidth: 150,
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
    borderRadius: 10,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusTitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
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
  servicesContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderColor: colors.base.gray300,
    borderRadius: 10,
    borderWidth: 1,
  },
  servicesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  servicesTitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
  },
  servicesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
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
    marginRight: 4,
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
    marginTop: 2,
  },
  servicesFooter: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  addServiceButton: {
    height: 48,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    backgroundColor: colors.base.gray100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  addServiceText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.principal.purpleBase,
  },
  investmentContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderColor: colors.base.gray300,
    borderRadius: 10,
    borderWidth: 1,
  },
  investmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  investmentTitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
  },
  investmentBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  investmentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  investmentLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray700,
  },
  investmentRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  investmentItems: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
  },
  investmentAmount: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray700,
  },
  discountLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  discountBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minWidth: 80,
    height: 36,
    backgroundColor: colors.base.gray100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.base.gray300,
  },
  discountText: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.base.gray700,
  },
  discountInput: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.base.gray700,
    minWidth: 24,
    textAlign: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  discountPercent: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.base.gray600,
  },
  discountAmount: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.feedback.dangerBase,
  },
  investmentFooter: {
    backgroundColor: colors.base.gray100,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  totalLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.base.gray700,
  },
  totalOld: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
    textDecorationLine: "line-through",
  },
  totalAmount: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.base.gray700,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 16,
  },
  footerButtonOutline: {
    height: 52,
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: colors.base.gray300,
    backgroundColor: colors.base.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtonOutlineText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.principal.purpleBase,
  },
  footerButtonPrimary: {
    height: 52,
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.principal.purpleBase,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  footerButtonPrimaryText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.white,
  },
});
