"use client";

import { useEffect, useState } from "react";
import { Deuda } from "@/types/deuda";
import { getDeudas, deleteDeuda } from "@/services/deudas.service";
import DeudaForm from "./components/DeudaForm";
import Link from "next/link";

export default function DeudasPage() {
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [deudaToEdit, setDeudaToEdit] = useState<Deuda | null>(null);

  const fetchDeudas = async () => {
    setLoading(true);
    try {
      const data = await getDeudas();
      setDeudas(data);
      setError(null);
    } catch (err: any) {
      setError("No se pudieron cargar las deudas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeudas();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este registro de deuda? Esta acción es irreversible.")) {
      try {
        await deleteDeuda(id);
        fetchDeudas();
      } catch (err) {
        alert("Error al eliminar la deuda.");
      }
    }
  };

  const handleOpenModal = (deuda: Deuda | null = null) => {
    setDeudaToEdit(deuda);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeudaToEdit(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchDeudas();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pagada": return "bg-green-100 text-green-800 border border-green-200";
      case "Vencida": return "bg-red-100 text-red-800 border border-red-200";
      case "Fraccionada": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Pendiente": default: return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
  };

  const isVencida = (fechaStr: string, estado: string) => {
      if (estado === "Pagada") return false;
      const vencimiento = new Date(fechaStr);
      const hoy = new Date();
      return vencimiento < hoy;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-municipal-950 flex items-center gap-2">
              <span className="text-red-600">⚠</span> Deudas y Moras
            </h1>
            <p className="text-gray-500 mt-1">Gestión consolidada de cobranza a contribuyentes</p>
          </div>
          <div className="flex gap-4">
             <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              Volver al Inicio
            </Link>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center shadow-md"
            >
              + Registrar Deuda
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando datos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                    <th className="p-4 font-semibold">Contribuyente / Predio</th>
                    <th className="p-4 font-semibold">Concepto</th>
                    <th className="p-4 font-semibold text-center">Base / Mora / Dsc</th>
                    <th className="p-4 font-semibold text-right">Total a Pagar</th>
                    <th className="p-4 font-semibold">Vencimiento</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {deudas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">
                        No hay deudas registradas.
                      </td>
                    </tr>
                  ) : (
                    deudas.map((d) => {
                      const vencidaAlert = isVencida(d.fechaVencimiento, d.estado);
                      return (
                      <tr key={d.id} className={`border-b hover:bg-gray-50 transition-colors ${vencidaAlert ? 'bg-red-50/30' : 'border-gray-100'}`}>
                        <td className="p-4">
                          <span className="font-bold text-municipal-900">{d.contribuyenteNombre}</span>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={d.predioDireccion}>
                            {d.predioDireccion || "Sin predio (Multa genérica)"}
                          </div>
                        </td>
                        <td className="p-4">
                           <span className="font-medium text-gray-800 block">{d.concepto}</span>
                           <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{d.tipoDeuda}</span>
                        </td>
                        <td className="p-4 text-center text-xs">
                          <div className="flex justify-center gap-2">
                             <span className="text-gray-600" title="Monto Base">S/{d.montoOriginal.toFixed(2)}</span>
                             <span className="text-red-500" title="Mora">+{d.mora.toFixed(2)}</span>
                             <span className="text-green-600" title="Descuento">-{d.descuento.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-lg text-municipal-950">
                          S/ {d.totalPagar.toFixed(2)}
                        </td>
                        <td className="p-4 text-sm">
                          <span className={vencidaAlert ? 'text-red-600 font-medium flex items-center gap-1' : ''}>
                             {vencidaAlert && "⚠ "}
                             {new Date(d.fechaVencimiento).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${getStatusBadgeClass(d.estado)}`}>
                            {d.estado}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <button
                            onClick={() => handleOpenModal(d)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Modificar
                          </button>
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Borrar
                          </button>
                        </td>
                      </tr>
                    )})
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <DeudaForm
            deudaToEdit={deudaToEdit}
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}
