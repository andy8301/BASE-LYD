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

  // Listados Maestros para los Selects
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const tiposRenta = ["IMPUESTO SOBRE VEHICULOS", "IMPUESTO DE REGISTRO", "IMPUESTO AL CONSUMO", "IMPUESTO DE DEGUELLO", "TASA DE SEGURIDAD", "ESTAMPILLA", "APREHENCIÓN Y DECOMISO DE MERCANCIAS", "PASAPORTE", "OTROS", "NO TRIBUTARIO", "IMPUESTO TASA DE GASOLINA"];
  const tiposTramite = ["Derecho de peticion", "Exención", "Devolucion", "Copia boleta fiscal", "Recurso", "Certificación", "Atención PDTIR", "Insolvencia", "Subsanación"];
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
    } catch (error) { toast.error("Error al cargar datos"); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // Mapeo EXACTO por columnas desde la A hasta la BL sin desplazamientos
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
        formData.prelacionLegal || "", formData.baseFuncionario1ra || "", formData.numeroResolucion || "", // X, Y, Z
        formData.numeroSadeSalida || "", formData.fechaResolucionSadeSalida || "", // AA, AB
        formData.tipoRespuesta || "", formData.noPlanillaSalida || "", formData.fechaDePlanillaSalida || "", // AC, AD, AE
        formData.fechaEjecutoria || "", formData.traslado || "", // AF, AG
        formData.observacionAH || "", // AH
        formData.baseFuncionario2daAI || "", // AI
        formData.numResolucionAJ || "", // AJ
        formData.numSadeAK || "", // AK
        formData.fechaResolucionAL || "", // AL
        formData.numPlanillaAM || "", // AM
        formData.fechaPlanillaAN || "", // AN
        formData.fechaEjecutoriaAO || "", // AO
        formData.trasladoAP || "", // AP
        formData.tipoRespuestaAQ || "", // AQ
        formData.baseFunc3raAR || "", // AR
        ...Array(11).fill(""), // AS a BC (Espacios vacíos de control)
        formData.fechaVencimientoBD || "", // BD
        formData.diasPendientesBE || "", // BE
        formData.semaforoVencimientoBF || "", // BF
        formData.diasTranscurridosBG || "", // BG
        formData.semaforoExpedientesBH || "", // BH
        formData.anoIngresoBI || "", // BI
        "", // BJ (Fórmula oculta en el Excel, no se pisa)
        formData.clasificacionPdtesBK || "", // BK
        formData.funcencarBL || "" // BL
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:BL${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Expediente guardado exitosamente en Google Sheets!");
    } catch (error) { toast.error("Error al guardar"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Base Olga</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}><RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualizar</Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-700 hover:bg-blue-800 text-white font-bold">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4"><DialogTitle className="text-xl font-bold text-blue-900">Formulario de Gestión Integral (B a BL)</DialogTitle></DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* 1. RADICACIÓN E INGRESO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">No consecutivo (B)</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Canal de ingreso (C)</Label><Input {...register("canalIngreso")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Area Remitente (D)</Label><Input {...register("areaRemitente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. PLANILLA (E)</Label><Input {...register("planilla")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. EXPEDIENTE (F)</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Radicacion (G)</Label><Input {...register("fechaRadicacion")} className="bg-white h-9" /></div>
              <div className="col-span-1 space-y-1"><Label className="text-xs font-bold">ACTO ADMINISTRA-TIVO (H)</Label><Input {...register("actoAdministrativo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. ACTO / SADE (I)</Label><Input {...register("numeroActo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-700">FECHA ACTO (J)</Label><Input {...register("fechaActo")} className="bg-white h-9 border-blue-300" /></div>
            </div>

            {/* 2. CONTRIBUYENTE Y RENTA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">2. Información del Contribuyente</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">PLACA (L)</Label><Input {...register("placa")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. IDENTIFICACION (M)</Label><Input {...register("identificacion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">CONTRIBUYENTE (N)</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">CIUDAD-DEPARTAMENTO (O)</Label><Input {...register("ciudadDepartamento")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">OBSERVACIONES (P)</Label><Input {...register("observaciones")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FUNCIONARIO (Q)</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-700">NOTA: (R)</Label><Input {...register("nota")} className="bg-white h-9 border-green-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA RECIBIDO (S)</Label><Input {...register("fechaRecibido")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RENTA (T)</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE TRAMITE (U)</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* 3. CLASIFICACIÓN Y RESPUESTA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">3. Clasificación y Respuesta (V a AG)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">ITEM (V)</Label><Input {...register("item")} className="bg-white h-9 border-orange-200" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold text-[10px]">SI EL TIPO DE RENTA ES OTRO (W)</Label><Input {...register("tipoRentaOtro")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">PRELACIÓN LEGAL (X)</Label><Input {...register("prelacionLegal")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-[10px]">BASE FUNCIONARIO 1RA RESP (Y)</Label><Input {...register("baseFuncionario1ra")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">NUMERO RESOLUCION (Z)</Label><Input {...register("numeroResolucion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">SADE SALIDA (AA)</Label><Input {...register("numeroSadeSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA RESOLUCION (AB)</Label><Input {...register("fechaResolucionSadeSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RESPUESTA (AC)</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">No PLANILLA (AD)</Label><Input {...register("noPlanillaSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA PLANILLA (AE)</Label><Input {...register("fechaDePlanillaSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">FECHA EJECUTORIA (AF)</Label><Input {...register("fechaEjecutoria")} className="bg-white h-9 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">TRASLADO (AG)</Label><Input {...register("traslado")} className="bg-white h-9" /></div>
            </div>

            {/* 4. SEGUNDA INSTANCIA Y SEGUIMIENTO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200 pb-1 text-sm">4. Segunda Instancia y Vencimiento (AH a BD)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">OBSERVACIÓN (AH)</Label><Input {...register("observacionAH")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">BASE FUNC. 2DA RESP (AI)</Label><Input {...register("baseFuncionario2daAI")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. RESOLUCIÓN (AJ)</Label><Input {...register("numResolucionAJ")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. SADE (AK)</Label><Input {...register("numSadeAK")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA RES./SADE (AL)</Label><Input {...register("fechaResolucionAL")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No PLANILLA (AM)</Label><Input {...register("numPlanillaAM")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA PLANILLA (AN)</Label><Input {...register("fechaPlanillaAN")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">EJECUTORIA (AO)</Label><Input {...register("fechaEjecutoriaAO")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">TRASLADO (AP)</Label><Input {...register("trasladoAP")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO RESPUESTA (AQ)</Label>
                <Select onValueChange={(v) => setValue("tipoRespuestaAQ", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">BASE FUNC. 3RA RESP (AR)</Label><Input {...register("baseFunc3raAR")} className="bg-white h-9 border-purple-200" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-red-700">FECHA VENCIMIENTO (BD)</Label>
                <Input {...register("fechaVencimientoBD")} className="bg-white h-9 border-red-300" />
              </div>
            </div>

            {/* 5. CONTROL Y CONTROL DE VENCIMIENTO (BE a BL) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-teal-50/50 rounded-lg border border-teal-100">
              <h3 className="col-span-3 font-bold text-teal-800 border-b border-teal-200 pb-1 text-sm">5. Control de Vencimiento y Asignación (BE a BL)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">DIAS PENDIENTES (BE)</Label><Input {...register("diasPendientesBE")} className="bg-white h-9 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-orange-600">SEMAFORO DE VENCIMIENTO (BF)</Label><Input {...register("semaforoVencimientoBF")} className="bg-white h-9 border-orange-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">DIAS TRANSCURRIDOS (BG)</Label><Input {...register("diasTranscurridosBG")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">SEMAFORO EXPEDIENTES (BH)</Label><Input {...register("semaforoExpedientesBH")} className="
