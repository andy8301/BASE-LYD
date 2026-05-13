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

  // --- LISTADOS MAESTROS CONSOLIDADOS ---
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const tiposRenta = ["IMPUESTO SOBRE VEHICULOS", "IMPUESTO DE REGISTRO", "IMPUESTO AL CONSUMO", "IMPUESTO DE DEGUELLO", "TASA DE SEGURIDAD", "ESTAMPILLA", "APREHENCIÓN Y DECOMISO DE MERCANCIAS", "PASAPORTE", "OTROS (Felicitación, Queja, etc)", "IMPUESTO DE DEGUELLO DE GANADO MAYOR", "CONTRIBUCION PARA EL DEPORTE", "CONTRIBUCIÓN PARA LA SEGURIDAD", "NO TRIBUTARIO", "Devolución por conceptos NO tributarios", "IMPUESTO TASA DE GASOLINA"];
  const tiposTramite = ["Derecho de peticion", "Exención", "Devolucion", "Copia boleta fiscal", "Recurso", "Certificación", "Atención PDTIR", "Especificar", "Información", "Insolvencia", "Subsanación"];
  const items = ["Devolucion impuesto de registro", "Certificación", "Devolucion impuesto de vehiculo", "Respuesta a Liquidacion provisional", "Liquidacion de impuesto", "Respuesta del contribuyente", "Solicitud de información", "Desglose impuesto de registro", "Devolucion de estampilla", "Recurso de reconsideración", "Devolucion de pasaporte", "Exención impuesto de registro"];
  const respuestas = ["RESPUESTA DERECHO DE PETICION", "AUTO DE CIERRE", "TRASLADO", "LIQUIDACION OFICIAL", "SANCION", "AUTO INADMISORIO", "RESOLUCION RECHAZADA", "RESOLUCION CONCEDIDA", "NOTIFICACIÓN", "AUTO DE PRUEBAS", "SUSPENSIÓN DE TERMINOS", "REVOCATORIA", "NO REQUIERE RESPUESTA"];
  const prelaciones = ["Peticiones de Autoridades", "Peticiones de Periodistas", "Riesgo de vida o salud", "Población vulnerable", "Derechos Fundamentales", "N/A"];

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
      // Mapeo EXACTO por columnas (Letra por Letra)
      const rowData = [
        "", // A
        formData.consecutivo || "",    // B
        formData.canalIngreso || "",   // C
        formData.areaRemitente || "",  // D
        formData.planilla || "",       // E
        formData.expediente || "",     // F
        formData.fechaRadicacion || "",// G
        formData.actoAdministrativo || "", // H
        formData.numeroActo || "",     // I
        formData.fechaActo || "",      // J
        "", // K (MES - FÓRMULA)
        formData.placa || "",          // L
        formData.identificacion || "", // M
        formData.contribuyente || "",  // N
        formData.ciudadDepartamento || "", // O
        formData.observacionSade || "", // P
        formData.funcionarioEncargado || "", // Q
        formData.nota || "",           // R
        formData.fechaRecibido || "",  // S
        formData.tipoRenta || "",      // T
        formData.tipoTramite || "",    // U
        formData.item || "",           // V
        formData.tipoRentaOtro || "",  // W
        formData.prelacionLegal || "", // X
        formData.baseFuncionario1ra || "", // Y
        formData.numeroResolucion || "", // Z
        formData.numeroSadeSalida || "", // AA
        formData.fechaResolucion || "",  // AB
        formData.tipoRespuesta || "",    // AC
        formData.planillaSalida || "",   // AD
        formData.fechaPlanilla || "",    // AE
        formData.fechaEjecutoria || "",  // AF
        formData.traslado || ""          // AG
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:AG${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Información procesada correctamente!");
    } catch (error) {
      toast.error("Error al guardar en Google Sheets");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <h1 className="text-2xl font-bold text-slate-800">Base Olga</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}><RefreshCw className="mr-2 h-4 w-4" /> Actualizar</Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-700 hover:bg-blue-800"><Plus className="mr-2 h-4 w-4" /> Nuevo Registro</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">Detalle del Expediente - Traza Rentas</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4">
            
            {/* 1. RADICACIÓN (B-J) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-900">No consecutivo</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-blue-900">Canal de ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.['Canal de ingreso']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent><SelectItem value="SADE">SADE</SelectItem><SelectItem value="NEXURA">NEXURA</SelectItem><SelectItem value="Correo electrónico">Correo electrónico</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-blue-900">Area Remitente</Label>
                <Select onValueChange={(v) => setValue("areaRemitente", v)} defaultValue={editingItem?.['Area Remitente']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent><SelectItem value="Traslado subgerencia gestión de Cobranzas">Cobranzas</SelectItem><SelectItem value="Traslado subdirección técnica Jurídica">Jurídica</SelectItem><SelectItem value="Traslado subgerencia de Fiscalización">Fiscalización</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-900">No. PLANILLA</Label><Input {...register("planilla")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-900">No. EXPEDIENTE</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-900">Fecha Radicacion (DD/MM/YYYY)</Label><Input {...register("fechaRadicacion")} className="bg-white h-9" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold text-blue-900">ACTO ADMINISTRA-TIVO</Label><Input {...register("actoAdministrativo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-900">No. ACTO / SADE</Label><Input {...register("numeroActo")} className="bg-white h-9" /></div>
            </div>

            {/* 2. CONTRIBUYENTE (L-S) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1">2. Información del Contribuyente</h3>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-900">PLACA</Label><Input {...register("placa")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-900">No. DE IDENTIFICACION</Label><Input {...register("identificacion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-900">CONTRIBUYENTE</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-green-900">FUNCIONARIO ENCARGADO</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.['FUNCIONARIO ENCARGADO']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold text-green-900">OBSERVACIONES SADE</Label><Input {...register("observacionSade")} className="bg-white h-9" /></div>
            </div>

            {/* 3. CLASIFICACIÓN (T-X) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1">3. Clasificación Técnica</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-orange-900">TIPO DE RENTA</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)} defaultValue={editingItem?.['TIPO DE RENTA']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-orange-900">TIPO DE TRAMITE</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)} defaultValue={editingItem?.['TIPO DE TRAMITE']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-orange-900">ITEM</Label>
                <Select onValueChange={(v) => setValue("item", v)} defaultValue={editingItem?.['ITEM']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{items.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* 4. RESPUESTA (Y-AG) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200 pb-1">4. Resolución y Salida</h3>
              <div className="space-y-1"><Label className="text-xs font-bold text-purple-900">NUMERO DE RESOLUCION</Label><Input {...register("numeroResolucion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-purple-900">SADE SALIDA</Label><Input {...register("numeroSadeSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-purple-900">TIPO DE RESPUESTA</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)} defaultValue={editingItem?.['TIPO DE RESPUESTA']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold"><Save className="mr-2 h-6 w-6" /> Guardar Todo en Google Sheets</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
