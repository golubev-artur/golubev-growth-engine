import type { ClientData } from "@/types/client";
import data from "./clients.json";

export const clientsData: Record<string, ClientData> = data as Record<string, ClientData>;

export const getClientData = (slug: string): ClientData | undefined =>
  clientsData[slug];

export const getAllClients = (): ClientData[] =>
  Object.values(clientsData);
