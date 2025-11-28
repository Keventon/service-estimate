import AsyncStorage from "@react-native-async-storage/async-storage";
import { ServiceDetail } from "@/types/service";

const SERVICE_STORAGE_KEY = "@service-estimate:services";

function ensureIdPrefix(id: string) {
  return id.startsWith("#") ? id : `#${id}`;
}

async function saveServices(services: ServiceDetail[]) {
  await AsyncStorage.setItem(SERVICE_STORAGE_KEY, JSON.stringify(services));
}

export async function getServices(): Promise<ServiceDetail[]> {
  try {
    const stored = await AsyncStorage.getItem(SERVICE_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function getServiceById(id: string): Promise<ServiceDetail | null> {
  const normalized = ensureIdPrefix(id);
  const services = await getServices();
  return services.find((item) => item.id === normalized) ?? null;
}

export async function upsertService(service: ServiceDetail) {
  const normalized = ensureIdPrefix(service.id);
  const services = await getServices();
  const payload = { ...service, id: normalized };
  const existingIndex = services.findIndex((item) => item.id === normalized);
  if (existingIndex >= 0) {
    services[existingIndex] = payload;
  } else {
    services.push(payload);
  }
  await saveServices(services);
}

export async function deleteService(id: string) {
  const normalized = ensureIdPrefix(id);
  const services = await getServices();
  const filtered = services.filter((item) => item.id !== normalized);
  await saveServices(filtered);
}
