"use client";

import React, { useEffect, useState } from "react";
import { Predio } from "@/types/predio";
import { getPredios, deletePredio } from "@/services/predios.service";
import PredioForm from "./components/PredioForm";
import Link from "next/link";

export default function PrediosPage() {
  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [predioToEdit, setPredioToEdit] = useState<Predio | null>(null);
  const [notificacionModal, setNotificacionModal] = useState<Predio | null>(null);

  const fetchPredios = async () => {
    setLoading(true);
    try {
      const data = await getPredios();
      setPredios(data);
      setError(null);
    } catch (err: any) {
      setError("No se pudieron cargar los predios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredios();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este predio?")) {
      try {
        await deletePredio(id);
        fetchPredios();
      } catch (err) {
        alert("Error al eliminar el predio.");
      }
    }
  };

  const handleOpenModal = (predio: Predio | null = null) => {
    setPredioToEdit(predio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPredioToEdit(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchPredios();
  };

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filteredPredios = predios.filter(p => 
    p.codigoCatastral.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.contribuyenteNombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-50 p-4 lg:p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Catastro de Predios</h1>
            <p className="text-xs text-slate-500 mt-0.5">Inventario de propiedades y terrenos del distrito</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-white text-slate-600 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
              Exportar
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
            >
              + Nuevo Predio
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">{error}</div>}

        {/* SEARCH BAR */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <input 
              type="text" 
              placeholder="Buscar por código catastral o propietario..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {filteredPredios.length} predios encontrados
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">Cargando catastro...</div>
          ) : (
            <div className="overflow-x-auto slim-scrollbar min-h-[300px]">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="px-4 py-3 font-semibold">Código Catastral</th>
                    <th className="px-4 py-3 font-semibold">Propietario</th>
                    <th className="px-4 py-3 font-semibold">Ubicación y Uso</th>
                    <th className="px-4 py-3 font-semibold">Licencia</th>
                    <th className="px-4 py-3 font-semibold">Valor Aran.</th>
                    <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 text-sm">
                  {filteredPredios.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No se encontraron predios.
                      </td>
                    </tr>
                  ) : (
                    filteredPredios.map((p) => (
                      <React.Fragment key={p.id}>
                        <tr className={`border-b border-slate-100 hover:bg-slate-50 transition-colors group ${expandedId === p.id ? 'bg-slate-50' : ''}`}>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-800">{p.codigoCatastral}</span>
                          </td>
                          <td className="px-4 py-3">
                            {/* Hover Card del Dueño */}
                            <div className="relative group/card cursor-pointer">
                              <div className="font-medium text-slate-700 hover:text-blue-600 transition-colors">{p.contribuyenteNombre}</div>
                              <div className="text-[10px] text-slate-400 font-bold">{p.contribuyenteDocumento}</div>
                              
                              {/* Tarjeta Flotante */}
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover/card:block w-64 bg-slate-800 text-white p-3 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
                                <div className="text-xs font-bold text-slate-300 mb-1">Contacto Rápido</div>
                                <div className="text-sm font-medium">{p.contribuyenteNombre}</div>
                                <div className="text-xs mt-2 text-slate-300 flex items-center gap-2">📞 987 654 321</div>
                                <div className="text-xs mt-1 text-slate-300 flex items-center gap-2">✉️ correo@ejemplo.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-slate-700 max-w-[200px] truncate" title={p.direccion}>{p.direccion}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {p.usoPredio} • {p.areaTerreno} m²
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {p.usoPredio === 'Local Comercial' || p.usoPredio === 'Industrial' ? (
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 w-max cursor-pointer hover:bg-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Activa
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No requiere</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            S/ {p.valorArancelario.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Botón Estado Financiero */}
                              <button 
                                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                                className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                              >
                                {expandedId === p.id ? 'Ocultar Deuda' : 'Ver Deuda'}
                              </button>
                              
                              {/* Menú 3 Puntitos */}
                              <div className="relative inline-block text-left" onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}>
                                <button 
                                  onClick={(e) => toggleDropdown(e, p.id)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-bold text-lg"
                                >
                                  ⋮
                                </button>
                                
                                {openDropdownId === p.id && (
                                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-1">
                                      <button onClick={() => { setNotificacionModal(p); setOpenDropdownId(null); }} className="flex items-center gap-2 px-4 py-2 text-xs text-amber-600 font-medium hover:bg-amber-50 transition-colors w-full text-left">
                                        📄 Generar Notificación (PDF)
                                      </button>
                                      <hr className="my-1 border-slate-100" />
                                      <button onClick={() => handleOpenModal(p)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors w-full text-left">
                                        ✏️ Editar Predio
                                      </button>
                                      <button onClick={() => handleDelete(p.id)} className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                                        🗑️ Eliminar Registro
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Fila Expandible de Deudas */}
                        {expandedId === p.id && (
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3">Estado Financiero Específico</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Impuesto Predial 2024</div>
                                    <div className="text-lg font-bold text-red-600 mt-1">S/ 450.00</div>
                                    <div className="text-[10px] text-red-400 font-medium">Vencido</div>
                                  </div>
                                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Arbitrios (Limpieza)</div>
                                    <div className="text-lg font-bold text-emerald-600 mt-1">S/ 0.00</div>
                                    <div className="text-[10px] text-emerald-500 font-medium">Al día</div>
                                  </div>
                                  <div className="flex items-center justify-end">
                                    <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                                      Realizar Pago
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative z-10 w-full max-w-2xl px-4 animate-in zoom-in-95 duration-200">
            <PredioForm
              predioToEdit={predioToEdit}
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}

      {/* MODAL MOCKUP: GENERAR NOTIFICACIÓN */}
      {notificacionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setNotificacionModal(null)}></div>
          
          <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] animate-in zoom-in-95 duration-200">
            
            {/* SIDEBAR DE CONFIGURACIÓN */}
            <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Generar Notificación</h2>
              <p className="text-xs text-slate-500 mb-6">Configura los parámetros del documento legal a emitir.</p>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tipo de Documento</label>
                  <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option>Carta Inductiva</option>
                    <option>Resolución de Determinación</option>
                    <option>Requerimiento de Pago</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deuda a Notificar</label>
                  <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option>Deuda Total (Todos los años)</option>
                    <option>Solo Año Actual (2024)</option>
                    <option>Deuda Coactiva</option>
                  </select>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
                  <div className="text-xs font-bold text-amber-800 mb-1">Atención</div>
                  <p className="text-[10px] text-amber-700">Esta acción quedará registrada en el historial del contribuyente como "Notificado".</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                <button className="w-full px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-900 transition-colors shadow-md">
                  Generar e Imprimir PDF
                </button>
                <button onClick={() => setNotificacionModal(null)} className="w-full px-4 py-2 bg-white text-slate-600 border border-slate-200 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>

            {/* VISTA PREVIA DEL PDF (MOCKUP A4) */}
            <div className="flex-1 bg-slate-200/50 p-6 flex justify-center overflow-y-auto custom-scrollbar">
              <div className="w-[400px] h-[565px] bg-white shadow-xl p-8 flex flex-col scale-[0.9] origin-top">
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-[8px] text-slate-500 text-center font-bold">LOGO<br/>MUNI</div>
                  <div className="text-right">
                    <div className="text-sm font-bold">MUNICIPALIDAD DISTRITAL</div>
                    <div className="text-[10px] text-slate-500">Gerencia de Rentas</div>
                  </div>
                </div>

                <div className="text-center font-bold text-sm mb-4 uppercase underline underline-offset-4">CARTA INDUCTIVA N° 0045-2024</div>

                <div className="text-[10px] text-slate-800 space-y-2 mb-6">
                  <p><strong>Señor(a):</strong> {notificacionModal.contribuyenteNombre}</p>
                  <p><strong>Código Catastral:</strong> {notificacionModal.codigoCatastral}</p>
                  <p><strong>Dirección del Predio:</strong> {notificacionModal.direccion}</p>
                </div>

                <p className="text-[10px] text-slate-700 leading-relaxed mb-4 text-justify">
                  Por medio de la presente, nos dirigimos a usted para saludarle cordialmente y a la vez comunicarle que verificando nuestra base de datos, su predio presenta cuotas pendientes de pago correspondientes al Impuesto Predial y Arbitrios Municipales.
                </p>

                <table className="w-full border-collapse border border-slate-300 text-[8px] mb-4">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-1">Concepto</th>
                      <th className="border border-slate-300 p-1">Periodo</th>
                      <th className="border border-slate-300 p-1">Total (S/)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-1">Impuesto Predial</td>
                      <td className="border border-slate-300 p-1">2023 - 2024</td>
                      <td className="border border-slate-300 p-1 text-right font-bold">450.00</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-auto pt-8 flex justify-center">
                  <div className="text-center">
                    <div className="w-32 border-t border-slate-400 mx-auto mb-1"></div>
                    <div className="text-[8px] text-slate-600 font-bold uppercase">Gerente de Rentas</div>
                    <div className="text-[7px] text-slate-400">Firma Autorizada</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
