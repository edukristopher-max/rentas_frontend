"use client";

import { useEffect, useState } from "react";
import { ImpuestoPredial } from "@/types/impuestoPredial";
import { getImpuestosPrediales, deleteImpuestoPredial } from "@/services/impuestosPrediales.service";
import ImpuestoPredialForm from "./components/ImpuestoPredialForm";
import Link from "next/link";

export default function ImpuestosPredialesPage() {
  const [impuestos, setImpuestos] = useState<ImpuestoPredial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [impuestoToEdit, setImpuestoToEdit] = useState<ImpuestoPredial | null>(null);

  const fetchImpuestos = async () => {
    setLoading(true);
    try {
      const data = await getImpuestosPrediales();
      setImpuestos(data);
      setError(null);
    } catch (err: any) {
      setError("No se pudieron cargar los impuestos prediales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpuestos();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este registro de impuesto?")) {
      try {
        await deleteImpuestoPredial(id);
        fetchImpuestos();
      } catch (err) {
        alert("Error al eliminar el impuesto.");
      }
    }
  };

  const handleOpenModal = (impuesto: ImpuestoPredial | null = null) => {
    setImpuestoToEdit(impuesto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImpuestoToEdit(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchImpuestos();
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
            <h1 className="text-3xl font-bold text-municipal-950">Impuestos Prediales</h1>
            <p className="text-gray-500 mt-1">Gestión de cobros y deudas de propiedades</p>
          </div>
          <div className="flex gap-4">
             <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              Volver al Inicio
            </Link>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-municipal-600 text-white rounded-md hover:bg-municipal-800 transition-colors flex items-center shadow-md"
            >
              + Generar Impuesto
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
                    <th className="p-4 font-semibold">Año Fiscal</th>
                    <th className="p-4 font-semibold text-right">Impuesto Total</th>
                    <th className="p-4 font-semibold">Vencimiento</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {impuestos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No hay impuestos generados.
                      </td>
                    </tr>
                  ) : (
                    impuestos.map((i) => (
                      <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <span className="font-medium text-municipal-900">{i.predioCodigoCatastral}</span>
                          <div className="text-xs text-gray-500 mt-1">{i.predioDireccion}</div>
                        </td>
                        <td className="p-4 font-bold text-gray-800">{i.anioFiscal}</td>
                        <td className="p-4 text-right font-medium text-gray-900">
                          S/ {i.impuestoCalculado.toFixed(2)}
                        </td>
                        <td className="p-4 text-sm">
                          {new Date(i.fechaVencimiento).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusBadgeClass(i.estadoPago)}`}>
                            {i.estadoPago}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(i)}
                            className="text-municipal-600 hover:text-municipal-800 text-sm font-medium"
                          >
                            Gestionar
                          </button>
                          <button
                            onClick={() => handleDelete(i.id)}
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
          <ImpuestoPredialForm
            impuestoToEdit={impuestoToEdit}
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}
