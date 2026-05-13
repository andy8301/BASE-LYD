import { useState, useEffect } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { BaseOlgaForm } from "@/components/forms/BaseOlgaForm";
import { BaseOlga } from "@/types/processes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

function rowToBaseOlga(row: Record<string, string>, index: number): BaseOlga {
  const fechaVencimiento = row['FECHA DE VENCIMIENTO'] || '';
  let diasPendientes = 0;
  if (fechaVencimiento && fechaVencimiento !== '#N/A') {
    const parts = fechaVencimiento.split('/');
    if (parts.length === 3) {
      const dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      diasPendientes = Math.ceil((dateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    }
  }
  const cerrado = row['CERRADO PASADO A ARCHIVO'] || row['BASE OLGAB'] || '';
  const semaforoSheet = row['SEMAFORO DE VENCIMIENTO'] || '';

  return {
    id: `row-${index + 2}`,
    consecutivo: row['No consecutivo'] || '',
    canalIngreso: row['Canal de ingreso'] || '',
    areaRemitente: row['Area Remitente'] || '',
    planilla: row['No PLANILLA '] || row['No. PLANILLA'] || row['NO DE PLANILLA'] || '',
    expediente: row['No.  EXPEDIENTE'] || row['EXPEDIENTE'] || '',
    fechaRadicacion: row['Fecha Radicacion expediente (DD/MM/YYYY)'] || '',
    actoAdministrativo: row['ACTO ADMINISTRA-TIVO'] || '',
    numeroActo: row['No. ACTO ADMINISTRATIVO Y No. SADE'] || '',
    fechaActo: row['FECHA ACTO (DD-MM-AAAA)'] || '',
    placa: row['PLACA'] || '',
    identificacion: row['No. DE IDENTIFICACION'] || '',
    contribuyente: row['CONTRIBUYENTE '] || '',
    ciudadDepartamento: row['CIUDAD-DEPARTAMENTO'] || '',
    funcionarioEncargado: row['FUNCIONARIO ENCARGADO'] || '',
    fechaRecibido: row['FECHA DE RECIBIDO'] || '',
    tipoRenta: row['TIPO DE RENTA'] || '',
    tipoTramite: row['TIPO DE TRAMITE'] || '',
    item: row['ITEM'] || '',
    numeroResolucion: row['NUMERO DE RESOLUCION'] || row['RESOLUCION'] || '',
    numeroSadeSalida: row['NUMERO DE SADE SALIDA'] || row['SADE SALIDA'] || row['NUMERO DE SADE'] || '',
    fechaResolucion: row['FECHA RESOLUCION/SADE SALIDA'] || row['FECHA RESOLUCION/SADE'] || row['FECHA RESOLUCIÓN/SADE'] || row['FECHA RESOLUCION'] || '',
    tipoRespuesta: row['TIPO DE RESPUESTA'] || '',
    tipoRespuestaFinal: row['TIPO DE RESPUESTA FINAL'] || '',
    fechaEjecutoria: row['FECHA EJECUTORIA'] || '',
    traslado: row['TRASLADO'] || '',
    cerradoPasadoArchivo: cerrado,
    ubicacionFisica: row['UBICACIÓN DEL EXPEDIENTE EN FISICO'] || '',
    observacionSade: row['OBSERVACIONES'] || row['OBSERVACION'] || '',
    fechaVencimiento: fechaVencimiento,
    fechaIngreso: row['FECHA DE RECIBIDO'] || '',
    // New fields
    anoIngreso: row['AÑO INGRESO'] || '',
    mes: row['MES'] || '',
    fechaPlanilla: row['FECHA DE PLANILLA '] || row['FECHA PLANILLA '] || row['FECHA PLANILLA'] || '',
    diasTranscurridos: row['DIAS TRANSCURRIDOS ENTRE FECHA EXP Y FECHA NOTIF'] || '',
    clasificacionPdtes: row['CLASIFICACION PDTES'] || '',
    tipoRentaOtro: row['SI EL TIPO DE RENTA ES OTRO (ESPECIFICAR EN ESTA COLUMNA)'] || '',
    tipoResolucion: row['TIPO DE RESOLUCION'] || '',
    trasladoArchivoFuncionario: row['TRASLADO DE ARCHIVO A FUNCIONARIO ENCARGADO'] || '',
    semaforoExpedientes: row['SEMAFORO EXPEDIENTES'] || '',
    baseFuncionario1ra: row['BASE FUNCIONARIO 1RA RESPUESTA'] || '',
    baseFuncionario2da: row['BASE FUNCIONARIO 2DA RESPUESTA'] || '',
    baseFuncionario3ra: row['BASE FUNCIONARIO 3RA RESPUESTA'] || '',
    nota: row['NOTA:'] || '',
    sadeRepetido: row['SADE REPETIDO'] || '',
    diasPendientes: diasPendientes,
    semaforo: semaforoSheet === 'CONTESTADO' ? 'verde' : diasPendientes < 0 ? 'rojo' : diasPendientes <= 5 ? 'amarillo' : 'verde',
    estado: semaforoSheet === 'CONTESTADO' || cerrado === 'Si' ? 'resuelto' : diasPendientes < 0 ? 'vencido' : 'pendiente',
  };
}

function baseOlgaToRow(data: BaseOlga): string[] {
  return [
    data.consecutivo,
    data.canalIngreso,
    data.areaRemitente,
    data.planilla,
    data.expediente,
    data.fechaRadicacion,
    data.actoAdministrativo,
    data.numeroActo,
    data.fechaActo,
    data.placa,
    data.identificacion,
    data.contribuyente,
    data.ciudadDepartamento,
    data.funcionarioEncargado,
    data.fechaRecibido,
    data.tipoRenta,
    data.tipoTramite,
    data.item,
    data.numeroResolucion,
    data.numeroSadeSalida,
    data.fechaResolucion,
    data.tipoRespuesta,
    data.fechaEjecutoria,
    data.traslado,
    data.cerradoPasadoArchivo,
    data.ubicacionFisica,
    data.observacionSade,
    "", // Días pendientes (calculated)
    data.fechaVencimiento,
  ];
}

export default function BaseOlgaPage() {
  const [data, setData] = useState<BaseOlga[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseOlga | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const columns = [
    { key: 'consecutivo', label: 'No. Consecutivo' },
    { key: 'anoIngreso', label: 'Año Ingreso' },
    { key: 'mes', label: 'Mes' },
    { key: 'canalIngreso', label: 'Canal Ingreso' },
    { key: 'areaRemitente', label: 'Área Remitente' },
    { key: 'planilla', label: 'No. Planilla' },
    { key: 'fechaPlanilla', label: 'Fecha Planilla' },
    { key: 'expediente', label: 'No. Expediente' },
    { key: 'fechaRadicacion', label: 'Fecha Radicación' },
    { key: 'actoAdministrativo', label: 'Acto Administrativo' },
    { key: 'numeroActo', label: 'No. Acto/SADE' },
    { key: 'fechaActo', label: 'Fecha Acto' },
    { key: 'placa', label: 'Placa' },
    { key: 'identificacion', label: 'No. Identificación' },
    { key: 'contribuyente', label: 'Contribuyente' },
    { key: 'ciudadDepartamento', label: 'Ciudad-Depto' },
    { key: 'funcionarioEncargado', label: 'Funcionario Encargado' },
    { key: 'fechaRecibido', label: 'Fecha Recibido' },
    { key: 'tipoRenta', label: 'Tipo Renta' },
    { key: 'tipoRentaOtro', label: 'Tipo Renta (Otro)' },
    { key: 'tipoTramite', label: 'Tipo Trámite' },
    { key: 'item', label: 'Ítem' },
    { key: 'clasificacionPdtes', label: 'Clasificación Pdtes' },
    { key: 'numeroResolucion', label: 'No. Resolución' },
    { key: 'tipoResolucion', label: 'Tipo Resolución' },
    { key: 'numeroSadeSalida', label: 'No. SADE Salida' },
    { key: 'fechaResolucion', label: 'Fecha Resolución/SADE' },
    { key: 'tipoRespuesta', label: 'Tipo Respuesta' },
    { key: 'tipoRespuestaFinal', label: 'Tipo Respuesta Final' },
    { key: 'fechaEjecutoria', label: 'Fecha Ejecutoria' },
    { key: 'diasTranscurridos', label: 'Días Transcurridos Exp-Notif' },
    { key: 'traslado', label: 'Traslado' },
    { key: 'trasladoArchivoFuncionario', label: 'Traslado Archivo a Funcionario' },
    { key: 'cerradoPasadoArchivo', label: 'Cerrado/Archivo' },
    { key: 'ubicacionFisica', label: 'Ubicación Física' },
    { key: 'observacionSade', label: 'Observaciones' },
    { key: 'nota', label: 'Nota' },
    { key: 'fechaVencimiento', label: 'Fecha Vencimiento' },
    { key: 'semaforoExpedientes', label: 'Semáforo Expedientes' },
    { key: 'baseFuncionario1ra', label: 'Funcionario 1ra Respuesta' },
    { key: 'baseFuncionario2da', label: 'Funcionario 2da Respuesta' },
    { key: 'baseFuncionario3ra', label: 'Funcionario 3ra Respuesta' },
    { key: 'sadeRepetido', label: 'SADE Repetido' },
    {
      key: 'semaforo',
      label: 'Semáforo Vencimiento',
      render: (item: BaseOlga) => {
        const colors = { verde: '🟢', amarillo: '🟡', rojo: '🔴' };
        return colors[item.semaforo] || item.semaforo;
      }
    },
    { key: 'estado', label: 'Estado' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      const sheetData = result[SHEET_NAMES.BASE_OLGA] || [];
      const records = sheetData.map((row: Record<string, string>, index: number) => rowToBaseOlga(row, index));
      setData(records);
      console.log(`Loaded ${records.length} records from Base Olga`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos de Google Sheets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (formData: BaseOlga) => {
    setIsSaving(true);
    try {
      const rowData = baseOlgaToRow(formData);
      if (editingItem) {
        const rowNumber = parseInt(editingItem.id.replace('row-', ''));
        const range = `A${rowNumber}:AC${rowNumber}`;
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, range, rowData);
        toast.success("Registro actualizado exitosamente en Google Sheets");
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
        toast.success("Registro creado exitosamente en Google Sheets");
      }
      await fetchData();
      setIsDialogOpen(false);
      setEditingItem(undefined);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error al guardar los datos en Google Sheets");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: BaseOlga) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-[95vw] mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Base Olga</h1>
          <p className="text-muted-foreground text-lg">Gestión de expedientes y actos administrativos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Registro' : 'Nuevo Registro'} - Base Olga</DialogTitle>
              </DialogHeader>
              <BaseOlgaForm onSubmit={handleSubmit} initialData={editingItem} mode={editingItem ? 'edit' : 'create'} />
              {isSaving && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Guardando...</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mr-2" />
          <span>Cargando datos...</span>
        </div>
      ) : (
        <ProcessTable
          title="Expedientes y Actos Administrativos"
          description={`Seguimiento completo de expedientes, planillas y resoluciones (${data.length} registros)`}
          data={data}
          columns={columns}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
