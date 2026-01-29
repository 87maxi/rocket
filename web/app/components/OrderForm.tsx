"use client";

import { useState, useEffect } from "react";
import { NewOrder, UpdateOrder } from "@/app/lib/api";

interface OrderFormProps {
  initialData?: UpdateOrder;
  onSubmit: (data: NewOrder | UpdateOrder) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

export default function OrderForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
}: OrderFormProps) {
  const [formData, setFormData] = useState<NewOrder>({
    employee_id: null,
    customer_id: null,
    order_date: null,
    shipped_date: null,
    shipper_id: null,
    ship_name: null,
    ship_address: null,
    ship_city: null,
    ship_state_province: null,
    ship_zip_postal_code: null,
    ship_country_region: null,
    shipping_fee: null,
    taxes: null,
    payment_type: null,
    paid_date: null,
    notes: null,
    tax_rate: null,
    tax_status_id: null,
    status_id: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number | null = value;

    if (value === "") {
      parsedValue = null;
    } else if (type === "number") {
      parsedValue = value === "" ? null : parseFloat(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Employee IDs */}
        <div>
          <label
            htmlFor="customer_id"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Customer ID
          </label>
          <input
            type="number"
            id="customer_id"
            name="customer_id"
            value={formData.customer_id ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="employee_id"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Employee ID
          </label>
          <input
            type="number"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Dates */}
        <div>
          <label
            htmlFor="order_date"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Order Date
          </label>
          <input
            type="datetime-local"
            id="order_date"
            name="order_date"
            value={formatDateForInput(formData.order_date)}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="shipped_date"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Shipped Date
          </label>
          <input
            type="datetime-local"
            id="shipped_date"
            name="shipped_date"
            value={formatDateForInput(formData.shipped_date)}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="paid_date"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Paid Date
          </label>
          <input
            type="datetime-local"
            id="paid_date"
            name="paid_date"
            value={formatDateForInput(formData.paid_date)}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Shipper */}
        <div>
          <label
            htmlFor="shipper_id"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Shipper ID
          </label>
          <input
            type="number"
            id="shipper_id"
            name="shipper_id"
            value={formData.shipper_id ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Shipping Information */}
        <div className="md:col-span-2">
          <label
            htmlFor="ship_name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Ship Name
          </label>
          <input
            type="text"
            id="ship_name"
            name="ship_name"
            value={formData.ship_name ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="ship_address"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Ship Address
          </label>
          <input
            type="text"
            id="ship_address"
            name="ship_address"
            value={formData.ship_address ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="ship_city"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Ship City
          </label>
          <input
            type="text"
            id="ship_city"
            name="ship_city"
            value={formData.ship_city ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="ship_state_province"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            State/Province
          </label>
          <input
            type="text"
            id="ship_state_province"
            name="ship_state_province"
            value={formData.ship_state_province ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="ship_zip_postal_code"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="ship_zip_postal_code"
            name="ship_zip_postal_code"
            value={formData.ship_zip_postal_code ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="ship_country_region"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Country/Region
          </label>
          <input
            type="text"
            id="ship_country_region"
            name="ship_country_region"
            value={formData.ship_country_region ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Financial Information */}
        <div>
          <label
            htmlFor="shipping_fee"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Shipping Fee
          </label>
          <input
            type="text"
            id="shipping_fee"
            name="shipping_fee"
            value={formData.shipping_fee ?? ""}
            onChange={handleChange}
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="taxes"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Taxes
          </label>
          <input
            type="text"
            id="taxes"
            name="taxes"
            value={formData.taxes ?? ""}
            onChange={handleChange}
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="tax_rate"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tax Rate (%)
          </label>
          <input
            type="number"
            id="tax_rate"
            name="tax_rate"
            value={formData.tax_rate ?? ""}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="payment_type"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Payment Type
          </label>
          <select
            id="payment_type"
            name="payment_type"
            value={formData.payment_type ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select payment type</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Check">Check</option>
            <option value="Wire Transfer">Wire Transfer</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status_id"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Order Status
          </label>
          <select
            id="status_id"
            name="status_id"
            value={formData.status_id ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select status</option>
            <option value="0">New</option>
            <option value="1">Invoiced</option>
            <option value="2">Shipped</option>
            <option value="3">Closed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tax_status_id"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tax Status
          </label>
          <select
            id="tax_status_id"
            name="tax_status_id"
            value={formData.tax_status_id ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select tax status</option>
            <option value="0">None</option>
            <option value="1">Taxable</option>
            <option value="2">Tax Exempt</option>
          </select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : isEditing ? (
            "Update Order"
          ) : (
            "Create Order"
          )}
        </button>
      </div>
    </form>
  );
}
