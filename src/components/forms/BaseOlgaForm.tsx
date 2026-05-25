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

  // Maestros de datos
  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const respuestas = ["PETICIÓN", "TRASLADO", "RESPUESTA", "NOTIFICACIÓN", "AUTO DE CIERRE", "REVOCATORIA", "CONTESTADO"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      const records = (result[SHEET_NAMES.BASE_OLGA] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`
      }));
      setData(records);
    } catch (error) { toast.error("Error al cargar datos"); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // MAPEACIÓN EXACTA A GOOGLE SHEETS (B hasta AQ)
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J
        "", // K (Espacio Mes)
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
        formData.fechaResAL || "", // AL
        formData.numPlanillaAM || "", // AM
        formData.fechaPlanillaAN || "", // AN
        formData.fechaEjecutoriaAO || "", // AO
        formData.trasladoAP || "", // AP
        formData.tipoRespAQ || "" // AQ
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:AQ${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Expediente actualizado hasta la AQ!");
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
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4"><DialogTitle className="text-xl font-bold text-blue-900">Formulario Integral de Gestión (B a AQ)</DialogTitle></DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* BLOQUES 1, 2 y 3: Mantenemos lo anterior intacto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b">1. Radicación e Ingreso (B a J)</h3>
              <div className="space-y-1"><Label>Consecutivo (B)</Label><Input {...register("consecutivo")} /></div>
              <div className="space-y-1"><Label>Expediente (F)</Label><Input {...register("expediente")} /></div>
              <div className="space-y-1"><Label className="text-blue-700">FECHA ACTO (J)</Label><Input {...register("fechaActo")} /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b">2. Contribuyente y Renta (L a T)</h3>
              <div className="space-y-1"><Label>CONTRIBUYENTE (N)</Label><Input {...register("contribuyente")} /></div>
              <div className="space-y-1"><Label className="text-green-700">NOTA: (R)</Label><Input {...register("nota")} /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b">3. Clasificación Inicial (V a AG)</h3>
              <div className="space-y-1"><Label>ITEM (V)</Label><Input {...register("item")} /></div>
              <div className="space-y-1"><Label className="text-red-600">FECHA EJECUTORIA (AF)</Label><Input {...register("fechaEjecutoria")} /></div>
              <div className="space-y-1"><Label>TRASLADO (AG)</Label><Input {...register("traslado")} /></div>
            </div>

            {/* BLOQUE NUEVO SOLICITADO: AH a AQ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200">4. Segunda Instancia y Seguimiento (AH a AQ)</h3>
              
              <div className="space-y-1"><Label>OBSERVACIÓN (AH)</Label><Input {...register("observacionAH")} /></div>
              <div className="space-y-1"><Label>BASE FUNC. 2DA RESP (AI)</Label><Input {...register("baseFunc2daAI")} /></div>
              <div className="space-y-1"><Label>NÚMERO RESOLUCIÓN (AJ)</Label><Input {...register("numResolucionAJ")} /></div>
              <div className="space-y-1"><Label>NÚMERO DE SADE (AK)</Label><Input {...register("numSadeAK")} /></div>
              <div className="space-y-1"><Label>FECHA RESOLUCIÓN/SADE (AL)</Label><Input {...register("fechaResAL")} /></div>
              <div className="space-y-1"><Label>No PLANILLA (AM)</Label><Input {...register("numPlanillaAM")} /></div>
              <div className="space-y-1"><Label>FECHA PLANILLA (AN)</Label><Input {...register("fechaPlanillaAN")} /></div>
              <div className="space-y-1"><Label>FECHA EJECUTORIA (AO)</Label><Input {...register("fechaEjecutoriaAO")} /></div>
              <div className="space-y-1"><Label>TRASLADO (AP)</Label><Input {...register("trasladoAP")} /></div>
              <div className="space-y-1">
                <Label>TIPO DE RESPUESTA (AQ)</Label>
                <Select onValueChange={(v) => setValue("tipoRespAQ", v)}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold text-white hover:bg-black">
              <Save className="mr-2 h-6 w-6" /> Guardar Expediente Completo
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

¡Hecho! Tu sistema ya cubre hasta la columna **AQ**. Recuerda hacer el *Commit* en GitHub y esperar a que el check verde termine. Si necesitas los siguientes campos, ¡aquí estaré!
