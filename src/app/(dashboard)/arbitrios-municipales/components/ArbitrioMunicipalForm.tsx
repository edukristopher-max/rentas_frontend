"use client";

import { useState, useEffect } from "react";
import { ArbitrioMunicipal, CreateArbitrioMunicipalDto, UpdateArbitrioMunicipalDto } from "@/types/arbitrioMunicipal";
import { createArbitrioMunicipal, updateArbitrioMunicipal } from "@/services/arbitriosMunicipales.service";
import { Predio } from "@/types/predio";
import { getPredios } from "@/services/predios.service";

interface ArbitrioMunicipalFormProps {
  arbitrioToEdit?: ArbitrioMunicipal | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ArbitrioMunicipalForm({ arbitrioToEdit, onSuccess, onCancel }: ArbitrioMunicipalFormProps) {
  const [formData, setFormData] = useState({
    predioId: 0,
    anioFiscal: new Date().getFullYear(),
    periodo: "Enero",
    montoLimpieza: 0,
    montoParques: 0,
    montoSerenazgo: 0,
    fechaVencimiento: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0], // Último día del mes actual
    estadoPago: "Pendiente",
    fechaPago: "",
  });

  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar predios
    const fetchPredios = async () => {
      try {
        const data = await getPredios();
        setPredios(data);
        if (data.length > 0 && !arbitrioToEdit) {
          setFormData((prev) => ({ ...prev, predioId: data[0].id }));
        }
      } catch (err) {
        console.error("Error cargando predios", err);
      }
    };

    fetchPredios();

    if (arbitrioToEdit) {
      setFormData({
        predioId: arbitrioToEdit.predioId,
        anioFiscal: arbitrioToEdit.anioFiscal,
        periodo: arbitrioToEdit.periodo,
        montoLimpieza: arbitrioToEdit.montoLimpieza,
        montoParques: arbitrioToEdit.montoParques,
        montoSerenazgo: arbitrioToEdit.montoSerenazgo,
        fechaVencimiento: arbitrioToEdit.fechaVencimiento.split('T')[0],
        estadoPago: arbitrioToEdit.estadoPago,
        fechaPago: arbitrioToEdit.fechaPago ? arbitrioToEdit.fechaPago.split('T')[0] : "",
      });
    }
  }, [arbitrioToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === "number") {
      parsedValue = parseFloat(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const calcularTotal = () => {
    return (formData.montoLimpieza || 0) + (formData.montoParques || 0) + (formData.montoSerenazgo || 0);
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
        fechaPago: formData.fechaPago || undefined
      };

      if (arbitrioToEdit) {
        await updateArbitrioMunicipal(arbitrioToEdit.id, dataToSubmit as UpdateArbitrioMunicipalDto);
      } else {
        await createArbitrioMunicipal(dataToSubmit as CreateArbitrioMunicipalDto);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al guardar el arbitrio municipal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-municipal-950">
        {arbitrioToEdit ? "Editar Arbitrio" : "Nuevo Arbitrio"}
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
                [{p.codigoCatastral}] {p.direccion}
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
            <label className="block text-sm font-medium text-gray-700">Periodo</label>
            <select
              name="periodo"
              value={formData.periodo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            >
              <option value="Enero">Enero</option>
              <option value="Febrero">Febrero</option>
              <option value="Marzo">Marzo</option>
              <option value="Abril">Abril</option>
              <option value="Mayo">Mayo</option>
              <option value="Junio">Junio</option>
              <option value="Julio">Julio</option>
              <option value="Agosto">Agosto</option>
              <option value="Septiembre">Septiembre</option>
              <option value="Octubre">Octubre</option>
              <option value="Noviembre">Noviembre</option>
              <option value="Diciembre">Diciembre</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-700">Limpieza (S/)</label>
            <input
              type="number"
              step="0.01"
              name="montoLimpieza"
              value={formData.montoLimpieza}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-1 text-sm border"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Parques (S/)</label>
            <input
              type="number"
              step="0.01"
              name="montoParques"
              value={formData.montoParques}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-1 text-sm border"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Serenazgo (S/)</label>
            <input
              type="number"
              step="0.01"
              name="montoSerenazgo"
              value={formData.montoSerenazgo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-1 text-sm border"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-municipal-50 p-3 rounded border border-municipal-100">
           <span className="font-semibold text-municipal-800">Total a Pagar:</span>
           <span className="font-bold text-lg text-municipal-900">S/ {calcularTotal().toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vencimiento</label>
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
