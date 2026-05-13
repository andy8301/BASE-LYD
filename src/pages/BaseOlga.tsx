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

  // Listados Maestros actualizados
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const respuestas = ["PETICION", "TRASLADO", "RESPUESTA", "NOTIFICACIÓN", "AUTO DE CIERRE", "REVOCATORIA", "CONTESTADO", "PENDIENTE"];

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
      // Mapeo EXACTO por columnas A hasta BJ según image_58380a.png
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
        formData.fechaEjecutoria || "", formData.traslado || "", formData.observacionFinal || "", // AF, AG, AH
        formData.baseFuncionario2da || "", formData.numeroDeResolucionFinal || "", // AI, AJ
        formData.numeroDeSadeFinal || "", formData.fechaResolucionSadeFinal || "", // AK, AL
        formData.noPlanillaAM || "", formData.fechaPlanillaAN || "", formData.fechaEjecutoriaAO || "", // AM, AN, AO
        formData.trasladoAP || "", formData.tipoRespuestaAQ || "", formData.baseFuncionario3raAR || "", // AP, AQ, AR
        ...Array(11).fill(""), // Columnas AS a BC (Libres)
        formData.fechaVencimientoBD || "", "", "", // BD, BE (Fórmula), BF (Fórmula)
        "", // BG (Fórmula)
        "", // BH (SEMAFORO EXPEDIENTES - FÓRMULA)
        formData.anoIngresoBI || new Date().getFullYear(), // BI (AÑO INGRESO)
        "TRUE" // BJ (ES FORMULA)
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:BJ${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Registro completo guardado hasta la columna BJ!");
    } catch (error) { toast.error("Error al guardar"); }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Base Olga - Sistema de Control</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}><RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualizar</Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-700 hover:bg-blue-800 text-white font-bold"><Plus className="mr-2 h-4 w-4" /> Nuevo Registro</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4"><DialogTitle className="text-xl font-bold text-blue-900">Formulario Integral de Procesos (B a BJ)</DialogTitle></DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            {/* BLOQUES ANTERIORES YA CONFIGURADOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="col-span-3 font-bold text-slate-700 border-b border-slate-300">Resumen Identificación</h3>
                <div className="space-y-1"><Label className="text-xs font-bold">Consecutivo (B)</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
                <div className="space-y-1"><Label className="text-xs font-bold">Contribuyente (N)</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
                <div className="space-y-1"><Label className="text-xs font-bold">Expediente (F)</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
            </div>

            {/* ÚLTIMO BLOQUE: CONTROL Y CIERRE (BH a BJ) - Según image_58380a.png */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-yellow-50/50 rounded-lg border border-yellow-200">
              <h3 className="col-span-3 font-bold text-yellow-800 border-b border-yellow-300 pb-1">4. Control Final y Auditoría (BH a BJ)</h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold text-yellow-900">SEMAFORO EXPEDIENTES (BH)</Label>
                <Input disabled placeholder="Automático" className="bg-slate-100 h-9 border-dashed" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-yellow-900">AÑO INGRESO (BI)</Label>
                <Input {...register("anoIngresoBI")} type="number" defaultValue={new Date().getFullYear()} className="bg-white h-9" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-yellow-900">ES FORMULA (BJ)</Label>
                <Select onValueChange={(v) => setValue("esFormulaBJ", v)} defaultValue="TRUE">
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRUE">TRUE</SelectItem>
                    <SelectItem value="FALSE">FALSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold text-white hover:bg-black transition-colors"><Save className="mr-2 h-6 w-6" /> Guardar Expediente Completo</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
