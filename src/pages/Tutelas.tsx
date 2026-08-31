import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, RefreshCw, Search, Save, Edit, Download, Filter } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow } from "@/lib/googleSheets";

export default function TutelasPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  const canalesIngreso = ["CORREO ELE", "SADE", "VENTANILLA", "OFICIO"];
  const meses = ["DICIEMBRE", "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE"];
  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const tiposRenta = ["IMPUESTO AL CONSUMO", "IMPUESTO DE VEHÍCULOS", "DEGÜELLO", "LOTERÍAS", "ESTAMPILLAS", "N/A"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sheetName = "Base Tutelas"; 
      const result = await readSheet(sheetName); 
      const records = (result[sheetName] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`,
        canalIngreso: row[Object.keys(row)[0]] || "",
        mes: row[Object.keys(row)[1]] || "",
        fechaAsignacion: row[Object.keys(row)[2]] || "",
        correoFuncionario: row[Object.keys(row)[3]] || "",
        funcionarioEncargado: row[Object.keys(row)[4]] || "",
        asuntoCorreo: row[Object.keys(row)[5]] || "",
        fechaCorreo: row[Object.keys(row)[6]] || "",
        contribuyente: row[Object.keys(row)[7]] || "",
        correoSolicitante: row[Object.keys(row)[8]] || "",
        tipoRenta: row[Object.keys(row)[9]] || "",
        tipoTramite: row[Object.keys(row)[10]] || "",
        item: row[Object.keys(row)[11]] || "",
        placa: row[Object.keys(row)[12]] || "",
        remitente: row[Object.keys(row)[13]] || "",
        correoRemitente: row[Object.keys(row)[14]] || "",
        fechaRespuestaPeticion: row[Object.keys(row)[15]] || "",
        fechaRespuestaJuridica: row[Object.keys(row)[16]] || "",
        observaciones: row[Object.keys(row)[17]] || ""
      }));
      setData(records);
    } catch (error) { 
      toast.error("Error al cargar los datos de tutelas"); 
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
      link.setAttribute("download", `Base_Tutelas_${new Date().toISOString().split('T')[0]}.csv`);
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
      const sheetName = "Base Tutelas";
      const rowData = [
        formData.canalIngreso || "CORREO ELE", // A: CANAL DE INGRESO
        formData.mes || "",                      // B: MES
        formData.fechaAsignacion || "",          // C: FECHA ASIGNACION
        formData.correoFuncionario || "",        // D: CORREO FUNCIONARIO ENCARGADO
        formData.funcionarioEncargado || "",     // E: FUNCIONARIO ENCARGADO
        formData.asuntoCorreo || "",             // F: ASUNTO CORREO
        formData.fechaCorreo || "",              // G: FECHA CORREO
        formData.contribuyente || "",            // H: CONTRIBUYENTE O SOLICITANTE
        formData.correoSolicitante || "",        // I: CORREO SOLICITANTE
        formData.tipoRenta || "",                // J: TIPO DE RENTA
        formData.tipoTramite || "",              // K: TIPO DE TRÁMITE
        formData.item || "",                     // L: ÍTEM
        formData.placa || "",                    // M: PLACA
        formData.remitente || "",                // N: REMITENTE
        formData.correoRemitente || "",          // O: CORREO REMITENTE
        formData.fechaRespuestaPeticion || "",   // P: FECHA RESPUESTA DERECHO DE PETICIÓN
        formData.fechaRespuestaJuridica || "",   // Q: FECHA RESPUESTA AL ÁREA DE JURÍDICA
        formData.observaciones || ""             // R: OBSERVACIONES
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(sheetName, `A${rowNumber}:R${rowNumber}`, rowData);
        toast.success("¡Registro de tutela actualizado exitosamente!");
      } else {
        await appendToSheet(sheetName, rowData);
        toast.success("¡Nuevo registro de tutela guardado exitosamente!");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) { 
      toast.error("Error al guardar en la hoja de cálculo"); 
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val: any) => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesMonth = monthFilter === "ALL" || item.mes === monthFilter;
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Base Tutelas</h1>
          <p className="text-sm text-gray-500">Gestión completa y seguimiento de tutelas y requerimientos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button onClick={fetchData} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo
          </Button>
        </div>
      </div>

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
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white h-9">
              <SelectValue placeholder="Filtrar por mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los meses</SelectItem>
              {meses.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-3">Canal Ingreso</th>
                <th className="p-3">Mes</th>
                <th className="p-3">Fecha Asignación</th>
                <th className="p-3">Funcionario</th>
                <th className="p-3">Contribuyente</th>
                <th className="p-3">Asunto Correo</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">Cargando registros...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">No se encontraron registros con los filtros aplicados.</td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-medium text-slate-900">{item.canalIngreso}</td>
                    <td className="p-3 text-slate-600">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {item.mes}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{item.fechaAsignacion}</td>
                    <td className="p-3 text-slate-600">{item.funcionarioEncargado}</td>
                    <td className="p-3 text-slate-600">{item.contribuyente}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{item.asuntoCorreo}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); reset(item); setIsDialogOpen(true); }}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>{editingItem ? "Editar Registro - Base Tutelas" : "Nuevo Registro - Base Tutelas"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">Canal de Ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.canalIngreso || "CORREO ELE"}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{canalesIngreso.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Mes</Label>
                <Select onValueChange={(v) => setValue("mes", v)} defaultValue={editingItem?.mes}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione mes..." /></SelectTrigger>
                  <SelectContent>{meses.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Fecha Asignación</Label>
                <Input {...register("fechaAsignacion")} type="date" className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Fecha Correo</Label>
                <Input {...register("fechaCorreo")} type="date" className="bg-white h-8" />
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.funcionarioEncargado}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione funcionario..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Correo Funcionario Encargado</Label>
                <Input {...register("correoFuncionario")} className="bg-white h-8" />
              </div>

              <div className="space-y-1 md:col-span-3">
                <Label className="text-xs font-bold">Asunto Correo</Label>
                <Input {...register("asuntoCorreo")} className="bg-white h-8" />
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Contribuyente o Solicitante</Label>
                <Input {...register("contribuyente")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Correo Solicitante</Label>
                <Input {...register("correoSolicitante")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Renta</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)} defaultValue={editingItem?.tipoRenta}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Trámite</Label>
                <Input {...register("tipoTramite")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Ítem</Label>
                <Input {...register("item")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Placa</Label>
                <Input {...register("placa")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Remitente</Label>
                <Input {...register("remitente")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Correo Remitente</Label>
                <Input {...register("correoRemitente")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Fecha Respuesta Derecho de Petición</Label>
                <Input {...register("fechaRespuestaPeticion")} type="date" className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Fecha Respuesta al Área de Jurídica</Label>
                <Input {...register("fechaRespuestaJuridica")} type="date" className="bg-white h-8" />
              </div>

              <div className="space-y-1 md:col-span-3">
                <Label className="text-xs font-bold">Observaciones</Label>
                <Input {...register("observaciones")} className="bg-white h-8" />
              </div>

            </div>

            <Button type="submit" className="w-full bg-slate-900 py-5 text-lg font-bold text-white hover:bg-black">
              <Save className="mr-2 h-5 w-5" /> Guardar Registro Completo de Tutelas
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
