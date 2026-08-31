import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Save, Search, Edit, Download, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow } from "@/lib/googleSheets";

export default function NexuraPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  
  const canalesIngreso = ["Correo Contáctenos", "Virtual", "Ventanilla", "SADE", "NEXURA"];
  const secretarias = ["UNIDAD ADMIN", "SECRETARÍA DE HACIENDA", "JURÍDICA"];
  const tiposSolicitud = ["Petición de interés general", "Reclamo", "Queja", "Solicitud de información"];
  const prioritariaOpciones = ["SÍ", "NO"];
  const condiciones = ["Pendiente", "Tramitado", "Cerrado"];
  const tiposPersona = ["Persona Natural", "Persona Jurídica"];
  const tiposDocumento = ["Cédula de ciudadanía", "NIT", "Cédula de extranjería", "Pasaporte"];
  const tiposRenta = ["IMPUESTO", "PASAPORTE", "VEHICULOS", "DEGUELLO", "LOTERIAS", "ESTAMPILLAS", "OTRO"];
  const tiposTramite = ["Derecho de Petición", "Solicitud", "Recurso", "Reclamación"];
  const tiposRespuesta = ["RESPUESTA", "TRASLADO", "PETICIÓN", "NOTIFICACIÓN", "AUTO DE CIERRE"];
  const prelacionOpciones = ["N/A", "SÍ", "NO", "URGENTE"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sheetName = "Base NEXURA";
      const result = await readSheet(sheetName); 
      const records = (result[sheetName] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`,
        noRadicacion: row[Object.keys(row)[3]] || "",
        secretaria: row[Object.keys(row)[5]] || "",
        tiposolicitud: row[Object.keys(row)[6]] || "",
        nombreSolicitante: row[Object.keys(row)[26]] || "",
        responsable: row[Object.keys(row)[11]] || "",
        condicionSolicitud: row[Object.keys(row)[10]] || "Pendiente"
      }));
      setData(records);
    } catch (error) { 
      toast.error("Error al cargar los datos de Base NEXURA"); 
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
      link.setAttribute("download", `Base_NEXURA_${new Date().toISOString().split('T')[0]}.csv`);
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
      const sheetName = "Base NEXURA";
      const rowData = [
        "",                                               // A
        formData.baseInformeNexura || "NEXURA",           // B: NEXURA
        formData.numero || "",                            // C: No.
        formData.noRadicacion || "",                      // D: No. radicación
        formData.noRadicacionExterno || "",               // E: No. radicación externo
        formData.secretaria || "",                        // F: Secretaría
        formData.tipoSolicitud || "",                     // G: Tipo de solicitud
        formData.prioritaria || "NO",                     // H: Prioritaria
        formData.canalIngreso || "",                      // I: Canal de ingreso
        formData.tema || "",                              // J: Tema
        formData.condicionSolicitud || "",                // K: Condición de solicitud
        formData.responsable || "",                       // L: Responsable
        formData.fechaRegistro || "",                     // M: Fecha de Registro
        formData.fechaIngreso || "",                      // N: Fecha ingreso
        formData.fechaLimiteRespuesta || "",              // O: Fecha límite de respuesta
        formData.fechaRespuestaP || "",                   // P: Fecha de respuesta a
        "", "", "", "",                                   // Q, R, S, T: Fórmulas
        formData.tipoPersona || "",                       // U: Tipo de persona
        formData.nit || "",                               // V: Nit
        formData.digitoVerificacion || "",                // W: Dígito de verificación
        formData.tipoDocumento || "",                     // X: Tipo de documento
        formData.numeroDocumento || "",                   // Y: Número de documento
        "",                                               // Z: Duplicados
        formData.nombreSolicitante || "",                 // AA: Nombre del solicitante
        formData.telefonoContacto || "",                  // AB: Teléfono de contacto
        formData.email || "",                             // AC: Email
        "",                                               // AD: Término (Fórmula)
        formData.requerimiento || "",                     // AE: Requerimiento
        formData.funcionarioEncargado || "",              // AF: FUNCIONARIO ENCARGADO
        formData.tipoRenta || "",                         // AG: TIPO DE RENTA
        formData.tipoTramite || "",                       // AH: TIPO DE TRAMITE
        formData.item || "",                              // AI: ITEM
        formData.tipoRentaOtro || "",                     // AJ: SI EL TIPO DE RENTA ES OTRO
        formData.tipoRespuesta || "",                     // AK: TIPO DE RESPUESTA
        formData.fechaRespuestaAL || "",                  // AL: FECHA DE RESPUESTA
        formData.numeroSadeSalida || "",                  // AM: NUMERO DE SADE DE SALIDA
        formData.prelacionLegal || "N/A"                  // AN: PRELACIÓN LEGAL
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(sheetName, `A${rowNumber}:AN${rowNumber}`, rowData);
        toast.success("¡Registro actualizado exitosamente!");
      } else {
        await appendToSheet(sheetName, rowData);
        toast.success("¡Registro guardado exitosamente!");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) { 
      toast.error("Error al guardar en Sheets"); 
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val: any) => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === "ALL" || item.condicionSolicitud === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold">Módulo Base NEXURA</h1>
          <p className="text-sm text-gray-500">Gestión estructurada y control de trazabilidad gerencial</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button onClick={fetchData} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-56 bg-white h-9">
              <SelectValue placeholder="Filtrar por condición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las condiciones</SelectItem>
              {condiciones.map(cond => <SelectItem key={cond} value={cond}>{cond}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-3">No. Radicación</th>
                <th className="p-3">Secretaría</th>
                <th className="p-3">Tipo Solicitud</th>
                <th className="p-3">Solicitante</th>
                <th className="p-3">Responsable</th>
                <th className="p-3">Condición</th>
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
                    <td className="p-3 font-medium text-slate-900">{item.noRadicacion}</td>
                    <td className="p-3 text-slate-600">{item.secretaria}</td>
                    <td className="p-3 text-slate-600">{item.tiposolicitud}</td>
                    <td className="p-3 text-slate-600">{item.nombreSolicitante}</td>
                    <td className="p-3 text-slate-600">{item.responsable}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.condicionSolicitud === "Pendiente" ? "bg-amber-100 text-amber-800" :
                        item.condicionSolicitud === "Tramitado" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}>
                        {item.condicionSolicitud || "Pendiente"}
                      </span>
                    </td>
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
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>{editingItem ? "Editar Registro - Base NEXURA" : "Nuevo Registro - Base NEXURA"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Radicación y Secretaría</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">NEXURA / Base</Label><Input {...register("baseInformeNexura")} defaultValue="NEXURA" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No.</Label><Input {...register("numero")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Radicación</Label><Input {...register("noRadicacion")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Radicación Externo</Label><Input {...register("noRadicacionExterno")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Secretaría</Label>
                <Select onValueChange={(v) => setValue("secretaria", v)} defaultValue={editingItem?.secretaria}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{secretarias.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Solicitud</Label>
                <Select onValueChange={(v) => setValue("tipoSolicitud", v)} defaultValue={editingItem?.tipoSolicitud}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposSolicitud.map(ts => <SelectItem key={ts} value={ts}>{ts}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Prioritaria</Label>
                <Select onValueChange={(v) => setValue("prioritaria", v)} defaultValue={editingItem?.prioritaria || "NO"}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{prioritariaOpciones.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">2. Detalle y Trámite</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Canal de Ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.canalIngreso}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{canalesIngreso.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">Tema</Label><Input {...register("tema")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Condición de Solicitud</Label>
                <Select onValueChange={(v) => setValue("condicionSolicitud", v)} defaultValue={editingItem?.condicionSolicitud}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{condiciones.map(cond => <SelectItem key={cond} value={cond}>{cond}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Responsable / Funcionario</Label>
                <Select onValueChange={(v) => setValue("responsable", v)} defaultValue={editingItem?.responsable}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">3. Fechas Principales de Control</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Registro</Label><Input {...register("fechaRegistro")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha ingreso</Label><Input {...register("fechaIngreso")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">Fecha límite de respuesta</Label><Input {...register("fechaLimiteRespuesta")} type="date" className="bg-white h-8 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de respuesta a</Label><Input {...register("fechaRespuestaP")} type="date" className="bg-white h-8" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <h3 className="col-span-3 font-bold text-indigo-800 border-b border-indigo-200 pb-1 text-sm">4. Datos del Solicitante</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de persona</Label>
                <Select onValueChange={(v) => setValue("tipoPersona", v)} defaultValue={editingItem?.tipoPersona}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposPersona.map(tp => <SelectItem key={tp} value={tp}>{tp}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">Nit</Label><Input {...register("nit")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Dígito de verificación</Label><Input {...register("digitoVerificacion")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de documento</Label>
                <Select onValueChange={(v) => setValue("tipoDocumento", v)} defaultValue={editingItem?.tipoDocumento}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposDocumento.map(td => <SelectItem key={td} value={td}>{td}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">Número de documento</Label><Input {...register("numeroDocumento")} className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Nombre del solicitante</Label><Input {...register("nombreSolicitante")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Teléfono de contacto</Label><Input {...register("telefonoContacto")} className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Email</Label><Input {...register("email")} type="email" className="bg-white h-8" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200 pb-1 text-sm">5. Detalle Final y Cierre</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Requerimiento</Label><Input {...register("requerimiento")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FUNCIONARIO ENCARGADO</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.funcionarioEncargado}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RENTA</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)} defaultValue={editingItem?.tipoRenta}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE TRAMITE</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)} defaultValue={editingItem?.tipoTramite}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(tt => <SelectItem key={tt} value={tt}>{tt}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">ITEM</Label><Input {...register("item")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">SI EL TIPO DE RENTA ES OTRO</Label><Input {...register("tipoRentaOtro")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RESPUESTA</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)} defaultValue={editingItem?.tipoRespuesta}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposRespuesta.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA DE RESPUESTA</Label><Input {...register("fechaRespuestaAL")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">NUMERO DE SADE DE SALIDA</Label><Input {...register("numeroSadeSalida")} className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-3">
                <Label className="text-xs font-bold text-purple-900">PRELACIÓN LEGAL</Label>
                <Select onValueChange={(v) => setValue("prelacionLegal", v)} defaultValue={editingItem?.prelacionLegal || "N/A"}>
                  <SelectTrigger className="bg-white h-8 border-purple-300"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{prelacionOpciones.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold text-white hover:bg-black">
              <Save className="mr-2 h-6 w-6" /> Guardar Registro en Sheets
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
