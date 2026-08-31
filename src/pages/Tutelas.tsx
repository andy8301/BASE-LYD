import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, RefreshCw, Search, Save, Edit, Download, Filter } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow } from "@/lib/googleSheets";

export default function TutelasPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  const { register, handleSubmit, setValue, reset } = useForm();

  // Listas desplegables estándar para tutelas
  const estadosTutela = ["ADMITIDA", "FALLADA", "CUMPLIDA", "IMPUGNADA", "ARCHIVADA", "FONDOS"];
  const despachosJudiciales = [
    "JUZGADO PRIMERO CIVIL MUNICIPAL", 
    "JUZGADO SEGUNDO CIVIL MUNICIPAL", 
    "JUZGADO PRIMERO LABORAL", 
    "JUZGADO SEGUNDO LABORAL", 
    "TRIBUNAL SUPERIOR", 
    "OTRO"
  ];
  const funcionarios = ["Adalberto Vásquez", "Benjamín Acosta Gordillo", "Carlos Peña", "César Enrique Gómez", "Cristiano Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando López", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana López", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sheetName = "Base Tutelas"; // Nombre exacto de la pestaña en tu Sheets
      const result = await readSheet(sheetName); 
      const records = (result[sheetName] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`,
        radicado: row[Object.keys(row)[0]] || "",
        fechaNotificacion: row[Object.keys(row)[1]] || "",
        despacho: row[Object.keys(row)[2]] || "",
        accionante: row[Object.keys(row)[3]] || "",
        accionado: row[Object.keys(row)[4]] || "",
        expediente: row[Object.keys(row)[5]] || "",
        derechoInvocado: row[Object.keys(row)[6]] || "",
        funcionario: row[Object.keys(row)[7]] || "",
        estado: row[Object.keys(row)[8]] || "ADMITIDA",
        observaciones: row[Object.keys(row)[9]] || ""
      }));
      setData(records);
    } catch (error) { 
      toast.error("Error al cargar los datos de tutelas"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }
    try {
      const headers = Object.keys(data[0]).filter(k => k !== 'id');
      const csvRows = [
        headers.join(","),
        ...data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(","))
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Base_Tutelas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("¡Datos exportados exitosamente!");
    } catch (error) {
      toast.error("Error al exportar los datos");
    }
  };

  const onSubmit = async (formData: any) => {
    try {
      const sheetName = "Base Tutelas";
      const rowData = [
        formData.radicado || "",           // Columna A: Radicado / SADE
        formData.fechaNotificacion || "",  // Columna B: Fecha Notificación
        formData.despacho || "",           // Columna C: Despacho Judicial
        formData.accionante || "",         // Columna D: Accionante
        formData.accionado || "",          // Columna E: Accionado / Contribuyente
        formData.expediente || "",         // Columna F: No. Expediente
        formData.derechoInvocado || "",    // Columna G: Derecho Invocado
        formData.funcionario || "",        // Columna H: Funcionario Encargado
        formData.estado || "ADMITIDA",     // Columna I: Estado
        formData.observaciones || ""       // Columna J: Observaciones / Fallo
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(sheetName, `A${rowNumber}:J${rowNumber}`, rowData);
        toast.success("¡Tutela actualizada exitosamente!");
      } else {
        await appendToSheet(sheetName, rowData);
        toast.success("¡Nueva tutela registrada exitosamente!");
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
    const matchesStatus = statusFilter === "ALL" || item.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Cabecera del Módulo */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Acciones de Tutela</h1>
          <p className="text-sm text-gray-500">Seguimiento y control de requerimientos judiciales y tutelas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button onClick={fetchData} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
          <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo
          </Button>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros */}
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
        <div className="flex gap-2 w-full md:w-auto items-center">
          <Filter className="h-4 w-4 text-gray-400 hidden md:block" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-56 bg-white h-9">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los estados</SelectItem>
              {estadosTutela.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla de Visualización */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-3">Radicado / SADE</th>
                <th className="p-3">Fecha Notificación</th>
                <th className="p-3">Despacho Judicial</th>
                <th className="p-3">Accionante</th>
                <th className="p-3">Expediente</th>
                <th className="p-3">Funcionario</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">Cargando tutelas...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">No se encontraron tutelas con los filtros aplicados.</td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-medium text-slate-900">{item.radicado}</td>
                    <td className="p-3 text-slate-600">{item.fechaNotificacion}</td>
                    <td className="p-3 text-slate-600">{item.despacho}</td>
                    <td className="p-3 text-slate-600">{item.accionante}</td>
                    <td className="p-3 text-slate-600">{item.expediente}</td>
                    <td className="p-3 text-slate-600">{item.funcionario}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.estado === "ADMITIDA" ? "bg-amber-100 text-amber-800" :
                        item.estado === "FALLADA" ? "bg-blue-100 text-blue-800" :
                        item.estado === "CUMPLIDA" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                      }`}>
                        {item.estado}
                      </span>
                    </td>
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
          <span>Mostrando {filteredData.length} de {data.length} tutelas</span>
        </div>
      </div>

      {/* Modal de Formulario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>{editingItem ? "Editar Acción de Tutela" : "Nueva Acción de Tutela"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">Radicado / SADE</Label>
                <Input {...register("radicado")} className="bg-white h-8" placeholder="Ej. 2026..." />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Fecha Notificación</Label>
                <Input {...register("fechaNotificacion")} type="date" className="bg-white h-8" />
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Despacho Judicial</Label>
                <Select onValueChange={(v) => setValue("despacho", v)} defaultValue={editingItem?.despacho}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione despacho..." /></SelectTrigger>
                  <SelectContent>{despachosJudiciales.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Accionante</Label>
                <Input {...register("accionante")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Accionado / Contribuyente</Label>
                <Input {...register("accionado")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">No. Expediente</Label>
                <Input {...register("expediente")} className="bg-white h-8" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Derecho Invocado</Label>
                <Input {...register("derechoInvocado")} className="bg-white h-8" placeholder="Ej. Petición, Debido Proceso..." />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionario", v)} defaultValue={editingItem?.funcionario}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione funcionario..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Estado del Proceso</Label>
                <Select onValueChange={(v) => setValue("estado", v)} defaultValue={editingItem?.estado || "ADMITIDA"}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione estado..." /></SelectTrigger>
                  <SelectContent>{estadosTutela.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-bold">Observaciones / Fallo</Label>
                <Input {...register("observaciones")} className="bg-white h-8" />
              </div>

            </div>

            <Button type="submit" className="w-full bg-slate-900 py-5 text-lg font-bold text-white hover:bg-black">
              <Save className="mr-2 h-5 w-5" /> Guardar Acción de Tutela
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
