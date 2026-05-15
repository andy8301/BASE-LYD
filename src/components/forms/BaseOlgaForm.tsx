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
    } catch (error) { toast.error("Error de carga"); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // MAPEACIÓN EXACTA PARA QUE CADA DATO CAIGA EN SU COLUMNA (A a BD)
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J
        "", // K (MES - FÓRMULA)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", // L, M, N
        formData.ciudadDepartamento || "", formData.observaciones || "", formData.funcionarioEncargado || "", // O, P, Q
        formData.nota || "", formData.fechaRecibido || "", formData.tipoRenta || "", // R, S, T
        formData.tipoTramite || "", formData.item || "", formData.tipoRentaOtro || "", // U, V, W
        formData.prelacionLegal || "", formData.baseFuncionario1ra || "", formData.numeroResolucion || "", // X, Y, Z
        formData.numeroSadeSalida || "", formData.fechaResolucionSadeSalida || "", // AA, AB
        formData.tipoRespuesta || "", formData.noPlanillaSalida || "", formData.fechaDePlanillaSalida || "", // AC, AD, AE
        formData.fechaEjecutoria || "", formData.traslado || "", // AF, AG
        formData.observacionAH || "", // AH
        formData.baseFunc2daAI || "", // AI
        formData.numResolucionAJ || "", // AJ
        formData.numSadeAK || "", // AK
        formData.fechaResolucionAL || "", // AL
        formData.numPlanillaAM || "", // AM
        formData.fechaPlanillaAN || "", // AN
        formData.fechaEjecutoriaAO || "", // AO
        formData.trasladoAP || "", // AP
        formData.tipoRespuestaAQ || "", // AQ
        formData.baseFunc3raAR || "", // AR
        ...Array(11).fill(""), // AS a BC (Celdas vacías/intermedias)
        formData.fechaVencimientoBD || "" // BD
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:BD${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Expediente guardado hasta la columna BD!");
    } catch (error) { toast.error("Error al guardar"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <h1 className="text-2xl font-bold">Base Olga - Traza Rentas</h1>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-2"><DialogTitle>Gestión de Expedientes (B a BD)</DialogTitle></DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* BLOQUES ANTERIORES (B-AG) - SE MANTIENEN IGUAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border">
              <h3 className="col-span-3 font-bold text-slate-700 border-b">1. Datos Básicos y Radicación</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Consecutivo (B)</Label><Input {...register("consecutivo")} className="h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Expediente (F)</Label><Input {...register("expediente")} className="h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-600">FECHA ACTO (J)</Label><Input {...register("fechaActo")} className="h-8 border-blue-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Contribuyente (N)</Label><Input {...register("contribuyente")} className="h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-600">NOTA: (R)</Label><Input {...register("nota")} className="h-8 border-green-200" /></div>
            </div>

            {/* BLOQUE NUEVO: AH A BD (SEGÚN TUS PANTALLAZOS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200">2. Instancias y Vencimientos (AH a BD)</h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">OBSERVACION (AH)</Label>
                <Input {...register("observacionAH")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">BASE FUNCIONARIO 2DA RESP (AI)</Label>
                <Input {...register("baseFunc2daAI")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">NUMERO DE RESOLUCION (AJ)</Label>
                <Input {...register("numResolucionAJ")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">NUMERO DE SADE (AK)</Label>
                <Input {...register("numSadeAK")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FECHA RESOLUCIÓN/SADE (AL)</Label>
                <Input {...register("fechaResolucionAL")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">No PLANILLA (AM)</Label>
                <Input {...register("numPlanillaAM")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FECHA PLANILLA (AN)</Label>
                <Input {...register("fechaPlanillaAN")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FECHA EJECUTORIA (AO)</Label>
                <Input {...register("fechaEjecutoriaAO")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TRASLADO (AP)</Label>
                <Input {...register("trasladoAP")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RESPUESTA (AQ)</Label>
                <Select onValueChange={(v) => setValue("tipoRespuestaAQ", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">BASE FUNCIONARIO 3RA RESP (AR)</Label>
                <Input {...register("baseFunc3raAR")} className="bg-white h-8 border-purple-200" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-red-700">FECHA DE VENCIMIENTO (BD)</Label>
                <Input {...register("fechaVencimientoBD")} className="bg-white h-8 border-red-200" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold text-white"><Save className="mr-2" /> Guardar Expediente</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
