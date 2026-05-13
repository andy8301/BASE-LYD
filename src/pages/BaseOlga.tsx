import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

export default function BaseOlga() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  // Listados Maestros
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const tiposRenta = ["IMPUESTO SOBRE VEHICULOS", "IMPUESTO DE REGISTRO", "IMPUESTO AL CONSUMO", "IMPUESTO DE DEGUELLO", "TASA DE SEGURIDAD", "ESTAMPILLA", "APREHENCIÓN Y DECOMISO DE MERCANCIAS", "PASAPORTE", "OTROS", "NO TRIBUTARIO", "IMPUESTO TASA DE GASOLINA"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      setData(result[SHEET_NAMES.BASE_OLGA] || []);
    } catch (error) {
      toast.error("Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // Mapeo Letra por Letra (B a AG)
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J
        "", // K (MES - FÓRMULA)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", // L, M, N
        formData.ciudadDepartamento || "", formData.observaciones || "", formData.funcionarioEncargado || "", // O, P, Q
        formData.nota || "", formData.fechaRecibido || "", formData.tipoRenta || "" // R, S, T
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:T${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("Guardado correctamente");
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <h1 className="text-2xl font-bold">Base Olga</h1>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-800">Detalle del Expediente (B a T)</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            {/* BLOQUE 1: B a J */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-700">1. Radicación e Ingreso (B-J)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">No consecutivo</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Canal de ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)}><SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger><SelectContent><SelectItem value="SADE">SADE</SelectItem><SelectItem value="NEXURA">NEXURA</SelectItem><SelectItem value="Correo electrónico">Correo</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">Area Remitente</Label><Input {...register("areaRemitente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. PLANILLA</Label><Input {...register("planilla")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. EXPEDIENTE</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Radicacion</Label><Input {...register("fechaRadicacion")} className="bg-white h-9" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold">ACTO ADMINISTRA-TIVO</Label><Input {...register("actoAdministrativo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-[10px]">No. ACTO / SADE</Label><Input {...register("numeroActo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA ACTO</Label><Input {...register("fechaActo")} className="bg-white h-9" /></div>
            </div>

            {/* BLOQUE 2: L a T (Saltando K) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-700">2. Información del Contribuyente y Renta (L-T)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">PLACA</Label><Input {...register("placa")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. DE IDENTIFICACION</Label><Input {...register("identificacion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">CONTRIBUYENTE</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">CIUDAD-DEPARTAMENTO</Label><Input {...register("ciudadDepartamento")} className="bg-white h-9" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold">OBSERVACIONES</Label><Input {...register("observaciones")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-[10px]">FUNCIONARIO ENCARGADO</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}><SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger><SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold text-[10px]">NOTA:</Label><Input {...register("nota")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-[10px]">FECHA DE RECIBIDO</Label><Input {...register("fechaRecibido")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-[10px]">TIPO DE RENTA</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)}><SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger><SelectContent>{tiposRenta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-lg font-bold"><Save className="mr-2" /> Guardar Todo en Google Sheets</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
