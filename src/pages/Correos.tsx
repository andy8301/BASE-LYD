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

  // ESTADO INICIAL CON LAS VARIABLES EXACTAS EN INGLÉS TÉCNICO INTERNO
  const [formData, setFormData] = useState({
    canalIngreso: "CORREO ELECTRÓNICO", // A
    mes: "OCTUBRE",                     // B
    fechaAsignacion: "",                // C
    correoFuncionarioEncargado: "respuestavur@valledelcauca.gov.co", // D
    funcionarioEncargado: "",           // E
    asuntoCorreo: "",                   // F
    fechaCorreo: "",                    // G
    contribuyenteSolicitante: "",       // H
    correoSolicitante: "",              // I
    tipoRenta: "",                      // J
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
      
      // EL MAPEO EN EL ORDEN MATRIZ EXACTO DE TU EXCEL (A - Z)
      const nuevaFila = [
        formData.canalIngreso,               // A
        formData.mes,                        // B
        formData.fechaAsignacion,            // C
        formData.correoFuncionarioEncargado, // D
        formData.funcionarioEncargado,       // E
        formData.asuntoCorreo,               // F
        formData.fechaCorreo,                // G
        formData.contribuyenteSolicitante,   // H
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
      toast.success("Registro guardado exitosamente");
      
      // Resetear campos variables manteniendo los valores por defecto
      setFormData({
        ...formData,
        fechaAsignacion: "",
        funcionarioEncargado: "",
        asuntoCorreo: "",
        fechaCorreo: "",
        contribuyenteSolicitante: "",
        correoSolicitante: "",
        tipoRenta: "",
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
      {/* Encabezado Principal */}
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

      {/* MODAL CON SCROLL PARA LA TOTALIDAD DE CAMPOS (A - Z) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Correspondencia Electrónica</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={manejarEnviar} className="space-y-4 pt-2">
            
            {/* ENCABEZADOS EN ESPAÑOL IDÉNTICOS A TU EXCEL */}
            
            {/* Bloque 1: Columnas A - D */}
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

            {/* Bloque 2: Columnas E - I */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>FUNCIONARIO ENCARGADO</Label>
                <Input type="text" name="funcionarioEncargado" value={formData.funcionarioEncargado} onChange={handleChange} required />
              </div>
              <div>
                <Label>FECHA CORREO (DD-MM-AAAA)</Label>
                <Input type="date" name="fechaCorreo" value={formData.fechaCorreo} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CONTRIBUYENTE O SOLICITANTE</Label>
                <Input type="text" name="contribuyenteSolicitante" value={formData.contribuyenteSolicitante} onChange={handleChange} required />
              </div>
              <div>
                <Label>CORREO SOLICITANTE</Label>
                <Input type="email" name="correoSolicitante" value={formData.correoSolicitante} onChange={handleChange} required />
              </div>
            </div>

            {/* Bloque 3: Columnas J - N */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>TIPO DE RENTA</Label>
                <Input type="text" name="tipoRenta" value={formData.tipoRenta} onChange={handleChange} placeholder="Ej. Vehículos, Registro" />
              </div>
              <div>
                <Label>TIPO DE TRAMITE</Label>
                <Input type="text" name="tipoTramite" value={formData.tipoTramite} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label>SI EL TIPO DE RENTA ES OTRO (ESPECIFICAR EN ESTA COLUMNA)</Label>
              <Input type="text" name="tipoRentaOtro" value={formData.tipoRentaOtro} onChange={handleChange} />
            </div>

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

            {/* Bloque 4: Columnas O - S */}
            <div className="grid grid-cols-2 gap
