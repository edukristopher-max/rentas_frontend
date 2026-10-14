"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Search, Users, Map, Building2, Landmark, 
  AlertCircle, FileText, CreditCard, Settings, Bell, BarChart3, 
  Menu, Search as SearchIcon, User, ChevronDown 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isContribuyentes = pathname.includes('/contribuyentes');
  const isPredios = pathname.includes('/predios');
  const isImpuestos = pathname.includes('/impuestos-prediales');
  const isArbitrios = pathname.includes('/arbitrios-municipales');
  const isDeudas = pathname.includes('/deudas');
  const isPagos = pathname.includes('/pagos');
  const isLicencias = pathname.includes('/licencias');
  const isReportes = pathname.includes('/reportes');
  const isNotificaciones = pathname.includes('/notificaciones');
  const isConfiguracion = pathname.includes('/configuracion');
  const isConsulta = pathname.includes('/consulta-integral');

  const getPageInfo = () => {
    if (pathname === '/') return { title: 'Dashboard', subtitle: 'Resumen general de la gestión de rentas municipales' };
    if (isConsulta) return { title: 'Consulta Integral', subtitle: 'Búsqueda de contribuyentes, predios y arbitrios' };
    if (isContribuyentes) return { title: 'Contribuyentes', subtitle: 'Gestión y registro de contribuyentes' };
    if (isPredios) return { title: 'Predios', subtitle: 'Administración de predios registrados' };
    if (isImpuestos) return { title: 'Impuesto Predial', subtitle: 'Gestión de impuestos prediales' };
    if (isArbitrios) return { title: 'Arbitrios Municipales', subtitle: 'Control de arbitrios y tasas' };
    if (isDeudas) return { title: 'Deudas y Moras', subtitle: 'Seguimiento de cuentas por cobrar' };
    if (isLicencias) return { title: 'Licencias y Tasas', subtitle: 'Trámites de licencias de funcionamiento' };
    if (isPagos) return { title: 'Pagos / Caja', subtitle: 'Control de pagos y recaudación' };
    if (isConfiguracion) return { title: 'Configuración', subtitle: 'Ajustes del sistema de rentas' };
    if (isNotificaciones) return { title: 'Notificaciones', subtitle: 'Alertas y comunicados del sistema' };
    if (isReportes) return { title: 'Reportes e Indicadores', subtitle: 'Estadísticas e informes de gestión' };
    return { title: 'Sistema de Rentas', subtitle: 'Municipalidad Distrital de Cajaruro' };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`w-60 bg-gradient-to-b from-[#06265f] to-[#031b48] text-white flex flex-col fixed inset-y-0 left-0 z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-900">
              <Landmark size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">Muni.<br />Cajaruro</h1>
              <p className="text-[10px] text-blue-200 mt-0.5 uppercase tracking-wide">Sistema de Rentas</p>
            </div>
          </div>
        </div>

        <nav className="p-2.5 space-y-0.5 flex-1 overflow-y-auto text-sm slim-scrollbar">
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/' ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isConsulta ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/consulta-integral">
            <Search size={18} className={isConsulta ? "text-emerald-300" : "text-emerald-400"} /> Consulta Integral
          </a>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isContribuyentes ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/contribuyentes">
            <Users size={18} /> Contribuyentes
          </a>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isPredios ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/predios">
            <Map size={18} /> Predios
          </a>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isImpuestos ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/impuestos-prediales">
            <Building2 size={18} /> Impuesto Predial
          </a>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isArbitrios ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/arbitrios-municipales">
            <Landmark size={18} /> Arbitrios
          </a>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isDeudas ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/deudas">
            <AlertCircle size={18} /> Deudas y Moras
          </a>
          
          <div className="pt-4 pb-1">
            <p className="px-3 text-[10px] font-semibold text-blue-300 uppercase tracking-widest">Trámites</p>
          </div>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isLicencias ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/licencias">
            <FileText size={18} /> Licencias y Tasas
          </a>

          <div className="pt-4 pb-1">
            <p className="px-3 text-[10px] font-semibold text-blue-300 uppercase tracking-widest">Caja y Sistema</p>
          </div>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isPagos ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/pagos">
            <CreditCard size={18} className={isPagos ? "text-emerald-300" : "text-emerald-400"} /> Pagos / Caja
          </a>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isReportes ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/reportes">
            <BarChart3 size={18} /> Reportes
          </a>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isNotificaciones ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/notificaciones">
            <Bell size={18} /> Notificaciones <span className="ml-auto bg-emerald-500 text-[10px] font-bold rounded-md px-1.5 py-0.5">3</span>
          </a>
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isConfiguracion ? 'bg-blue-600/80 font-medium text-white shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`} href="/configuracion">
            <Settings size={18} className="text-slate-400" /> Configuración
          </a>
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">Admin User</p>
              <p className="text-[10px] text-blue-300 truncate">Caja Principal</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="lg:ml-60 flex-1 min-w-0 bg-slate-50 flex flex-col h-screen">
        {/* HEADER */}
        <header className="h-[56px] bg-[#06265f] border-b border-white/10 flex items-center justify-between px-5 lg:px-8 sticky top-0 z-20 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="p-1.5 -ml-1.5 rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-colors lg:hidden" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-none">{title}</h2>
              <p className="text-[10px] text-blue-200 hidden sm:block font-medium mt-1 leading-none">{subtitle}</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-5">
            <button className="relative p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center border-2 border-[#06265f]">3</span>
            </button>
            
            <button className="flex items-center gap-3 hover:bg-white/10 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-white/20">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center shadow-md">
                <User size={18} />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[0.8rem] font-bold text-white leading-none">Admin User</p>
                <p className="text-[0.65rem] text-blue-200 mt-1 font-medium">Caja Principal</p>
              </div>
              <ChevronDown size={14} className="text-blue-300 ml-1" />
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
