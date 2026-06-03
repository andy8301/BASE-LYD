import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { appendToSheet, SHEET_NAMES } from "@/lib/googleSheets";

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

// Lista Dictada Exacta para el campo ITEM
const itemList: string[] = [
  "copia boleta fiscal",
  "desglose impuesto de registro",
  "solicitud de informacion",
  "respuesta del contribuyente"
];

export default function Correos() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [mostrarCamposExtras, setMostrarCamposExtras] = useState<boolean>(false);

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
    item: "copia boleta fiscal", // Inicializado con el primer ítem dictado
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnviar = async (e: React.FormEvent<HTMLFormElement>) => {
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
            
            {/* CAMPOS PRINCIPALES */}
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

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMostrarCamposExtras(!mostrarCamposExtras)}
                className="w-full flex items-center justify-between p-3 border border-dashed border-primary/50 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <span>SI EL TIPO DE RENTA ES OTRO (HUNDA AQUÍ PARA VER MÁS CAMPOS)</span>
                {mostrarCamposExtras ? <ChevronUp
