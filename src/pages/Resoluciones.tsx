import { useState, useEffect } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { Resoluciones } from "@/types/processes";
import { ResolucionesForm } from "@/components/forms/ResolucionesForm";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { readSheet, SHEET_NAMES } from "@/lib/googleSheets";

function rowToResolucion(row: Record<string, string>, index: number): Resoluciones {
  return {
    id: `row-${index + 2}`,
    canalIngreso: '',
    funcionarioEncargado: '',
    tipoRenta: '',
    tipoTramite: row['TIPO DE RESOLUCION'] || '',
    fechaVencimiento: '',
    diasPendientes: 0,
    semaforo: 'verde',
    estado: 'resuelto',
    fechaIngreso: row['FECHA'] || '',
    sadeIngreso: row['SADE INGRESO'] || '',
    numeroActoSadeSalida: row['RESOLUCIÓN NO.'] || '',
    planilla: '',
    fechaPlanilla: row['FECHA'] || '',
    actoAdministrativo: row['TIPO DE RESOLUCION'] || '',
    numeroSadeSalida: row['SADE SALIDA'] || '',
    expediente: row['EXPEDIENTE'] || '',
  };
}

export default function ResolucionesPage() {
  const [data, setData] = useState<Resoluciones[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Resoluciones | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { key: 'sadeIngreso', label: 'SADE Ingreso' },
    { key: 'numeroActoSadeSalida', label: 'No. Resolución' },
    { key: 'expediente', label: 'Expediente' },
    { key: 'actoAdministrativo', label: 'Tipo Resolución' },
    { key: 'numeroSadeSalida', label: 'SADE Salida' },
    { key: 'fechaPlanilla', label: 'Fecha' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.RESOLUCIONES);
      const sheetData = result[SHEET_NAMES.RESOLUCIONES] || [];
      const records = sheetData.map((row: Record<string, string>, index: number) => rowToResolucion(row, index));
      setData(records);
      console.log(`Loaded ${records.length} records from Resoluciones`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos de Resoluciones");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = (formData: Resoluciones) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast.success("Resolución actualizada exitosamente");
    } else {
      setData(prev => [...prev, formData]);
      toast.success("Resolución creada exitosamente");
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Resoluciones) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Resoluciones</h1>
          <p className="text-muted-foreground text-lg">Gestión de resoluciones administrativas y actos definitivos</p>
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
                <DialogTitle>{editingItem ? 'Editar Resolución' : 'Nueva Resolución'}</DialogTitle>
              </DialogHeader>
              <ResolucionesForm onSubmit={handleSubmit} initialData={editingItem || undefined} mode={editingItem ? 'edit' : 'create'} />
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
          title="Resoluciones Administrativas"
          description={`Seguimiento de resoluciones, autos y actos administrativos definitivos (${data.length} registros)`}
          data={data}
          columns={columns}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
