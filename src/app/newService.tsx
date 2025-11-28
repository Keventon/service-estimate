import { Input } from "@/components/Input";
import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/fontFamily";
import { upsertService } from "@/service/storage";
import { ServiceDetail } from "@/types/service";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import {
  Check,
  ChevronLeft,
  ClipboardList,
  Minus,
  Pencil,
  Plus,
  Store,
  Tag,
  Trash2,
  Wallet,
  X,
} from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function NewService() {
  type StatusOption = "draft" | "sent" | "approved" | "rejected";
  type Service = {
    id: string;
    title: string;
    description: string;
    amount: number;
    qty: number;
  };
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>("draft");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [estimateTitle, setEstimateTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceQty, setServiceQty] = useState(1);
  const [isEditingService, setIsEditingService] = useState(false);
  const [isServiceSheetOpen, setIsServiceSheetOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [servicesIncluded, setServicesIncluded] = useState<Service[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["75%"], []);

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

  function handleOpenBottomSheet() {
    setIsServiceSheetOpen(true);
    bottomSheetRef.current?.snapToIndex(0);
  }

  function handleCloseBottomSheet() {
    setIsServiceSheetOpen(false);
    bottomSheetRef.current?.close();
  }

  function handleDecreaseQty() {
    setServiceQty((prev) => Math.max(1, prev - 1));
  }

  function handleIncreaseQty() {
    setServiceQty((prev) => prev + 1);
  }

  function handleChangePrice(text: string) {
    const sanitized = text.replace(/[^\d]/g, "");
    if (!sanitized) {
      setServicePrice("");
      return;
    }

    const asNumber = Number(sanitized) / 100;
    setServicePrice(
      asNumber.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function resetServiceFields() {
    setServiceTitle("");
    setServiceDescription("");
    setServicePrice("");
    setServiceQty(1);
    setIsEditingService(false);
    setEditingServiceId(null);
  }

  function populateServiceFields(service: (typeof servicesIncluded)[number]) {
    setServiceTitle(service.title);
    setServiceDescription(service.description);
    setServicePrice(
      service.amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setServiceQty(service.qty);
    setIsEditingService(true);
    setEditingServiceId(service.id);
  }

  function parsePriceToNumber(value: string) {
    const normalized = value.replace(/\./g, "").replace(",", ".");
    const asNumber = parseFloat(normalized);
    return Number.isNaN(asNumber) ? 0 : asNumber;
  }

  function handleSaveService() {
    const amount = parsePriceToNumber(servicePrice);
    const payload: Service = {
      id: editingServiceId ?? String(Date.now()),
      title: serviceTitle || "Serviço",
      description: serviceDescription || "Descrição do serviço",
      amount,
      qty: serviceQty,
    };

    setServicesIncluded((prev) => {
      if (isEditingService && editingServiceId) {
        return prev.map((item) =>
          item.id === editingServiceId ? payload : item
        );
      }
      return [...prev, payload];
    });

    handleCloseBottomSheet();
  }

  function handleDeleteService() {
    if (!editingServiceId) {
      handleCloseBottomSheet();
      return;
    }

    setServicesIncluded((prev) =>
      prev.filter((item) => item.id !== editingServiceId)
    );
    handleCloseBottomSheet();
  }

  async function handleSaveBudget() {
    const now = new Date().toISOString();
    const normalizedId = `#${Date.now().toString().slice(-5)}`;
    const numericDiscount = Number(discountPercent) || 0;

    const budget: ServiceDetail = {
      id: normalizedId,
      title: estimateTitle || "Orçamento",
      status: selectedStatus,
      client: clientName || "Cliente",
      createdAt: now,
      updatedAt: now,
      services: servicesIncluded,
      subtotal,
      discountPercent: numericDiscount,
      discountAmount: discountValue,
      total,
    };

    await upsertService(budget);
    router.back();
  }

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.header}
          activeOpacity={0.5}
          onPress={() => router.back()}
        >
          <ChevronLeft
            strokeWidth={1.3}
            size={32}
            color={colors.base.gray600}
          />
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
            <Input
              placeholder="Título"
              value={estimateTitle}
              onChangeText={setEstimateTitle}
            />
            <Input
              placeholder="Cliente"
              value={clientName}
              onChangeText={setClientName}
            />
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

            {servicesIncluded.length > 0 ? (
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

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        populateServiceFields(service);
                        handleOpenBottomSheet();
                      }}
                    >
                      <Pencil
                        strokeWidth={1.5}
                        size={18}
                        color={colors.principal.purpleBase}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyServicesText}>
                Nenhum serviço adicionado ainda.
              </Text>
            )}

            <View style={styles.servicesFooter}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.addServiceButton}
                onPress={() => {
                  resetServiceFields();
                  handleOpenBottomSheet();
                }}
              >
                <Plus
                  size={22}
                  strokeWidth={1.5}
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
          onPress={handleSaveBudget}
        >
          <Check size={18} strokeWidth={2} color={colors.white} />
          <Text style={styles.footerButtonPrimaryText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleComponent={null}
        enablePanDownToClose
        index={isServiceSheetOpen ? 0 : -1}
        onChange={(idx) => {
          if (idx < 0) {
            setIsServiceSheetOpen(false);
            resetServiceFields();
          }
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Serviço</Text>
            <TouchableOpacity
              onPress={handleCloseBottomSheet}
              activeOpacity={0.7}
            >
              <X size={24} strokeWidth={1.5} color={colors.base.gray600} />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetDivisor} />

          <View style={styles.sheetContent}>
            <View style={styles.sheetInput}>
              <TextInput
                value={serviceTitle}
                onChangeText={setServiceTitle}
                placeholder="Nome do serviço"
                placeholderTextColor={colors.base.gray400}
                style={styles.sheetTextInput}
              />
            </View>

            <View style={styles.sheetTextarea}>
              <TextInput
                value={serviceDescription}
                onChangeText={setServiceDescription}
                placeholder="Descrição"
                placeholderTextColor={colors.base.gray400}
                style={styles.sheetTextInput}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.sheetRow}>
              <View style={[styles.sheetInput, { flex: 1 }]}>
                <TextInput
                  value={servicePrice ? `R$ ${servicePrice}` : ""}
                  onChangeText={handleChangePrice}
                  placeholder="R$ 0,00"
                  keyboardType="numeric"
                  placeholderTextColor={colors.base.gray400}
                  style={styles.sheetTextInput}
                />
              </View>

              <View style={[styles.sheetInput, styles.sheetQtyContainer]}>
                <TouchableOpacity
                  onPress={handleDecreaseQty}
                  activeOpacity={0.7}
                  style={styles.qtyButton}
                >
                  <Minus
                    size={16}
                    strokeWidth={2}
                    color={colors.principal.purpleBase}
                  />
                </TouchableOpacity>

                <Text style={styles.qtyValue}>{serviceQty}</Text>

                <TouchableOpacity
                  onPress={handleIncreaseQty}
                  activeOpacity={0.7}
                  style={styles.qtyButton}
                >
                  <Plus
                    size={16}
                    strokeWidth={2}
                    color={colors.principal.purpleBase}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.sheetFooter}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sheetDeleteButton}
              onPress={handleDeleteService}
            >
              <Trash2
                size={18}
                strokeWidth={2}
                color={colors.feedback.dangerBase}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sheetSaveButton}
              onPress={handleSaveService}
            >
              <Check size={18} strokeWidth={1.5} color={colors.white} />
              <Text style={styles.sheetSaveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
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
    marginBottom: 16,
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
  emptyServicesText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.base.gray500,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  sheetContainer: {
    flex: 1,
    paddingBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sheetTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.base.gray700,
  },
  sheetDivisor: {
    height: 1,
    backgroundColor: colors.base.gray300,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  sheetInput: {
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    backgroundColor: colors.base.gray100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: "center",
  },
  sheetTextarea: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    backgroundColor: colors.base.gray100,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sheetTextInput: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.base.gray700,
  },
  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sheetQtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 120,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.base.gray700,
  },
  sheetFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: colors.base.gray300,
  },
  sheetDeleteButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.base.gray300,
    backgroundColor: colors.base.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetSaveButton: {
    height: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 99,
    backgroundColor: colors.principal.purpleBase,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  sheetSaveText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.white,
  },
});
