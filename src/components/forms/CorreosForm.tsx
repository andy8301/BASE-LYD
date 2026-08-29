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

export default function Correos() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  // Lista de funcionarios (la misma de Base Olga para mantener consistencia)
  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const estados = ["RECIBIDO", "EN TRÁMITE", "RESPONDIDO", "CERRADO"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Asegúrate de que SHEET_NAMES.CORREOS exista en tu archivo googleSheets.ts
      const result = await readSheet("CORREOS"); // Reemplaza "CORREOS" por la variable correcta si es diferente
      const records = (result["CORREOS"] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`
      }));
      setData(records);
    } catch (error) { toast.error("Error de carga"); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // ATENCIÓN: Aquí mapeamos los campos a las columnas de Google Sheets.
      // Ajusta el orden de este array para que coincida exactamente con las columnas de tu hoja "Correos".
      const rowData = [
        "", // A - ID o Timestamp automático
        formData.consecutivo || "",       // B
        formData.fechaRecepcion || "",    // C
        formData.canalIngreso || "Correo Electrónico", // D
        formData.contribuyente || "",     // E
        formData.correoRemitente || "",   // F
        formData.asunto || "",            // G
        formData.funcionarioEncargado || "", // H
        formData.estado || "",            // I
        formData.fechaRespuesta || "",    // J
        formData.observaciones || ""      // K
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow("CORREOS", `A${rowNumber}:K${rowNumber}`, rowData);
      } else {
        await appendToSheet("CORREOS", rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Correo registrado exitosamente!");
    } catch (error) { toast.error("Error al guardar"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Correos Electrónicos</h1>
          <p className="text-sm text-gray-500">Control y trazabilidad de correspondencia digital</p>
        </div>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Registrar Correo
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
              <h3 className="col-span-1 md:col-span-2 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Datos de Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Consecutivo</Label><Input {...register("consecutivo")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Recepción</Label><Input {...register("fechaRecepcion")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Canal de Ingreso</Label><Input {...register("canalIngreso")} defaultValue="Correo Electrónico" className="bg-white h-8" /></div>
            </div>

            {/* 2. Información del Remitente y Mensaje */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <h3 className="col-span-1 md:col-span-2 font-bold text-indigo-800 border-b border-indigo-200 pb-1 text-sm">2. Información del Remitente y Mensaje</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Contribuyente / Remitente</Label><Input {...register("contribuyente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Correo del Remitente</Label><Input {...register("correoRemitente")} type="email" className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Asunto del Correo</Label><Input {...register("asunto")} className="bg-white h-8" /></div>
            </div>

            {/* 3. Gestión y Asignación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-1 md:col-span-2 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">3. Gestión y Asignación</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione funcionario..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Estado</Label>
                <Select onValueChange={(v) => setValue("estado", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione estado..." /></SelectTrigger>
                  <SelectContent>{estados.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Respuesta (Si aplica)</Label><Input {...register("fechaRespuesta")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold">Observaciones</Label><Input {...register("observaciones")} className="bg-white h-8" /></div>
            </div>

            <Button type="submit" className="w-full bg-blue-700 py-6 text-xl font-bold text-white hover:bg-blue-900">
              <Save className="mr-2 h-6 w-6" /> Guardar Registro de Correo
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
