import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { appendToSheet, SHEET_NAMES } from "@/lib/googleSheets";

// 1. LISTADO DE LOS 34 FUNCIONARIOS
const funcionariosList: string[] = [
  "Maira Alejandra Cardona", "Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboní", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "María Cristina Posso", "Maria Jose Cerquera", "Olga Lucía Gómez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Yurani Andrea Vivas", "Yuri Andrea Quintero"
];

const tipoTramiteList: string[] = ["Derecho de Peticion", "Exencion", "Devolucion", "copia boleta fiscal", "recurso", "certificacion", "atencion PDTIR"];
const itemList: string[] = ["copia boleta fiscal", "desglose impuesto de registro", "solicitud de informacion", "respuesta del contribuyente"];
const tipoRespuestaList: string[] = ["RESPUESTA DERECHO DE PETICION", "AUTO DE CIERRE", "TRASLADO", "LIQUIDACION OFICIAL", "SANCION", "AUTO INADMISORIO", "RESOLUCION RECHAZADA", "RESOLUCION CONCEDIDA", "NOTIFICACION"];
const prelacionLegalList: string[] = ["PETICIONES DE AUTORIDADES", "PETICIONES DE PERIODISTAS", "RIESGO DE VIDA O SALUD", "POBLACION VULNERABLE", "DERECHOS FUNDAMENTALES", "N/A"];

interface CorreoFormData {
  canalIngreso: string; mes: string; fechaAsignacion: string; correoFuncionarioEncargado: string; funcionarioEncargado: string; asuntoCorreo: string; fechaCorreo: string; contribuyenteSolicitante: string; correoSolicitante: string; tipoRenta: string; tipoRentaOtro: string; tipoTramite: string; item: string; placa: string; fechaRespuesta: string; tipoRespuesta: string; noSadeSalida: string; observaciones: string; prelacionLegal: string; fechaVencimiento: string; diasPendientes: string; semaforo: string; noExpediente: string; anoIngreso: string; mesIngreso: string; siEsFormula: string;
}

const estadoInicial: CorreoFormData = {
  canalIngreso: "CORREO ELECTRÓNICO", mes: "OCTUBRE", fechaAsignacion: "", correoFuncionarioEncargado: "respuestavur@valledelcauca.gov.co", funcionarioEncargado: "", asuntoCorreo: "", fechaCorreo: "", contribuyenteSolicitante: "", correoSolicitante: "", tipoRenta: "IMPUESTO SOBRE VEHÍCULOS AUTOMOTORES", tipoRentaOtro: "", tipoTramite: "Derecho de Peticion", item: "copia boleta fiscal", placa: "", fechaRespuesta: "", tipoRespuesta: "RESPUESTA DERECHO DE PETICION", noSadeSalida: "", observaciones: "", prelacionLegal: "PETICIONES DE AUTORIDADES", fechaVencimiento: "", diasPendientes: "", semaforo: "", noExpediente: "", anoIngreso: "", mesIngreso: "", siEsFormula: ""
};

export default function Correos() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [mostrarCamposExtras, setMostrarCamposExtras] = useState<boolean>(false);
  const [formData, setFormData] = useState<CorreoFormData>(estadoInicial);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof CorreoFormData]: value }));
  };

  const manejarEnviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const nuevaFila: string[] = Object.values(formData);
      await appendToSheet(SHEET_NAMES.CORREOS, nuevaFila);
      setIsDialogOpen(false);
      setMostrarCamposExtras(false);
      toast.success("Registro guardado con éxito");
      setFormData(estadoInicial);
    } catch {
      toast.error("Error al guardar el registro");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold tracking-tight">Correos Electrónicos</h1></div>
        <button type="button" onClick={() => { setMostrarCamposExtras(false); setIsDialogOpen(true); }} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 text-sm font-medium">Agregar Nuevo</button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Registrar Correspondencia</DialogTitle></DialogHeader>
          <form onSubmit={manejarEnviar} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>CANAL DE INGRESO</Label><Input name="canalIngreso" value={formData.canalIngreso} disabled className="bg-muted" /></div>
              <div><Label>MES</Label><select name="mes" value={formData.mes} onChange={handleChange} className="w-full p-2 border rounded-md text-sm bg-background"><option>ENERO</option><option>FEBRERO</option><option>MARZO</option><option>ABRIL</option><option>MAYO</option><option>JUNIO</option><option>JULIO</option><option>AGOSTO</option><option>SEPTIEMBRE</option><option>OCTUBRE</option><option>NOVIEMBRE</option><option>DICIEMBRE</option></select></div>
            </div>
            {/* ... Resto de los campos obligatorios ... */}
            <div className="pt-2"><button type="button" onClick={() => setMostrarCamposExtras(!mostrarCamposExtras)} className="w-full flex items-center justify-between p-3 border border-dashed rounded-lg bg-primary/5 text-primary text-xs font-semibold uppercase"><span>MÁS CAMPOS</span>{mostrarCamposExtras ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button></div>
            
            {mostrarCamposExtras && (
              <div className="space-y-4 pt-2 border-t border-dashed mt-2">
                {/* Campos visibles restantes como Tipo Tramite, Item, Placa, Observaciones, etc... */}
                {/* DIAS PENDIENTES, SEMAFORO Y SI ES FORMULA HAN SIDO REMOVIDOS DE ESTA VISTA */}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t"><button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 border rounded-md text-sm">Cancelar</button><button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Guardar</button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
