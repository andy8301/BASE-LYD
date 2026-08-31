import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow } from "@/lib/googleSheets";

export default function NexuraPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      const result = await readSheet("Base NEXURA"); 
      const records = (result["Base NEXURA"] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`
      }));
      setData(records);
    } catch (error) { toast.error("Error al cargar los datos"); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      const rowData = [
        "",                                         // A
        formData.baseInformeNexura || "NEXURA",     // B: NEXURA
        formData.numero || "",                      // C: No.
        formData.noRadicacion || "",                // D: No. radicación
        formData.noRadicacionExterno || "",         // E: No. radicación externo
        formData.secretaria || "",                  // F: Secretaría
        formData.tipoSolicitud || "",               // G: Tipo de solicitud
        formData.prioritaria || "NO",               // H: Prioritaria
        formData.canalIngreso || "",                // I: Canal de ingreso
        formData.tema || "",                        // J: Tema
        formData.condicionSolicitud || "",          // K: Condición de solicitud
        formData.responsable || "",                 // L: Responsable
        formData.fechaRegistro || "",               // M: Fecha de Registro
        formData.fechaIngreso || "",                // N: Fecha ingreso
        formData.fechaLimiteRespuesta || "",        // O: Fecha límite de respuesta
        formData.fechaRespuestaP || "",             // P: Fecha de respuesta a
        "", "", "", "",                             // Q, R, S, T: Fórmulas
        formData.tipoPersona || "",                 // U: Tipo de persona
        formData.nit || "",                         // V: Nit
        formData.digitoVerificacion || "",          // W: Dígito de verificación
        formData.tipoDocumento || "",               // X: Tipo de documento
        formData.numeroDocumento || "",             // Y: Número de documento
        "",                                         // Z: Duplicados
        formData.nombreSolicitante || "",           // AA: Nombre del solicitante
        formData.telefonoContacto || "",            // AB: Teléfono de contacto
        formData.email || "",                       // AC: Email
        "",                                         // AD: Término (Fórmula)
        formData.requerimiento || "",               // AE: Requerimiento
        formData.funcionarioEncargado || "",        // AF: FUNCIONARIO ENCARGADO
        formData.tipoRenta || "",                   // AG: TIPO DE RENTA
        formData.tipoTramite || "",                 // AH: TIPO DE TRAMITE
        formData.item || "",                        // AI: ITEM
        formData.tipoRentaOtro || "",               // AJ: SI EL TIPO DE RENTA ES OTRO
        formData.tipoRespuesta || "",               // AK: TIPO DE RESPUESTA
        formData.fechaRespuestaAL || "",            // AL: FECHA DE RESPUESTA
        formData.numeroSadeSalida || "",            // AM: NUMERO DE SADE DE SALIDA
        formData.prelacionLegal || "N/A"            // AN: PRELACIÓN LEGAL
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow("Base NEXURA", `A${rowNumber}:AN${rowNumber}`, rowData);
      } else {
        await appendToSheet("Base NEXURA", rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Registro de Base Nexura guardado exitosamente!");
    } catch (error) { toast.error("Error al guardar en Sheets"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold">Módulo Base NEXURA</h1>
          <p className="text-sm text-gray-500">Gestión estructurada y control de trazabilidad gerencial</p>
        </div>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Formulario de Registro - Base NEXURA</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* Seccion 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Radicación y Secretaría</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">NEXURA / Base</Label><Input {...register("baseInformeNexura")} defaultValue="NEXURA" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No.</Label><Input {...register("numero")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Radicación</Label><Input {...register("noRadicacion")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Radicación Externo</Label><Input {...register("noRadicacionExterno")} className="bg-white h-8" /></div>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">Secretaría</Label>
                <Select onValueChange={(v) => setValue("secretaria", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{secretarias.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Solicitud</Label>
                <Select onValueChange={(v) => setValue("tipoSolicitud", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposSolicitud.map(ts => <SelectItem key={ts} value={ts}>{ts}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Prioritaria</Label>
                <Select onValueChange={(v) => setValue("prioritaria", v)} defaultValue="NO">
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{prioritariaOpciones.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Seccion 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">2. Detalle y Trámite</h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">Canal de Ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{canalesIngreso.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Tema</Label><Input {...register("tema")} className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Condición de Solicitud</Label>
                <Select onValueChange={(v) => setValue("condicionSolicitud", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{condiciones.map(cond => <SelectItem key={cond} value={cond}>{cond}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Responsable / Funcionario</Label>
                <Select onValueChange={(v) => setValue("responsable", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Seccion 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">3. Fechas Principales de Control</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Registro</Label><Input {...register("fechaRegistro")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Ingreso</Label><Input {...register("fechaIngreso")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">Fecha Límite de Respuesta</Label><Input {...register("fechaLimiteRespuesta")} type="date" className="bg-white h-8 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Respuesta (Gestión)</Label><Input {...register("fechaRespuestaP")} type="date" className="bg-white h-8" /></div>
            </div>

            {/* Seccion 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <h3 className="col-span-3 font-bold text-indigo-800 border-b border-indigo-200 pb-1 text-sm">4. Datos del Solicitante</h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Persona</Label>
                <Select onValueChange={(v) => setValue("tipoPersona", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposPersona.map(tp => <SelectItem key={tp} value={tp}>{tp}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Nit</Label><Input {...register("nit")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Dígito de Verificación</Label><Input {...register("digitoVerificacion")} className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Documento</Label>
                <Select onValueChange={(v) => setValue("tipoDocumento", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposDocumento.map(td => <SelectItem key={td} value={td}>{td}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Número de Documento</Label><Input {...register("numeroDocumento")} className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Nombre del Solicitante</Label><Input {...register("nombreSolicitante")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Teléfono de Contacto</Label><Input {...register("telefonoContacto")} className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Email</Label><Input {...register("email")} type="email" className="bg-white h-8" /></div>
            </div>

            {/* Seccion 5 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200 pb-1 text-sm">5. Detalle Final y Cierre</h3>

              <div className="space-y-1"><Label className="text-xs font-bold">Requerimiento</Label><Input {...register("requerimiento")} className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Renta</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Trámite</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(tt => <SelectItem key={tt} value={tt}>{tt}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Item</Label><Input {...register("item")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Si es Otro (Renta)</Label><Input {...register("tipoRentaOtro")} className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Respuesta</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposRespuesta.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Respuesta</Label><Input {...register("fechaRespuestaAL")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. SADE de Salida</Label><Input {...register("numeroSadeSalida")} className="bg-white h-8" /></div>

              <div className="space-y-1 md:col-span-3">
                <Label className="text-xs font-bold text-purple-900">Prelación Legal</Label>
                <Select onValueChange={(v) => setValue("prelacionLegal", v)} defaultValue="N/A">
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
