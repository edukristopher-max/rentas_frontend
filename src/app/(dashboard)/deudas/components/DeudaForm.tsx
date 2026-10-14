"use client";

import { useState, useEffect } from "react";
import { Deuda, CreateDeudaDto, UpdateDeudaDto } from "@/types/deuda";
import { createDeuda, updateDeuda } from "@/services/deudas.service";
import { Contribuyente } from "@/types/contribuyente";
import { getContribuyentes } from "@/services/contribuyentes.service";
import { Predio } from "@/types/predio";
import { getPredios } from "@/services/predios.service";

interface DeudaFormProps {
  deudaToEdit?: Deuda | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DeudaForm({ deudaToEdit, onSuccess, onCancel }: DeudaFormProps) {
  const [formData, setFormData] = useState({
    contribuyenteId: 0,
    predioId: 0, // 0 significa nulo (sin predio)
    concepto: "",
    tipoDeuda: "Impuesto",
    montoOriginal: 0,
    mora: 0,
    descuento: 0,
    fechaVencimiento: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
    estado: "Pendiente",
  });

  const [contribuyentes, setContribuyentes] = useState<Contribuyente[]>([]);
  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar dependencias
    const fetchData = async () => {
      try {
        const [contribuyentesData, prediosData] = await Promise.all([
          getContribuyentes(),
          getPredios()
        ]);
        setContribuyentes(contribuyentesData);
        setPredios(prediosData);
        
        if (contribuyentesData.length > 0 && !deudaToEdit) {
          setFormData((prev) => ({ ...prev, contribuyenteId: contribuyentesData[0].id }));
        }
      } catch (err) {
        console.error("Error cargando datos", err);
      }
    };

    fetchData();

    if (deudaToEdit) {
      setFormData({
        contribuyenteId: deudaToEdit.contribuyenteId,
        predioId: deudaToEdit.predioId || 0,
        concepto: deudaToEdit.concepto,
        tipoDeuda: deudaToEdit.tipoDeuda,
        montoOriginal: deudaToEdit.montoOriginal,
        mora: deudaToEdit.mora,
        descuento: deudaToEdit.descuento,
        fechaVencimiento: deudaToEdit.fechaVencimiento.split('T')[0],
        estado: deudaToEdit.estado,
      });
    }
  }, [deudaToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === "number") {
      parsedValue = parseFloat(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const calcularTotalPagar = () => {
    return (formData.montoOriginal || 0) + (formData.mora || 0) - (formData.descuento || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contribuyenteId) {
      setError("Por favor, selecciona un contribuyente responsable.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        predioId: formData.predioId === 0 ? null : formData.predioId
      };

      if (deudaToEdit) {
        await updateDeuda(deudaToEdit.id, dataToSubmit as UpdateDeudaDto);
      } else {
        await createDeuda(dataToSubmit as CreateDeudaDto);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al guardar la deuda.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar predios para mostrar solo los del contribuyente seleccionado
  const prediosFiltrados = predios.filter(p => p.contribuyenteId === formData.contribuyenteId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-municipal-950">
        {deudaToEdit ? "Gestionar Deuda" : "Nueva Deuda"}
      </h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contribuyente (Responsable)</label>
            <select
              name="contribuyenteId"
              value={formData.contribuyenteId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            >
              <option value={0} disabled>-- Selecciona --</option>
              {contribuyentes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombreCompletoRazonSocial}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Predio (Opcional)</label>
            <select
              name="predioId"
              value={formData.predioId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
            >
              <option value={0}>Ninguno (General)</option>
              {prediosFiltrados.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.direccion} [{p.codigoCatastral}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Tipo de Deuda</label>
            <select
              name="tipoDeuda"
              value={formData.tipoDeuda}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            >
              <option value="Impuesto">Impuesto</option>
              <option value="Arbitrio">Arbitrio</option>
              <option value="Multa">Multa Administrativa</option>
              <option value="Fraccionamiento">Fraccionamiento</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Concepto Detallado</label>
            <input
              type="text"
              name="concepto"
              value={formData.concepto}
              onChange={handleChange}
              placeholder="Ej. Impuesto Predial 2026"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div>
            <label className="block text-xs font-bold text-gray-700">Monto Base (S/)</label>
            <input
              type="number"
              step="0.01"
              name="montoOriginal"
              value={formData.montoOriginal}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border font-medium text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-red-600">Mora (+) (S/)</label>
            <input
              type="number"
              step="0.01"
              name="mora"
              value={formData.mora}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border text-red-700"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-green-600">Descuento (-) (S/)</label>
            <input
              type="number"
              step="0.01"
              name="descuento"
              value={formData.descuento}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-green-700"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-municipal-900 p-4 rounded-lg text-white shadow-inner">
           <span className="font-medium text-municipal-100">Total a Pagar (Monto + Mora - Descuento):</span>
           <span className="font-bold text-2xl">S/ {calcularTotalPagar().toFixed(2)}</span>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado de Deuda</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Vencida">Vencida</option>
              <option value="Pagada">Pagada</option>
              <option value="Fraccionada">Fraccionada</option>
            </select>
          </div>
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
            {loading ? "Guardando..." : "Guardar Deuda"}
          </button>
        </div>
      </form>
    </div>
  );
}
