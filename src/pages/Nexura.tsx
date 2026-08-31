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
  const canalesIngreso = ["NEXURA", "VENTANILLA", "CORREO ELECTRÓNICO", "SADE", "OFICIO"];
  const tiposRenta = ["IMPUESTO DE REGISTRO", "VEHICULOS", "DEGUELLO", "LOTERIAS", "ESTAMPILLAS", "OTRO"];
  const tiposTramite = ["PETICIÓN", "RECONSIDERACIÓN", "REVOCATORIA", "TRASLADO", "REQUERIMIENTO"];
  const prelacionOpciones = ["SÍ", "NO", "URGENTE", "PRIORITARIO"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet("Base Nexura"); 
      const records = (result["Base Nexura"] || []).map((row: any, i: number) => ({
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
        formData.canalIngreso || "NEXURA",    // A: Canal de Ingreso
        "",                                   // B: Mes (Fórmula automática)
        formData.radicado || "",              // C: Radicado / Consecutivo
        formData.fechaRadicacion || "",       // D: Fecha de Radicación
        formData.contribuyente || "",         // E: Contribuyente o Solicitante
        formData.identificacion || "",        // F: Identificación / NIT
        formData.placa || "",                 // G: Placa
        formData.tipoRenta || "",             // H: Tipo de Renta
        formData.tipoTramite || "",           // I: Tipo de Trámite
        formData.funcionario || "",           // J: Funcionario Asignado
        formData.fechaAsignacion || "",       // K: Fecha de Asignación
        formData.estado || "",                // L: Estado del Trámite
        formData.fechaVencimiento || "",      // M: Fecha de Vencimiento
        formData.observaciones || "",         // N: Observaciones
        formData.sadeSalida || ""             // O: SADE de Salida
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow("Base Nexura", `A${rowNumber}:O${rowNumber}`, rowData);
      } else {
        await appendToSheet("Base Nexura", rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Registro de Nexura guardado exitosamente!");
    } catch (error) { toast.error("Error al guardar en Sheets"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold">Módulo Base Nexura</h1>
          <p className="text-sm text-gray-500">Gestión de PQRSD, radicación y control de trámites</p>
        </div>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Formulario de Registro - Base Nexura</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* 1. Datos de Radicación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Datos de Radicación</h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">Canal de Ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue="NEXURA">
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{canalesIngreso.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">No. Radicado</Label><Input {...register("radicado")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Radicación</Label><Input {...register("fechaRadicacion")} type="date" className="bg-white h-8" /></div>
            </div>

            {/* 2. Información del Contribuyente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <h3 className="col-span-3 font-bold text-indigo-800 border-b border-indigo-200 pb-1 text-sm">2. Contribuyente y Renta</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Contribuyente o Solicitante</Label><Input {...register("contribuyente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Identificación / NIT</Label><Input {...register("identificacion")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Placa</Label><Input {...register("placa")} className="bg-white h-8" /></div>

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
            </div>

            {/* 3. Asignación y Gestión */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">3. Asignación y Control</h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionario", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Asignación</Label><Input {...register("fechaAsignacion")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">Fecha de Vencimiento</Label><Input {...register("fechaVencimiento")} type="date" className="bg-white h-8 border-red-200" /></div>
              
              <div className="space-y-1"><Label className="text-xs font-bold">Estado del Trámite</Label><Input {...register("estado")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">SADE de Salida</Label><Input {...register("sadeSalida")} className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-3"><Label className="text-xs font-bold">Observaciones</Label><Input {...register("observaciones")} className="bg-white h-8" /></div>
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
