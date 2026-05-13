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

// Función para mapear los datos de la web hacia las columnas A-AG de tu Excel
function baseOlgaToRow(data: BaseOlga): string[] {
  return [
    "",                         // A
    data.consecutivo || "",     // B: No consecutivo
    data.canalIngreso || "",    // C: Canal de ingreso
    data.areaRemitente || "",   // D: Area Remitente
    data.planilla || "",        // E: No. PLANILLA
    data.expediente || "",      // F: No. EXPEDIENTE (Protegido si es fórmula)
    data.fechaRadicacion || "", // G: Fecha Radicacion expediente
    data.actoAdministrativo || "", // H: ACTO ADMINISTRA-TIVO
    data.numeroActo || "",      // I: No. ACTO ADMINISTRATIVO Y No. SADE
    data.fechaActo || "",       // J: FECHA ACTO
    "",                         // K: MES (Fórmula en Excel)
    data.placa || "",           // L: PLACA
    data.identificacion || "",  // M: No. DE IDENTIFICACION
    data.contribuyente || "",   // N: CONTRIBUYENTE
    data.ciudadDepartamento || "", // O: CIUDAD-DEPARTAMENTO
    data.observacionSade || "", // P: OBSERVACIONES
    data.funcionarioEncargado || "", // Q: FUNCIONARIO ENCARGADO
    data.nota || "",            // R: NOTA:
    data.fechaRecibido || "",   // S: FECHA DE RECIBIDO
    data.tipoRenta || "",       // T: TIPO DE RENTA
    data.tipoTramite || "",     // U: TIPO DE TRAMITE
    data.item || "",            // V: ITEM
    data.tipoRentaOtro || "",   // W: SI EL TIPO DE RENTA ES OTRO
    data.prelacionLegal || "",  // X: PRELACIÓN LEGAL
    data.baseFuncionario1ra || "", // Y: BASE FUNCIONARIO 1RA RESPUESTA
    data.numeroResolucion || "", // Z: NUMERO DE RESOLUCION
    data.numeroSadeSalida || "", // AA: NUMERO DE SADE SALIDA
    data.fechaResolucion || "",  // AB: FECHA RESOLUCION/SADE SALIDA
    data.tipoRespuesta || "",    // AC: TIPO DE RESPUESTA
    data.planillaSalida || "",   // AD: No PLANILLA
    data.fechaPlanilla || "",    // AE: FECHA DE PLANILLA
    data.fechaEjecutoria || "",  // AF: FECHA EJECUTORIA
    data.traslado || ""          // AG: TRASLADO
  ];
}

export default function BaseOlga() {
  const [data, setData] = useState<BaseOlga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseOlga | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm<BaseOlga>();

  // Catálogos maestros extraídos de tus imágenes
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Cesar Enrique Gomez", "Luis Andres Botia Riascos", "Olga Lucia Gomez Aristizabal", "Yaleydy Mosquera"]; // ... agregar resto del listado
  const tiposRenta = ["IMPUESTO DE REGISTRO", "IMPUESTO SOBRE VEHICULOS", "IMPUESTO AL CONSUMO", "PASAPORTE", "ESTAMPILLA"];
  const tiposRespuesta = ["RESOLUCION RECHAZADA", "RESOLUCION CONCEDIDA", "AUTO DE CIERRE", "NOTIFICACIÓN"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      const records = (result[SHEET_NAMES.BASE_OLGA] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`,
        consecutivo: row['No consecutivo'],
        contribuyente: row['CONTRIBUYENTE'],
        tipoRenta: row['TIPO DE RENTA']
      }));
      setData(records);
    } catch (error) {
      toast.error("Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: BaseOlga) => {
    try {
      const rowData = baseOlgaToRow(formData);
      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:AG${rowNumber}`, rowData);
        toast.success("Registro actualizado correctamente");
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
        toast.success("Nuevo registro guardado");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Error al guardar en Sheets");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Base Olga</h1>
          <p className="text-slate-500 text-sm">Gestión y control de rentas base</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Sincronizar
          </Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-700 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
          </Button>
        </div>
      </div>

      <ProcessTable 
        data={data} 
        onEdit={(item) => { reset(item); setEditingItem(item); setIsDialogOpen(true); }}
        columns={[
          { key: 'consecutivo', label: 'Consecutivo' },
          { key: 'contribuyente', label: 'Contribuyente' },
          { key: 'tipoRenta', label: 'Tipo de Renta' },
          { key: 'funcionarioEncargado', label: 'Responsable' }
        ]}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 bg-slate-50 border-b">
            <DialogTitle className="text-xl font-bold">{editingItem ? '✏️ Editar' : '➕ Nuevo'} Expediente - Base Olga</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sección 1: Radicación */}
              <div className="space-y-4">
                <h3 className="font-bold text-blue-700 border-b pb-2">1. Datos de Radicación</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Consecutivo</Label>
                    <Input {...register("consecutivo")} />
                  </div>
                  <div className="space-y-2">
                    <Label>No. Planilla</Label>
                    <Input {...register("planilla")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Canal de Ingreso</Label>
                  <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.canalIngreso}>
                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SADE">SADE</SelectItem>
                      <SelectItem value="NEXURA">NEXURA</SelectItem>
                      <SelectItem value="Correo electrónico">Correo electrónico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sección 2: Contribuyente */}
              <div className="space-y-4">
                <h3 className="font-bold text-green-700 border-b pb-2">2. Contribuyente</h3>
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input {...register("contribuyente")} />
                </div>
                <div className="space-y-2">
                  <Label>Identificación</Label>
                  <Input {...register("identificacion")} />
                </div>
              </div>
            </div>

            {/* Sección 3: Respuesta Técnica */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-orange-700 border-b pb-2">3. Seguimiento y Respuesta</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Funcionario</Label>
                  <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.funcionarioEncargado}>
                    <SelectTrigger><SelectValue placeholder="Asignar a..." /></SelectTrigger>
                    <SelectContent>
                      {funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Respuesta</Label>
                  <Select onValueChange={(v) => setValue("tipoRespuesta", v)} defaultValue={editingItem?.tipoRespuesta}>
                    <SelectTrigger><SelectValue placeholder="Estado..." /></SelectTrigger>
                    <SelectContent>
                      {tiposRespuesta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Resolución / SADE</Label>
                  <Input {...register("numeroSadeSalida")} />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="submit" className="flex-1 bg-slate-900 text-white h-12">
                <Save className="mr-2 h-5 w-5" /> Guardar Cambios en Google Sheets
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
