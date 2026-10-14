"use client";

import { useState, useEffect } from "react";
import { ImpuestoPredial, CreateImpuestoPredialDto, UpdateImpuestoPredialDto } from "@/types/impuestoPredial";
import { createImpuestoPredial, updateImpuestoPredial } from "@/services/impuestosPrediales.service";
import { Predio } from "@/types/predio";
import { getPredios } from "@/services/predios.service";

interface ImpuestoPredialFormProps {
  impuestoToEdit?: ImpuestoPredial | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ImpuestoPredialForm({ impuestoToEdit, onSuccess, onCancel }: ImpuestoPredialFormProps) {
  const [formData, setFormData] = useState({
    predioId: 0,
    anioFiscal: new Date().getFullYear(),
    montoBase: 0,
    impuestoCalculado: 0,
    fechaVencimiento: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0], // 31 dic
    estadoPago: "Pendiente",
    fechaPago: "",
  });

  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar predios para el Select
    const fetchPredios = async () => {
      try {
        const data = await getPredios();
        setPredios(data);
        if (data.length > 0 && !impuestoToEdit) {
          setFormData((prev) => ({ ...prev, predioId: data[0].id }));
        }
      } catch (err) {
        console.error("Error cargando predios", err);
      }
    };

    fetchPredios();

    if (impuestoToEdit) {
      setFormData({
        predioId: impuestoToEdit.predioId,
        anioFiscal: impuestoToEdit.anioFiscal,
        montoBase: impuestoToEdit.montoBase,
        impuestoCalculado: impuestoToEdit.impuestoCalculado,
        fechaVencimiento: impuestoToEdit.fechaVencimiento.split('T')[0],
        estadoPago: impuestoToEdit.estadoPago,
        fechaPago: impuestoToEdit.fechaPago ? impuestoToEdit.fechaPago.split('T')[0] : "",
      });
    }
  }, [impuestoToEdit]);

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
    if (!formData.predioId) {
      setError("Por favor, selecciona un predio.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        fechaPago: formData.fechaPago || undefined // no enviar string vacío
      };

      if (impuestoToEdit) {
        await updateImpuestoPredial(impuestoToEdit.id, dataToSubmit as UpdateImpuestoPredialDto);
      } else {
        await createImpuestoPredial(dataToSubmit as CreateImpuestoPredialDto);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al guardar el impuesto predial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-municipal-950">
        {impuestoToEdit ? "Editar Impuesto" : "Nuevo Impuesto"}
      </h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <label className="block text-sm font-medium text-gray-700">Predio</label>
          <select
            name="predioId"
            value={formData.predioId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
            required
          >
            <option value={0} disabled>-- Selecciona un Predio --</option>
            {predios.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.codigoCatastral}] {p.direccion} - {p.contribuyenteNombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Año Fiscal</label>
            <input
              type="number"
              name="anioFiscal"
              value={formData.anioFiscal}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado de Pago</label>
            <select
              name="estadoPago"
              value={formData.estadoPago}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto Base (S/)</label>
            <input
              type="number"
              step="0.01"
              name="montoBase"
              value={formData.montoBase}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Impuesto Calc. (S/)</label>
            <input
              type="number"
              step="0.01"
              name="impuestoCalculado"
              value={formData.impuestoCalculado}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
            <input
              type="date"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          {formData.estadoPago === "Pagado" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Pago</label>
              <input
                type="date"
                name="fechaPago"
                value={formData.fechaPago}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              />
            </div>
          )}
        </div>

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
