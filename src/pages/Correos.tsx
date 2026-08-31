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

export default function CorreosPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const canalesIngreso = ["CORREO ELECTRÓNICO", "VENTANILLA", "OFICIO", "SADE", "FISCALIZACIÓN"];
  const tiposRenta = ["IMPUESTO DE REGISTRO", "VEHICULOS", "DEGUELLO", "LOTERIAS", "ESTAMPILLAS", "OTRO"];
  const tiposTramite = ["Derecho de Petición", "Copia boletín", "Recurso", "Solicitud"];
  const tiposRespuesta = ["RESPUESTA", "TRASLADO", "PETICIÓN", "NOTIFICACIÓN", "AUTO DE CIERRE"];
  const prelacionOpciones = ["SÍ", "NO", "URGENTE", "PRIORITARIO"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet("BASE CORREOS ELECTRONICOS"); 
      const records = (result["BASE CORREOS ELECTRONICOS"] || []).map((row: any, i: number) => ({
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
        formData.canalIngreso || "CORREO ELECTRÓNICO", // A: CANAL DE INGRESO
        "",                                           // B: MES (Fórmula)
        formData.fechaAsignacion || "",               // C: FECHA ASIGNACION
        formData.correoFuncionario || "",             // D: CORREO FUNCIONARIO
        formData.funcionario || "",                   // E: FUNCIONARIO ENCARGADO
        formData.asunto || "",                        // F: ASUNTO CORREO
        formData.fechaCorreo || "",                   // G: FECHA CORREO
        formData.contribuyente || "",                 // H: CONTRIBUYENTE
        formData.correoSolicitante || "",             // I: CORREO SOLICITANTE
        formData.tipoRenta || "",                     // J: TIPO DE RENTA
        formData.tipoRentaOtro || "",                 // K: TIPO RENTA OTRO
        formData.tipoTramite || "",                   // L: TIPO DE TRAMITE
        formData.item || "",                          // M: ITEM
        formData.placa || "",                         // N: PLACA
        formData.fechaRespuesta || "",                // O: FECHA RESPUESTA
        formData.tipoRespuesta || "",                 // P: TIPO DE RESPUESTA
        formData.noSadeSalida || "",                  // Q: No SADE SALIDA
        formData.observaciones || "",                 // R: OBSERVACIONES
        formData.prelacionLegal || "",                // S: PRELACION LEGAL
        formData.fechaVencimiento || ""               // T: FECHA DE VENCIMIENTO
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow("BASE CORREOS ELECTRONICOS", `A${rowNumber}:T${rowNumber}`, rowData);
      } else {
        await appendToSheet("BASE CORREOS ELECTRONICOS", rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Registro de correo guardado exitosamente!");
    } catch (error) { toast.error("Error al guardar en Sheets"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold">Módulo de Correos Electrónicos</h1>
          <p className="text-sm text-gray-500">Gestión completa de correspondencia y radicación</p>
        </div>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Formulario de Registro - BASE CORREOS ELECTRONICOS</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* 1. Ingreso y Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Ingreso y Fechas</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Canal de Ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue="CORREO ELECTRÓNICO">
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{canalesIngreso.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Asignación</Label><Input {...register("fechaAsignacion")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Correo</Label><Input {...register("fechaCorreo")} type="date" className="bg-white h-8" /></div>
            </div>

            {/* 2. Asignación de Funcionario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-1 md:col-span-2 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">2. Asignación de Funcionario</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionario", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">Correo Funcionario Encargado</Label><Input {...register("correoFuncionario")} type="email" className="bg-white h-8" /></div>
            </div>

            {/* 3. Solicitante y Detalle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <h3 className="col-span-1 md:col-span-2 font-bold text-indigo-800 border-b border-indigo-200 pb-1 text-sm">3. Solicitante y Detalle</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Contribuyente o Solicitante</Label><Input {...register("contribuyente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Correo Solicitante</Label><Input {...register("correoSolicitante")} type="email" className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Asunto Correo</Label><Input {...register("asunto")} className="bg-white h-8" /></div>
            </div>

            {/* 4. Clasificación, Trámite y Respuesta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">4. Clasificación, Trámite y Respuesta</h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Renta</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Si es Otro (Especificar)</Label><Input {...register("tipoRentaOtro")} className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Trámite</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(tt => <SelectItem key={tt} value={tt}>{tt}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Ítem</Label><Input {...register("item")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Placa</Label><Input {...register("placa")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Respuesta</Label><Input {...register("fechaRespuesta")} type="date" className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Respuesta</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{tiposRespuesta.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">No. de SADE de Salida</Label><Input {...register("noSadeSalida")} className="bg-white h-8" /></div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Prelación Legal</Label>
                <Select onValueChange={(v) => setValue("prelacionLegal", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{prelacionOpciones.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">Fecha de Vencimiento</Label><Input {...register("fechaVencimiento")} type="date" className="bg-white h-8 border-red-200" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Observaciones</Label><Input {...register("observaciones")} className="bg-white h-8" /></div>
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
