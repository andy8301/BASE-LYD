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

  // ESTADO INTERNO CON TODOS LOS CAMPOS DE LA A A LA Z
  const [formData, setFormData] = useState({
    canalIngreso: "CORREO ELECTRÓNICO", // A
    mes: "OCTUBRE",                     // B
    fechaAsignacion: "",                // C
    correoFuncionarioEncargado: "respuestavur@valledelcauca.gov.co", // D
    funcionarioEncargado: "",           // E
    asuntoCorreo: "",                   // F
    fechaCorreo: "",                    // G
    contribuyenteOclicitante: "",       // H
    correoSolicitante: "",              // I
    tipoRenta: "VEHICULOS",             // J (Inicia por defecto en VEHICULOS)
    tipoRentaOtro: "",                  // K
    tipoTramite: "",                    // L
    item: "",                           // M
    placa: "",                          // N
    fechaRespuesta: "",                 // O
    tipoRespuesta: "",                  // P
    noSadeSalida: "",                   // Q
    observaciones: "",                  // R
    prelacionLegal: "",                 // S
    fechaVencimiento: "",               // T
    diasPendientes: "",                 // U
    semaforo: "",                       // V
    noExpediente: "",                   // W
    anoIngreso: "",                     // X
    mesIngreso: "",                     // Y
    siEsFormula: ""                     // Z
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
      
      const nuevaFila = [
        formData.canalIngreso,               // A
        formData.mes,                        // B
        formData.fechaAsignacion,            // C
        formData.correoFuncionarioEncargado, // D
        formData.funcionarioEncargado,       // E
        formData.asuntoCorreo,               // F
        formData.fechaCorreo,                // G
        formData.contribuyenteOclicitante,   // H
        formData.correoSolicitante,          // I
        formData.tipoRenta,                  // J
        formData.tipoRentaOtro,              // K
        formData.tipoTramite,                // L
        formData.item,                       // M
        formData.placa,                      // N
        formData.fechaRespuesta,             // O
        formData.tipoRespuesta,              // P
        formData.noSadeSalida,               // Q
        formData.observaciones,              // R
        formData.prelacionLegal,             // S
        formData.fechaVencimiento,           // T
        formData.diasPendientes,             // U
        formData.semaforo,                   // V
        formData.noExpediente,               // W
        formData.anoIngreso,                 // X
        formData.mesIngreso,                 // Y
        formData.siEsFormula                 // Z
      ];

      await appendToSheet(SHEET_NAMES.CORREOS, nuevaFila);
      setIsDialogOpen(false);
      toast.success("Registro guardado con éxito");
      
      setFormData({
        ...formData,
        fechaAsignacion: "",
        funcionarioEncargado: "",
        asuntoCorreo: "",
        fechaCorreo: "",
        contribuyenteOclicitante: "",
        correoSolicitante: "",
        tipoRenta: "VEHICULOS",
        tipoRentaOtro: "",
        tipoTramite: "",
        item: "",
        placa: "",
        fechaRespuesta: "",
        tipoRespuesta: "",
        noSadeSalida: "",
        observaciones: "",
        prelacionLegal: "",
        fechaVencimiento: "",
        diasPendientes: "",
        semaforo: "",
        noExpediente: "",
        anoIngreso: "",
        mesIngreso: "",
        siEsFormula: ""
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Correspondencia Electrónica</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={manejarEnviar} className="space-y-4 pt-2">
            
            {/* A y B */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CANAL DE INGRESO</Label>
                <Input name="canalIngreso" value={formData.canalIngreso} disabled className="bg-muted" />
              </div>
              <div>
                <Label>MES</Label>
                <select name="mes" value={formData.mes} onChange={handleChange} className="w-full p-2 border rounded-md text-sm bg-background" required>
                  {["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* C y D */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>FECHA ASIGNACION</Label>
                <Input type="date" name="fechaAsignacion" value={formData.fechaAsignacion} onChange={handleChange} required />
              </div>
              <div>
                <Label>CORREO FUNCIONARIO ENCARGADO</Label>
                <Input type="email" name="correoFuncionarioEncargado" value={formData.correoFuncionarioEncargado} onChange={handleChange} required />
              </div>
            </div>

            {/* E */}
            <div>
              <Label>FUNCIONARIO ENCARGADO</Label>
              <Input type="text" name="funcionarioEncargado" value={formData.funcionarioEncargado} onChange={handleChange} required />
            </div>

            {/* F */}
            <div>
              <Label>ASUNTO CORREO</Label>
              <textarea
                name="asuntoCorreo"
                value={formData.asuntoCorreo}
                onChange={handleChange}
                rows={2}
                className="w-full p-2 border rounded-md text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* G, H, I */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>FECHA CORREO (DD-MM-AAAA)</Label>
                <Input type="date" name="fechaCorreo" value={formData.fechaCorreo} onChange={handleChange} required />
              </div>
              <div>
                <Label>CONTRIBUYENTE O SOLICITANTE</Label>
                <Input type="text" name="contribuyenteOclicitante" value={formData.contribuyenteOclicitante} onChange={handleChange} required />
              </div>
              <div>
                <Label>CORREO SOLICITANTE</Label>
                <Input type="email" name="correoSolicitante" value={formData.correoSolicitante} onChange={handleChange} required />
              </div>
            </div>

            {/* J y L (TIPO DE RENTA como menú desplegable y TIPO DE TRÁMITE) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>TIPO DE RENTA</Label>
                <select 
                  name="tipoRenta" 
                  value={formData.tipoRenta} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md text-sm bg-background"
                  required
                >
                  <option value="VEHICULOS">VEHICULOS</option>
                  <option value="REGISTRO">REGISTRO</option>
                  <option value="ESTAMPILLAS">ESTAMPILLAS</option>
                  <option value="DEGUELLO">DEGUELLO</option>
                  <option value="TASAS">TASAS</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>
              <div>
                <Label>TIPO DE TRAMITE</Label>
                <Input type="text" name="tipoTramite" value={formData.tipoTramite} onChange={handleChange} />
              </div>
            </div>

            {/* K */}
            <div>
              <Label>SI EL TIPO DE RENTA ES OTRO (ESPECIFICAR EN ESTA COLUMNA)</Label>
              <Input type="text" name="tipoRentaOtro" value={formData.tipoRentaOtro} onChange={handleChange} />
            </div>

            {/* M y N */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ITEM</Label>
                <Input type="text" name="item" value={formData.item} onChange={handleChange} />
              </div>
              <div>
                <Label>PLACA</Label>
                <Input type="text" name="placa" value={formData.placa} onChange={handleChange} />
              </div>
            </div>

            {/* O y P */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>FECHA RESPUESTA (DD-MM-AAAA)</Label>
                <Input type="date" name="fechaRespuesta" value={formData.fechaRespuesta} onChange={handleChange} />
              </div>
              <div>
                <Label>TIPO DE RESPUESTA</Label>
                <Input type="text" name="tipoRespuesta" value={formData.tipoRespuesta} onChange={handleChange} />
              </div>
            </div>

            {/* Q */}
            <div>
              <Label>No DE SADE DE SALIDA</Label>
              <Input type="text" name="noSadeSalida" value={formData.noSadeSalida} onChange={handleChange} />
            </div>

            {/* R */}
            <div>
              <Label>OBSERVACIONES</Label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={2}
                className="w-full p-2 border rounded-md text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* S, T, U */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>PRELACIÓN LEGAL</Label>
                <Input type="text" name="prelacionLegal" value={formData.prelacionLegal} onChange={handleChange} />
              </div>
              <div>
                <Label>FECHA DE VENCIMIENTO</Label>
                <Input type="date" name="fechaVencimiento" value={formData.fechaVencimiento} onChange={handleChange} />
              </div>
              <div>
                <Label>DIAS PENDIENTES</Label>
                <Input type="number" name="diasPendientes" value={formData.diasPendientes} onChange={handleChange} />
              </div>
            </div>

            {/* V, W, X */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>SEMAFORO</Label>
                <Input type="text" name="semaforo" value={formData.semaforo} onChange={handleChange} />
              </div>
              <div>
                <Label>NO EXPEDIENTE</Label>
                <Input type="text" name="noExpediente" value={formData.noExpediente} onChange={handleChange} />
              </div>
              <div>
                <Label>AÑO INGRESO</Label>
                <Input type="number" name="anoIngreso" value={formData.anoIngreso} onChange={handleChange} />
              </div>
            </div>

            {/* Y y Z */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>MES INGRESO</Label>
                <Input type="text" name="mesIngreso" value={formData.mesIngreso} onChange={handleChange} />
              </div>
              <div>
                <Label>SI ES FORMULA</Label>
                <Input type="text" name="siEsFormula" value={formData.siEsFormula} onChange={handleChange} />
              </div>
            </div>

            {/* Botones de acción */}
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
        Tabla de control de correos electrónicos de la A a la Z organizada por orden exacto.
      </div>
    </div>
  );
}
