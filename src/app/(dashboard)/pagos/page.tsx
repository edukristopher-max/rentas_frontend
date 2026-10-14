"use client";

import { useEffect, useState } from "react";
import { Pago } from "@/types/pago";
import { getPagos } from "@/services/pagos.service";
import PagoForm from "./components/PagoForm";
import Link from "next/link";

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);

  const fetchPagos = async () => {
    setLoading(true);
    try {
      const data = await getPagos();
      setPagos(data);
      setError(null);
    } catch (err: any) {
      setError("No se pudieron cargar los recibos de pago.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchPagos();
  };

  const calcularRecaudacionDiaria = () => {
    const hoy = new Date().toISOString().split('T')[0];
    return pagos
      .filter(p => p.fechaPago.startsWith(hoy))
      .reduce((sum, current) => sum + current.montoPagado, 0);
  };

  const calcularRecaudacionTotal = () => {
    return pagos.reduce((sum, current) => sum + current.montoPagado, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-municipal-950 flex items-center gap-2">
              <span className="text-green-600">💵</span> Caja y Pagos
            </h1>
            <p className="text-gray-500 mt-1">Registro de cobros y emisión de recibos</p>
          </div>
          <div className="flex gap-4">
             <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              Volver al Inicio
            </Link>
            <button
              onClick={handleOpenModal}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors flex items-center shadow-lg"
            >
              + Nuevo Pago
            </button>
          </div>
        </div>

        {/* Dashboards Financieros Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Recaudación Hoy</p>
                <p className="text-3xl font-bold text-green-600 mt-2">S/ {calcularRecaudacionDiaria().toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Recaudación Histórica</p>
                <p className="text-3xl font-bold text-municipal-900 mt-2">S/ {calcularRecaudacionTotal().toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Recibos Emitidos</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{pagos.length}</p>
            </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-5 border-b border-gray-200 bg-gray-50">
             <h2 className="text-lg font-bold text-gray-800">Historial de Recibos</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando datos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-600 border-b border-gray-200 text-sm">
                    <th className="p-4 font-semibold">N° Recibo / Fecha</th>
                    <th className="p-4 font-semibold">Contribuyente</th>
                    <th className="p-4 font-semibold">Concepto Pagado</th>
                    <th className="p-4 font-semibold">Método de Pago</th>
                    <th className="p-4 font-semibold">Cajero</th>
                    <th className="p-4 font-semibold text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {pagos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No hay pagos registrados.
                      </td>
                    </tr>
                  ) : (
                    pagos.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                           <span className="font-bold text-municipal-900 block">{p.numeroRecibo}</span>
                           <span className="text-xs text-gray-500">{new Date(p.fechaPago).toLocaleString()}</span>
                        </td>
                        <td className="p-4 font-medium text-gray-800">
                          {p.contribuyenteNombre}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {p.deudaConcepto}
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200">
                             {p.metodoPago}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-500 font-medium uppercase">
                          {p.cajero}
                        </td>
                        <td className="p-4 text-right font-bold text-green-700 text-lg">
                          S/ {p.montoPagado.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <PagoForm
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}
