"use client";

import { useEffect, useState } from "react";
import { Contribuyente } from "@/types/contribuyente";
import { getContribuyentes, deleteContribuyente } from "@/services/contribuyentes.service";
import ContribuyenteForm from "./components/ContribuyenteForm";
import Link from "next/link";
import { 
  Search, Plus, MoreVertical, Download, 
  Map, User, Eye, Edit, Trash2, ExternalLink
} from "lucide-react";

export default function ContribuyentesPage() {
  const [contribuyentes, setContribuyentes] = useState<Contribuyente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [contribuyenteToEdit, setContribuyenteToEdit] = useState<Contribuyente | null>(null);

  const fetchContribuyentes = async () => {
    setLoading(true);
    try {
      const data = await getContribuyentes();
      setContribuyentes(data);
      setError(null);
    } catch (err: any) {
      setError("No se pudieron cargar los contribuyentes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContribuyentes();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este contribuyente?")) {
      try {
        await deleteContribuyente(id);
        fetchContribuyentes();
      } catch (err) {
        alert("Error al eliminar el contribuyente.");
      }
    }
    setOpenDropdownId(null);
  };

  const handleOpenModal = (contribuyente: Contribuyente | null = null) => {
    setContribuyenteToEdit(contribuyente);
    setShowModal(true);
    setOpenDropdownId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setContribuyenteToEdit(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchContribuyentes();
  };

  const toggleDropdown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation(); // Previene que llegue al document
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filteredContribuyentes = contribuyentes.filter(c => {
    // Text search
    const matchesSearch = c.nombreCompletoRazonSocial.toLowerCase().includes(searchTerm.toLowerCase()) || c.numeroDocumento.includes(searchTerm);
    // Tab search
    let matchesTab = true;
    if (activeTab === 'Personas Naturales') matchesTab = c.tipoDocumento === 'DNI';
    else if (activeTab === 'Empresas') matchesTab = c.tipoDocumento === 'RUC';
    else if (activeTab === 'Inactivos') matchesTab = c.estado === false;
    return matchesSearch && matchesTab;
  });

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';
  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700'];
    return colors[name.length % colors.length];
  };

  const tabs = ['Todos', 'Personas Naturales', 'Empresas', 'Inactivos'];

  // Mock function to determine if they owe money based on ID parity
  const getMorosidadStatus = (id: number) => {
    return id % 3 === 0 
      ? { label: 'Con Deuda', color: 'bg-rose-50 text-rose-600 border-rose-200', dot: 'bg-rose-500' } 
      : { label: 'Al Día', color: 'bg-teal-50 text-teal-600 border-teal-200', dot: 'bg-teal-500' };
  };

  return (
    <div className="flex-1 bg-slate-50 p-4 lg:p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Contribuyentes</h1>
            <p className="text-xs text-slate-500 mt-0.5">Gestión de base de datos de ciudadanos y empresas</p>
          </div>
          <div className="flex items-center gap-2">
             <button className="px-3 py-2 bg-white text-slate-600 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <Download size={14} /> Exportar
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> Nuevo
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">{error}</div>}

        {/* TABS (Segmentación) */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-max overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, RUC o DNI..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {filteredContribuyentes.length} contribuyentes encontrados
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">Cargando base de datos...</div>
          ) : (
            <div className="overflow-x-auto slim-scrollbar min-h-[300px]">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="px-4 py-3 font-semibold">Contribuyente</th>
                    <th className="px-4 py-3 font-semibold">Documento</th>
                    <th className="px-4 py-3 font-semibold">Contacto</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Financiero</th>
                    <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 text-sm">
                  {filteredContribuyentes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No se encontraron resultados para tu búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredContribuyentes.map((c) => (
                      <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarColor(c.nombreCompletoRazonSocial)}`}>
                              {getInitials(c.nombreCompletoRazonSocial)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{c.nombreCompletoRazonSocial}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[200px]" title={c.direccion}>{c.direccion || 'Sin dirección registrada'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold text-slate-400 block">{c.tipoDocumento}</span>
                          <span className="font-medium text-slate-700">{c.numeroDocumento}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-700">{c.telefono || '-'}</div>
                          <div className="text-[10px] text-slate-400">{c.email || 'Sin correo'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 w-max ${c.estado ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.estado ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            {c.estado ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {(() => {
                            const morosidad = getMorosidadStatus(c.id);
                            return (
                              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 w-max border ${morosidad.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${morosidad.dot}`}></span>
                                {morosidad.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="relative inline-block text-left" onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}>
                            <button 
                              onClick={(e) => toggleDropdown(e, c.id)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {/* DROPDOWN MENU */}
                            {openDropdownId === c.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="py-1">
                                  <Link href={`/consulta-integral?search=${c.numeroDocumento}`} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors w-full text-left">
                                    <ExternalLink size={14} /> Consulta Integral
                                  </Link>
                                  <button onClick={() => handleOpenModal(c)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors w-full text-left">
                                    <Edit size={14} /> Editar Datos
                                  </button>
                                  <button onClick={() => handleDelete(c.id)} className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                                    <Trash2 size={14} /> Eliminar Registro
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <ContribuyenteForm
            contribuyenteToEdit={contribuyenteToEdit}
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}
