import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Save, ChevronDown, ChevronUp, Search, Edit, Download, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

export default function BaseOlga() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  const [mostrarSegundaInstancia, setMostrarSegundaInstancia] = useState(false);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  
  const canalesIngreso = ["CORREO ELECTRÓNICO", "VENTANILLA", "OFICIO", "SADE", "FISCALIZACIÓN"];
  const areasRemitentes = ["COACTIVA", "LIQUIDACIÓN", "FISCALIZACIÓN", "RECAUDO", "JURÍDICA", "DESPACHO"];
  const tiposRenta = ["VEHICULOS", "DEGUELLO", "LOTERIAS", "ESTAMPILLAS", "CERVEZA", "LICORES"];
  const tiposTramite = ["RECURSO DE RECONSIDERACIÓN", "REVOCATORIA DIRECTA", "REQUERIMIENTO ORDINARIO", "TRASLADO", "PETICIÓN"];
  const prelacionOpciones = ["SÍ", "NO", "URGENTE", "PRIORITARIO"];
  const respuestas = ["PETICIÓN", "TRASLADO", "RESPUESTA", "NOTIFICACIÓN", "AUTO DE CIERRE", "REVOCATORIA", "CONTESTADO"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      const records = (result[SHEET_NAMES.BASE_OLGA] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`,
        consecutivo: row[Object.keys(row)[1]] || "",
        expediente: row[Object.keys(row)[5]] || "",
        contribuyente: row[Object.keys(row)[13]] || "",
        funcionarioEncargado: row[Object.keys(row)[16]] || "",
        tipoRenta: row[Object.keys(row)[19]] || "",
        tipoRespuesta: row[Object.keys(row)[28]] || "PENDIENTE"
      }));
      setData(records);
    } catch (error) { 
      toast.error("Error de carga"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }
    try {
      const headers = Object.keys(data[0]).filter(k => k !== 'id');
      const csvRows = [
        headers.join(","),
        ...data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(","))
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Base_Olga_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("¡Datos exportados exitosamente!");
    } catch (error) {
      toast.error("Error al exportar los datos");
    }
  };

  const onSubmit = async (formData: any) => {
    try {
      const rowData = [
        "", // A
        formData.consecutivo || "",         // B
        formData.canalIngreso || "",        // C
        formData.areaRemitente || "",       // D
        formData.planilla || "",            // E
        formData.expediente || "",          // F
        formData.fechaRadicacion || "",     // G
        formData.actoAdministrativo || "",  // H
        formData.numeroActo || "",          // I
        formData.fechaActo || "",           // J
        "", // K (Fórmula Mes)
        formData.placa || "",               // L
        formData.identificacion || "",      // M
        formData.contribuyente || "",       // N
        formData.ciudadDepartamento || "",  // O
        formData.observaciones || "",       // P
        formData.funcionarioEncargado || "",// Q
        formData.nota || "",                // R
        formData.fechaRecibido || "",       // S
        formData.tipoRenta || "",           // T
        formData.tipoTramite || "",         // U
        formData.item || "",                // V
        formData.tipoRentaOtro || "",       // W
        formData.prelacionLegal || "",      // X
        "",                                 // Y (Base Funcionario 1ra - Oculto)
        formData.numeroResolucion || "",    // Z
        formData.numeroSadeSalida || "",    // AA
        formData.fechaResolucionSadeSalida || "", // AB
        formData.tipoRespuesta || "",       // AC
        formData.noPlanillaSalida || "",    // AD
        formData.fechaDePlanillaSalida || "", // AE
        formData.fechaEjecutoria || "",     // AF
        formData.traslado || "",            // AG
        formData.observacionAH || "",       // AH
        "",                                 // AI (Base Func. 2da Instancia - Oculto)
        formData.numResolucionAJ || "",     // AJ
        formData.numSadeAK || "",           // AK
        formData.fechaResolucionAL || "",   // AL
        formData.numPlanillaAM || "",       // AM
        formData.fechaPlanillaAN || "",     // AN
        formData.fechaEjecutoriaAO || "",   // AO
        formData.trasladoAP || "",          // AP
        formData.tipoRespuestaAQ || "",     // AQ
        "",                                 // AR (Base Func. 3ra Instancia - Oculto)
        ...Array(11).fill(""),              // AS a BC
        formData.fechaVencimientoBD || ""   // BD
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:BD${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Expediente guardado exitosamente!");
    } catch (error) { toast.error("Error al guardar"); }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val: any) => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === "ALL" || item.tipoRespuesta === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Cabecera y Botones Principales */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold">Traza Rentas - Base Olga</h1>
          <p className="text-sm text-gray-500">Gestión gerencial e integral de expedientes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button onClick={fetchData} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setMostrarSegundaInstancia(false); setIsDialogOpen(true); }} className="bg-slate-900 text-white hover:bg-black">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
          </Button>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-lg shadow border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar en todos los campos..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-9 bg-white h-9"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto items-center">
          <Filter className="h-4 w-4 text-gray-400 hidden md:block" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white h-9">
              <SelectValue placeholder="Filtrar respuesta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las respuestas</SelectItem>
              {respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla de Consulta Principal */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-3">Consecutivo</th>
                <th className="p-3">Expediente</th>
                <th className="p-3">Contribuyente</th>
                <th className="p-3">Funcionario</th>
                <th className="p-3">Tipo Renta</th>
                <th className="p-3">Tipo Respuesta</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">Cargando expedientes...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">No se encontraron registros con los filtros aplicados.</td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-medium text-slate-900">{item.consecutivo}</td>
                    <td className="p-3 text-slate-600">{item.expediente}</td>
                    <td className="p-3 text-slate-600">{item.contribuyente}</td>
                    <td className="p-3 text-slate-600">{item.funcionarioEncargado}</td>
                    <td className="p-3 text-slate-600">{item.tipoRenta}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {item.tipoRespuesta || "PENDIENTE"}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); reset(item); setMostrarSegundaInstancia(false); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span>Mostrando {filteredData.length} de {data.length} registros</span>
        </div>
      </div>

      {/* Modal de Formulario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4"><DialogTitle>Formulario de Gestión Integral - Base Olga</DialogTitle></DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* 1. Radicación e Ingreso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Consecutivo</Label><Input {...register("consecutivo")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Canal de Ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.canalIngreso}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{canalesIngreso.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Área Remitente</Label>
                <Select onValueChange={(v) => setValue("areaRemitente", v)} defaultValue={editingItem?.areaRemitente}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{areasRemitentes.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Planilla</Label><Input {...register("planilla")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Expediente</Label><Input {...register("expediente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Radicación</Label><Input {...register("fechaRadicacion")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Acto Administrativo</Label><Input {...register("actoAdministrativo")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Acto / SADE</Label><Input {...register("numeroActo")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-700">Fecha del Acto</Label><Input {...register("fechaActo")} type="date" className="bg-white h-8 border-blue-300" /></div>
            </div>

            {/* 2. Contribuyente y Renta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">2. Información del Contribuyente</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Placa</Label><Input {...register("placa")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Identificación</Label><Input {...register("identificacion")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Contribuyente</Label><Input {...register("contribuyente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Ciudad / Departamento</Label><Input {...register("ciudadDepartamento")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Observaciones</Label><Input {...register("observaciones")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.funcionarioEncargado}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-700">Nota</Label><Input {...register("nota")} className="bg-white h-8 border-green-300" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Recibido</Label><Input {...register("fechaRecibido")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Renta</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)} defaultValue={editingItem?.tipoRenta}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Trámite</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)} defaultValue={editingItem?.tipoTramite}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(tt => <SelectItem key={tt} value={tt}>{tt}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* 3. Clasificación y Respuesta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">3. Clasificación y Respuesta (1ra Instancia)</h3>
              <div
