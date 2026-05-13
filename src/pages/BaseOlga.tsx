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

  // Listados Maestros integrados
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const tiposRenta = ["IMPUESTO SOBRE VEHICULOS", "IMPUESTO DE REGISTRO", "IMPUESTO AL CONSUMO", "IMPUESTO DE DEGUELLO", "TASA DE SEGURIDAD", "ESTAMPILLA", "APREHENCIÓN Y DECOMISO DE MERCANCIAS", "PASAPORTE", "OTROS", "NO TRIBUTARIO", "IMPUESTO TASA DE GASOLINA"];
  const tiposTramite = ["Derecho de peticion", "Exención", "Devolucion", "Copia boleta fiscal", "Recurso", "Certificación", "Atención PDTIR", "Insolvencia", "Subsanación"];
  const respuestas = ["PETICION", "TRASLADO", "RESPUESTA", "NOTIFICACIÓN", "AUTO DE CIERRE", "REVOCATORIA"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      const records = (result[SHEET_NAMES.BASE_OLGA] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`
      }));
      setData(records);
    } catch (error) {
      toast.error("Error al sincronizar con Sheets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // Mapeo EXACTO por columnas A-AL basado en image_58ba9a.png
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
        formData.fechaResolucionSadeFinal || "" // AL
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:AL${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("Información actualizada hasta la columna AL");
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <h1 className="text-2xl font-bold text-slate-800">Base Olga - Gestión Integral</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}><RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualizar</Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-700 hover:bg-blue-800"><Plus className="mr-2 h-4 w-4" /> Nuevo Registro</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">Detalle del Expediente (B a AL)</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            {/* SECCIÓN 1 y 2 (Ya configuradas anteriormente) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
               <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200">Datos Iniciales y Contribuyente</h3>
               <div className="space-y-1"><Label className="text-xs font-bold">No consecutivo</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
               <div className="space-y-1"><Label className="text-xs font-bold">CONTRIBUYENTE</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
               <div className="space-y-1"><Label className="text-xs font-bold">No. EXPEDIENTE</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
            </div>

            {/* SECCIÓN 3: CIERRE Y SALIDA (AB a AL) - Siguiendo image_58ba9a.png */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1">
                3. Información de Salida y Resolución (AB a AL)
              </h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">FECHA RESOLUCION/SADE SALIDA (AB)</Label>
                <Input {...register("fechaResolucionSadeSalida")} className="bg-white h-9" placeholder="DD/MM/AAAA" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RESPUESTA (AC)</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">No PLANILLA (AD)</Label>
                <Input {...register("noPlanillaSalida")} className="bg-white h-9" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">FECHA DE PLANILLA (AE)</Label>
                <Input {...register("fechaDePlanillaSalida")} className="bg-white h-9" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-red-600">FECHA EJECUTORIA (AF)</Label>
                <Input {...register("fechaEjecutoria")} className="bg-white h-9 border-red-200" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">TRASLADO (AG)</Label>
                <Input {...register("traslado")} className="bg-white h-9" />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1">
                <Label className="text-xs font-bold">OBSERVACION (AH)</Label>
                <Input {...register("observacionFinal")} className="bg-white h-9" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">BASE FUNCIONARIO 2DA RESP (AI)</Label>
                <Input {...register("baseFuncionario2da")} className="bg-white h-9" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">NUMERO DE RESOLUCION (AJ)</Label>
                <Input {...register("numeroDeResolucionFinal")} className="bg-white h-9" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">NUMERO DE SADE (AK)</Label>
                <Input {...register("numeroDeSadeFinal")} className="bg-white h-9" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">FECHA RESOLUCIÓN/SADE (AL)</Label>
                <Input {...register("fechaResolucionSadeFinal")} className="bg-white h-9" placeholder="DD/MM/AAAA" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold"><Save className="mr-2 h-6 w-6" /> Guardar Todo en Google Sheets</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
