"use client";

import { useState, useEffect } from "react";
import { LicenciaTasa, CreateLicenciaTasaDto, UpdateLicenciaTasaDto } from "@/types/licenciaTasa";
import { createLicenciaTasa, updateLicenciaTasa } from "@/services/licenciasTasas.service";
import { Contribuyente } from "@/types/contribuyente";
import { getContribuyentes } from "@/services/contribuyentes.service";
import { Predio } from "@/types/predio";
import { getPredios } from "@/services/predios.service";

interface LicenciaFormProps {
  licenciaToEdit?: LicenciaTasa | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LicenciaForm({ licenciaToEdit, onSuccess, onCancel }: LicenciaFormProps) {
  const [formData, setFormData] = useState({
    contribuyenteId: 0,
    predioId: 0,
    tipo: "Licencia de Funcionamiento",
    numeroExpediente: "",
    concepto: "",
    monto: 0,
    fechaEmision: new Date().toISOString().split('T')[0],
    fechaVencimiento: "",
    estado: "En Trámite",
  });

  const [contribuyentes, setContribuyentes] = useState<Contribuyente[]>([]);
  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar contribuyentes y predios
    const fetchData = async () => {
      try {
        const [contribuyentesData, prediosData] = await Promise.all([
          getContribuyentes(),
          getPredios()
        ]);
        setContribuyentes(contribuyentesData);
        setPredios(prediosData);

        if (contribuyentesData.length > 0 && !licenciaToEdit) {
          setFormData((prev) => ({ ...prev, contribuyenteId: contribuyentesData[0].id }));
        }
      } catch (err) {
        console.error("Error cargando dependencias", err);
      }
    };

    fetchData();

    if (licenciaToEdit) {
      setFormData({
        contribuyenteId: licenciaToEdit.contribuyenteId,
        predioId: licenciaToEdit.predioId || 0,
        tipo: licenciaToEdit.tipo,
        numeroExpediente: licenciaToEdit.numeroExpediente,
        concepto: licenciaToEdit.concepto,
        monto: licenciaToEdit.monto,
        fechaEmision: licenciaToEdit.fechaEmision.split('T')[0],
        fechaVencimiento: licenciaToEdit.fechaVencimiento ? licenciaToEdit.fechaVencimiento.split('T')[0] : "",
        estado: licenciaToEdit.estado,
      });
    }
  }, [licenciaToEdit]);

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
      const dataToSubmit = {
        ...formData,
        predioId: formData.predioId === 0 ? null : formData.predioId,
        fechaVencimiento: formData.fechaVencimiento || null
      };

      if (licenciaToEdit) {
        await updateLicenciaTasa(licenciaToEdit.id, dataToSubmit as UpdateLicenciaTasaDto);
      } else {
        await createLicenciaTasa(dataToSubmit as CreateLicenciaTasaDto);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al guardar la licencia.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar predios para mostrar solo los del contribuyente seleccionado
  const prediosFiltrados = predios.filter(p => p.contribuyenteId === formData.contribuyenteId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-municipal-950">
        {licenciaToEdit ? "Editar Licencia / Tasa" : "Nuevo Trámite de Licencia"}
      </h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contribuyente (Titular)</label>
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
            <label className="block text-sm font-medium text-gray-700">Predio (Opcional - Local Comercial)</label>
            <select
              name="predioId"
              value={formData.predioId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
            >
              <option value={0}>No aplica (Ej: Tasa administrativa)</option>
              {prediosFiltrados.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.direccion} [{p.codigoCatastral}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Trámite</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            >
              <option value="Licencia de Funcionamiento">Licencia de Funcionamiento</option>
              <option value="Licencia de Construcción">Licencia de Construcción</option>
              <option value="Certificado ITSE (Defensa Civil)">Certificado ITSE (Defensa Civil)</option>
              <option value="Tasa Administrativa">Tasa Administrativa (Otros)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">N° de Expediente</label>
            <input
              type="text"
              name="numeroExpediente"
              value={formData.numeroExpediente}
              onChange={handleChange}
              placeholder="Ej. EXP-2026-001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Concepto / Actividad Comercial</label>
          <input
            type="text"
            name="concepto"
            value={formData.concepto}
            onChange={handleChange}
            placeholder="Ej. Restaurante y Bar, Bodega, etc."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-bold text-gray-700">Costo del Trámite (S/)</label>
            <input
              type="number"
              step="0.01"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border text-lg font-bold text-municipal-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado del Trámite</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            >
              <option value="En Trámite">En Trámite</option>
              <option value="Activa">Activa (Aprobada)</option>
              <option value="Vencida">Vencida</option>
              <option value="Revocada">Revocada / Anulada</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Emisión</label>
            <input
              type="date"
              name="fechaEmision"
              value={formData.fechaEmision}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento (Opcional)</label>
            <input
              type="date"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2 border"
            />
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
            className="px-4 py-2 bg-municipal-600 text-white rounded-md hover:bg-municipal-800 transition-colors shadow-sm"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
}
