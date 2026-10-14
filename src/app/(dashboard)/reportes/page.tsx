"use client";

import { useEffect, useState } from "react";
import { ReporteGenerado, DashboardMetrics } from "@/types/reporte";
import { getMetricas, getHistorialReportes, registrarReporte } from "@/services/reportes.service";
import Link from "next/link";

export default function ReportesPage() {
  const [metricas, setMetricas] = useState<DashboardMetrics | null>(null);
  const [historial, setHistorial] = useState<ReporteGenerado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metricasData, historialData] = await Promise.all([
        getMetricas(),
        getHistorialReportes()
      ]);
      setMetricas(metricasData);
      setHistorial(historialData);
      setError(null);
    } catch (err: any) {
      setError("No se pudieron cargar los reportes y métricas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerarReporte = async (tipoReporte: string) => {
    try {
      // Simular descarga de reporte (en un sistema real aquí se llamaría a un endpoint de PDF/Excel)
      alert(`Generando ${tipoReporte}...`);
      
      // Registrar en el historial
      await registrarReporte({
        tipoReporte,
        filtros: "Periodo: Actual",
        totalRegistros: Math.floor(Math.random() * 100) + 1, // Fake count para demostración
      });
      
      fetchData(); // Refrescar historial
    } catch (err) {
      alert("Error al registrar el reporte.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-municipal-950 flex items-center gap-2">
              <span className="text-blue-600">📊</span> Reportes e Inteligencia de Negocio
            </h1>
            <p className="text-gray-500 mt-1">Métricas en tiempo real e historial de auditoría</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Volver al Inicio
          </Link>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        {/* MÉTRICAS (Dashboard Superior) */}
        {metricas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-municipal-500">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Contribuyentes</p>
                <p className="text-3xl font-bold text-municipal-900 mt-2">{metricas.totalContribuyentes}</p>
                <p className="text-xs text-green-600 mt-2 font-medium">↑ Activos en padrón</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Predios</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{metricas.totalPredios}</p>
                <p className="text-xs text-blue-600 mt-2 font-medium">Inmuebles registrados</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Recaudado</p>
                <p className="text-3xl font-bold text-green-700 mt-2">S/ {metricas.totalRecaudado.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-2 font-medium">✓ Ingresos reales</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Deuda por Cobrar</p>
                <p className="text-3xl font-bold text-red-700 mt-2">S/ {metricas.deudaPorCobrar.toFixed(2)}</p>
                <p className="text-xs text-red-600 mt-2 font-medium">⚠ Pendiente o vencido</p>
            </div>
          </div>
        )}

        {/* SECCIÓN DE GENERACIÓN DE REPORTES */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
           <h2 className="text-xl font-bold text-gray-800 mb-4">Generador de Reportes</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => handleGenerarReporte("Cierre de Caja Diario")}
                className="p-4 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
              >
                <p className="font-bold text-blue-900">Cierre de Caja Diario</p>
                <p className="text-xs text-blue-700 mt-1">Exportar pagos del día en PDF</p>
              </button>
              <button 
                 onClick={() => handleGenerarReporte("Listado de Morosos")}
                className="p-4 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors"
              >
                <p className="font-bold text-red-900">Listado de Morosos</p>
                <p className="text-xs text-red-700 mt-1">Exportar contribuyentes con deudas vencidas</p>
              </button>
              <button 
                 onClick={() => handleGenerarReporte("Padrón Catastral")}
                className="p-4 border border-municipal-200 bg-municipal-50 hover:bg-municipal-100 rounded-lg text-left transition-colors"
              >
                <p className="font-bold text-municipal-900">Padrón Catastral</p>
                <p className="text-xs text-municipal-700 mt-1">Listado de todos los predios y direcciones</p>
              </button>
           </div>
        </div>

        {/* HISTORIAL (Auditoría) */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-5 border-b border-gray-200 bg-gray-50">
             <h2 className="text-lg font-bold text-gray-800">Historial de Reportes Generados (Auditoría)</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando historial...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-600 border-b border-gray-200 text-sm">
                    <th className="p-4 font-semibold">Fecha y Hora</th>
                    <th className="p-4 font-semibold">Tipo de Reporte</th>
                    <th className="p-4 font-semibold">Filtros Aplicados</th>
                    <th className="p-4 font-semibold">Usuario</th>
                    <th className="p-4 font-semibold text-right">Resultados</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {historial.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                        No se ha generado ningún reporte aún.
                      </td>
                    </tr>
                  ) : (
                    historial.map((h) => (
                      <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm font-medium text-gray-800">
                          {new Date(h.fechaGeneracion).toLocaleString()}
                        </td>
                        <td className="p-4 font-bold text-municipal-800">
                          {h.tipoReporte}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {h.filtros}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {h.usuario}
                        </td>
                        <td className="p-4 text-right">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                             {h.totalRegistros} filas
                          </span>
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
    </div>
  );
}
