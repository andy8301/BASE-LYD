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
    } catch (error) { toast.error("Error de sincronización"); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // MAPEACIÓN ESTRICTA A GOOGLE SHEETS (Columnas A a AR)
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J
        "", // K (MES - FÓRMULA EXCEL)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", // L, M, N
        formData.ciudadDepartamento || "", formData.observaciones || "", formData.funcionarioEncargado || "", // O, P, Q
        formData.nota || "", formData.fechaRecibido || "", formData.tipoRenta || "", // R, S, T
        formData.tipoTramite || "", formData.item || "", formData.tipoRentaOtro || "", // U, V, W
        formData.prelacionLegal || "", formData.baseFuncionario1ra || "", formData.numeroResolucion || "", // X, Y, Z
        formData.numeroSadeSalida || "", formData.fechaResolucionSadeSalida || "", // AA, AB
        formData.tipoRespuesta || "", formData.noPlanillaSalida || "", formData.fechaDePlanillaSalida || "", // AC, AD, AE
        formData.fechaEjecutoria || "", formData.traslado || "", // AF, AG
        formData.observacionAH || "", // AH
        formData.baseFuncionario2da || "", // AI
        formData.numResolFinal || "", // AJ
        formData.numSadeFinal || "", // AK
        formData.fechaFinalAL || "", // AL
        formData.numPlanillaAM || "", // AM
        formData.fechaPlanillaAN || "", // AN
        formData.fechaEjecutoriaAO || "", // AO
        formData.trasladoAP || "", // AP
        formData.tipoRespAQ || "", // AQ
        formData.baseFunc3ra || "" // AR
      ];

      const range = `A${editingItem ? editingItem.id.replace('row-', '') : data.length + 2}:AR${editingItem ? editingItem.id.replace('row-', '') : data.length + 2}`;
      
      if (editingItem) {
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, range, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      reset();
      toast.success("Expediente actualizado hasta la columna AR");
    } catch (error) { toast.error("Error al guardar"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Traza Rentas - Base Olga</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}><RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Sincronizar</Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-700 hover:bg-blue-800"><Plus className="mr-2 h-4 w-4" /> Nuevo Registro</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">Gestión de Expediente Completo (B - AR)</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* BLOQUE 1: RADICACIÓN (B-J) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">No consecutivo (B)</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. EXPEDIENTE (F)</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-700">FECHA ACTO (J)</Label><Input {...register("fechaActo")} className="bg-white h-9 border-blue-300" /></div>
            </div>

            {/* BLOQUE 2: CONTRIBUYENTE (L-T) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">2. Contribuyente y Renta</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">CONTRIBUYENTE (N)</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FUNCIONARIO (Q)</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-700">NOTA: (R)</Label><Input {...register("nota")} className="bg-white h-9 border-green-300" /></div>
            </div>

            {/* BLOQUE 3: CLASIFICACIÓN (U-AG) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">3. Clasificación y Respuesta</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">ITEM (V)</Label><Input {...register("item")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">FECHA EJECUTORIA (AF)</Label><Input {...register("fechaEjecutoria")} className="bg-white h-9 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">TRASLADO (AG)</Label><Input {...register("traslado")} className="bg-white h-9" /></div>
            </div>

            {/* BLOQUE NUEVO: AH A AR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200 pb-1 text-sm">4. Segunda y Tercera Instancia (AH - AR)</h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">OBSERVACION (AH)</Label>
                <Input {...register("observacionAH")} className="bg-white h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">BASE FUNCIONARIO 2DA (AI)</Label>
                <Input {...register("baseFuncionario2da")} className="bg-white h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">No. RESOLUCION FINAL (AJ)</Label>
                <Input {...register("numResolFinal")} className="bg-white h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">No. SADE FINAL (AK)</Label>
                <Input {...register("numSadeFinal")} className="bg-white h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FECHA FINAL (AL)</Label>
                <Input {...register("fechaFinalAL")} className="bg-white h-9" placeholder="DD/MM/AAAA" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">No. PLANILLA (AM)</Label>
                <Input {...register("numPlanillaAM")} className="bg-white h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FECHA PLANILLA (AN)</Label>
                <Input {...register("fechaPlanillaAN")} className="bg-white h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FECHA EJECUTORIA (AO)</Label>
                <Input {...register("fechaEjecutoriaAO")} className="bg-white h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO RESPUESTA (AQ)</Label>
                <Select onValueChange={(v) => setValue("tipoRespAQ", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">BASE FUNCIONARIO 3RA (AR)</Label>
                <Input {...register("baseFunc3ra")} className="bg-white h-9 border-purple-200" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold text-white hover:bg-black transition-colors">
              <Save className="mr-2 h-6 w-6" /> Guardar Todo en Sheets
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
