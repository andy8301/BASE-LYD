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
    } catch (error) { toast.error("Error de carga"); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J (CORREGIDO)
        "", // K (MES)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", // L, M, N
        formData.ciudadDepartamento || "", formData.observaciones || "", formData.funcionarioEncargado || "", // O, P, Q
        formData.nota || "", formData.fechaRecibido || "", formData.tipoRenta || "", // R, S, T (CORREGIDO R)
        formData.tipoTramite || "", formData.item || "", formData.tipoRentaOtro || "", // U, V, W
        formData.prelacionLegal || "", formData.baseFuncionario1ra || "", formData.numeroResolucion || "", // X, Y, Z
        formData.numeroSadeSalida || "", formData.fechaResolucionSadeSalida || "", // AA, AB
        formData.tipoRespuesta || "", formData.noPlanillaSalida || "", formData.fechaDePlanillaSalida || "", // AC, AD, AE
        formData.fechaEjecutoria || "", formData.traslado || "", formData.observacionFinal || "", // AF, AG, AH
        formData.baseFuncionario2da || "", formData.numeroDeResolucionFinal || "", // AI, AJ
        formData.numeroDeSadeFinal || "", formData.fechaResolucionSadeFinal || "", // AK, AL
        formData.noPlanillaAM || "", formData.fechaPlanillaAN || "", formData.fechaEjecutoriaAO || "", // AM, AN, AO
        formData.trasladoAP || "", formData.tipoRespuestaAQ || "", formData.baseFuncionario3raAR || "", // AP, AQ, AR
        ...Array(11).fill(""), // AS a BC
        formData.fechaVencimientoBD || "", "", "", "", // BD, BE, BF, BG
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
      toast.success("Guardado exitoso");
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-2"><DialogTitle>Formulario Completo (B a BJ)</DialogTitle></DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 pb-10">
            
            {/* BLOQUE 1: B-J */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200">1. Radicación e Ingreso (B a J)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Consecutivo (B)</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Canal (C)</Label><Select onValueChange={(v) => setValue("canalIngreso", v)}><SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger><SelectContent><SelectItem value="SADE">SADE</SelectItem><SelectItem value="NEXURA">NEXURA</SelectItem><SelectItem value="Correo">Correo</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Área (D)</Label><Input {...register("areaRemitente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Planilla (E)</Label><Input {...register("planilla")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Expediente (F)</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Rad (G)</Label><Input {...register("fechaRadicacion")} className="bg-white h-9" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold">Acto (H)</Label><Input {...register("actoAdministrativo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Acto/SADE (I)</Label><Input {...register("numeroActo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-700">FECHA ACTO (J)</Label><Input {...register("fechaActo")} className="bg-white h-9 border-blue-300" /></div>
            </div>

            {/* BLOQUE 2: L-T */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200">2. Contribuyente y Renta (L a T)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Placa (L)</Label><Input {...register("placa")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Identificación (M)</Label><Input {...register("identificacion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Contribuyente (N)</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Ciudad (O)</Label><Input {...register("ciudadDepartamento")} className="bg-white h-9" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold">Observaciones (P)</Label><Input {...register("observaciones")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Funcionario (Q)</Label><Select onValueChange={(v) => setValue("funcionarioEncargado", v)}><SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger><SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-700">NOTA: (R)</Label><Input {...register("nota")} className="bg-white h-9 border-green-300" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Recibido (S)</Label><Input {...register("fechaRecibido")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Renta (T)</Label><Select onValueChange={(v) => setValue("tipoRenta", v)}><SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger><SelectContent>{tiposRenta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
            </div>

            {/* BLOQUE FINAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-yellow-50/50 rounded-lg border border-yellow-200">
              <h3 className="col-span-3 font-bold text-yellow-800">Control Final (BH-BJ)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Año (BI)</Label><Input {...register("anoIngresoBI")} defaultValue="2026" className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fórmula (BJ)</Label><Select onValueChange={(v) => setValue("esFormulaBJ", v)} defaultValue="TRUE"><SelectTrigger className="bg-white h-9"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TRUE">TRUE</SelectItem><SelectItem value="FALSE">FALSE</SelectItem></SelectContent></Select></div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold"><Save className="mr-2" /> Guardar Todo</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
