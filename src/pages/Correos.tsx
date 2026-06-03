import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { appendToSheet, SHEET_NAMES } from "@/lib/googleSheets";

// 1. LISTADO DE LOS 34 FUNCIONARIOS
const funcionariosList: string[] = [
  "Maira Alejandra Cardona",
  "Adalberto Vasquez",
  "Benjamin Acosta Gordillo",
  "Carlos Peña",
  "Cesar Enrique Gomez",
  "Cristian Felipe Arana",
  "Claudia Mosquera",
  "Daniela Riascos",
  "Diego Fernando Ortiz",
  "Diego Fernando Lopez",
  "Eliana Salamanca",
  "Frank Mauricio Restrepo",
  "Gustavo Adolfo Valencia",
  "Ibeth Restrepo Espitia",
  "Isabel Cristina Quintero",
  "Jhon Helber Samboní",
  "Jorge Arias",
  "Jose Fernando Moreno",
  "Juan Manuel Pizo",
  "Katherine Salamanca",
  "Karol Tatiana Lopez",
  "Luis Andres Botia Riascos",
  "María Cristina Posso",
  "Maria Jose Cerquera",
  "Olga Lucía Gómez Aristizabal",
  "Robinson Rosero",
  "Samuel Orozco",
  "Sara Millán",
  "Wilson Quiñónez",
  "Yaleydy Mosquera",
  "Yamid Bolaños Manquillo",
  "Yohana Estrada",
  "Yurani Andrea Vivas",
  "Yuri Andrea Quintero"
];

// 2. LISTADO DE LOS 7 TRAMITES DEL SISTEMA
const tipoTramiteList: string[] = [
  "Derecho de Peticion",
  "Exencion",
  "Devolucion",
  "copia boleta fiscal",
  "recurso",
  "certificacion",
  "atencion PDTIR"
];

// 3. LISTADO DE LOS 4 ITEMS DEL SISTEMA
const itemList: string[] = [
  "copia boleta fiscal",
  "desglose impuesto de registro",
  "solicitud de informacion",
  "respuesta del contribuyente"
];

export default function Correos() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [mostrarCamposExtras, setMostrarCamposExtras] = useState<boolean>(false);

  // ESTADO INICIAL SEGURO Y ALINEADO CON LAS COLUMNAS DE GOOGLE SHEETS
  const [formData, setFormData] = useState<any>({
    canalIngreso: "CORREO ELECTRÓNICO",
    mes: "OCTUBRE",
    fechaAsignacion: "",
    correoFuncionarioEncargado: "respuestavur@valledelcauca.gov.co",
    funcionarioEncargado: "",
    asuntoCorreo: "",
    fechaCorreo: "",
    contribuyenteSolicitante: "",
    correoSolicitante: "",
    tipoRenta: "IMPUESTO SOBRE VEHÍCULOS AUTOMOTORES",
    tipoRentaOtro: "",
    tipoTramite: "Derecho de Peticion",
    item: "copia boleta fiscal",
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnviar = async (e: FormEvent<HTMLFormElement>) => {
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
      
      // RESET DEL FORMULARIO CON VALORES POR DEFECTO SEGUROS
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
        tipoTramite: "Derecho de Peticion",
        item: "copia boleta fiscal",
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
          type="button"
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
            
            {/* CAMPOS PRINCIPALES (A - B) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CANAL DE INGRESO</Label>
                <Input name="canalIngreso" value={formData.canalIngreso} disabled className="bg-muted" />
              </div>
              <div>
                <Label>MES</Label>
                <select name="mes" value={formData.mes} onChange={handleChange} className="w-full p-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary" required>
                  {["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CAMPOS PRINCIPALES (C - D) */}
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

            {/* CAMPO FUNCIONARIO ENCARGADO (E) */}
            <div>
              <Label>FUNCIONARIO ENCARGADO</Label>
              <select
                name="funcionarioEncargado"
                value={formData.funcionarioEncargado}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">Seleccione un funcionario...</option>
                {funcionariosList.map((funcionario) => (
                  <option key={funcionario} value={funcionario}>
                    {funcionario}
                  </option>
                ))}
              </select>
            </div>

            {/* ASUNTO CORREO (F) */}
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

            {/* CAMPOS PRINCIPALES (G - I) */}
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

            {/* TIPO DE RENTA (J) */}
            <div>
              <Label>TIPO DE RENTA</Label>
              <select 
                name="tipoRenta" 
                value={formData.tipoRenta} 
                onChange={handleChange} 
                className="w-full p-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary"
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

            {/* BOTÓN DISPARADOR DE CAMPOS EXTRAS (K) */}
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

            {/* CAMPOS COMPLEMENTARIOS (L - Z) */}
            {mostrarCamposExtras && (
              <div className="space-y-4 pt-2 border-t border-dashed border-slate-200 mt-2 animate-in fade-in duration-200">
                
                {/* TIPO DE TRAMITE (L) - CON LOS 7 ITEMS CORRECTOS */}
                <div>
                  <Label>TIPO DE TRAMITE</Label>
                  <select 
                    name="tipoTramite" 
                    value={formData.tipoTramite} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary"
                  >
                    {tipoTramiteList.map((tramite) => (
                      <option key={tramite} value={tramite}>{tramite}</option>
                    ))}
                  </select>
                </div>

                {/* ITEM (M) Y PLACA (N) - ITEM CON LOS 4 ITEMS REALES */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ITEM</Label>
                    <select 
                      name="item" 
                      value={formData.item} 
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary"
                    >
                      {itemList.map((it) => (
                        <option key={it} value={it}>{it}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>PLACA</Label>
                    <Input type="text" name="placa" value={formData.placa} onChange={handleChange} />
                  </div>
                </div>

                {/* FECHA RESPUESTA (O) Y TIPO DE RESPUESTA (P) */}
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
                      className="w-full p-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary"
                    >
                      <option value="LIQUIDACION">LIQUIDACION</option>
                      <option value="OFICIO">OFICIO</option>
                      <option value="RESOLUCION">RESOLUCION</option>
                      <option value="REQUERIMIENTO ORDINARIO">REQUERIMIENTO ORDINARIO</option>
                      <option value="AUTO">AUTO</option>
                    </select>
                  </div>
                </div>

                {/* No DE SADE DE SALIDA (Q) */}
                <div>
                  <Label>No DE SADE DE SALIDA</Label>
                  <Input type="text" name="noSadeSalida" value={formData.noSadeSalida} onChange={handleChange} />
                </div>

                {/* OBSERVACIONES (R) */}
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

                {/* PRELACIÓN LEGAL (S) */}
                <div>
                  <Label>PRELACIÓN LEGAL</Label>
                  <select 
                    name="prelacionLegal" 
                    value={formData.prelacionLegal} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md text-sm bg-background mb-4 focus:ring-1 focus:ring-primary"
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

                {/* FECHA VENCIMIENTO (T) Y DIAS PENDIENTES (U) */}
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

                {/* SEMAFORO (V), NO EXPEDIENTE (W), AÑO INGRESO (X) */}
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

                {/* MES INGRESO (Y) Y SI ES FORMULA (Z) */}
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

            {/* BOTONES DE ACCIÓN */}
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
