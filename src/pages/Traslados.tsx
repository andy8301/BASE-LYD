import { useState, useEffect } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { Traslados } from "@/types/processes";
import { TrasladosForm } from "@/components/forms/TrasladosForm";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { readSheet, SHEET_NAMES } from "@/lib/googleSheets";

function rowToTraslado(row: Record<string, string>, index: number): Traslados {
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
    sadeIngreso: row['No. ACTO ADMINISTRATIVO Y No. SADE'] || '',
    numeroActoSade: row['ACTO ADMINISTRATIVO'] || '',
    planilla: row['No. PLANILLA'] || '',
    expediente: row['No. EXPEDIENTE'] || '',
    fechaPlanilla: row['FECHA PLANILLA INGRESO'] || '',
    actoAdministrativo: row['ACTO ADMINISTRATIVO'] || '',
    numeroSadeSalida: '',
  };
}

export default function TrasladosPage() {
  const [data, setData] = useState<Traslados[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Traslados | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { key: 'sadeIngreso', label: 'SADE Ingreso' },
    { key: 'numeroActoSade', label: 'No. Acto' },
    { key: 'expediente', label: 'Expediente' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'actoAdministrativo', label: 'Acto Administrativo' },
    { key: 'fechaPlanilla', label: 'Fecha Planilla' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.FISCALIZACION);
      const sheetData = result[SHEET_NAMES.FISCALIZACION] || [];
      const records = sheetData.map((row: Record<string, string>, index: number) => rowToTraslado(row, index));
      setData(records);
      console.log(`Loaded ${records.length} records from Traslados`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos de Traslados");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = (formData: Traslados) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast.success("Traslado actualizado exitosamente");
    } else {
      setData(prev => [...prev, formData]);
      toast.success("Traslado creado exitosamente");
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Traslados) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Traslados</h1>
          <p className="text-muted-foreground text-lg">Gestión y seguimiento de procesos de traslado</p>
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
                <DialogTitle>{editingItem ? 'Editar Traslado' : 'Nuevo Traslado'}</DialogTitle>
              </DialogHeader>
              <TrasladosForm onSubmit={handleSubmit} initialData={editingItem || undefined} mode={editingItem ? 'edit' : 'create'} />
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
          title="Procesos de Traslado"
          description={`Seguimiento de traslados administrativos y fiscales (${data.length} registros)`}
          data={data}
          columns={columns}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
