const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  shipping_fee: string | null;
  taxes: string | null;
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

export interface UpdateOrder extends NewOrder {}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

class OrdersApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null,
      };
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<string>> {
    return this.request<string>('/api/health');
  }

  // Get all orders
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>('/api/orders/');
  }

  // Get order by ID
  async getOrderById(orderId: number): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/api/orders/${orderId}`);
  }

  // Create new order
  async createOrder(order: NewOrder): Promise<ApiResponse<Order>> {
    return this.request<Order>('/api/orders/', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Update order
  async updateOrder(orderId: number, order: UpdateOrder): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  }

  // Delete order
  async deleteOrder(orderId: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });
  }

  // Get orders by customer
  async getOrdersByCustomer(customerId: number): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>(`/api/orders/customer/${customerId}`);
  }

  // Get orders by employee
  async getOrdersByEmployee(employeeId: number): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>(`/api/orders/employee/${employeeId}`);
  }
}

// Export singleton instance
export const ordersApi = new OrdersApi();

// Export class for custom instances
export { OrdersApi };
