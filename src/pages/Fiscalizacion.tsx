import { useState, useEffect } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { Fiscalizacion } from "@/types/processes";
import { FiscalizacionForm } from "@/components/forms/FiscalizacionForm";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { readSheet, SHEET_NAMES } from "@/lib/googleSheets";

function rowToFiscalizacion(row: Record<string, string>, index: number): Fiscalizacion {
  const fechaVencimiento = row['FECHA VENCIMIENTO'] || '';
  const diasPendientes = fechaVencimiento
    ? Math.ceil((new Date(fechaVencimiento).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    id: `row-${index + 2}`,
    canalIngreso: row['CANAL DE INGRESO'] || '',
    funcionarioEncargado: row['FUNCIONARIO ENCARGADO'] || '',
    tipoRenta: row['TIPO DE RENTA'] || '',
    tipoTramite: row['TIPO DE TRAMITE'] || '',
    fechaVencimiento,
    diasPendientes,
    semaforo: diasPendientes < 0 ? 'rojo' : diasPendientes <= 5 ? 'amarillo' : 'verde',
    estado: diasPendientes < 0 ? 'vencido' : 'pendiente',
    fechaIngreso: row['FECHA PLANILLA INGRESO'] || '',
    planilla: row['No. PLANILLA'] || '',
    expediente: row['No. EXPEDIENTE'] || '',
    actoAdministrativo: row['ACTO ADMINISTRATIVO'] || '',
    fechaPlanillaIngreso: row['FECHA PLANILLA INGRESO'] || '',
    proceso: row['PROCESO'] || '',
    contribuyente: row['CONTRIBUYENTE'] || '',
    impuesto: row['IMPUESTO'] || '',
    estadoProceso: row['TIPO'] || '',
    resolucionSadeSalida: row['No. ACTO ADMINISTRATIVO Y No. SADE'] || '',
    fechaResolucionSade: row['FECHA ACTO (DD-MM-AAAA)'] || '',
    fechaEjecutoria: '',
    semaforoVencimiento: diasPendientes < 0 ? 'rojo' : diasPendientes <= 5 ? 'amarillo' : 'verde',
  };
}

export default function FiscalizacionPage() {
  const [data, setData] = useState<Fiscalizacion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Fiscalizacion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { key: 'expediente', label: 'Expediente' },
    { key: 'contribuyente', label: 'Contribuyente' },
    { key: 'proceso', label: 'Proceso' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'impuesto', label: 'Impuesto' },
    { key: 'estadoProceso', label: 'Estado Proceso' },
    { key: 'fechaPlanillaIngreso', label: 'Fecha Ingreso' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.FISCALIZACION);
      const sheetData = result[SHEET_NAMES.FISCALIZACION] || [];
      const records = sheetData.map((row: Record<string, string>, index: number) => rowToFiscalizacion(row, index));
      setData(records);
      console.log(`Loaded ${records.length} records from Fiscalización`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos de Fiscalización");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = (formData: Fiscalizacion) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast.success("Proceso de fiscalización actualizado exitosamente");
    } else {
      setData(prev => [...prev, formData]);
      toast.success("Proceso de fiscalización creado exitosamente");
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Fiscalizacion) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Fiscalización</h1>
          <p className="text-muted-foreground text-lg">Seguimiento de procesos de fiscalización tributaria</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" /> Agregar Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Fiscalización' : 'Nueva Fiscalización'}</DialogTitle>
              </DialogHeader>
              <FiscalizacionForm onSubmit={handleSubmit} initialData={editingItem || undefined} mode={editingItem ? 'edit' : 'create'} />
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
          title="Procesos de Fiscalización"
          description={`Seguimiento y control de procesos de fiscalización tributaria (${data.length} registros)`}
          data={data}
          columns={columns}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
