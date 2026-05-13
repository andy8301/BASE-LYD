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

  // Listados Maestros extraídos de tus archivos
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const tiposRenta = ["IMPUESTO SOBRE VEHICULOS", "IMPUESTO DE REGISTRO", "IMPUESTO AL CONSUMO", "IMPUESTO DE DEGUELLO", "TASA DE SEGURIDAD", "ESTAMPILLA", "APREHENCIÓN Y DECOMISO DE MERCANCIAS", "PASAPORTE", "OTROS", "NO TRIBUTARIO", "IMPUESTO TASA DE GASOLINA"];
  const tiposTramite = ["Derecho de peticion", "Exención", "Devolucion", "Copia boleta fiscal", "Recurso", "Certificación", "Atención PDTIR", "Insolvencia", "Subsanación"];
  const respuestas = ["RESPUESTA DERECHO DE PETICION", "AUTO DE CIERRE", "TRASLADO", "LIQUIDACION OFICIAL", "SANCION", "RESOLUCION RECHAZADA", "RESOLUCION CONCEDIDA", "NOTIFICACIÓN", "REVOCATORIA", "NO REQUIERE RESPUESTA"];

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
      // Mapeo EXACTO por columnas A-AG
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
        formData.numeroSadeSalida || "", formData.fechaResolucion || "", formData.tipoRespuesta || "", // AA, AB, AC
        formData.planillaSalida || "", formData.fechaPlanilla || "", formData.fechaEjecutoria || "", // AD, AE, AF
        formData.traslado || "" // AG
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:AG${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Registro procesado exitosamente!");
    } catch (error) {
      toast.error("Error al guardar en Google Sheets");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <h1 className="text-2xl font-bold text-slate-800">Base Olga - Control Procesos</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}><RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualizar</Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-700 hover:bg-blue-800"><Plus className="mr-2 h-4 w-4" /> Nuevo Registro</Button>
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="bg-white rounded-lg border shadow overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-2">No.</th>
              <th className="p-2">Contribuyente</th>
              <th className="p-2">Renta</th>
              <th className="p-2">Funcionario</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-slate-50">
                <td className="p-2 font-medium">{item['No consecutivo']}</td>
                <td className="p-2">{item['CONTRIBUYENTE']}</td>
                <td className="p-2">{item['TIPO DE RENTA']}</td>
                <td className="p-2">{item['FUNCIONARIO ENCARGADO']}</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); reset(item); setIsDialogOpen(true); }}>Editar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">Detalle del Expediente Completo</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* SECCIÓN 1: RADICACIÓN (B-J) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1">1. Radicación e Ingreso (B a J)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">No consecutivo</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Canal de ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.['Canal de ingreso']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent><SelectItem value="SADE">SADE</SelectItem><SelectItem value="NEXURA">NEXURA</SelectItem><SelectItem value="Correo electrónico">Correo electrónico</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">Area Remitente</Label><Input {...register("areaRemitente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. PLANILLA</Label><Input {...register("planilla")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. EXPEDIENTE</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Radicacion</Label><Input {...register("fechaRadicacion")} className="bg-white h-9" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold">ACTO ADMINISTRA-TIVO</Label><Input {...register("actoAdministrativo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. ACTO / SADE</Label><Input {...register("numeroActo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA ACTO</Label><Input {...register("fechaActo")} className="bg-white h-9" /></div>
            </div>

            {/* SECCIÓN 2: CONTRIBUYENTE Y RENTA (L-T) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1">2. Contribuyente y Renta (L a T)</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">PLACA</Label><Input {...register("placa")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. DE IDENTIFICACION</Label><Input {...register("identificacion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">CONTRIBUYENTE</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">CIUDAD-DEPARTAMENTO</Label><Input {...register("ciudadDepartamento")} className="bg-white h-9" /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs font-bold">OBSERVACIONES</Label><Input {...register("observaciones")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FUNCIONARIO ENCARGADO</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.['FUNCIONARIO ENCARGADO']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">NOTA:</Label><Input {...register("nota")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA DE RECIBIDO</Label><Input {...register("fechaRecibido")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RENTA</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)} defaultValue={editingItem?.['TIPO DE RENTA']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* SECCIÓN 3: CLASIFICACIÓN Y RESPUESTA (U-AG) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1">3. Clasificación y Salida (U a AG)</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE TRAMITE</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)} defaultValue={editingItem?.['TIPO DE TRAMITE']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">ITEM</Label><Input {...register("item")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">OTRO RENTA (ESPECIFICAR)</Label><Input {...register("tipoRentaOtro")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">PRELACIÓN LEGAL</Label><Input {...register("prelacionLegal")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">NUMERO DE RESOLUCION</Label><Input {...register("numeroResolucion")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">SADE SALIDA</Label><Input {...register("numeroSadeSalida")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RESPUESTA</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)} defaultValue={editingItem?.['TIPO DE RESPUESTA']}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">FECHA PLANILLA</Label><Input {...register("fechaPlanilla")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">TRASLADO</Label><Input {...register("traslado")} className="bg-white h-9" /></div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-lg font-bold"><Save className="mr-2" /> Guardar Todo en Google Sheets</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
