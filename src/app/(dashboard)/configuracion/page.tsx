"use client";

import { useEffect, useState } from "react";
import { Configuracion, UpdateConfiguracionDto } from "@/types/configuracion";
import { getConfiguracion, updateConfiguracion } from "@/services/configuracion.service";
import Link from "next/link";

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Configuracion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateConfiguracionDto>({
    nombreMunicipalidad: "",
    ruc: "",
    direccion: "",
    telefono: "",
    emailContacto: "",
    tasaInteresMoratorio: 0,
    uitActual: 0,
    moneda: "PEN"
  });

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await getConfiguracion();
      setConfig(data);
      setFormData({
        nombreMunicipalidad: data.nombreMunicipalidad,
        ruc: data.ruc,
        direccion: data.direccion,
        telefono: data.telefono,
        emailContacto: data.emailContacto,
        tasaInteresMoratorio: data.tasaInteresMoratorio,
        uitActual: data.uitActual,
        moneda: data.moneda
      });
      setError(null);
    } catch (err) {
      setError("No se pudo cargar la configuración.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

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
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateConfiguracion(formData);
      setSuccess("Configuración guardada exitosamente.");
      setTimeout(() => setSuccess(null), 3000);
      fetchConfig();
    } catch (err: any) {
      setError("Error al guardar la configuración.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">Cargando configuración...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-municipal-950 flex items-center gap-2">
               <span className="text-gray-500">⚙️</span> Configuración del Sistema
            </h1>
            <p className="text-gray-500 mt-1">Parámetros globales y tributarios</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Volver al Inicio
          </Link>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">{success}</div>}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* SECCIÓN INSTITUCIONAL */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-blue-500">🏛️</span> Datos Institucionales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Institución</label>
                        <input
                            type="text"
                            name="nombreMunicipalidad"
                            value={formData.nombreMunicipalidad}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
                        <input
                            type="text"
                            name="ruc"
                            value={formData.ruc}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Principal</label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
                        <input
                            type="email"
                            name="emailContacto"
                            value={formData.emailContacto}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border"
                        />
                    </div>
                </div>
            </div>

            {/* SECCIÓN TRIBUTARIA */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">💰</span> Parámetros Tributarios Base
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Valor de la UIT (Actual)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-bold">S/</span>
                            <input
                                type="number"
                                step="0.01"
                                name="uitActual"
                                value={formData.uitActual}
                                onChange={handleChange}
                                className="w-full pl-8 rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border font-bold text-lg text-gray-900"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Valor usado para el cálculo de topes y multas.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tasa de Interés Moratorio (TIM)</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                name="tasaInteresMoratorio"
                                value={formData.tasaInteresMoratorio}
                                onChange={handleChange}
                                className="w-full pr-8 rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border font-bold text-lg text-gray-900"
                                required
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 font-bold">%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Porcentaje mensual aplicado a deudas vencidas.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Moneda Principal</label>
                        <select
                            name="moneda"
                            value={formData.moneda}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border font-bold text-lg text-gray-900"
                            required
                        >
                            <option value="PEN">Soles (PEN)</option>
                            <option value="USD">Dólares (USD)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Símbolo monetario usado en reportes.</p>
                    </div>
                </div>
            </div>

            {/* BOTONES */}
            <div className="p-6 bg-white flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => fetchConfig()}
                    className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
                    disabled={saving}
                >
                    Descartar Cambios
                </button>
                <button
                    type="submit"
                    className="px-8 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
                    disabled={saving}
                >
                    {saving ? "Guardando..." : "💾 Guardar Configuración"}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
