"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ordersApi, Order, UpdateOrder } from "@/app/lib/api";
import OrderForm from "@/app/components/OrderForm";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Alert, { AlertType } from "@/app/components/Alert";

interface EditOrderPageProps {
  params: Promise<{ id: string }>;
}

export default function EditOrderPage({ params }: EditOrderPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await ordersApi.getOrderById(parseInt(id));
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setAlert({ type: "error", message: response.message || "Orden no encontrada" });
        }
      } catch {
        setAlert({ type: "error", message: "Error de conexión con la API" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleSubmit = async (data: UpdateOrder) => {
    if (!order?.id) return;

    setIsSaving(true);
    setAlert(null);

    try {
      const response = await ordersApi.updateOrder(order.id, data);

      if (response.success && response.data) {
        setAlert({ type: "success", message: "Orden actualizada exitosamente" });
        // Redirect after a brief delay to show the success message
        setTimeout(() => {
          router.push(`/orders/${order.id}`);
        }, 1000);
      } else {
        setAlert({
          type: "error",
          message: response.message || "Error al actualizar la orden",
        });
      }
    } catch {
      setAlert({ type: "error", message: "Error de conexión con la API" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/orders/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Cargando orden..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Orden no encontrada
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              La orden que intentas editar no existe o ha sido eliminada.
            </p>
            <div className="mt-6">
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Volver a órdenes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Convert Order to UpdateOrder format for the form
  const initialFormData: UpdateOrder = {
    employee_id: order.employee_id,
    customer_id: order.customer_id,
    order_date: order.order_date,
    shipped_date: order.shipped_date,
    shipper_id: order.shipper_id,
    ship_name: order.ship_name,
    ship_address: order.ship_address,
    ship_city: order.ship_city,
    ship_state_province: order.ship_state_province,
    ship_zip_postal_code: order.ship_zip_postal_code,
    ship_country_region: order.ship_country_region,
    shipping_fee: order.shipping_fee,
    taxes: order.taxes,
    payment_type: order.payment_type,
    paid_date: order.paid_date,
    notes: order.notes,
    tax_rate: order.tax_rate,
    tax_status_id: order.tax_status_id,
    status_id: order.status_id,
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 shadow-sm border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/orders/${id}`}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Editar Orden #{order.id}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Modifica los datos de la orden
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
              autoClose={alert.type === "success"}
            />
          </div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
          <OrderForm
            initialData={initialFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={true}
            isLoading={isSaving}
          />
        </div>
      </main>
    </div>
  );
}
