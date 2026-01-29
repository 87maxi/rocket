"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ordersApi, Order } from "@/app/lib/api";
import OrderCard from "@/app/components/OrderCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Alert, { AlertType } from "@/app/components/Alert";

type FilterType = "all" | "customer" | "employee";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterId, setFilterId] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState<"checking" | "online" | "offline">("checking");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setAlert(null);

    let response;

    try {
      switch (filterType) {
        case "customer":
          if (filterId) {
            response = await ordersApi.getOrdersByCustomer(parseInt(filterId));
          } else {
            response = await ordersApi.getAllOrders();
          }
          break;
        case "employee":
          if (filterId) {
            response = await ordersApi.getOrdersByEmployee(parseInt(filterId));
          } else {
            response = await ordersApi.getAllOrders();
          }
          break;
        default:
          response = await ordersApi.getAllOrders();
      }

      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setAlert({ type: "error", message: response.message || "Error al cargar órdenes" });
        setOrders([]);
      }
    } catch {
      setAlert({ type: "error", message: "Error de conexión con la API" });
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterType, filterId]);

  const checkHealth = async () => {
    setHealthStatus("checking");
    try {
      const response = await ordersApi.healthCheck();
      setHealthStatus(response.success ? "online" : "offline");
    } catch {
      setHealthStatus("offline");
    }
  };

  useEffect(() => {
    checkHealth();
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (orderId: number) => {
    try {
      const response = await ordersApi.deleteOrder(orderId);
      if (response.success) {
        setAlert({ type: "success", message: `Orden #${orderId} eliminada correctamente` });
        fetchOrders();
      } else {
        setAlert({ type: "error", message: response.message || "Error al eliminar la orden" });
      }
    } catch {
      setAlert({ type: "error", message: "Error de conexión al eliminar la orden" });
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const clearFilter = () => {
    setFilterType("all");
    setFilterId("");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 shadow-sm border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
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
                  Northwind Orders
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Gestión de órdenes - API v0.1.1
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Health Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    healthStatus === "online"
                      ? "bg-green-500"
                      : healthStatus === "offline"
                      ? "bg-red-500"
                      : "bg-yellow-500 animate-pulse"
                  }`}
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {healthStatus === "online"
                    ? "API Online"
                    : healthStatus === "offline"
                    ? "API Offline"
                    : "Verificando..."}
                </span>
              </div>

              <Link
                href="/orders/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nueva Orden
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
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

        {/* Filters */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 mb-6">
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="filterType"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Filtrar por
              </label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Todas las órdenes</option>
                <option value="customer">Por Cliente</option>
                <option value="employee">Por Empleado</option>
              </select>
            </div>

            {filterType !== "all" && (
              <div className="flex-1">
                <label
                  htmlFor="filterId"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  {filterType === "customer" ? "Customer ID" : "Employee ID"}
                </label>
                <input
                  type="number"
                  id="filterId"
                  value={filterId}
                  onChange={(e) => setFilterId(e.target.value)}
                  placeholder={`Ingrese ${filterType === "customer" ? "Customer" : "Employee"} ID`}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Buscar
              </button>
              {filterType !== "all" && (
                <button
                  type="button"
                  onClick={clearFilter}
                  className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" message="Cargando órdenes..." />
          </div>
        ) : orders.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              No hay órdenes
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {filterType !== "all"
                ? "No se encontraron órdenes con los filtros seleccionados"
                : "Comienza creando una nueva orden"}
            </p>
            <div className="mt-6">
              <Link
                href="/orders/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nueva Orden
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {orders.length} {orders.length === 1 ? "orden encontrada" : "órdenes encontradas"}
              </p>
              <button
                onClick={() => fetchOrders()}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualizar
              </button>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onDelete={handleDelete}
                  showActions
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
