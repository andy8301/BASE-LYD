import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProcessTable } from "@/components/common/ProcessTable";
import { BaseOlga } from "@/types/processes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

// Función de mapeo completa (A a AG)
function baseOlgaToRow(data: BaseOlga): string[] {
  return [
    "",                             // A
    data.consecutivo || "",         // B
    data.canalIngreso || "",        // C
    data.areaRemitente || "",       // D
    data.planilla || "",            // E
    data.expediente || "",          // F
    data.fechaRadicacion || "",     // G
    data.actoAdministrativo || "",  // H
    data.numeroActo || "",          // I
    data.fechaActo || "",           // J
    "",                             // K (Fórmula MES)
    data.placa || "",               // L
    data.identificacion || "",      // M
    data.contribuyente || ""        // N
    // ... el sistema de envío incluirá el resto de campos (O a AG) mapeados abajo
  ];
}

export default function BaseOlga() {
  const [data, setData] = useState<BaseOlga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseOlga | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm<BaseOlga>();

  // Listados consolidados de tus capturas
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  const tiposRenta = ["IMPUESTO SOBRE VEHICULOS", "IMPUESTO DE REGISTRO", "IMPUESTO AL CONSUMO", "IMPUESTO DE DEGUELLO", "TASA DE SEGURIDAD", "ESTAMPILLA", "APREHENCIÓN Y DECOMISO DE MERCANCIAS", "PASAPORTE", "OTROS", "NO TRIBUTARIO", "IMPUESTO TASA DE GASOLINA"];
  const tiposTramite = ["Derecho de peticion", "Exención", "Devolucion", "Copia boleta fiscal", "Recurso", "Certificación", "Atención PDTIR", "Insolvencia", "Subsanación"];
  const items = ["Devolucion impuesto de registro", "Certificación", "Devolucion impuesto de vehiculo", "Respuesta a Liquidacion", "Liquidacion de impuesto", "Solicitud de información", "Subsanación", "Exención"];
  const respuestas = ["RESPUESTA DERECHO DE PETICION", "AUTO DE CIERRE", "TRASLADO", "LIQUIDACION OFICIAL", "SANCION", "RESOLUCION RECHAZADA", "RESOLUCION CONCEDIDA", "NOTIFICACIÓN", "REVOCATORIA", "NO REQUIERE RESPUESTA"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      setData(result[SHEET_NAMES.BASE_OLGA] || []);
    } catch (error) {
      toast.error("Error de sincronización");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // Mapeo dinámico para asegurar que todas las columnas (B-AG) se envíen
      const rowData = [
        "", // A
        formData.consecutivo, formData.canalIngreso, formData.areaRemitente, 
        formData.planilla, formData.expediente, formData.fechaRadicacion, 
        formData.actoAdministrativo, formData.numeroActo, formData.fechaActo, 
        "", // K (Mes)
        formData.placa, formData.identificacion, formData.contribuyente, 
        formData.ciudadDepartamento, formData.observacionSade, formData.funcionarioEncargado, 
        formData.nota, formData.fechaRecibido, formData.tipoRenta, 
        formData.tipoTramite, formData.item, formData.tipoRentaOtro, 
        formData.prelacionLegal, formData.baseFuncionario1ra, formData.numeroResolucion, 
        formData.numeroSadeSalida, formData.fechaResolucion, formData.tipoRespuesta, 
        formData.planillaSalida, formData.fechaPlanilla, formData.fechaEjecutoria, 
        formData.traslado
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:AG${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      setIsDialogOpen(false);
      fetchData();
      toast.success("Datos guardados exitosamente");
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Base Olga</h1>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <ProcessTable data={data} onEdit={(item) => { reset(item); setEditingItem(item); setIsDialogOpen(true); }} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Formulario Completo de Registro</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-10">
            {/* BLOQUE 1: RADICACIÓN (B a J) */}
            <div className="grid grid-cols-3 gap-4 border p-4 rounded bg-slate-50">
              <h3 className="col-span-3 font-bold text-blue-600">1. Radicación e Identificación de Acto</h3>
              <div className="space-y-1"><Label>Consecutivo</Label><Input {...register("consecutivo")} /></div>
              <div className="space-y-1"><Label>Canal de Ingreso</Label>
                <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.canalIngreso}>
                  <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SADE">SADE</SelectItem>
                    <SelectItem value="NEXURA">NEXURA</SelectItem>
                    <SelectItem value="Correo electrónico">Correo electrónico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Área Remitente</Label><Input {...register("areaRemitente")} /></div>
              <div className="space-y-1"><Label>No. Planilla</Label><Input {...register("planilla")} /></div>
              <div className="space-y-1"><Label>No. Expediente</Label><Input {...register("expediente")} /></div>
              <div className="space-y-1"><Label>Fecha Radicación</Label><Input {...register("fechaRadicacion")} placeholder="DD/MM/YYYY" /></div>
              <div className="space-y-1"><Label>Acto Administrativo</Label><Input {...register("actoAdministrativo")} /></div>
              <div className="space-y-1"><Label>No. Acto/SADE</Label><Input {...register("numeroActo")} /></div>
              <div className="space-y-1"><Label>Fecha Acto</Label><Input {...register("fechaActo")} /></div>
            </div>

            {/* BLOQUE 2: CONTRIBUYENTE (L a S) */}
            <div className="grid grid-cols-3 gap-4 border p-4 rounded bg-green-50">
              <h3 className="col-span-3 font-bold text-green-600">2. Información del Contribuyente</h3>
              <div className="space-y-1"><Label>Placa</Label><Input {...register("placa")} /></div>
              <div className="space-y-1"><Label>Identificación</Label><Input {...register("identificacion")} /></div>
              <div className="space-y-1 col-span-2"><Label>Nombre Contribuyente</Label><Input {...register("contribuyente")} /></div>
              <div className="space-y-1"><Label>Ciudad/Depto</Label><Input {...register("ciudadDepartamento")} /></div>
              <div className="space-y-1"><Label>Observaciones SADE</Label><Input {...register("observacionSade")} /></div>
              <div className="space-y-1"><Label>Fecha Recibido</Label><Input {...register("fechaRecibido")} /></div>
            </div>

            {/* BLOQUE 3: TRÁMITE (T a X) */}
            <div className="grid grid-cols-3 gap-4 border p-4 rounded bg-orange-50">
              <h3 className="col-span-3 font-bold text-orange-600">3. Clasificación del Trámite</h3>
              <div className="space-y-1"><Label>Funcionario</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.funcionarioEncargado}>
                  <SelectTrigger><SelectValue placeholder="Asignar" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Tipo de Renta</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)} defaultValue={editingItem?.tipoRenta}>
                  <SelectTrigger><SelectValue placeholder="Renta" /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Tipo de Trámite</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)} defaultValue={editingItem?.tipoTramite}>
                  <SelectTrigger><SelectValue placeholder="Trámite" /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Item</Label>
                <Select onValueChange={(v) => setValue("item", v)} defaultValue={editingItem?.item}>
                  <SelectTrigger><SelectValue placeholder="Item" /></SelectTrigger>
                  <SelectContent>{items.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Prelación Legal</Label><Input {...register("prelacionLegal")} /></div>
            </div>

            {/* BLOQUE 4: RESPUESTA (Y a AG) */}
            <div className="grid grid-cols-3 gap-4 border p-4 rounded bg-purple-50">
              <h3 className="col-span-3 font-bold text-purple-600">4. Resolución y Salida</h3>
              <div className="space-y-1"><Label>No. Resolución</Label><Input {...register("numeroResolucion")} /></div>
              <div className="space-y-1"><Label>SADE Salida</Label><Input {...register("numeroSadeSalida")} /></div>
              <div className="space-y-1"><Label>Fecha Resolución</Label><Input {...register("fechaResolucion")} /></div>
              <div className="space-y-1"><Label>Tipo Respuesta</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)} defaultValue={editingItem?.tipoRespuesta}>
                  <SelectTrigger><SelectValue placeholder="Respuesta" /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>No. Planilla Salida</Label><Input {...register("planillaSalida")} /></div>
              <div className="space-y-1"><Label>Fecha Planilla</Label><Input {...register("fechaPlanilla")} /></div>
              <div className="space-y-1"><Label>Fecha Ejecutoria</Label><Input {...register("fechaEjecutoria")} /></div>
              <div className="space-y-1"><Label>Traslado</Label><Input {...register("traslado")} /></div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 text-white py-6">
              <Save className="mr-2" /> Guardar Cambios en Google Sheets
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
