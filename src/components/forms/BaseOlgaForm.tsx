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

  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const respuestas = ["PETICIÓN", "TRASLADO", "RESPUESTA", "NOTIFICACIÓN", "AUTO DE CIERRE", "REVOCATORIA", "CONTESTADO"];

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
        tipoRespAQ: row[42] || row.tipoRespAQ || ""
      }));
      setData(records);
      setFilteredData(records);
    } catch (error) { 
      toast.error("Error al cargar datos desde Google Sheets"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Lógica de filtrado en tiempo real al usar el buscador
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
      result = result.filter(item => (item.tipoRespAQ || item.tipoRespuesta || "") === filterEstado);
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
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J
        "", // K (Espacio para Fórmula de Mes)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", // L, M, N
        formData.ciudadDepartamento || "", formData.observaciones || "", formData.funcionarioEncargado || "", // O, P, Q
        formData.nota || "", formData.fechaRecibido || "", formData.tipoRenta || "", // R, S, T
        formData.tipoTramite || "", formData.item || "", formData.tipoRentaOtro || "", // U, V, W
        formData.prelacionLegal || "", formData.baseFuncionario1ra || "", formData.numeroResolucion || "", // X, Y, Z
        formData.numeroSadeSalida || "", formData.fechaResolucionSadeSalida || "", // AA, AB
        formData.tipoRespuesta || "", formData.noPlanillaSalida || "", formData.fechaDePlanillaSalida || "", // AC, AD, AE
        formData.fechaEjecutoria || "", formData.traslado || "", // AF, AG
        formData.observacionAH || "", // AH
        formData.baseFunc2daAI || "", // AI
        formData.numResolucionAJ || "", // AJ
        formData.numSadeAK || "", // AK
        formData.fechaResAL || "", // AL
        formData.numPlanillaAM || "", // AM
        formData.fechaPlanillaAN || "", // AN
        formData.fechaEjecutoriaAO || "", // AO
        formData.trasladoAP || "", // AP
        formData.tipoRespAQ || "" // AQ
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:AQ${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Expediente sincronizado con éxito!");
    } catch (error) { 
      toast.error("Error al guardar en la base de datos"); 
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado Superior estilo Nexura */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Base Olga</h1>
          <p className="text-sm text-slate-500">Sistema de radicación y gestión de actos administrativos de cobro</p>
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

      {/* Barra de Búsqueda y Filtros de Estado */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar en todos los campos (Consecutivo, Expediente, Contribuyente)..." 
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

      {/* Tabla Principal de Registros de la Consulta */}
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
                        {item.tipoRespAQ || item.tipoRespuesta || "PENDIENTE"}
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

      {/* Modal del Formulario Integral (B a AQ) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">
              {editingItem ? "Modificar Expediente Activo" : "Registrar Nuevo Expediente"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            {/* 1. Radicación e Ingreso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b">1. Radicación e Ingreso (B a J)</h3>
              <div className="space-y-1"><Label>Consecutivo (B)</Label><Input {...register("consecutivo")} className="bg-white" /></div>
              <div className="space-y-1"><Label>Expediente (F)</Label><Input {...register("expediente")} className="bg-white" /></div>
              <div className="space-y-1"><Label className="text-blue-700 font-semibold">FECHA ACTO (J)</Label><Input {...register("fechaActo")} className="bg-white border-blue-300" /></div>
            </div>

            {/* 2. Contribuyente y Renta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b">2. Contribuyente y Renta (L a T)</h3>
              <div className="space-y-1"><Label>CONTRIBUYENTE (N)</Label><Input {...register("contribuyente")} className="bg-white" /></div>
              <div className="space-y-1"><Label className="text-green-700 font-semibold">NOTA: (R)</Label><Input {...register("nota")} className="bg-white border-green-300" /></div>
              <div className="space-y-1">
                <Label>FUNCIONARIO (Q)</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* 3. Clasificación Inicial */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b">3. Clasificación Inicial (V a AG)</h3>
              <div className="space-y-1"><Label>ITEM (V)</Label><Input {...register("item")} className="bg-white" /></div>
              <div className="space-y-1"><Label className="text-red-600 font-semibold">FECHA EJECUTORIA (AF)</Label><Input {...register("fechaEjecutoria")} className="bg-white border-red-200" /></div>
              <div className="space-y-1"><Label>TRASLADO (AG)</Label><Input {...register("traslado")} className="bg-white" /></div>
            </div>

            {/* 4. Segunda Instancia y Seguimiento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200">4. Segunda Instancia y Seguimiento (AH a AQ)</h3>
              <div className="space-y-1"><Label>OBSERVACIÓN (AH)</Label><Input {...register("observacionAH")} className="bg-white" /></div>
              <div className="space-y-1"><Label>BASE FUNC. 2DA RESP (AI)</Label><Input {...register("baseFunc2daAI")} className="bg-white" /></div>
              <div className="space-y-1"><Label>NÚMERO RESOLUCIÓN (AJ)</Label><Input {...register("numResolucionAJ")} className="bg-white" /></div>
              <div className="space-y-1"><Label>NÚMERO DE SADE (AK)</Label><Input {...register("numSadeAK")} className="bg-white" /></div>
              <div className="space-y-1"><Label>FECHA RESOLUCIÓN/SADE (AL)</Label><Input {...register("fechaResAL")} className="bg-white" /></div>
              <div className="space-y-1"><Label>No PLANILLA (AM)</Label><Input {...register("numPlanillaAM")} className="bg-white" /></div>
              <div className="space-y-1"><Label>FECHA PLANILLA (AN)</Label><Input {...register("fechaPlanillaAN")} className="bg-white" /></div>
              <div className="space-y-1"><Label>FECHA EJECUTORIA (AO)</Label><Input {...register("fechaEjecutoriaAO")} className="bg-white" /></div>
              <div className="space-y-1"><Label>TRASLADO (AP)</Label><Input {...register("trasladoAP")} className="bg-white" /></div>
              <div className="space-y-1">
                <Label>TIPO DE RESPUESTA (AQ)</Label>
                <Select onValueChange={(v) => setValue("tipoRespAQ", v)}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold text-white hover:bg-black transition-all">
              <Save className="mr-2 h-6 w-6" /> Guardar y Sincronizar con Google Sheets
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
