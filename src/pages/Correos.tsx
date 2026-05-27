import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, Plus, Save, Search, FileSpreadsheet, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

export default function Correos() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // LOS CAMPOS EXACTOS DE TU EXCEL (Columnas A a la I)
  const [formData, setFormData] = useState({
    canalIngreso: "CORREO ELECTRÓNICO", // Columna A
    mes: "OCTUBRE",                     // Columna B
    fechaAsignacion: "",                // Columna C
    correoFuncionarioEncargado: "respuestavur@valledelcauca.gov.co", // Columna D
    funcionarioEncargado: "",           // Columna E
    asuntoCorreo: "",                   // Columna F
    fechaCorreo: "",                    // Columna G
    contribuyenteSolicitante: "",       // Columna H
    correoSolicitante: ""               // Columna I
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnviar = async (e: any) => {
    e.preventDefault();
    try {
      toast.success("Guardando registro...");
      
      // Mapeo directo en orden de columnas para tu Google Sheets
      const nuevaFila = [
        formData.canalIngreso,                // A
        formData.mes,                         // B
        formData.fechaAsignacion,             // C
        formData.correoFuncionarioEncargado,  // D
        formData.funcionarioEncargado,        // E
        formData.asuntoCorreo,                // F
        formData.fechaCorreo,                 // G
        formData.contribuyenteSolicitante,    // H
        formData.correoSolicitante            // I
      ];

      await appendToSheet(SHEET_NAMES.CORREOS, nuevaFila);
      setIsDialogOpen(false);
      toast.success("Registro guardado con éxito");
      
      // Limpiar campos después de guardar
      setFormData({
        ...formData,
        fechaAsignacion: "",
        funcionarioEncargado: "",
        asuntoCorreo: "",
        fechaCorreo: "",
        contribuyenteSolicitante: "",
        correoSolicitante: ""
      });
    } catch (error) {
      toast.error("Error al guardar el registro");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Correos Electrónicos</h1>
          <p className="text-muted-foreground">Gestión y seguimiento de correspondencia electrónica</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Agregar Nuevo
        </button>
      </div>

      {/* MODAL IDÉNTICO A BASE OLGA */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Correspondencia Electrónica</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={manejarEnviar} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Canal de Ingreso</Label>
                <Input name="canalIngreso" value={formData.canalIngreso} disabled className="bg-muted" />
              </div>
              <div>
                <Label>Mes</Label>
                <select name="mes" value={formData.mes} onChange={handleChange} className="w-full p-2 border rounded-md text-sm bg-background" required>
                  {["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha Correo (Origen)</Label>
                <Input type="date" name="fechaCorreo" value={formData.fechaCorreo} onChange={handleChange} required />
              </div>
              <div>
                <Label>Fecha Asignación</Label>
                <Input type="date" name="fechaAsignacion" value={formData.fechaAsignacion} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contribuyente / Solicitante</Label>
                <Input type="text" name="contribuyenteSolicitante" value={formData.contribuyenteSolicitante} onChange={handleChange} required />
              </div>
              <div>
                <Label>Correo Solicitante</Label>
                <Input type="email" name="correoSolicitante" value={formData.correoSolicitante} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Funcionario Encargado</Label>
                <Input type="text" name="funcionarioEncargado" value={formData.funcionarioEncargado} onChange={handleChange} required />
              </div>
              <div>
                <Label>Correo Funcionario</Label>
                <Input type="email" name="correoFuncionarioEncargado" value={formData.correoFuncionarioEncargado} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label>Asunto del Correo</Label>
              <textarea
                name="asuntoCorreo"
                value={formData.asuntoCorreo}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded-md text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Asunto completo del correo..."
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 border rounded-md text-sm hover:bg-muted">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                Guardar Registro
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border rounded-md p-8 text-center text-muted-foreground bg-card">
        Tabla de control de correos electrónicos.
      </div>
    </div>
  );
}
