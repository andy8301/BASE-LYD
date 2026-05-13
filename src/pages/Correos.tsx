import { useState, useEffect } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { BaseCorreos } from "@/types/processes";
import { CorreosForm } from "@/components/forms/CorreosForm";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { readSheet, appendToSheet, SHEET_NAMES } from "@/lib/googleSheets";

function rowToCorreos(row: Record<string, string>, index: number): BaseCorreos {
  const fechaVencimiento = row['FECHA DE VENCIMIENTO'] || new Date().toISOString();
  const diasPendientes = parseInt(row['DIAS PENDIENTES'] || '0') || 0;

  return {
    id: `row-${index + 2}`,
    canalIngreso: row['CANAL DE INGRESO'] || '',
    funcionarioEncargado: row['FUNCIONARIO ENCARGADO'] || '',
    tipoRenta: row['TIPO DE RENTA'] || '',
    tipoTramite: row['TIPO DE TRAMITE'] || '',
    fechaVencimiento,
    diasPendientes,
    semaforo: row['SEMAFORO'] === 'VENCIDO' ? 'rojo' : row['SEMAFORO'] === 'PROXIMO' ? 'amarillo' : 'verde',
    estado: row['SEMAFORO'] === 'VENCIDO' ? 'vencido' : 'pendiente',
    fechaIngreso: row['FECHA ASIGNACION'] || new Date().toISOString(),
    mes: row['MES'] || '',
    fechaAsignacion: row['FECHA ASIGNACION'] || '',
    correoFuncionario: row['CORREO FUNCIONARIO ENCARGADO'] || '',
    asuntoCorreo: row['ASUNTO CORREO'] || '',
    fechaCorreo: row['FECHA CORREO (DD-MM-AAAA)'] || '',
    contribuyenteSolicitante: row['CONTRIBUYENTE O SOLICITANTE'] || '',
    item: row['ITEM'] || '',
    placa: row['PLACA'] || '',
    fechaRespuesta: row['FECHA RESPUESTA (DD-MM-AAAA)'] || '',
    tipoRespuesta: row['TIPO DE RESPUESTA'] || '',
    numeroSadeSalida: row['No DE SADE DE SALIDA'] || '',
    observaciones: row['OBSERVACIONES'] || '',
  };
}

export default function CorreosPage() {
  const [data, setData] = useState<BaseCorreos[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseCorreos | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { key: 'asuntoCorreo', label: 'Asunto' },
    { key: 'contribuyenteSolicitante', label: 'Solicitante' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'tipoTramite', label: 'Tipo Trámite' },
    { key: 'fechaCorreo', label: 'Fecha Correo' },
    { key: 'fechaRespuesta', label: 'Fecha Respuesta',
      render: (item: BaseCorreos) => item.fechaRespuesta || 'Pendiente'
    }
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.CORREOS);
      const sheetData = result[SHEET_NAMES.CORREOS] || [];
      const records = sheetData.map((row: Record<string, string>, index: number) => rowToCorreos(row, index));
      setData(records);
      console.log(`Loaded ${records.length} records from Correos`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos de Correos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = (formData: BaseCorreos) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast.success("Correo actualizado exitosamente");
    } else {
      setData(prev => [...prev, formData]);
      toast.success("Correo creado exitosamente");
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: BaseCorreos) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Correos Electrónicos</h1>
          <p className="text-muted-foreground text-lg">Gestión y seguimiento de correspondencia electrónica</p>
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
                <DialogTitle>{editingItem ? 'Editar Correo' : 'Nuevo Correo'}</DialogTitle>
              </DialogHeader>
              <CorreosForm onSubmit={handleSubmit} initialData={editingItem || undefined} mode={editingItem ? 'edit' : 'create'} />
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
          title="Correspondencia Electrónica"
          description={`Seguimiento de correos, consultas y respuestas (${data.length} registros)`}
          data={data}
          columns={columns}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
