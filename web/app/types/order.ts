// TypeScript interfaces matching the Rocket API models

export interface Order {
  id: number | null;
  employee_id: number | null;
  customer_id: number | null;
  order_date: string | null;
  shipped_date: string | null;
  shipper_id: number | null;
  ship_name: string | null;
  ship_address: string | null;
  ship_city: string | null;
  ship_state_province: string | null;
  ship_zip_postal_code: string | null;
  ship_country_region: string | null;
  shipping_fee: string | null; // Decimal comes as string from API
  taxes: string | null; // Decimal comes as string from API
  payment_type: string | null;
  paid_date: string | null;
  notes: string | null;
  tax_rate: number | null;
  tax_status_id: number | null;
  status_id: number | null;
}

export interface NewOrder {
  employee_id?: number | null;
  customer_id?: number | null;
  order_date?: string | null;
  shipped_date?: string | null;
  shipper_id?: number | null;
  ship_name?: string | null;
  ship_address?: string | null;
  ship_city?: string | null;
  ship_state_province?: string | null;
  ship_zip_postal_code?: string | null;
  ship_country_region?: string | null;
  shipping_fee?: string | null;
  taxes?: string | null;
  payment_type?: string | null;
  paid_date?: string | null;
  notes?: string | null;
  tax_rate?: number | null;
  tax_status_id?: number | null;
  status_id?: number | null;
}

export interface UpdateOrder {
  employee_id?: number | null;
  customer_id?: number | null;
  order_date?: string | null;
  shipped_date?: string | null;
  shipper_id?: number | null;
  ship_name?: string | null;
  ship_address?: string | null;
  ship_city?: string | null;
  ship_state_province?: string | null;
  ship_zip_postal_code?: string | null;
  ship_country_region?: string | null;
  shipping_fee?: string | null;
  taxes?: string | null;
  payment_type?: string | null;
  paid_date?: string | null;
  notes?: string | null;
  tax_rate?: number | null;
  tax_status_id?: number | null;
  status_id?: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// Status mapping for display
export const ORDER_STATUS: Record<number, string> = {
  0: "New",
  1: "Invoiced",
  2: "Shipped",
  3: "Closed",
};

export const TAX_STATUS: Record<number, string> = {
  0: "None",
  1: "Taxable",
  2: "Tax Exempt",
};
