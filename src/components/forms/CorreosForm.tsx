import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

export default function CorreosForm() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const estados = ["RECIBIDO", "EN TRÁMITE", "TRASLADADO", "CONTESTADO", "CERRADO"];
  const clasesCorrespondencia = ["PETICIÓN", "TUTELA", "NOTIFICACIÓN", "SOLICITUD DE INFORMACIÓN", "OTRO"];

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
        "", // A - ID / Marca de tiempo
        formData.radicado || "",          // B
        formData.canalIngreso || "CORREO ELECTRÓNICO", // C
        formData.claseCorrespondencia || "", // D
        formData.fechaRecepcion || "",    // E
        formData.mes || "",               // F (Fórmula si se requiere)
        formData.remitente || "",         // G
        formData.correoDe || "",          // H
        formData.asunto || "",            // I
        formData.funcionario || "",       // J
        formData.estado || "",            // K
        formData.fechaVencimiento || "",  // L
        formData.observaciones || "",     // M
        formData.sadeSalida || ""         // N
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow("BASE CORREOS ELECTRONICOS", `A${rowNumber}:N${rowNumber}`, rowData);
      } else {
        await appendToSheet("BASE CORREOS ELECTRONICOS", rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Registro guardado exitosamente!");
    } catch (error) { toast.error("Error al guardar en Sheets"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold">Módulo de Correos Electrónicos</h1>
          <p className="text-sm text-gray-500">Gestión de correspondencia y asignación de SADE</p>
        </div>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Formulario de Registro de Correo</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* 1. Datos de Ingreso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-1 md:col-span-2 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Datos de Ingreso y Clasificación</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Radicado / Consecutivo</Label><Input {...register("radicado")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Recepción</Label><Input {...register("fechaRecepcion")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Canal de Ingreso</Label><Input {...register("canalIngreso")} defaultValue="CORREO ELECTRÓNICO" className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Clase de Correspondencia</Label>
                <Select onValueChange={(v) => setValue("claseCorrespondencia", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{clasesCorrespondencia.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* 2. Información del Remitente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <h3 className="col-span-1 md:col-span-2 font-bold text-indigo-800 border-b border-indigo-200 pb-1 text-sm">2. Información del Remitente</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Remitente / Contribuyente</Label><Input {...register("remitente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Correo Electrónico (De:)</Label><Input {...register("correoDe")} type="email" className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Asunto</Label><Input {...register("asunto")} className="bg-white h-8" /></div>
            </div>

            {/* 3. Gestión, Asignación y Vencimientos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-1 md:col-span-2 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">3. Asignación y Gestión</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Funcionario Asignado</Label>
                <Select onValueChange={(v) => setValue("funcionario", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Estado del Trámite</Label>
                <Select onValueChange={(v) => setValue("estado", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{estados.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">Fecha de Vencimiento</Label><Input {...register("fechaVencimiento")} type="date" className="bg-white h-8 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">SADE de Salida / Respuesta</Label><Input {...register("sadeSalida")} className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Observaciones del Paso</Label><Input {...register("observaciones")} className="bg-white h-8" /></div>
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
