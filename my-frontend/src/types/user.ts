export interface ShippingAddress {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  city?: string;
  note?: string;
  isDefault?: boolean;
}


