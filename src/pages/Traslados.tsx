import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, RefreshCw, Search, Save, Edit } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow } from "@/lib/googleSheets";

export default function TrasladosPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];
  
  const actosAdministrativos = ["RESOLUCIÓN", "AUTO INADMISORIO", "REQUERIMIENTO ORDINARIO", "TRASLADO", "AUTO DE CIERRE"];
  const areasRemitentes = ["COACTIVA", "LIQUIDACIÓN", "FISCALIZACIÓN", "RECAUDO", "JURÍDICA", "DESPACHO"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sheetName = "Base Traslados Fiscalizacion"; 
      const result = await readSheet(sheetName); 
      const records = (result[sheetName] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`,
        sadeIngreso: row.sadeIngreso || row[Object.keys(row)[0]] || "",
        noPlanilla: row.noPlanilla || row[Object.keys(row)[1]] || "",
        expediente: row.expediente || row[Object.keys(row)[2]] || "",
        actoAdministrativo: row.actoAdministrativo || row[Object.keys(row)[3]] || "",
        areaRemitente: row.areaRemitente || row[Object.keys(row)[4]] || "",
        noActoSade: row.noActoSade || row[Object.keys(row)[5]] || "",
        fechaActo: row.fechaActo || row[Object.keys(row)[6]] || "",
        placa: row.placa || row[Object.keys(row)[7]] || "",
        identificacion: row.identificacion || row[Object.keys(row)[8]] || "",
        contribuyente: row.contribuyente || row[Object.keys(row)[9]] || "",
        contacto: row.contacto || row[Object.keys(row)[10]] || "",
        ciudad: row.ciudad || row[Object.keys(row)[11]] || "",
        observaciones: row.observaciones || row[Object.keys(row)[12]] || "",
        fechaPlanilla: row.fechaPlanilla || row[Object.keys(row)[13]] || "",
        funcionario: row.funcionario || row[Object.keys(row)[14]] || ""
      }));
      setData(records);
    } catch (error) { 
      toast.error("Error al cargar los datos de traslados"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      const sheetName = "Base Traslados Fiscalizacion";
      const rowData = [
        formData.sadeIngreso || "",         // A: SADE de Ingreso
        formData.noPlanilla || "",          // B: No. Planilla
        formData.expediente || "",          // C: No. Expediente
        formData.actoAdministrativo || "",  // D: Acto Administrativo
        formData.areaRemitente || "",       // E: Área a la que se remite
        formData.noActoSade || "",          // F: No. Acto Administrativo y No. SADE
        formData.fechaActo || "",           // G: Fecha Acto
        formData.placa || "",               // H: Placa
        formData.identificacion || "",      // I: No. de Identificación
        formData.contribuyente || "",       // J: Contribuyente
        formData.contacto || "",            // K: Dirección y Correo Electrónico
        formData.ciudad || "",              // L: Ciudad-Departamento
        formData.observaciones || "",       // M: Observaciones
        formData.fechaPlanilla || "",       // N: Fecha Planilla
        formData.funcionario || ""          // O: Funcionario
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(sheetName, `A${rowNumber}:O${rowNumber}`, rowData);
        toast.success("¡Proceso de traslado actualizado exitosamente!");
      } else {
        await appendToSheet(sheetName, rowData);
        toast.success("¡Nuevo proceso de traslado registrado!");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) { 
      toast.error("Error al guardar en la hoja de cálculo"); 
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val: any) => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === "ALL" || item.actoAdministrativo === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Procesos de Traslado</h1>
          <p className="text-sm text-gray-500">Gestión y seguimiento de planillas de entrega de expedientes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" className="border-slate-300">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar en todos los campos..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-9 bg-white h-9"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-56 bg-white h-9">
              <SelectValue placeholder="Filtrar por acto administrativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los actos</SelectItem>
              {actosAdministrativos.map(act => <SelectItem key={act} value={act}>{act}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-3">SADE Ingreso</th>
                <th className="p-3">Planilla</th>
                <th className="p-3">Expediente</th>
                <th className="p-3">Acto Administrativo</th>
                <th className="p-3">Contribuyente</th>
                <th className="p-3">Fecha Planilla</th>
                <th className="p-3">Funcionario</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">Cargando registros de traslados...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">No se encontraron procesos con los filtros aplicados.</td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-medium text-slate-900">{item.sadeIngreso}</td>
                    <td className="p-3 text-slate-600">{item.noPlanilla}</td>
                    <td className="p-3 text-slate-600">{item.expediente}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {item.actoAdministrativo}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{item.contribuyente}</td>
                    <td className="p-3 text-slate-600">{item.fechaPlanilla}</td>
                    <td className="p-3 text-slate-600">{item.funcionario}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); reset(item); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span>Mostrando {filteredData.length} de {data.length} procesos</span>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>{editingItem ? "Editar Proceso de Traslado" : "Nueva Planilla de Traslado"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold">SADE de Ingreso</Label>
                <Input {...register("sadeIngreso")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">No. Planilla</Label>
                <Input {...register("noPlanilla")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">No. Expediente</Label>
                <Input {...register("expediente")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Acto Administrativo</Label>
                <Select onValueChange={(v) => setValue("actoAdministrativo", v)} defaultValue={editingItem?.actoAdministrativo}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{actosAdministrativos.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Área a la que se remite</Label>
                <Select onValueChange={(v) => setValue("areaRemitente", v)} defaultValue={editingItem?.areaRemitente}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                  <SelectContent>{areasRemitentes.map(ar => <SelectItem key={ar} value={ar}>{ar}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">No. Acto / SADE Salida</Label>
                <Input {...register("noActoSade")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Fecha del Acto</Label>
                <Input {...register("fechaActo")} type="date" className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Placa</Label>
                <Input {...register("placa")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">No. de Identificación</Label>
                <Input {...register("identificacion")} className="bg-white h-8" />
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Contribuyente</Label>
                <Input {...register("contribuyente")} className="bg-white h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Ciudad - Departamento</Label>
                <Input {...register("ciudad")} className="bg-white h-8" />
              </div>

              <div className="space-y-1 md:col-span-3">
                <Label className="text-xs font-bold">Dirección y Correo Electrónico</Label>
                <Input {...register("contacto")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Fecha Planilla</Label>
                <Input {...register("fechaPlanilla")} type="date" className="bg-white h-8" />
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionario", v)} defaultValue={editingItem?.funcionario}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione funcionario..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1 md:col-span-3">
                <Label className="text-xs font-bold">Observaciones</Label>
                <Input {...register("observaciones")} className="bg-white h-8" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-5 text-lg font-bold text-white hover:bg-black">
              <Save className="mr-2 h-5 w-5" /> Guardar Planilla de Traslado
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
