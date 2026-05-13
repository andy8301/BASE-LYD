import { useState, useEffect } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { Tutelas } from "@/types/processes";
import { TutelasForm } from "@/components/forms/TutelasForm";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { readSheet, SHEET_NAMES } from "@/lib/googleSheets";

function rowToTutela(row: Record<string, string>, index: number): Tutelas {
  const fechaVencimiento = row['FECHA DE VENCIMIENTO'] || '';
  const diasPendientes = parseInt(row['DIAS PENDIENTES'] || '0') || 0;

  return {
    id: `row-${index + 2}`,
    canalIngreso: row['CANAL DE INGRESO'] || '',
    funcionarioEncargado: row['FUNCIONARIO ENCARGADO'] || '',
    tipoRenta: row['TIPO DE RENTA'] || '',
    tipoTramite: row['TIPO DE TRAMITE'] || '',
    fechaVencimiento,
    diasPendientes,
    semaforo: row['SEMAFORO'] === 'VENCIDO' ? 'rojo' : diasPendientes <= 2 ? 'amarillo' : 'verde',
    estado: row['SEMAFORO'] === 'VENCIDO' ? 'vencido' : 'pendiente',
    fechaIngreso: row['FECHA ASIGNACION'] || '',
    mes: row['MES'] || '',
    fechaAsignacion: row['FECHA ASIGNACION'] || '',
    asuntoCorreo: row['ASUNTO CORREO'] || '',
    remitente: row['REMITENTE'] || '',
    fechaRespuestaPeticion: row['FECHA RESPUESTA DERECHO DE PETICIÓN DD-MM-AAAA'] || '',
    fechaRespuestaJuridica: row['FECHA RESPUESTA AL AREA DE JURIDICA\nDD-MM-AAAA'] || '',
    observaciones: row['OBSERVACIONES'] || '',
  };
}

export default function TutelasPage() {
  const [data, setData] = useState<Tutelas[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Tutelas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { key: 'asuntoCorreo', label: 'Asunto' },
    { key: 'remitente', label: 'Remitente' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'fechaAsignacion', label: 'Fecha Asignación' },
    { key: 'fechaRespuestaPeticion', label: 'Respuesta Petición',
      render: (item: Tutelas) => item.fechaRespuestaPeticion || 'Pendiente'
    },
    { key: 'observaciones', label: 'Observaciones' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.TUTELAS);
      const sheetData = result[SHEET_NAMES.TUTELAS] || [];
      const records = sheetData.map((row: Record<string, string>, index: number) => rowToTutela(row, index));
      setData(records);
      console.log(`Loaded ${records.length} records from Tutelas`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos de Tutelas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = (formData: Tutelas) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast.success("Tutela actualizada exitosamente");
    } else {
      setData(prev => [...prev, formData]);
      toast.success("Tutela creada exitosamente");
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Tutelas) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Tutelas</h1>
          <p className="text-muted-foreground text-lg">Gestión de acciones de tutela y derechos fundamentales</p>
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
                <DialogTitle>{editingItem ? 'Editar Tutela' : 'Nueva Tutela'}</DialogTitle>
              </DialogHeader>
              <TutelasForm onSubmit={handleSubmit} initialData={editingItem || undefined} mode={editingItem ? 'edit' : 'create'} />
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
          title="Acciones de Tutela"
          description={`Seguimiento de tutelas y derechos de petición constitucionales (${data.length} registros)`}
          data={data}
          columns={columns}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
