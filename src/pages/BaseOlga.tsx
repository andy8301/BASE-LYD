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
  const respuestas = ["PETICION", "TRASLADO", "RESPUESTA", "NOTIFICACIÓN", "AUTO DE CIERRE", "REVOCATORIA", "CONTESTADO"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      const records = (result[SHEET_NAMES.BASE_OLGA] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`
      }));
      setData(records);
    } catch (error) { toast.error("Error al sincronizar"); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // Mapeo EXACTO por columnas A hasta BG basado en image_584314.png
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J
        "", // K (MES)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", // L, M, N
        formData.ciudadDepartamento || "", formData.observaciones || "", formData.funcionarioEncargado || "", // O, P, Q
        formData.nota || "", formData.fechaRecibido || "", formData.tipoRenta || "", // R, S, T
        formData.tipoTramite || "", formData.item || "", formData.tipoRentaOtro || "", // U, V, W
        formData.prelacionLegal || "", formData.baseFuncionario1ra || "", formData.numeroResolucion || "", // X, Y, Z
        formData.numeroSadeSalida || "", formData.fechaResolucionSadeSalida || "", // AA, AB
        formData.tipoRespuesta || "", formData.noPlanillaSalida || "", formData.fechaDePlanillaSalida || "", // AC, AD, AE
        formData.fechaEjecutoria || "", formData.traslado || "", formData.observacionFinal || "", // AF, AG, AH
        formData.baseFuncionario2da || "", formData.numeroDeResolucionFinal || "", // AI, AJ
        formData.numeroDeSadeFinal || "", formData.fechaResolucionSadeFinal || "", // AK, AL
        formData.noPlanillaAM || "", formData.fechaPlanillaAN || "", formData.fechaEjecutoriaAO || "", // AM, AN, AO
        formData.trasladoAP || "", formData.tipoRespuestaAQ || "", formData.baseFuncionario3raAR || "", // AP, AQ, AR
        ...Array(11).fill(""), // Columnas AS a BC (Libres/Ocultas)
        formData.fechaVencimientoBD || "", "", "", // BD, BE (Fórmula), BF (Fórmula)
        "" // BG (Fórmula)
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:BG${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("Expediente guardado hasta columna BG");
    } catch (error) { toast.error("Error al guardar"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <h1 className="text-2xl font-bold text-slate-800">Base Olga - Traza Rentas</h1>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">Gestión Integral (B a BG)</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* BLOQUE 1: RADICACIÓN (B-J) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-4 font-bold text-blue-800 border-b border-blue-200">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">No consecutivo (B)</Label><Input {...register("consecutivo")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">No. PLANILLA (E)</Label><Input {...register("planilla")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">No. EXPEDIENTE (F)</Label><Input {...register("expediente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">No. ACTO / SADE (I)</Label><Input {...register("numeroActo")} className="bg-white h-8" /></div>
            </div>

            {/* BLOQUE 2: SEGUIMIENTO TERCERA INSTANCIA (AM-AR) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200">2. Seguimiento y Tercera Instancia (AM a AR)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-purple-900">No PLANILLA (AM)</Label><Input {...register("noPlanillaAM")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-purple-900">FECHA PLANILLA (AN)</Label><Input {...register("fechaPlanillaAN")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-red-600">FECHA EJECUTORIA (AO)</Label><Input {...register("fechaEjecutoriaAO")} className="bg-white h-8 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-purple-900">TRASLADO (AP)</Label><Input {...register("trasladoAP")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold font-mono text-purple-900">TIPO DE RESPUESTA (AQ)</Label>
                <Select onValueChange={(v) => setValue("tipoRespuestaAQ", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-purple-900">BASE FUNCIONARIO 3RA RESP (AR)</Label><Input {...register("baseFuncionario3raAR")} className="bg-white h-8" /></div>
            </div>

            {/* BLOQUE 3: VENCIMIENTOS Y CONTROL (BD-BG) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-4 font-bold text-orange-800 border-b border-orange-200">3. Control de Vencimientos (BD a BG)</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold font-mono text-orange-900">FECHA DE VENCIMIENTO (BD)</Label>
                <Input {...register("fechaVencimientoBD")} className="bg-white h-8" placeholder="DD/MM/AAAA" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold font-mono text-slate-400 text-[10px]">DIAS PENDIENTES (BE)</Label>
                <Input disabled placeholder="Fórmula" className="bg-slate-100 h-8 border-dashed" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold font-mono text-slate-400 text-[10px]">SEMAFORO (BF)</Label>
                <Input disabled placeholder="Automático" className="bg-slate-100 h-8 border-dashed" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold font-mono text-slate-400 text-[10px]">DIAS TRANS-FECHA (BG)</Label>
                <Input disabled placeholder="Fórmula" className="bg-slate-100 h-8 border-dashed" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold"><Save className="mr-2" /> Guardar Todo en Google Sheets</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
