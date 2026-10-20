import "server-only";
import type { ContactData } from "./contact-validation";
// A real provider must implement this contract and be verified before enabling delivery.
export interface ContactDeliveryAdapter {
  send(data: ContactData): Promise<{ delivered: boolean }>;
}
export function getContactAdapter(): ContactDeliveryAdapter | null {
  return null;
}
