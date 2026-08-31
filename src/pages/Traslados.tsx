import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, RefreshCw, Search, Save, Edit } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow } from "@/lib/googleSheets";

export default function TrasladosPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  const canalesIngreso = ["SADE FISCALIZACIÓN", "SADE", "VENTANILLA", "CORREO ELECTRÓNICO", "OFICIO"];
  const actosAdministrativos = ["EMPLAZAMIENTO POR NO DECLARAR", "REQUERIMIENTO ORDINARIO", "RESOLUCIÓN", "AUTO DE CIERRE", "TRASLADO"];
  const procesos = ["OMISO", "INEXACTO", "MOROSO", "NORMAL"];
  const impuestos = ["CONSUMO", "LICORES", "DEGÜELLO", "LOTERÍAS", "ESTAMPILLAS", "VEHÍCULOS", "N/A"];
  const tiposRenta = ["IMPUESTO AL CONSUMO", "IMPUESTO DE VEHÍCULOS", "DEGÜELLO", "LOTERÍAS", "ESTAMPILLAS"];
  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const ubicaciones = ["AUTO DE CIERRE", "PTE", "EN TRÁMITE", "ARCHIVADO"];
  const dependencias = ["NOTIFICACIONES", "JURÍDICA", "COACTIVA", "LIQUIDACIÓN"];
  const recursosArchivo = ["RECURSO", "ARCHIVO", "N/A"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sheetName = "Base Traslados Fiscalizacion"; 
      const result = await readSheet(sheetName); 
      const records = (result[sheetName] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`
      }));
      setData(records);
    } catch (error) { 
      toast.error("Error al cargar los datos de traslados"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      const sheetName = "Base Traslados Fiscalizacion";
      const rowData = [
        formData.canalIngreso || "SADE FISCALIZACIÓN", // A: CANAL DE INGRESO
        formData.item || "",                          // B: IT.
        formData.noPlanilla || "",                    // C: No. PLANILLA
        formData.expediente || "",                    // D: No. EXPEDIENTE
        formData.actoAdministrativo || "",            // E: ACTO ADMINISTRATIVO
        formData.fechaPlanillaIngreso || "",          // F: FECHA PLANILLA INGRESO
        formData.noActoSade || "",                    // G: No. ACTO ADMINISTRATIVO Y No. SADE
        formData.fechaActo || "",                     // H: FECHA ACTO
        formData.proceso || "",                       // I: PROCESO
        formData.identificacion || "",                // J: No. DE IDENTIFICACION
        formData.contribuyente || "",                 // K: CONTRIBUYENTE
        formData.impuesto || "",                      // L: IMPUESTO
        formData.tipoRenta || "",                     // M: TIPO DE RENTA
        formData.tipoTramite || "",                   // N: TIPO DE TRAMITE
        formData.itemDetalle || "",                   // O: ITEM
        formData.tipoExtra || "",                     // P: TIPO
        formData.direccion || "",                     // Q: DIRECCION
        formData.ciudad || "",                        // R: CIUDAD
        formData.periodo || "",                       // S: PERIODO (mes)
        formData.vigencia || "",                      // T: VIGENCIA (año)
        formData.fechaVencimientoInput || "",         // U: FECHA VENCIMIENTO
        formData.capital || "",                       // V: CAPITAL
        formData.sancion || "",                       // W: SANCION
        formData.funcionarioEncargado || "",          // X: FUNCIONARIO ENCARGADO
        formData.ubicacion || "",                     // Y: UBICACION
        formData.observaciones || "",                 // Z: OBSERVACIONES
        formData.estadoProceso || "",                 // AA: ESTADO DEL PROCESO
        "",                                           // AB (Fórmula)
        formData.resolucionSadeSalida || "",          // AC: RESOLUCION/SADE SALIDA
        formData.fechaResolucionSade || "",           // AD: FECHA RESOLUCION/SADE
        formData.numeroPlanilla || "",                // AE: NUMERO DE PLANILLA
        formData.fechaPlanilla || "",                 // AF: FECHA PLANILLA
        formData.fechaEjecutoria || "",               // AG: FECHA EJECUTORIA
        "",                                           // AH (Fórmula)
        formData.dependencia || "",                   // AI: DEPENDENCIA
        formData.tipoRespuesta || "",                 // AJ: TIPO DE RESPUESTA
        "", "", "", "", "", "", "", "",               // AK a AR: Fórmulas
        formData.ingresoExtra || "",                  // AS: INGRESO
        formData.recursoArchivo || "",                // AT: RECURSO O ARCHIVO
        formData.procesoAu || "",                     // AU: PROCESO
        formData.resolucionSadeAv || "",              // AV: RESOLUCION/SADE
        formData.fechaAw || "",                       // AW: FECHA
        formData.planilaAx || "",                     // AX: PLANILLA
        formData.fechaPlanillaAy || "",               // AY: FECHA PLANILLA
        formData.procesoFinal || ""                   // AZ: PROCESO FINAL
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(sheetName, `A${rowNumber}:AZ${rowNumber}`, rowData);
        toast.success("¡Registro actualizado exitosamente!");
      } else {
        await appendToSheet(sheetName, rowData);
        toast.success("¡Nuevo registro guardado exitosamente!");
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
    const matchesStatus = statusFilter === "ALL" || item.actoAdministrativo === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Base Traslados Fiscalización</h1>
          <p className="text-sm text-gray-500">Gestión completa de planillas, actos y control tributario</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" className="border-slate-300">
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
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-56 bg-white h-9">
              <SelectValue placeholder="Filtrar por acto administrativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los actos</SelectItem>
              {actosAdministrativos.map(act => <SelectItem key={act} value={act}>{act}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-3">Planilla</th>
                <th className="p-3">Expediente</th>
                <th className="p-3">Acto Administrativo</th>
                <th className="p-3">Contribuyente</th>
                <th className="p-3">Vigencia</th>
                <th className="p-3">Funcionario</th>
                <th className="p-3">Ubicación</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">Cargando registros...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">No se encontraron registros con los filtros aplicados.</td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const keys = Object.keys(item);
                  return (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-medium text-slate-900">{item[keys[2]] || ""}</td>
                      <td className="p-3 text-slate-600">{item[keys[3]] || ""}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                          {item[keys[4]] || ""}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{item[keys[10]] || ""}</td>
                      <td className="p-3 text-slate-600">{item[keys[19]] || ""}</td>
                      <td className="p-3 text-slate-600">{item[keys[23]] || ""}</td>
                      <td className="p-3 text-slate-600 font-semibold">{item[keys[24]] || ""}</td>
                      <td className="p-3 text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); reset(item); setIsDialogOpen(true); }}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span>Mostrando {filteredData.length} de {data.length} registros</span>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* Ancho ampliado a max-w-5xl idéntico al de Nexura para solucionar el problema visual de estrechez */}
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>{editingItem ? "Editar Registro Completo - Traslados" : "Nuevo Registro - Base Traslados Fiscalización"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">Canal de Ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.canalIngreso || "SADE FISCALIZACIÓN"}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{canalesIngreso.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Item (IT.)</Label><Input {...register("item")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Planilla</Label><Input {...register("noPlanilla")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Expediente</Label><Input {...register("expediente")} className="bg-white h-8" /></div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Acto Administrativo</Label>
                <Select onValueChange={(v) => setValue("actoAdministrativo", v)} defaultValue={editingItem?.actoAdministrativo}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{actosAdministrativos.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Planilla Ingreso</Label><Input {...register("fechaPlanillaIngreso")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Acto y No. SADE</Label><Input {...register("noActoSade")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Acto</Label><Input {...register("fechaActo")} type="date" className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Proceso</Label>
                <Select onValueChange={(v) => setValue("proceso", v)} defaultValue={editingItem?.proceso}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{procesos.map(pr => <SelectItem key={pr} value={pr}>{pr}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">No. Identificación</Label><Input {...register("identificacion")} className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Contribuyente</Label><Input {...register("contribuyente")} className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Impuesto</Label>
                <Select onValueChange={(v) => setValue("impuesto", v)} defaultValue={editingItem?.impuesto}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{impuestos.map(imp => <SelectItem key={imp} value={imp}>{imp}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Tipo de Renta</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)} defaultValue={editingItem?.tipoRenta}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Tipo de Trámite</Label><Input {...register("tipoTramite")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Dirección</Label><Input {...register("direccion")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Ciudad</Label><Input {...register("ciudad")} className="bg-white h-8" /></div>

              <div className="space-y-1"><Label className="text-xs font-bold">Periodo (mes)</Label><Input {...register("periodo")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Vigencia (año)</Label><Input {...register("vigencia")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Vencimiento</Label><Input {...register("fechaVencimientoInput")} type="date" className="bg-white h-8" /></div>

              <div className="space-y-1"><Label className="text-xs font-bold">Capital</Label><Input {...register("capital")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Sanción</Label><Input {...register("sancion")} className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.funcionarioEncargado}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Ubicación</Label>
                <Select onValueChange={(v) => setValue("ubicacion", v)} defaultValue={editingItem?.ubicacion}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{ubicaciones.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Resolución / SADE Salida</Label><Input {...register("resolucionSadeSalida")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Resolución / SADE</Label><Input {...register("fechaResolucionSade")} type="date" className="bg-white h-8" /></div>

              <div className="space-y-1"><Label className="text-xs font-bold">Número de Planilla</Label><Input {...register("numeroPlanilla")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Planilla</Label><Input {...register("fechaPlanilla")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Ejecutoria</Label><Input {...register("fechaEjecutoria")} type="date" className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Dependencia</Label>
                <Select onValueChange={(v) => setValue("dependencia", v)} defaultValue={editingItem?.dependencia}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{dependencias.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Recurso o Archivo</Label>
                <Select onValueChange={(v) => setValue("recursoArchivo", v)} defaultValue={editingItem?.recursoArchivo}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{recursosArchivo.map(ra => <SelectItem key={ra} value={ra}>{ra}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Proceso Final</Label><Input {...register("procesoFinal")} className="bg-white h-8" /></div>

              <div className="space-y-1 md:col-span-3">
                <Label className="text-xs font-bold">Observaciones</Label>
                <Input {...register("observaciones")} className="bg-white h-8" />
              </div>

            </div>

            <Button type="submit" className="w-full bg-slate-900 py-5 text-lg font-bold text-white hover:bg-black">
              <Save className="mr-2 h-5 w-5" /> Guardar Registro Completo
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
