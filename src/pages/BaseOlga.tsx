import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, Plus, Save, Search, FileSpreadsheet, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

export default function BaseOlga() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("TODOS");
  
  const { register, handleSubmit, setValue, reset } = useForm();

  // Listados Maestros para los Selects
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const tiposRenta = ["IMPUESTO SOBRE VEHICULOS", "IMPUESTO DE REGISTRO", "IMPUESTO AL CONSUMO", "IMPUESTO DE DEGUELLO", "TASA DE SEGURIDAD", "ESTAMPILLA", "APREHENCIÓN Y DECOMISO DE MERCANCIAS", "PASAPORTE", "OTROS", "NO TRIBUTARIO", "IMPUESTO TASA DE GASOLINA"];
  const tiposTramite = ["Derecho de peticion", "Exención", "Devolucion", "Copia boleta fiscal", "Recurso", "Certificación", "Atención PDTIR", "Insolvencia", "Subsanación"];
  const respuestas = ["PETICION", "TRASLADO", "RESPUESTA", "NOTIFICACIÓN", "AUTO DE CIERRE", "REVOCATORIA", "CONTESTADO"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      const records = (result[SHEET_NAMES.BASE_OLGA] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`,
        consecutivo: row[1] || row.consecutivo || "",
        expediente: row[5] || row.expediente || "",
        contribuyente: row[13] || row.contribuyente || "",
        funcionarioEncargado: row[16] || row.funcionarioEncargado || "",
        tipoRespuesta: row[28] || row.tipoRespuesta || "",
        tipoRespuestaAQ: row[42] || row.tipoRespuestaAQ || ""
      }));
      setData(records);
      setFilteredData(records);
    } catch (error) { 
      toast.error("Error al cargar datos"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Lógica de búsqueda y filtros en tiempo real
  useEffect(() => {
    let result = data;
    if (searchTerm) {
      result = result.filter(item => 
        (item.consecutivo?.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.expediente?.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.contribuyente?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filterEstado !== "TODOS") {
      result = result.filter(item => (item.tipoRespuestaAQ || item.tipoRespuesta || "") === filterEstado);
    }
    setFilteredData(result);
  }, [searchTerm, filterEstado, data]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
    reset(item);
  };

  const onSubmit = async (formData: any) => {
    try {
      // Mapeo EXACTO por columnas desde la A hasta la BL sin desplazamientos
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J
        "", // K (MES - FÓRMULA)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", // L, M, N
        formData.ciudadDepartamento || "", formData.observaciones || "", formData.funcionarioEncargado || "", // O, P, Q
        formData.nota || "", formData.fechaRecibido || "", formData.tipoRenta || "", // R, S, T
        formData.tipoTramite || "", // U
        formData.item || "", // V
        formData.tipoRentaOtro || "", // W
        formData.prelacionLegal || "", formData.baseFuncionario1ra || "", formData.numeroResolucion || "", // X, Y, Z
        formData.numeroSadeSalida || "", formData.fechaResolucionSadeSalida || "", // AA, AB
        formData.tipoRespuesta || "", formData.noPlanillaSalida || "", formData.fechaDePlanillaSalida || "", // AC, AD, AE
        formData.fechaEjecutoria || "", formData.traslado || "", // AF, AG
        formData.observacionAH || "", // AH
        formData.baseFuncionario2daAI || "", // AI
        formData.numResolucionAJ || "", // AJ
        formData.numSadeAK || "", // AK
        formData.fechaResolucionAL || "", // AL
        formData.numPlanillaAM || "", // AM
        formData.fechaPlanillaAN || "", // AN
        formData.fechaEjecutoriaAO || "", // AO
        formData.trasladoAP || "", // AP
        formData.tipoRespuestaAQ || "", // AQ
        formData.baseFunc3raAR || "", // AR
        ...Array(11).fill(""), // AS a BC (Espacios vacíos de control)
        formData.fechaVencimientoBD || "", // BD
        formData.diasPendientesBE || "", // BE
        formData.semaforoVencimientoBF || "", // BF
        formData.diasTranscurridosBG || "", // BG
        formData.semaforoExpedientesBH || "", // BH
        formData.anoIngresoBI || "", // BI
        "", // BJ (Fórmula oculta en el Excel, se respeta la celda vacía)
        formData.clasificacionPdtesBK || "", // BK
        formData.funcencarBL || "" // BL
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:BL${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Expediente guardado exitosamente!");
    } catch (error) { toast.error("Error al guardar"); }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Panel Superior */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Base Olga</h1>
          <p className="text-sm text-slate-500">Sistema de radicación y gestión de cobros</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} className="text-slate-600 border-slate-200">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualizar
          </Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo
          </Button>
        </div>
      </div>

      {/* Control de Consultas y Búsquedas */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por Consecutivo, Expediente o Contribuyente..." 
            className="pl-9 bg-slate-50/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="bg-slate-50/50">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos los estados</SelectItem>
              {respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="bg-white rounded-lg shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4">Radicación (B)</th>
                <th className="p-4">Expediente (F)</th>
                <th className="p-4">Contribuyente (N)</th>
                <th className="p-4">Funcionario (Q)</th>
                <th className="p-4">Estado (AQ)</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-slate-400">
                    <RefreshCw className="animate-spin h-6 w-6 mx-auto mb-2 text-blue-500" />
                    Consultando registros en Google Sheets...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-slate-400">
                    <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No se encontraron procesos con los filtros aplicados
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{item.consecutivo}</td>
                    <td className="p-4">{item.expediente}</td>
                    <td className="p-4 font-medium">{item.contribuyente}</td>
                    <td className="p-4">{item.funcionarioEncargado}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.tipoRespuestaAQ || item.tipoRespuesta || "PENDIENTE"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" /> Editar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal del Formulario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4"><DialogTitle className="text-xl font-bold text-blue-900">Formulario de Gestión Integral (B a BL)</DialogTitle></DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* 1. RADICACIÓN E INGRESO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">No consecutivo (B)</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Canal de ingreso (C)</Label><Input {...register("canalIngreso")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Area Remitente (D)</Label><Input {...register("areaRemitente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. PLANILLA (E)</Label><Input {...register("planilla")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. EXPEDIENTE (F)</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Radicacion (G)</Label><Input {...register("fechaRadicacion")} className="bg-white h-9" /></div>
              <div className="col-span-1 space-y-1"><Label className="text-xs font-bold">ACTO ADMINISTRA-TIVO (H)</Label><Input {...register("actoAdministrativo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. ACTO / SADE (I)</Label><Input {...register("numeroActo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-700">FECHA ACTO (J)</Label><Input {...register("fechaActo")} className="bg-white h-9 border-blue-300" /></div>
            </div>

            {/* 2. CONTRIBUYENTE Y RENTA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">2. Información del Contribuyente</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">PLACA (L)</Label><Input {...register("placa")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. IDENTIFICACION (M)</Label><Input {...register("identificacion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">CONTRIBUYENTE (N)</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">CIUDAD-DEPARTAMENTO (O)</Label><Input {...register("ciudadDepartamento")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">OBSERVACIONES (P)</Label><Input {...register("observaciones")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FUNCIONARIO (Q)</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-700">NOTA: (R)</Label><Input {...register("nota")} className="bg-white h-9 border-green-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA RECIBIDO (S)</Label><Input {...register("fechaRecibido")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RENTA (T)</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE TRAMITE (U)</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* 3. CLASIFICACIÓN Y RESPUESTA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">3. Clasificación y Respuesta (V a AG)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">ITEM (V)</Label><Input {...register("item")} className="bg-white h-9 border-orange-200" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold text-[10px]">SI EL TIPO DE RENTA ES OTRO (W)</Label><Input {...register("tipoRentaOtro")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">PRELACIÓN LEGAL (X)</Label><Input {...register("prelacionLegal")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-[10px]">BASE FUNCIONARIO 1RA RESP (Y)</Label><Input {...register("baseFuncionario1ra")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">NUMERO RESOLUCION (Z)</Label><Input {...register("numeroResolucion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">SADE SALIDA (AA)</Label><Input {...register("numeroSadeSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA RESOLUCION (AB)</Label><Input {...register("fechaResolucionSadeSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RESPUESTA (AC)</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">No PLANILLA (AD)</Label><Input {...register("noPlanillaSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA PLANILLA (AE)</Label><Input {...register("fechaDePlanillaSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">FECHA EJECUTORIA (AF)</Label><Input {...register("fechaEjecutoria")} className="bg-white h-9 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">TRASLADO (AG)</Label><Input {...register("traslado")} className="bg-white h-9" /></div>
            </div>

            {/* 4. SEGUNDA INSTANCIA Y SEGUIMIENTO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200 pb-1 text-sm">4. Segunda Instancia y Vencimiento (AH a BD)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">OBSERVACIÓN (AH)</Label><Input {...register("observacionAH")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">BASE FUNC. 2DA RESP (AI)</Label><Input {...register("baseFuncionario2daAI")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. RESOLUCIÓN (AJ)</Label><Input {...register("numResolucionAJ")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. SADE (AK)</Label><Input {...register("numSadeAK")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA RES./SADE (AL)</Label><Input {...register("fechaResolucionAL")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No PLANILLA (AM)</Label><Input {...register("numPlanillaAM")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA PLANILLA (AN)</Label><Input {...register("fechaPlanillaAN")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">EJECUTORIA (AO)</Label><Input {...register("fechaEjecutoriaAO")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">TRASLADO (AP)</Label><Input {...register("trasladoAP")} className="bg-white h-9" /></div>
              <div className="space-y-
