"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, RefreshCw, User, CreditCard, MapPin, 
  Home, Map, Eye, CheckCircle2, AlertCircle, HandCoins,
  ChevronDown, Printer, Plus, Info, LayoutList, Landmark
} from 'lucide-react';

export default function ConsultaIntegralPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);
  const [contribuyenteInfo, setContribuyenteInfo] = useState<any | null>(null);
  const [selectedPredioId, setSelectedPredioId] = useState<number | null>(null);

  useEffect(() => {
    if (initialSearch) {
      // Trigger search automatically if we came with a search param
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSearch(fakeEvent, initialSearch);
    }
  }, [initialSearch]);
  
  // States for creation flow
  const [searchNoResults, setSearchNoResults] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // State for slide-over Predio
  const [isCreatingPredio, setIsCreatingPredio] = useState(false);

  const handleSearch = async (e: React.FormEvent, termToSearch?: string) => {
    e.preventDefault();
    const query = termToSearch || searchTerm;
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchNoResults(false);
    setIsCreating(false);

    try {
      const response = await fetch(`http://localhost:5134/api/Contribuyentes/buscar?dni=${query}`);
      if (response.ok) {
        const data = await response.json();
        setContribuyenteInfo(data);
        setSelectedPredioId(null);
      } else {
        setContribuyenteInfo(null);
        setSearchNoResults(true);
      }
    } catch (error) {
      console.error("Error al buscar contribuyente:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setContribuyenteInfo(null);
    setSelectedPredioId(null);
    setSearchNoResults(false);
    setIsCreating(false);
  };

  const handleCreateContribuyente = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const newContribuyente = {
      tipoDocumento: form.tipoDocumento.value,
      numeroDocumento: form.numeroDocumento.value,
      nombreCompletoRazonSocial: form.nombreCompleto.value,
      direccion: form.direccion.value,
      telefono: "",
      email: ""
    };

    try {
      const response = await fetch('http://localhost:5134/api/Contribuyentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContribuyente)
      });
      
      if (response.ok) {
        const createdData = await response.json();
        createdData.predios = [];
        setContribuyenteInfo(createdData);
        setSearchNoResults(false);
        setIsCreating(false);
      } else {
        alert("Error al crear el contribuyente.");
      }
    } catch (error) {
      console.error("Error creating:", error);
      alert("Error de conexión al servidor.");
    }
  };

  const handleCreatePredio = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    if (!contribuyenteInfo?.id) return;

    const newPredio = {
      contribuyenteId: contribuyenteInfo.id,
      codigoCatastral: form.codigoCatastral.value,
      direccion: form.direccionPredio.value,
      areaTerreno: parseFloat(form.areaTerreno.value),
      areaConstruida: parseFloat(form.areaConstruida.value),
      usoPredio: form.usoPredio.value,
      valorArancelario: parseFloat(form.valorArancelario.value),
      estado: true
    };

    try {
      const response = await fetch('http://localhost:5134/api/Predios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPredio)
      });
      
      if (response.ok) {
        const createdPredio = await response.json();
        createdPredio.arbitriosMunicipales = []; // Initialize empty for UI
        setContribuyenteInfo({
          ...contribuyenteInfo,
          predios: [...(contribuyenteInfo.predios || []), createdPredio]
        });
        setIsCreatingPredio(false);
      } else {
        alert("Error al crear el predio.");
      }
    } catch (error) {
      console.error("Error creating predio:", error);
      alert("Error de conexión al servidor.");
    }
  };

  const selectedPredio = contribuyenteInfo?.predios?.find((p: any) => p.id === selectedPredioId);

  return (
    <div className="p-4 lg:p-6 mx-auto space-y-6 max-w-[1400px]">
      
      {/* 1. SECCIÓN SUPERIOR: FILTROS / BÚSQUEDA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex flex-col md:flex-row items-center gap-4">
        {/* Titulo */}
        <div className="flex items-center gap-3 pl-4 md:min-w-[250px] w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <User size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Consulta Integral</h1>
            <p className="text-[10px] text-slate-500 uppercase">Gestión de Contribuyentes</p>
          </div>
        </div>

        {/* Separador */}
        <div className="hidden md:block h-10 w-px bg-slate-100 shrink-0"></div>

        {/* Formulario */}
        <form onSubmit={handleSearch} className="flex-1 flex flex-col sm:flex-row gap-3 w-full pr-2 pb-2 md:pb-0">
          <div className="relative w-1/3 min-w-[120px] max-w-[200px]">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <CreditCard size={10}/> TIPO DE DOC
            </label>
            <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
              <span className="font-medium">DNI / RUC</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
          
          <div className="relative flex-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Search size={10}/> BÚSQUEDA
            </label>
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Ingrese número de documento..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-[140px] py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                {contribuyenteInfo && (
                  <button 
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    title="Limpiar Búsqueda"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={isSearching}
                  className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isSearching ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                  {isSearching ? 'Buscando' : 'Buscar'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-end pb-0 sm:pb-[1px]">
            <button 
              type="button" 
              onClick={() => {
                setContribuyenteInfo(null);
                setSearchNoResults(false);
                setIsCreating(true);
              }}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm flex items-center gap-2"
              title="Nuevo Contribuyente"
            >
              <Plus size={16} />
              <span className="hidden xl:inline-block">Nuevo</span>
            </button>
          </div>
        </form>
      </div>

      {/* INITIAL EMPTY STATE */}
      {!contribuyenteInfo && !searchNoResults && !isCreating && (
        <div className="flex-1 flex flex-col items-center justify-center opacity-40 select-none mt-20 pointer-events-none animate-in fade-in duration-700">
          <Landmark size={120} strokeWidth={1} className="text-slate-400 mb-6" />
          <h2 className="text-2xl font-bold text-slate-400 tracking-tight">Municipalidad Distrital de Cajaruro</h2>
          <p className="text-sm font-medium text-slate-400 mt-2">Ingresa un número de documento para comenzar a explorar</p>
        </div>
      )}

      {/* NOT FOUND STATE */}
      {searchNoResults && !isCreating && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Contribuyente no encontrado</h3>
          <p className="text-sm text-slate-500 max-w-md mb-6">
            No existen registros asociados al documento <strong className="text-slate-800">{searchTerm}</strong>. 
            ¿Deseas registrar un nuevo contribuyente en el sistema?
          </p>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={18} />
            Registrar Nuevo Contribuyente
          </button>
        </div>
      )}

      {/* CREATION FORM STATE (SLIDE-OVER PANEL) */}
      {isCreating && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          {/* Overlay oscuro */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => { setIsCreating(false); if(searchTerm) setSearchNoResults(true); }}
          ></div>

          {/* Panel Lateral */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  Nuevo Contribuyente
                </h2>
                <p className="text-xs text-slate-500 mt-1">Apertura rápida de cuenta</p>
              </div>
              <button 
                onClick={() => { setIsCreating(false); if(searchTerm) setSearchNoResults(true); }}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateContribuyente} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Datos Principales</h4>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Documento de Identidad</label>
                  <input name="numeroDocumento" type="text" defaultValue={searchTerm} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Tipo de Documento</label>
                  <select name="tipoDocumento" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Nombres y Apellidos / Razón Social</label>
                  <input name="nombreCompleto" type="text" placeholder="Ej. Pérez Rodríguez, Juan Carlos" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required autoFocus />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Ubicación</h4>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Dirección Fiscal / Domicilio</label>
                  <input name="direccion" type="text" placeholder="Av. Principal 123..." className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                </div>
              </div>

              <div className="pt-8 pb-4">
                <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md flex justify-center items-center gap-2">
                  <CheckCircle2 size={18} />
                  Guardar Contribuyente
                </button>
                <button type="button" onClick={() => { setIsCreating(false); if(searchTerm) setSearchNoResults(true); }} className="w-full mt-3 px-6 py-3 bg-transparent text-slate-500 hover:text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {contribuyenteInfo && !isCreating && (
        <div className="animate-in fade-in duration-500">
          {/* 2. SECCIÓN MEDIA: TARJETAS (PREDIOS) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <LayoutList size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Predios de: {contribuyenteInfo.nombreCompletoRazonSocial}</h3>
                  <p className="text-[10px] text-slate-500">Selecciona o consulta el estado de cuenta de cada predio.</p>
                </div>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full hidden sm:inline-block">
                  {contribuyenteInfo.predios?.length || 0} predios
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                  <Printer size={14} /> Imprimir
                </button>
                <button 
                  onClick={() => setIsCreatingPredio(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> Nuevo Predio
                </button>
              </div>
            </div>

            {contribuyenteInfo.predios?.length === 0 ? (
              <div className="py-12 px-6 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
                  <Home size={32} strokeWidth={1.5} />
                </div>
                <h4 className="text-sm font-bold text-slate-700 mb-1">Sin predios registrados</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">Este contribuyente actualmente no cuenta con propiedades asociadas en el sistema.</p>
                <button 
                  onClick={() => setIsCreatingPredio(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus size={16} />
                  Registrar su primer Predio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {contribuyenteInfo.predios?.map((predio: any) => {
                  const isSelected = selectedPredioId === predio.id;
                  // Calculate percentage loosely for demo based on arbitrios, or default if missing
                  const totalArbitrios = predio.arbitriosMunicipales?.length || 0;
                  const pagados = predio.arbitriosMunicipales?.filter((a: any) => a.estadoPago === 'Pagado').length || 0;
                  const porcentajePagado = totalArbitrios > 0 ? Math.round((pagados / totalArbitrios) * 100) : 100;
                  const estadoDeuda = porcentajePagado === 100 ? 'Al Día' : 'Con Deuda';

                  return (
                    <div 
                      key={predio.id}
                      onClick={() => setSelectedPredioId(predio.id)}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 shadow-md bg-blue-50/20 scale-[1.02]' 
                          : 'border-slate-200 hover:border-blue-300 hover:shadow-sm bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          CÓD: {predio.codigoCatastral}
                        </div>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white shadow-sm transition-colors ${isSelected ? 'bg-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                          <Plus size={14} className={isSelected ? "rotate-45 transition-transform" : "transition-transform"} />
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-sm mb-3 min-h-[40px] leading-tight line-clamp-2">
                        {predio.direccion}
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 text-[9px] font-semibold rounded flex items-center gap-1">
                          <Home size={10} /> {predio.usoPredio}
                        </span>
                        <span className={`px-2 py-1 text-[9px] font-semibold rounded flex items-center gap-1 ${
                          estadoDeuda === 'Al Día' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {estadoDeuda === 'Al Día' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                          {estadoDeuda}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-auto">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1.5 uppercase">
                          <span>Progreso de Pagos</span>
                          <span className={porcentajePagado === 100 ? 'text-emerald-500' : 'text-blue-500'}>{porcentajePagado}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${porcentajePagado === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${porcentajePagado}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 3. SECCIÓN INFERIOR: PANEL OSCURO (DETALLE) */}
          {selectedPredioId && selectedPredio && (
            <div className="bg-[#0f172a] rounded-2xl shadow-xl overflow-hidden mt-6 animate-in slide-in-from-bottom-8 fade-in duration-500 border border-slate-800">
              
              {/* Dark Panel Header */}
              <div className="px-6 py-5 border-b border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 bg-gradient-to-r from-transparent to-blue-900/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-3">
                      {selectedPredio.direccion}
                    </h2>
                    <div className="text-[11px] text-blue-300 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
                      <span className="flex items-center gap-1.5"><Map size={12}/> CÓDIGO: {selectedPredio.codigoCatastral}</span>
                      <span className="flex items-center gap-1.5"><Info size={12}/> {selectedPredio.uso}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="px-4 py-2 bg-black/20 border border-white/5 rounded-lg flex-1 lg:flex-none">
                    <p className="text-[9px] text-blue-400/80 uppercase font-bold tracking-widest mb-0.5">Valor Arancelario</p>
                    <p className="text-base font-bold text-emerald-400">S/ {selectedPredio.valorArancelario?.toLocaleString() || '0'}</p>
                  </div>
                  <button className="px-4 py-3 bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-600 hover:text-white transition-all flex-1 lg:flex-none">
                    Generar HR/PU
                  </button>
                </div>
              </div>

              {/* Dark Panel Content (Table) */}
              <div className="p-6">
                <div className="bg-[#0b101e] border border-white/5 rounded-xl overflow-hidden shadow-inner">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-blue-300/70 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4">Periodo (Arbitrio)</th>
                        <th className="px-6 py-4 text-center">Año Fiscal</th>
                        <th className="px-6 py-4 text-right">Monto Anual</th>
                        <th className="px-6 py-4 text-center">Estado</th>
                        <th className="px-6 py-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {selectedPredio.arbitriosMunicipales?.map((arbitrio: any) => (
                        <tr key={arbitrio.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${arbitrio.estadoPago === 'Pagado' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                            {arbitrio.periodo}
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-center text-xs">{arbitrio.anioFiscal}</td>
                          <td className="px-6 py-4 text-slate-200 text-right font-medium">S/ {arbitrio.montoTotal?.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center w-24 gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                              arbitrio.estadoPago === 'Pagado' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {arbitrio.estadoPago}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-blue-400 hover:text-white font-medium text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1.5 w-full">
                              Detalles <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Dark Panel Footer Actions */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-xs text-slate-500">Mostrando {selectedPredio.arbitriosMunicipales?.length || 0} registros para este predio.</p>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-5 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors">
                      Imprimir Estado
                    </button>
                    <button className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 text-emerald-950 text-xs font-extrabold uppercase tracking-wider rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
                      <HandCoins size={16} /> Ir a Caja a Pagar
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
      {/* CENTERED MODAL FOR NEW PREDIO */}
      {isCreatingPredio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay oscuro */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsCreatingPredio(false)}
          ></div>
          
          {/* Contenedor del Modal Centrado */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Home size={20} className="text-blue-600" />
                  Registrar Nuevo Predio
                </h2>
                <p className="text-xs text-slate-500 mt-1">Para: {contribuyenteInfo?.nombreCompletoRazonSocial}</p>
              </div>
              <button 
                onClick={() => setIsCreatingPredio(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreatePredio} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                
                {/* Datos Catastrales */}
                <div className="md:col-span-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">Datos Catastrales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Código Catastral</label>
                      <input name="codigoCatastral" type="text" placeholder="Ej. 01-02-03-04-05" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dirección del Predio</label>
                      <input name="direccionPredio" type="text" placeholder="Ubicación exacta..." className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                    </div>
                  </div>
                </div>

                {/* Características Técnicas */}
                <div className="md:col-span-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">Características Técnicas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Área Terreno (m²)</label>
                      <input name="areaTerreno" type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Área Construida (m²)</label>
                      <input name="areaConstruida" type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Uso del Predio</label>
                      <select name="usoPredio" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="Casa Habitación">Casa Habitación</option>
                        <option value="Local Comercial">Local Comercial</option>
                        <option value="Terreno Sin Construir">Terreno Sin Construir</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Valorización */}
                <div className="md:col-span-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">Valorización</h4>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Valor Arancelario / Autoevalúo (S/)</label>
                    <input name="valorArancelario" type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-bold text-emerald-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" required />
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsCreatingPredio(false)} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Guardar Predio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
