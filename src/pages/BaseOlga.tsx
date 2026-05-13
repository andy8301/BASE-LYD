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
      // MAPEACIÓN EXACTA A GOOGLE SHEETS (A a BJ)
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J
        "", // K (MES - FÓRMULA)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", // L, M, N
        formData.ciudadDepartamento || "", formData.observaciones || "", formData.funcionarioEncargado || "", // O, P, Q
        formData.nota || "", formData.fechaRecibido || "", formData.tipoRenta || "", // R, S, T
        formData.tipoTramite || "", // U
        formData.item || "", // V
        formData.tipoRentaOtro || "", // W
        formData.prelacionLegal || "", // X
        formData.baseFuncionario1ra || "", // Y
        formData.numeroResolucion || "", // Z
        formData.numeroSadeSalida || "", // AA
        formData.fechaResolucionSadeSalida || "", // AB
        formData.tipoRespuesta || "", // AC
        formData.noPlanillaSalida || "", // AD
        formData.fechaDePlanillaSalida || "", // AE
        formData.fechaEjecutoria || "", // AF
        formData.traslado || "", // AG
        formData.observacionFinal || "", // AH
        formData.baseFuncionario2da || "", // AI
        formData.numeroDeResolucionFinal || "", // AJ
        formData.numeroDeSadeFinal || "", // AK
        formData.fechaResolucionSadeFinal || "", // AL
        formData.noPlanillaAM || "", formData.fechaPlanillaAN || "", formData.fechaEjecutoriaAO || "", // AM, AN, AO
        formData.trasladoAP || "", formData.tipoRespuestaAQ || "", formData.baseFuncionario3raAR || "", // AP, AQ, AR
        ...Array(11).fill(""), // AS a BC
        formData.fechaVencimientoBD || "", "", "", "", // BD a BG
        "", formData.anoIngresoBI || "2026", "TRUE" // BH, BI, BJ
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:BJ${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("Expediente guardado correctamente");
    } catch (error) { toast.error("Error al guardar"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <h1 className="text-2xl font-bold">Traza Rentas - Base Olga</h1>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4"><DialogTitle className="text-xl font-bold text-blue-900">Formulario Completo de Gestión</DialogTitle></DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* 1. RADICACIÓN E INGRESO (B-J) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">No consecutivo (B)</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">No. PLANILLA (E)</Label><Input {...register("planilla")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">No. EXPEDIENTE (F)</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">No. ACTO / SADE (I)</Label><Input {...register("numeroActo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-blue-700">FECHA ACTO (J)</Label><Input {...register("fechaActo")} className="bg-white h-9 border-blue-200" /></div>
            </div>

            {/* 2. CONTRIBUYENTE (L-T) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200">2. Información del Contribuyente</h3>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">CONTRIBUYENTE (N)</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">OBSERVACIONES (P)</Label><Input {...register("observaciones")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">FUNCIONARIO (Q)</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-green-700">NOTA: (R)</Label><Input {...register("nota")} className="bg-white h-9 border-green-200" /></div>
            </div>

            {/* 3. CLASIFICACIÓN Y RESPUESTA (V-AG) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200">3. Clasificación y Respuesta (V a AG)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">ITEM (V)</Label><Input {...register("item")} className="bg-white h-9" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold font-mono text-[10px]">SI EL TIPO DE RENTA ES OTRO (W)</Label><Input {...register("tipoRentaOtro")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-[10px]">PRELACIÓN LEGAL (X)</Label><Input {...register("prelacionLegal")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-[10px]">BASE FUNCIONARIO 1RA RESP (Y)</Label><Input {...register("baseFuncionario1ra")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">FECHA RESOLUCION SALIDA (AB)</Label><Input {...register("fechaResolucionSadeSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">TIPO DE RESPUESTA (AC)</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-red-600">FECHA EJECUTORIA (AF)</Label><Input {...register("fechaEjecutoria")} className="bg-white h-9 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono text-[10px]">TRASLADO (AG)</Label><Input {...register("traslado")} className="bg-white h-9" /></div>
            </div>

            {/* 4. CONTROL FINAL (BI-BJ) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-yellow-50/50 rounded-lg border border-yellow-200">
              <h3 className="col-span-2 font-bold text-yellow-800 border-b border-yellow-300">4. Auditoría</h3>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">AÑO INGRESO (BI)</Label><Input {...register("anoIngresoBI")} defaultValue="2026" className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold font-mono">ES FORMULA (BJ)</Label>
                <Select onValueChange={(v) => setValue("esFormulaBJ", v)} defaultValue="TRUE">
                  <SelectTrigger className="bg-white h-9"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="TRUE">TRUE</SelectItem><SelectItem value="FALSE">FALSE</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold"><Save className="mr-2 h-6 w-6" /> Guardar Expediente Completo</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
