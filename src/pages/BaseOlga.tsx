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

  // --- LISTADOS MAESTROS EXTRAÍDOS DE TUS CAPTURAS ---
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const tiposRenta = ["IMPUESTO SOBRE VEHICULOS", "IMPUESTO DE REGISTRO", "IMPUESTO AL CONSUMO", "IMPUESTO DE DEGUELLO", "TASA DE SEGURIDAD", "ESTAMPILLA", "APREHENCIÓN Y DECOMISO DE MERCANCIAS", "PASAPORTE", "OTROS", "NO TRIBUTARIO", "IMPUESTO TASA DE GASOLINA"];
  const tiposTramite = ["Derecho de peticion", "Exención", "Devolucion", "Copia boleta fiscal", "Recurso", "Certificación", "Atención PDTIR", "Insolvencia", "Subsanación"];
  const respuestas = ["RESPUESTA DERECHO DE PETICION", "AUTO DE CIERRE", "TRASLADO", "LIQUIDACION OFICIAL", "SANCION", "RESOLUCION RECHAZADA", "RESOLUCION CONCEDIDA", "NOTIFICACIÓN", "REVOCATORIA"];

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
      const rowData = [
        "", // A
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", 
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", 
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", 
        "", // K (Mes - Fórmula)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", 
        formData.ciudadDepartamento || "", formData.observacionSade || "", formData.funcionarioEncargado || "", 
        formData.nota || "", formData.fechaRecibido || "", formData.tipoRenta || "", 
        formData.tipoTramite || "", formData.item || "", formData.tipoRentaOtro || "", 
        formData.prelacionLegal || "", formData.baseFuncionario1ra || "", formData.numeroResolucion || "", 
        formData.numeroSadeSalida || "", formData.fechaResolucion || "", formData.tipoRespuesta || "", 
        formData.planillaSalida || "", formData.fechaPlanilla || "", formData.fechaEjecutoria || "", 
        formData.traslado || ""
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:AG${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Registro guardado!");
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <h1 className="text-2xl font-bold">Base Olga - Gestión Completa</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}><RefreshCw className="mr-2 h-4 w-4" /> Actualizar</Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Nuevo Registro</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-2">No.</th>
              <th className="p-2">Contribuyente</th>
              <th className="p-2">Renta</th>
              <th className="p-2">Trámite</th>
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
                <td className="p-2">{item['TIPO DE TRAMITE']}</td>
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
            <DialogTitle className="text-xl font-bold text-blue-800">Detalle del Expediente</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
            {/* GRUPO 1: RADICACIÓN */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="col-span-4 font-bold text-blue-700">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label>Consecutivo</Label><Input {...register("consecutivo")} /></div>
              <div className="space-y-1"><Label>Planilla</Label><Input {...register("planilla")} /></div>
              <div className="space-y-1"><Label>Expediente</Label><Input {...register("expediente")} /></div>
              <div className="space-y-1">
                <Label>Canal</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.['Canal de ingreso']}>
                  <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent><SelectItem value="SADE">SADE</SelectItem><SelectItem value="NEXURA">NEXURA</SelectItem><SelectItem value="Correo electrónico">Correo</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            {/* GRUPO 2: CONTRIBUYENTE */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-700">2. Información del Contribuyente</h3>
              <div className="space-y-1 col-span-2"><Label>Nombre Contribuyente</Label><Input {...register("contribuyente")} /></div>
              <div className="space-y-1"><Label>Identificación</Label><Input {...register("identificacion")} /></div>
              <div className="space-y-1"><Label>Placa</Label><Input {...register("placa")} /></div>
              <div className="space-y-1"><Label>Ciudad</Label><Input {...register("ciudadDepartamento")} /></div>
              <div className="space-y-1"><Label>Fecha Recibido</Label><Input {...register("fechaRecibido")} /></div>
            </div>

            {/* GRUPO 3: CLASIFICACIÓN */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-700">3. Clasificación Técnica</h3>
              <div className="space-y-1">
                <Label>Funcionario</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.['FUNCIONARIO ENCARGADO']}>
                  <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Renta</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)} defaultValue={editingItem?.['TIPO DE RENTA']}>
                  <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Trámite</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)} defaultValue={editingItem?.['TIPO DE TRAMITE']}>
                  <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* GRUPO 4: RESPUESTA */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-700">4. Respuesta y Salida</h3>
              <div className="space-y-1"><Label>No. Resolución</Label><Input {...register("numeroResolucion")} /></div>
              <div className="space-y-1"><Label>SADE Salida</Label><Input {...register("numeroSadeSalida")} /></div>
              <div className="space-y-1">
                <Label>Tipo Respuesta</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)} defaultValue={editingItem?.['TIPO DE RESPUESTA']}>
                  <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-lg"><Save className="mr-2" /> Guardar Todo en Google Sheets</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
