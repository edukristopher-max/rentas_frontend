"use client";

import { useState, useEffect } from "react";
import { Predio, CreatePredioDto, UpdatePredioDto } from "@/types/predio";
import { createPredio, updatePredio } from "@/services/predios.service";
import { Contribuyente } from "@/types/contribuyente";
import { getContribuyentes } from "@/services/contribuyentes.service";

interface PredioFormProps {
  predioToEdit?: Predio | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PredioForm({ predioToEdit, onSuccess, onCancel }: PredioFormProps) {
  const [formData, setFormData] = useState({
    codigoCatastral: "",
    direccion: "",
    areaTerreno: 0,
    areaConstruida: 0,
    usoPredio: "Casa habitación",
    valorArancelario: 0,
    contribuyenteId: 0,
    estado: true,
  });

  const [contribuyentes, setContribuyentes] = useState<Contribuyente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar contribuyentes para el Select
    const fetchContribuyentes = async () => {
      try {
        const data = await getContribuyentes();
        setContribuyentes(data);
        if (data.length > 0 && !predioToEdit) {
          setFormData((prev) => ({ ...prev, contribuyenteId: data[0].id }));
        }
      } catch (err) {
        console.error("Error cargando contribuyentes", err);
      }
    };

    fetchContribuyentes();

    if (predioToEdit) {
      setFormData({
        codigoCatastral: predioToEdit.codigoCatastral,
        direccion: predioToEdit.direccion,
        areaTerreno: predioToEdit.areaTerreno,
        areaConstruida: predioToEdit.areaConstruida,
        usoPredio: predioToEdit.usoPredio,
        valorArancelario: predioToEdit.valorArancelario,
        contribuyenteId: predioToEdit.contribuyenteId,
        estado: predioToEdit.estado,
      });
    }
  }, [predioToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === "number") {
      parsedValue = parseFloat(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contribuyenteId) {
      setError("Por favor, selecciona un contribuyente.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (predioToEdit) {
        await updatePredio(predioToEdit.id, formData as UpdatePredioDto);
      } else {
        await createPredio(formData as CreatePredioDto);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al guardar el predio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-municipal-950">
        {predioToEdit ? "Editar Predio" : "Nuevo Predio"}
      </h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <label className="block text-sm font-medium text-gray-700">Contribuyente (Propietario)</label>
          <select
            name="contribuyenteId"
            value={formData.contribuyenteId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
            required
          >
            <option value={0} disabled>-- Selecciona un Contribuyente --</option>
            {contribuyentes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombreCompletoRazonSocial} - {c.tipoDocumento} {c.numeroDocumento}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Código Catastral</label>
            <input
              type="text"
              name="codigoCatastral"
              value={formData.codigoCatastral}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Uso del Predio</label>
            <select
              name="usoPredio"
              value={formData.usoPredio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            >
              <option value="Casa habitación">Casa habitación</option>
              <option value="Comercio">Comercio</option>
              <option value="Terreno sin construir">Terreno sin construir</option>
              <option value="Industria">Industria</option>
              <option value="Agrícola">Agrícola</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Área Terreno (m²)</label>
            <input
              type="number"
              step="0.01"
              name="areaTerreno"
              value={formData.areaTerreno}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Área Const. (m²)</label>
            <input
              type="number"
              step="0.01"
              name="areaConstruida"
              value={formData.areaConstruida}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Val. Arancelario</label>
            <input
              type="number"
              step="0.01"
              name="valorArancelario"
              value={formData.valorArancelario}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
        </div>

        {predioToEdit && (
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado}
              onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.checked }))}
              className="h-4 w-4 text-municipal-600 focus:ring-municipal-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Activo</label>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
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
            className="px-4 py-2 bg-municipal-600 text-white rounded-md hover:bg-municipal-800 transition-colors"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
