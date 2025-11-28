export type ServiceStatus = "draft" | "sent" | "approved" | "rejected";

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  amount: number;
  qty: number;
};

export type ServiceDetail = {
  id: string; // use the visual pattern "#12345"
  title: string;
  status: ServiceStatus;
  client: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  services: ServiceItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
};
