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

  // Listados Maestros para evitar errores de escritura
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Cesar Enrique Gomez", "Luis Andres Botia Riascos", "Olga Lucia Gomez Aristizabal", "Yaleydy Mosquera"];
  const tiposRenta = ["IMPUESTO DE REGISTRO", "IMPUESTO SOBRE VEHICULOS", "IMPUESTO AL CONSUMO", "PASAPORTE"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      setData(result[SHEET_NAMES.BASE_OLGA] || []);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar datos de Google Sheets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      toast.success("¡Guardado con éxito!");
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold">Base Olga</h1>
          <p className="text-sm text-gray-500">Control de ingresos y trámites</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}><RefreshCw className="mr-2 h-4 w-4" /> Refrescar</Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Nuevo</Button>
        </div>
      </div>

      {/* Tabla Simple para evitar errores de renderizado */}
      <div className="bg-white rounded-lg border shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Consecutivo</th>
              <th className="p-3">Contribuyente</th>
              <th className="p-3">Renta</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">{item['No consecutivo']}</td>
                <td className="p-3">{item['CONTRIBUYENTE']}</td>
                <td className="p-3">{item['TIPO DE RENTA']}</td>
                <td className="p-3">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingItem({...item, id: `row-${idx+2}`}); reset(item); setIsDialogOpen(true); }}>Editar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Formulario de Registro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Consecutivo</Label><Input {...register("consecutivo")} /></div>
            <div className="space-y-2"><Label>Contribuyente</Label><Input {...register("contribuyente")} /></div>
            <div className="space-y-2">
              <Label>Funcionario</Label>
              <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button type="submit" className="col-span-2 mt-4"><Save className="mr-2" /> Guardar en Sheets</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
