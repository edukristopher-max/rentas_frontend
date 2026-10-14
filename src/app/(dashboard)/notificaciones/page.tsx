"use client";

import { useEffect, useState } from "react";
import { Notificacion } from "@/types/notificacion";
import { getNotificaciones, updateNotificacion, deleteNotificacion } from "@/services/notificaciones.service";
import NotificacionForm from "./components/NotificacionForm";
import Link from "next/link";

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const data = await getNotificaciones();
      setNotificaciones(data);
      setError(null);
    } catch (err: any) {
      setError("No se pudieron cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchNotificaciones();
  };

  const handleMarcarLeida = async (notificacion: Notificacion) => {
      try {
          await updateNotificacion(notificacion.id, {
              contribuyenteId: notificacion.contribuyenteId,
              tipo: notificacion.tipo,
              medioEnvio: notificacion.medioEnvio,
              titulo: notificacion.titulo,
              mensaje: notificacion.mensaje,
              estado: "Leída"
          });
          fetchNotificaciones();
      } catch (err) {
          alert("Error al actualizar el estado.");
      }
  };

  const handleDelete = async (id: number) => {
      if (confirm("¿Seguro que deseas eliminar el registro de esta notificación?")) {
          try {
              await deleteNotificacion(id);
              fetchNotificaciones();
          } catch(err) {
              alert("Error al eliminar.");
          }
      }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Enviada": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Entregada": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Leída": return "bg-green-100 text-green-800 border-green-200";
      case "Fallida": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-municipal-950 flex items-center gap-2">
               <span className="text-blue-500">✉</span> Bandeja de Notificaciones
            </h1>
            <p className="text-gray-500 mt-1">Centro de comunicaciones oficiales con los contribuyentes</p>
          </div>
          <div className="flex gap-4">
             <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              Volver al Inicio
            </Link>
            <button
              onClick={handleOpenModal}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex items-center shadow-md gap-2"
            >
              + Redactar Mensaje
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
             <h2 className="text-lg font-bold text-gray-800">Mensajes Enviados</h2>
             <span className="text-sm text-gray-500">Total: {notificaciones.length} registros</span>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando bandeja...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-600 border-b border-gray-200 text-sm">
                    <th className="p-4 font-semibold">Fecha</th>
                    <th className="p-4 font-semibold">Destinatario</th>
                    <th className="p-4 font-semibold w-1/3">Asunto y Mensaje</th>
                    <th className="p-4 font-semibold">Canal</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {notificaciones.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        La bandeja está vacía. No se han enviado notificaciones.
                      </td>
                    </tr>
                  ) : (
                    notificaciones.map((n) => (
                      <tr key={n.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                        <td className="p-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                           {new Date(n.fechaEnvio).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-municipal-900 block">{n.contribuyenteNombre}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-800 block text-sm">{n.titulo}</span>
                          <span className="text-xs text-gray-500 line-clamp-2 mt-1">{n.mensaje}</span>
                        </td>
                        <td className="p-4">
                           <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                               {n.medioEnvio}
                           </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-bold border ${getStatusBadgeClass(n.estado)}`}>
                            {n.estado}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                           {n.estado !== "Leída" && (
                               <button
                                 onClick={() => handleMarcarLeida(n)}
                                 className="text-green-600 hover:text-green-800 text-xs font-bold bg-green-50 px-2 py-1 rounded"
                               >
                                 ✔ Leída
                               </button>
                           )}
                           <button
                             onClick={() => handleDelete(n.id)}
                             className="text-red-500 hover:text-red-700 text-xs font-medium"
                           >
                             Borrar
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
          <NotificacionForm
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}
