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

  // INTERRUPTOR VISUAL: Abre de la L a la Z
  const [mostrarCamposExtras, setMostrarCamposExtras] = useState(false);

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
    tipoRenta: "VEHICULOS",             // J
    tipoRentaOtro: "",                  // K (Se envía vacío por la estructura de celdas)
    tipoTramite: "LIQUIDACION",         // L (Inicia por defecto)
    item: "",                           // M
    placa: "",                          // N
    fechaRespuesta: "",                 // O
    tipoRespuesta: "LIQUIDACION",       // P (Inicia por defecto)
    noSadeSalida: "",                   // Q
    observaciones: "",                  // R
    prelacionLegal: "DERECHOS DE PETICIÓN (15 DÍAS HÁBILES)", // S (Inicia por defecto)
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
        formData.contribuyenteOclicitante,
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
        contribuyenteOclicitante: "",
        correoSolicitante: "",
        tipoRenta: "VEHICULOS",
        tipoRentaOtro: "",
        tipoTramite: "LIQUIDACION",
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
            
            {/* BLOQUE HASTA CAMPO J */}

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

            {/* J (TIPO DE RENTA) */}
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

            {/* BOTÓN COLUMNA K: DISPARADOR PARA MOSTRAR LO SIGUIENTE */}
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
                
                {/* L (TIPO DE TRAMITE DESPLEGABLE) */}
                <div>
                  <Label>TIPO DE TRAMITE</Label>
                  <select 
                    name="tipoTramite" 
                    value={formData.tipoTramite} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md text-sm bg-background"
                  >
                    <option value="LIQUIDACION">LIQUIDACION</option>
                    <option value="RESPUESTA A PETICION">RESPUESTA A PETICION</option>
                    <option value="DEVOLUCION">DEVOLUCION</option>
                    <option value="CORRECCION DE DECLARACION">CORRECCION DE DECLARACION</option>
                    <option value="RECURSO">RECURSO</option>
                    <option value="SOLICITUD EXENCION">SOLICITUD EXENCION</option>
                  </select>
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

                {/* O y P (TIPO DE RESPUESTA DESPLEGABLE) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>FECHA RESPUESTA (DD-MM-AAAA)</Label>
                    <Input type="date" name="fechaRespuesta" value={formData.fechaRespuesta} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>TIPO DE RESPUESTA</Label>
                    <select 
                      name="tipoRespuesta" 
                      value={formData.tipoRespuesta} 
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md text-sm bg-background"
                    >
                      <option value="LIQUIDACION">LIQUIDACION</option>
                      <option value="OFICIO">OFICIO</option>
                      <option value="RESOLUCION">RESOLUCION</option>
                      <option value="REQUERIMIENTO ORDINARIO">REQUERIMIENTO ORDINARIO</option>
                      <option value="AUTO">AUTO</option>
                    </select>
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

                {/* S (PRELACIÓN LEGAL DESPLEGABLE), T, U */}
                <div>
                  <Label>PRELACIÓN LEGAL</Label>
                  <select 
                    name="prelacionLegal" 
                    value={formData.prelacionLegal} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md text-sm bg-background mb-4"
                  >
                    <option value="DERECHOS DE PETICIÓN (15 DÍAS HÁBILES)">DERECHOS DE PETICIÓN (15 DÍAS HÁBILES)</option>
                    <option value="TUTELAS (48 HORAS O 10 DÍAS PRORROGABLES)">TUTELAS (48 HORAS O 10 DÍAS PRORROGABLES)</option>
                    <option value="TRASLADOS (5 DÍAS HÁBILES)">TRASLADOS (5 DÍAS HÁBILES)</option>
                    <option value="ENTIDADES PÚBLICAS (10 DÍAS HÁBILES)">ENTIDADES PÚBLICAS (10 DÍAS HÁBILES)</option>
                    <option value="DERECHOS DE PETICIÓN ENTRE AUTORIDADES (10 DÍAS HÁBILES)">DERECHOS DE PETICIÓN ENTRE AUTORIDADES (10 DÍAS HÁBILES)</option>
                    <option value="SOLICITUD DE INFORMACIÓN COMPLEMENTARIA (30 DÍAS DESDE RADICACIÓN)">SOLICITUD DE INFORMACIÓN COMPLEMENTARIA (30 DÍAS DESDE RADICACIÓN)</option>
                    <option value="REVOCATORIA DIRECTA (2 MESES PARA RESOLVER)">REVOCATORIA DIRECTA (2 MESES PARA RESOLVER)</option>
                    <option value="SILENCIO ADMINISTRATIVO POSITIVO (3 MESES SIN RESPUESTA VUR)">SILENCIO ADMINISTRATIVO POSITIVO (3 MESES SIN RESPUESTA VUR)</option>
                    <option value="TÉRMINOS DE PRESCRIPCIÓN Y CADUCIDAD (DEPENDE DEL TRIBUTO)">TÉRMINOS DE PRESCRIPCIÓN Y CADUCIDAD (DEPENDE DEL TRIBUTO)</option>
                    <option value="CORRECCIONES EX-OFICIO (SEGÚN EL ESTATUTO TRIBUTARIO)">CORRECCIONES EX-OFICIO (SEGÚN EL ESTATUTO TRIBUTARIO)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
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
