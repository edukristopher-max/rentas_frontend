"use client";

import { useState, useEffect } from "react";
import { CreateNotificacionDto } from "@/types/notificacion";
import { createNotificacion } from "@/services/notificaciones.service";
import { Contribuyente } from "@/types/contribuyente";
import { getContribuyentes } from "@/services/contribuyentes.service";

interface NotificacionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function NotificacionForm({ onSuccess, onCancel }: NotificacionFormProps) {
  const [contribuyentes, setContribuyentes] = useState<Contribuyente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateNotificacionDto>({
    contribuyenteId: 0,
    tipo: "Aviso de Cobranza",
    medioEnvio: "Email",
    titulo: "",
    mensaje: "",
  });

  useEffect(() => {
    const fetchContribuyentes = async () => {
      try {
        const data = await getContribuyentes();
        setContribuyentes(data);
      } catch (err) {
        console.error("Error cargando contribuyentes", err);
      }
    };
    fetchContribuyentes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === "number") {
      parsedValue = parseInt(value, 10) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value;
    let tituloPredefinido = "";
    
    switch (tipo) {
        case "Aviso de Cobranza": tituloPredefinido = "Aviso de Deuda Pendiente - Evite Cobranza Coactiva"; break;
        case "Recordatorio de Vencimiento": tituloPredefinido = "Recordatorio: Vencimiento Próximo de Obligaciones"; break;
        case "Resolución Administrativa": tituloPredefinido = "Notificación de Resolución Administrativa"; break;
        case "Informativa": tituloPredefinido = "Comunicado Importante - Municipalidad"; break;
    }

    setFormData((prev) => ({ 
        ...prev, 
        tipo,
        titulo: prev.titulo === "" || prev.titulo.startsWith("Aviso") || prev.titulo.startsWith("Recordatorio") || prev.titulo.startsWith("Comunicado") || prev.titulo.startsWith("Notificación") 
                ? tituloPredefinido 
                : prev.titulo
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contribuyenteId) {
      setError("Debes seleccionar un destinatario.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createNotificacion(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al enviar la notificación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-municipal-950 flex items-center gap-2">
        <span className="text-blue-500">✉</span> Redactar Notificación
      </h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <label className="block text-sm font-medium text-gray-700">Para (Destinatario)</label>
          <select
            name="contribuyenteId"
            value={formData.contribuyenteId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border bg-gray-50"
            required
          >
            <option value={0} disabled>-- Selecciona un Contribuyente --</option>
            {contribuyentes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombreCompletoRazonSocial} ({c.numeroDocumento})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Notificación</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleTipoChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border"
              required
            >
              <option value="Aviso de Cobranza">Aviso de Cobranza</option>
              <option value="Recordatorio de Vencimiento">Recordatorio de Vencimiento</option>
              <option value="Resolución Administrativa">Resolución Administrativa</option>
              <option value="Informativa">Informativa / General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Canal de Envío</label>
            <select
              name="medioEnvio"
              value={formData.medioEnvio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border"
              required
            >
              <option value="Email">Correo Electrónico (Email)</option>
              <option value="SMS">Mensaje de Texto (SMS)</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Físico">Notificador (Físico/Papel)</option>
            </select>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Asunto</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Asunto del mensaje..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border font-medium text-gray-800"
              required
            />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Cuerpo del Mensaje</label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              rows={6}
              placeholder="Escribe aquí el contenido de la notificación o resolución..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-3 border text-sm"
              required
            />
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex items-center shadow-md gap-2"
            disabled={loading}
          >
            {loading ? "Enviando..." : <><span className="text-xl">✈</span> Enviar Notificación</>}
          </button>
        </div>
      </form>
    </div>
  );
}
