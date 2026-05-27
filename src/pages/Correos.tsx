import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, Plus, Save, Search, FileSpreadsheet, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

export default function Correos() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // INTERRUPTOR VISUAL: Abre los campos de la L a la Z
  const [mostrarCamposExtras, setMostrarCamposExtras] = useState(false);

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
    tipoRenta: "IMPUESTO SOBRE VEHÍCULOS AUTOMOTORES", // J (Intacto)
    tipoRentaOtro: "",                  // K
    tipoTramite: "DERECHO DE PETICION", // L (Inicia con la primera opción correcta)
    item: "",                           // M
    placa: "",                          // N
    fechaRespuesta: "",                 // O
    tipoRespuesta: "LIQUIDACION",       // P
    noSadeSalida: "",                   // Q
    observaciones: "",                  // R
    prelacionLegal: "DERECHOS DE PETICIÓN (15 DÍAS HÁBILES)", // S
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
        formData.canalIngreso,
        formData.mes,
        formData.fechaAsignacion,
        formData.correoFuncionarioEncargado,
        formData.funcionarioEncargado,
        formData.asuntoCorreo,
        formData.fechaCorreo,
        formData.contribuyenteSolicitante,
        formData.correoSolicitante,
        formData.tipoRenta,
        formData.tipoRentaOtro,
        formData.tipoTramite,
        formData.item,
        formData.placa,
        formData.fechaRespuesta,
        formData.tipoRespuesta,
        formData.noSadeSalida,
        formData.observaciones,
        formData.prelacionLegal,
        formData.fechaVencimiento,
        formData.diasPendientes,
        formData.semaforo,
        formData.noExpediente,
        formData.anoIngreso,
        formData.mesIngreso,
        formData.siEsFormula
      ];

      await appendToSheet(SHEET_NAMES.CORREOS, nuevaFila);
      setIsDialogOpen(false);
      setMostrarCamposExtras(false);
      toast.success("Registro guardado con éxito");
      
      setFormData({
        ...formData,
        fechaAsignacion: "",
        funcionarioEncargado: "",
        asuntoCorreo: "",
        fechaCorreo: "",
        contribuyenteSolicitante: "",
        correoSolicitante: "",
        tipoRenta: "IMPUESTO SOBRE VEHÍCULOS AUTOMOTORES",
        tipoRentaOtro: "",
        tipoTramite: "DERECHO DE PETICION",
        item: "",
        placa: "",
        fechaRespuesta: "",
        tipoRespuesta: "LIQUIDACION",
        noSadeSalida: "",
        observaciones: "",
        prelacionLegal: "DERECHOS DE PETICIÓN (15 DÍAS HÁBILES)",
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
          onClick={() => {
            setMostrarCamposExtras(false);
            setIsDialogOpen(true);
          }}
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
                <Input type="text" name="contribuyenteSolicitante" value={formData.contribuyenteSolicitante} onChange={handleChange} required />
              </div>
              <div>
                <Label>CORREO SOLICITANTE</Label>
                <Input type="email" name="correoSolicitante" value={formData.correoSolicitante} onChange={handleChange} required />
              </div>
            </div>

            {/* J (TIPO DE RENTA - INTACTO) */}
            <div>
              <Label>TIPO DE RENTA</Label>
              <select 
                name="tipoRenta" 
                value={formData.tipoRenta} 
                onChange={handleChange} 
                className="w-full p-2 border rounded-md text-sm bg-background"
                required
              >
                <option value="IMPUESTO SOBRE VEHÍCULOS AUTOMOTORES">IMPUESTO SOBRE VEHÍCULOS AUTOMOTORES</option>
                <option value="IMPUESTO DE REGISTRO">IMPUESTO DE REGISTRO</option>
                <option value="IMPUESTO AL DEGÜELLO DE GANADO MAYOR">IMPUESTO AL DEGÜELLO DE GANADO MAYOR</option>
                <option value="TASA DE SEGURIDAD">TASA DE SEGURIDAD</option>
                <option value="ESTAMPILLAS">ESTAMPILLAS</option>
                <option value="APREHENSIÓN Y DECOMISO DE MERCANCÍAS">APREHENSIÓN Y DECOMISO DE MERCANCÍAS</option>
                <option value="PASAPORTES">PASAPORTES</option>
                <option value="OTROS (Felicitaciones, Quejas, Etc)">OTROS (Felicitaciones, Quejas, Etc)</option>
              </select>
            </div>

            {/* BOTÓN COLUMNA K */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMostrarCamposExtras(!mostrarCamposExtras)}
                className="w-full flex items-center justify-between p-3 border border-dashed border-primary/50 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <span>SI EL TIPO DE RENTA ES OTRO (HUNDA AQUÍ PARA VER MÁS CAMPOS)</span>
                {mostrarCamposExtras ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* BLOQUE CAMPOS SIGUIENTES (L A Z) */}
            {mostrarCamposExtras && (
              <div className="space-y-4 pt-2 border-t border-dashed border-slate-200 mt-2 animate-in fade-in duration-300">
                
                {/* L - TIPO DE TRAMITE (ACTUALIZADO CON TUS OPCIONES REALES) */}
                <div>
                  <Label>TIPO DE TRAMITE</Label>
                  <select 
                    name="tipoTramite" 
                    value={formData.tipoTramite} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md text-sm bg-background"
                  >
                    <option value="DERECHO DE PETICION">DERECHO DE PETICION</option>
                    <option value="QUEJAS">QUEJAS</option>
                    <option value="RECLAMOS">RECLAMOS</option>
                    <option value="SUGERENCIAS">SUGERENCIAS</option>
                    <option value="FELICITACIONES">FELICITACIONES</option>
                    <option value="ATENCION PDTIR">ATENCION PDTIR</option>
                  </select>
                </div>

                {/* M y N */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ITEM</Label>
                    <Input type="text" name="item" value={formData.item} onChange={
