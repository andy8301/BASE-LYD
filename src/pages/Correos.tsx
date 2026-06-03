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

// 4. LISTADO DE LOS 9 TIPOS DE RESPUESTA DICTADOS
const tipoRespuestaList: string[] = [
  "RESPUESTA DERECHO DE PETICION",
  "AUTO DE CIERRE",
  "TRASLADO",
  "LIQUIDACION OFICIAL",
  "SANCION",
  "AUTO INADMISORIO",
  "RESOLUCION RECHAZADA",
  "RESOLUCION CONCEDIDA",
  "NOTIFICACION"
];

// 5. LISTADO DE LAS 6 OPCIONES DE PRELACION LEGAL
const prelacionLegalList: string[] = [
  "PETICIONES DE AUTORIDADES",
  "PETICIONES DE PERIODISTAS",
  "RIESGO DE VIDA O SALUD",
  "POBLACION VULNERABLE",
  "DERECHOS FUNDAMENTALES",
  "N/A"
];

export default function Correos() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [mostrarCamposExtras, setMostrarCamposExtras] = useState<boolean>(false);

  // Tipado estricto (Record<string, string>) en lugar de "any" para que GitHub Actions apruebe la subida
  const [formData, setFormData] = useState<Record<string, string>>({
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
    tipoRespuesta: "RESPUESTA DERECHO DE PETICION",
    noSadeSalida: "",
    observaciones: "",
    prelacionLegal: "PETICIONES DE AUTORIDADES",
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
      
      const nuevaFila: string[] = [
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
