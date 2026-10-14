"use client";

import { useState, useEffect } from "react";
import { Contribuyente, CreateContribuyenteDto, UpdateContribuyenteDto } from "@/types/contribuyente";
import { createContribuyente, updateContribuyente } from "@/services/contribuyentes.service";
import { Search, Loader2 } from "lucide-react";

interface ContribuyenteFormProps {
  contribuyenteToEdit?: Contribuyente | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ContribuyenteForm({ contribuyenteToEdit, onSuccess, onCancel }: ContribuyenteFormProps) {
  const [formData, setFormData] = useState({
    tipoDocumento: "DNI",
    numeroDocumento: "",
    nombreCompletoRazonSocial: "",
    direccion: "",
    telefono: "",
    email: "",
    estado: true,
  });

  const [loading, setLoading] = useState(false);
  const [isSearchingReniec, setIsSearchingReniec] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contribuyenteToEdit) {
      setFormData({
        tipoDocumento: contribuyenteToEdit.tipoDocumento,
        numeroDocumento: contribuyenteToEdit.numeroDocumento,
        nombreCompletoRazonSocial: contribuyenteToEdit.nombreCompletoRazonSocial,
        direccion: contribuyenteToEdit.direccion,
        telefono: contribuyenteToEdit.telefono,
        email: contribuyenteToEdit.email,
        estado: contribuyenteToEdit.estado,
      });
    }
  }, [contribuyenteToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchReniec = async () => {
    if (!formData.numeroDocumento) return;
    setIsSearchingReniec(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (formData.tipoDocumento === 'DNI') {
      setFormData(prev => ({
        ...prev,
        nombreCompletoRazonSocial: "PÉREZ RODRÍGUEZ, JUAN CARLOS",
        direccion: "AV. PRINCIPAL 123 - CAJARURO"
      }));
    } else if (formData.tipoDocumento === 'RUC') {
      setFormData(prev => ({
        ...prev,
        nombreCompletoRazonSocial: "INVERSIONES TECNOLOGICAS S.A.C.",
        direccion: "CALLE COMERCIO 456 - CAJARURO"
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        nombreCompletoRazonSocial: "EXTRANJERO DEMO",
        direccion: "JR. PRUEBA 789"
      }));
    }
    
    setIsSearchingReniec(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (contribuyenteToEdit) {
        await updateContribuyente(contribuyenteToEdit.id, formData as UpdateContribuyenteDto);
      } else {
        await createContribuyente(formData as CreateContribuyenteDto);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al guardar el contribuyente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {contribuyenteToEdit ? "Editar Contribuyente" : "Nuevo Contribuyente"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Complete los datos de identidad y contacto</p>
        </div>
        <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
          &times;
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-4 border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Documento</label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="block w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm p-2.5 outline-none transition-all"
              required
            >
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="CE">C. Ext</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Número</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                placeholder="Ej. 12345678"
                className="block w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm p-2.5 outline-none transition-all"
                required
              />
              <button 
                type="button"
                onClick={handleSearchReniec}
                disabled={!formData.numeroDocumento || isSearchingReniec}
                className="px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center disabled:opacity-50"
                title={`Buscar en ${formData.tipoDocumento === 'RUC' ? 'SUNAT' : 'RENIEC'}`}
              >
                {isSearchingReniec ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombres o Razón Social</label>
          <input
            type="text"
            name="nombreCompletoRazonSocial"
            value={formData.nombreCompletoRazonSocial}
            onChange={handleChange}
            className="block w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm p-2.5 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dirección Legal</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="block w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm p-2.5 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="block w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm p-2.5 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm p-2.5 outline-none transition-all"
            />
          </div>
        </div>

        {contribuyenteToEdit && (
          <div className="flex items-center mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado}
              onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium text-slate-700">Mantener cuenta activa en el sistema</label>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
            disabled={loading || isSearchingReniec}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Guardando..." : "Guardar Contribuyente"}
          </button>
        </div>
      </form>
    </div>
  );
}
