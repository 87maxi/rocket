"use client";

import { Order, ORDER_STATUS } from "../types/order";
import Link from "next/link";

interface OrderCardProps {
  order: Order;
  onDelete?: (orderId: number) => void;
  showActions?: boolean;
}

export default function OrderCard({
  order,
  onDelete,
  showActions = true,
}: OrderCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const handleDelete = () => {
    if (order.id && onDelete) {
      if (window.confirm(`¿Estás seguro de eliminar la orden #${order.id}?`)) {
        onDelete(order.id);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Orden #{order.id}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              order.status_id
            )}`}
          >
            {ORDER_STATUS[order.status_id ?? 0] || "Unknown"}
          </span>
        </div>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {formatDate(order.order_date)}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Customer & Employee */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">Cliente ID:</span>
            <span className="ml-2 font-medium text-zinc-900 dark:text-zinc-100">
              {order.customer_id ?? "N/A"}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">Empleado ID:</span>
            <span className="ml-2 font-medium text-zinc-900 dark:text-zinc-100">
              {order.employee_id ?? "N/A"}
            </span>
          </div>
        </div>

        {/* Shipping Info */}
        {order.ship_name && (
          <div className="text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Enviar a:</span>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {order.ship_name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              {[
                order.ship_address,
                order.ship_city,
                order.ship_state_province,
                order.ship_zip_postal_code,
                order.ship_country_region,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">Fecha envío:</span>
            <span className="ml-2 text-zinc-900 dark:text-zinc-100">
              {formatDate(order.shipped_date)}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">Fecha pago:</span>
            <span className="ml-2 text-zinc-900 dark:text-zinc-100">
              {formatDate(order.paid_date)}
            </span>
          </div>
        </div>

        {/* Financial */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <div className="text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Envío:</span>
            <span className="ml-2 text-zinc-900 dark:text-zinc-100">
              {formatCurrency(order.shipping_fee)}
            </span>
            <span className="mx-2 text-zinc-300 dark:text-zinc-600">|</span>
            <span className="text-zinc-500 dark:text-zinc-400">Impuestos:</span>
            <span className="ml-2 text-zinc-900 dark:text-zinc-100">
              {formatCurrency(order.taxes)}
            </span>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Notas:</span>
            <p className="text-zinc-700 dark:text-zinc-300 italic mt-1">
              {order.notes}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-t border-zinc-200 dark:border-zinc-700 flex gap-2 justify-end">
          <Link
            href={`/orders/${order.id}`}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          >
            Ver detalles
          </Link>
          <Link
            href={`/orders/${order.id}/edit`}
            className="px-3 py-1.5 text-sm font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors"
          >
            Editar
          </Link>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
