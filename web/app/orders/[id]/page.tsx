"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ordersApi, Order } from "@/app/lib/api";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Alert, { AlertType } from "@/app/components/Alert";
import { ORDER_STATUS, TAX_STATUS } from "@/app/types/order";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!order?.id) return;

    if (!window.confirm(`¿Estás seguro de eliminar la orden #${order.id}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await ordersApi.deleteOrder(order.id);
      if (response.success) {
        router.push("/orders?deleted=true");
      } else {
        setAlert({ type: "error", message: response.message || "Error al eliminar la orden" });
      }
    } catch {
      setAlert({ type: "error", message: "Error de conexión al eliminar la orden" });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return "$0.00";
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const getStatusColor = (statusId: number | null) => {
    switch (statusId) {
      case 0:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 1:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 2:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 3:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
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
              La orden que buscas no existe o ha sido eliminada.
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 shadow-sm border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/orders"
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
                  Orden #{order.id}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                      order.status_id
                    )}`}
                  >
                    {ORDER_STATUS[order.status_id ?? 0] || "Unknown"}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {formatDate(order.order_date)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/orders/${order.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
              autoClose
            />
          </div>
        )}

        <div className="space-y-6">
          {/* Customer & Employee Info */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Información General
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Customer ID
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100 font-medium">
                  {order.customer_id ?? "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Employee ID
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100 font-medium">
                  {order.employee_id ?? "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Shipper ID
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100 font-medium">
                  {order.shipper_id ?? "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Payment Type
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100 font-medium">
                  {order.payment_type ?? "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Fechas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Fecha de Orden
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                  {formatDate(order.order_date)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Fecha de Envío
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                  {formatDate(order.shipped_date)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Fecha de Pago
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                  {formatDate(order.paid_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Información de Envío
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Nombre
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100 font-medium">
                  {order.ship_name ?? "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Dirección
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                  {order.ship_address ?? "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Ciudad
                  </label>
                  <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                    {order.ship_city ?? "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Estado/Provincia
                  </label>
                  <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                    {order.ship_state_province ?? "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Código Postal
                  </label>
                  <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                    {order.ship_zip_postal_code ?? "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    País/Región
                  </label>
                  <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                    {order.ship_country_region ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Información Financiera
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Costo de Envío
                </label>
                <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(order.shipping_fee)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Impuestos
                </label>
                <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(order.taxes)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Tasa de Impuesto
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                  {order.tax_rate != null ? `${order.tax_rate}%` : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Estado de Impuesto
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                  {TAX_STATUS[order.tax_status_id ?? 0] || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Notas
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
