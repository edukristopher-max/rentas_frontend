"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardMetricas, getActividades, getMonthlyChart, getTypesChart } from "@/services/dashboard.service";
import { DashboardMetrics, MonthlyRevenueDto, RevenueTypeDto } from "@/types/reporte";
import { ActividadReciente } from "@/types/actividad";
import RevenueBarChart from "./components/RevenueBarChart";
import RevenuePieChart from "./components/RevenuePieChart";

export default function DashboardPage() {
  const [metricas, setMetricas] = useState<DashboardMetrics | null>(null);
  const [actividades, setActividades] = useState<ActividadReciente[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenueDto[]>([]);
  const [typesData, setTypesData] = useState<RevenueTypeDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [metricasData, actividadesData, monthlyDataRes, typesDataRes] = await Promise.all([
        getDashboardMetricas(),
        getActividades(),
        getMonthlyChart(),
        getTypesChart()
      ]);
      setMetricas(metricasData);
      setActividades(actividadesData);
      setMonthlyData(monthlyDataRes);
      setTypesData(typesDataRes);
    } catch (err) {
      console.error("Error cargando el dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getModuloIcon = (modulo: string) => {
    switch(modulo) {
      case "Pagos": return "💵";
      case "Contribuyentes": return "👥";
      case "Deudas": return "⚠";
      case "Notificaciones": return "✉";
      case "Licencias": return "📝";
      default: return "⚡";
    }
  };

  const getModuloColor = (modulo: string) => {
    switch(modulo) {
      case "Pagos": return "bg-green-100 text-green-700";
      case "Contribuyentes": return "bg-blue-100 text-blue-700";
      case "Deudas": return "bg-red-100 text-red-700";
      case "Notificaciones": return "bg-purple-100 text-purple-700";
      case "Licencias": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con Buscador Global */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Control Gerencial</h1>
            <p className="text-gray-500 mt-1">Resumen general, análisis y estado de la recaudación</p>
          </div>
          <div className="w-full md:w-96 relative">
             <input 
               type="text" 
               placeholder="🔍 Buscar contribuyente por DNI o RUC..." 
               className="w-full rounded-full border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-3 pl-10 border text-sm"
             />
             <span className="absolute left-4 top-3 text-gray-400">🔍</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
             Cargando panel de inteligencia de negocios...
          </div>
        ) : (
          <>
            {/* TARJETAS DE MÉTRICAS (Glassmorphism & Gradients) */}
            {metricas && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="p-6 rounded-2xl shadow-lg border border-transparent bg-gradient-to-br from-emerald-500 to-green-600 text-white flex flex-col justify-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2 opacity-80">
                       <p className="text-sm font-bold uppercase tracking-wider">Recaudación</p>
                       <span className="p-2 bg-white/20 rounded-lg">💵</span>
                    </div>
                    <p className="text-3xl font-black mt-1">S/ {metricas.totalRecaudado.toFixed(2)}</p>
                    <p className="text-xs mt-2 font-medium flex items-center gap-1 bg-black/10 w-fit px-2 py-1 rounded-full"><span>↑</span> Ingreso confirmado</p>
                </div>

                <div className="p-6 rounded-2xl shadow-lg border border-transparent bg-gradient-to-br from-red-500 to-rose-600 text-white flex flex-col justify-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2 opacity-80">
                       <p className="text-sm font-bold uppercase tracking-wider">Por Cobrar</p>
                       <span className="p-2 bg-white/20 rounded-lg">⚠</span>
                    </div>
                    <p className="text-3xl font-black mt-1">S/ {metricas.deudaPorCobrar.toFixed(2)}</p>
                    <p className="text-xs mt-2 font-medium flex items-center gap-1 bg-black/10 w-fit px-2 py-1 rounded-full"><span>↓</span> Deudas pendientes</p>
                </div>

                <div className="p-6 rounded-2xl shadow-lg border border-transparent bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex flex-col justify-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2 opacity-80">
                       <p className="text-sm font-bold uppercase tracking-wider">Contribuyentes</p>
                       <span className="p-2 bg-white/20 rounded-lg">👥</span>
                    </div>
                    <p className="text-3xl font-black mt-1">{metricas.totalContribuyentes}</p>
                    <p className="text-xs mt-2 font-medium bg-black/10 w-fit px-2 py-1 rounded-full">Registrados en padrón</p>
                </div>

                <div className="p-6 rounded-2xl shadow-lg border border-transparent bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex flex-col justify-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2 opacity-80">
                       <p className="text-sm font-bold uppercase tracking-wider">Trámites</p>
                       <span className="p-2 bg-white/20 rounded-lg">📝</span>
                    </div>
                    <p className="text-3xl font-black mt-1">{metricas.licenciasActivas}</p>
                    <p className="text-xs mt-2 font-medium bg-black/10 w-fit px-2 py-1 rounded-full">Licencias Activas</p>
                </div>
              </div>
            )}

            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h2 className="text-lg font-bold text-gray-900 mb-6">Evolución de Recaudación (Últimos 6 meses)</h2>
                 <RevenueBarChart data={monthlyData} />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h2 className="text-lg font-bold text-gray-900 mb-6">Distribución de Emisión (Anual)</h2>
                 <RevenuePieChart data={typesData} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* ALERTAS CRÍTICAS */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                   <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                     <span className="text-red-500">🚨</span> Atención Requerida
                   </h2>
                 </div>
                 <div className="space-y-3">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
                       <span className="text-red-500 mt-0.5">⚠</span>
                       <div>
                          <p className="text-sm font-bold text-red-800">12 Deudas por Vencer Hoy</p>
                          <p className="text-xs text-red-600 mt-1">Se requiere emitir avisos de cobranza.</p>
                       </div>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex gap-3">
                       <span className="text-yellow-600 mt-0.5">⏱</span>
                       <div>
                          <p className="text-sm font-bold text-yellow-800">5 Licencias por Expirar</p>
                          <p className="text-xs text-yellow-700 mt-1">Inspecciones pendientes en los próximos 7 días.</p>
                       </div>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                       <span className="text-blue-500 mt-0.5">ℹ</span>
                       <div>
                          <p className="text-sm font-bold text-blue-800">Actualización de UIT Pendiente</p>
                          <p className="text-xs text-blue-600 mt-1">Revisa la configuración para el año en curso.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* ACCESOS DIRECTOS Y ACTIVIDAD */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* ACCESOS DIRECTOS */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/pagos" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-100 transition-colors group text-center">
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💵</span>
                        <span className="font-semibold text-gray-800 text-xs">Registrar Pago</span>
                      </Link>
                      <Link href="/contribuyentes" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-100 transition-colors group text-center">
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</span>
                        <span className="font-semibold text-gray-800 text-xs">Nuevo Contribuyente</span>
                      </Link>
                      <Link href="/deudas" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-red-50 rounded-xl border border-gray-100 transition-colors group text-center">
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚠</span>
                        <span className="font-semibold text-gray-800 text-xs">Emitir Deuda</span>
                      </Link>
                      <Link href="/licencias" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-yellow-50 rounded-xl border border-gray-100 transition-colors group text-center">
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                        <span className="font-semibold text-gray-800 text-xs">Trámite Licencia</span>
                      </Link>
                    </div>
                  </div>

                  {/* TIMELINE DE ACTIVIDAD RECIENTE */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col max-h-[320px]">
                     <div className="flex items-center justify-between mb-4">
                       <h2 className="text-lg font-bold text-gray-900">Actividad Reciente</h2>
                       <span className="text-[10px] uppercase font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">En vivo</span>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                       {actividades.length === 0 ? (
                         <p className="text-center text-gray-500 text-sm mt-10">No hay actividad reciente.</p>
                       ) : (
                         actividades.map((actividad) => (
                           <div key={actividad.id} className="relative pl-6 pb-2 border-l-2 border-gray-100 last:border-transparent last:pb-0">
                             <span className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-sm ring-4 ring-white ${getModuloColor(actividad.modulo)}`}>
                               {getModuloIcon(actividad.modulo)}
                             </span>
                             <div className="ml-2">
                               <p className="text-[10px] text-gray-400 font-bold mb-0.5">{new Date(actividad.fecha).toLocaleString()}</p>
                               <p className="text-xs text-gray-800 font-semibold leading-tight">{actividad.accion}</p>
                             </div>
                           </div>
                         ))
                       )}
                     </div>
                  </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
