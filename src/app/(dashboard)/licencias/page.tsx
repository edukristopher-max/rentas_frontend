"use client";

import { useEffect, useState } from "react";
import { LicenciaTasa } from "@/types/licenciaTasa";
import { getLicenciasTasas, deleteLicenciaTasa } from "@/services/licenciasTasas.service";
import LicenciaForm from "./components/LicenciaForm";
import Link from "next/link";

export default function LicenciasPage() {
  const [licencias, setLicencias] = useState<LicenciaTasa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [licenciaToEdit, setLicenciaToEdit] = useState<LicenciaTasa | null>(null);

  const fetchLicencias = async () => {
    setLoading(true);
    try {
      const data = await getLicenciasTasas();
      setLicencias(data);
      setError(null);
    } catch (err: any) {
      setError("No se pudieron cargar las licencias y tasas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicencias();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este trámite?")) {
      try {
        await deleteLicenciaTasa(id);
        fetchLicencias();
      } catch (err) {
        alert("Error al eliminar la licencia.");
      }
    }
  };

  const handleOpenModal = (licencia: LicenciaTasa | null = null) => {
    setLicenciaToEdit(licencia);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLicenciaToEdit(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchLicencias();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Activa": return "bg-green-100 text-green-800 border-green-200";
      case "En Trámite": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Vencida": return "bg-red-100 text-red-800 border-red-200";
      case "Revocada": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-municipal-950">Licencias y Tasas</h1>
            <p className="text-gray-500 mt-1">Gestión de licencias de funcionamiento, ITSE y otros trámites</p>
          </div>
          <div className="flex gap-4">
             <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              Volver al Inicio
            </Link>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-municipal-600 text-white rounded-md hover:bg-municipal-800 transition-colors flex items-center shadow-md"
            >
              + Nuevo Trámite
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
                  <tr className="bg-gray-100 text-gray-700 border-b border-gray-200 text-sm">
                    <th className="p-4 font-semibold">Expediente / Fecha</th>
                    <th className="p-4 font-semibold">Contribuyente (Titular)</th>
                    <th className="p-4 font-semibold">Trámite y Concepto</th>
                    <th className="p-4 font-semibold">Costo (S/)</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {licencias.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No hay licencias ni tasas registradas.
                      </td>
                    </tr>
                  ) : (
                    licencias.map((l) => (
                      <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-municipal-900 block">{l.numeroExpediente}</span>
                          <span className="text-xs text-gray-500">{new Date(l.fechaEmision).toLocaleDateString()}</span>
                        </td>
                        <td className="p-4">
                           <span className="font-medium text-gray-800">{l.contribuyenteNombre}</span>
                           <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={l.predioDireccion}>
                            {l.predioDireccion || "Sin predio asociado"}
                           </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{l.tipo}</span>
                          <span className="text-sm font-medium text-gray-800 mt-1">{l.concepto}</span>
                        </td>
                        <td className="p-4 font-medium text-gray-900">
                          S/ {l.monto.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm border ${getStatusBadgeClass(l.estado)}`}>
                            {l.estado}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(l)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(l.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <LicenciaForm
            licenciaToEdit={licenciaToEdit}
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}
