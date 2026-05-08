import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Search, Filter, AlertCircle, CheckCircle2, 
  Clock, FileText, MoreHorizontal, ArrowUpRight,
  LayoutDashboard, Mail, FolderTree, Scale, ClipboardCheck,
  ChevronRight
} from 'lucide-react';

// --- COMPONENTE DE LA VISTA BASE OLGA ---
const BaseOlgaView = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo basados en tu estructura de Excel
  const datosOlga = [
    {
      consecutivo: "001",
      canal: "FÍSICO",
      expediente: "EXP-2026-001",
      fechaRadicacion: "05/05/2026",
      contribuyente: "MUNICIPIO DE CALI",
      funcionario: "OLGA VALENCIA",
      vencimiento: "20/05/2026",
      diasPendientes: 12,
      semaforo: "AL DIA",
      tramite: "Liquidación Oficial"
    },
    {
      consecutivo: "002",
      canal: "SADE",
      expediente: "EXP-2026-045",
      fechaRadicacion: "02/05/2026",
      contribuyente: "CONSORCIO VALLE",
      funcionario: "CARLOS RODRIGUEZ",
      vencimiento: "09/05/2026",
      diasPendientes: 1,
      semaforo: "CRITICO",
      tramite: "Recurso de Reconsideración"
    }
  ];

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Base Olga</h1>
          <p className="text-slate-500">Seguimiento de expedientes y actos administrativos</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter size={16} /> Filtrar
          </button>
          <button className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-200">
            Exportar reporte
          </button>
        </div>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><FileText size={24} /></div>
            <span className="text-emerald-500 text-sm font-bold">+12%</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">1.240</div>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Expedientes</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><Clock size={24} /></div>
            <span className="text-slate-400 text-sm font-bold">Hoy</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">45</div>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">En Trámite</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-red-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-red-50 text-red-600"><AlertCircle size={24} /></div>
            <span className="text-red-500 text-sm font-bold">Urgente</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">6</div>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Vencidos</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={24} /></div>
            <span className="text-emerald-500 text-sm font-bold">Óptimo</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">87.5%</div>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Eficiencia</div>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <Search className="text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por contribuyente, funcionario o expediente..." 
            className="bg-transparent border-none outline-none text-sm w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Expediente / SADE</th>
              <th className="px-6 py-4">Contribuyente</th>
              <th className="px-6 py-4">Funcionario</th>
              <th className="px-6 py-4">Vencimiento
