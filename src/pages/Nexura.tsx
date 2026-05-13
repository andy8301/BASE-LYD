import { useState, useEffect } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { BaseNexura } from "@/types/processes";
import { NexuraForm } from "@/components/forms/NexuraForm";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { readSheet, SHEET_NAMES } from "@/lib/googleSheets";

function rowToNexura(row: Record<string, string>, index: number): BaseNexura {
  const diasRestantes = parseInt(row['Días hábiles restantes'] || '0') || 0;

  return {
    id: `row-${index + 2}`,
    canalIngreso: row['CANAL DE INGRESO'] || row['Canal de ingreso'] || '',
    funcionarioEncargado: row['FUNCIONARIO ENCARGADO'] || '',
    tipoRenta: row['TIPO DE RENTA'] || '',
    tipoTramite: row['TIPO DE TRAMITE'] || row['Tipo de solicitud'] || '',
    fechaVencimiento: row['Fecha límite de respuesta'] || '',
    diasPendientes: parseInt(row['DIAS PENDIENTES'] || '0') || 0,
    semaforo: row['SEMAFORO DE VENCIMIENTO'] === 'VENCIDO' ? 'rojo' : diasRestantes <= 3 ? 'amarillo' : 'verde',
    estado: row['Estado'] === 'Cerrado' ? 'resuelto' : diasRestantes < 0 ? 'vencido' : 'pendiente',
    fechaIngreso: row['Fecha ingreso'] || '',
    radicacion: row['No. radicación'] || '',
    radicacionExterno: row['No. radicación externo'] || '',
    secretaria: row['Secretaría'] || '',
    tipoSolicitud: row['Tipo de solicitud'] || '',
    condicionSolicitud: row['Condición de solicitud'] || '',
    responsable: row['Responsable'] || '',
    fechaLimiteRespuesta: row['Fecha límite de respuesta'] || '',
    fechaRespuesta: row['Fecha de respuesta'] || row['FECHA DE RESPUESTA'] || '',
    diasHabilesRestantes: diasRestantes,
    diasHabilesTranscurridos: parseInt(row['Días hábiles transcurridos '] || '0') || 0,
    nombreSolicitante: row['Nombre del solicitante'] || '',
    telefono: row['Teléfono de contacto'] || '',
    email: row['Email'] || '',
    item: row['ITEM'] || '',
    tipoRespuesta: row['TIPO DE RESPUESTA'] || '',
    numeroSadeSalida: row['NUMERO DE SADE DE SALIDA (SI APLICA)'] || '',
  };
}

export default function NexuraPage() {
  const [data, setData] = useState<BaseNexura[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseNexura | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { key: 'radicacion', label: 'Radicación' },
    { key: 'tipoSolicitud', label: 'Tipo Solicitud' },
    { key: 'nombreSolicitante', label: 'Solicitante' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'responsable', label: 'Responsable' },
    { key: 'fechaIngreso', label: 'Fecha Ingreso' },
    { key: 'fechaLimiteRespuesta', label: 'Fecha Límite' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.NEXURA);
      const sheetData = result[SHEET_NAMES.NEXURA] || [];
      const records = sheetData.map((row: Record<string, string>, index: number) => rowToNexura(row, index));
      setData(records);
      console.log(`Loaded ${records.length} records from Nexura`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos de Nexura");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = (formData: BaseNexura) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast.success("Registro Nexura actualizado exitosamente");
    } else {
      setData(prev => [...prev, formData]);
      toast.success("Registro Nexura creado exitosamente");
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: BaseNexura) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Base Nexura</h1>
          <p className="text-muted-foreground text-lg">Sistema de radicación y gestión de PQRSD</p>
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
                <DialogTitle>{editingItem ? 'Editar PQRSD' : 'Nueva PQRSD'}</DialogTitle>
              </DialogHeader>
              <NexuraForm onSubmit={handleSubmit} initialData={editingItem || undefined} mode={editingItem ? 'edit' : 'create'} />
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
          title="PQRSD y Radicación"
          description={`Seguimiento de peticiones, quejas, reclamos, sugerencias y denuncias (${data.length} registros)`}
          data={data}
          columns={columns}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
