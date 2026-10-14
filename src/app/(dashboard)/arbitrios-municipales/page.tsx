"use client";

import { useEffect, useState } from "react";
import { ArbitrioMunicipal } from "@/types/arbitrioMunicipal";
import { getArbitriosMunicipales, deleteArbitrioMunicipal } from "@/services/arbitriosMunicipales.service";
import ArbitrioMunicipalForm from "./components/ArbitrioMunicipalForm";
import Link from "next/link";

export default function ArbitriosMunicipalesPage() {
  const [arbitrios, setArbitrios] = useState<ArbitrioMunicipal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [arbitrioToEdit, setArbitrioToEdit] = useState<ArbitrioMunicipal | null>(null);

  const fetchArbitrios = async () => {
    setLoading(true);
    try {
      const data = await getArbitriosMunicipales();
      setArbitrios(data);
      setError(null);
    } catch (err: any) {
      setError("No se pudieron cargar los arbitrios municipales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArbitrios();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este registro de arbitrios?")) {
      try {
        await deleteArbitrioMunicipal(id);
        fetchArbitrios();
      } catch (err) {
        alert("Error al eliminar el arbitrio.");
      }
    }
  };

  const handleOpenModal = (arbitrio: ArbitrioMunicipal | null = null) => {
    setArbitrioToEdit(arbitrio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setArbitrioToEdit(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchArbitrios();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pagado": return "bg-green-100 text-green-700";
      case "Vencido": return "bg-red-100 text-red-700";
      case "Pendiente": default: return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-municipal-950">Arbitrios Municipales</h1>
            <p className="text-gray-500 mt-1">Cobros de limpieza pública, parques, jardines y serenazgo</p>
          </div>
          <div className="flex gap-4">
             <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              Volver al Inicio
            </Link>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-municipal-600 text-white rounded-md hover:bg-municipal-800 transition-colors flex items-center shadow-md"
            >
              + Generar Arbitrio
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando datos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                    <th className="p-4 font-semibold">Predio / Código</th>
                    <th className="p-4 font-semibold">Periodo</th>
                    <th className="p-4 font-semibold text-center">Desglose (Lim/Par/Ser)</th>
                    <th className="p-4 font-semibold text-right">Total a Pagar</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {arbitrios.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No hay arbitrios generados.
                      </td>
                    </tr>
                  ) : (
                    arbitrios.map((a) => (
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <span className="font-medium text-municipal-900">{a.predioCodigoCatastral}</span>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={a.predioDireccion}>
                            {a.predioDireccion}
                          </div>
                        </td>
                        <td className="p-4">
                           <span className="font-bold text-gray-800">{a.periodo}</span>
                           <div className="text-xs text-gray-500">{a.anioFiscal}</div>
                        </td>
                        <td className="p-4 text-center text-xs text-gray-500">
                          S/{a.montoLimpieza.toFixed(2)} / S/{a.montoParques.toFixed(2)} / S/{a.montoSerenazgo.toFixed(2)}
                        </td>
                        <td className="p-4 text-right font-medium text-gray-900">
                          S/ {a.montoTotal.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusBadgeClass(a.estadoPago)}`}>
                            {a.estadoPago}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(a)}
                            className="text-municipal-600 hover:text-municipal-800 text-sm font-medium"
                          >
                            Gestionar
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Eliminar
                          </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <ArbitrioMunicipalForm
            arbitrioToEdit={arbitrioToEdit}
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}
