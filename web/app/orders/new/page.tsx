"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ordersApi, NewOrder } from "@/app/lib/api";
import OrderForm from "@/app/components/OrderForm";
import Alert, { AlertType } from "@/app/components/Alert";

export default function NewOrderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const handleSubmit = async (data: NewOrder) => {
    setIsLoading(true);
    setAlert(null);

    try {
      const response = await ordersApi.createOrder(data);

      if (response.success && response.data) {
        setAlert({ type: "success", message: "Orden creada exitosamente" });
        // Redirect after a brief delay to show the success message
        setTimeout(() => {
          router.push(`/orders/${response.data!.id}`);
        }, 1000);
      } else {
        setAlert({
          type: "error",
          message: response.message || "Error al crear la orden",
        });
      }
    } catch {
      setAlert({ type: "error", message: "Error de conexión con la API" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/orders");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 shadow-sm border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                Nueva Orden
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Crear una nueva orden en el sistema
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
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={false}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
