import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

// ✅ CORRECCIÓN: Se añade 'default' para que App.tsx pueda importarlo correctamente
export default function BaseOlga() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | undefined>(undefined);
  
  // Inicializamos el formulario y observamos el tipo de renta para la lógica de la columna W
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const selectedTipoRenta = watch("tipoRenta");

  // Listados Maestros para los Selects
  const tiposTramite = ["Derecho de peticion", "Exención", "Devolucion", "Copia boleta fiscal", "Recurso", "Certificación", "Atención PDTIR", "Insolvencia", "Subsanación"];
  const tiposRenta = ["IMPUESTO SOBRE VEHICULOS", "IMPUESTO DE REGISTRO", "IMPUESTO AL CONSUMO", "IMPUESTO DE DEGUELLO", "TASA DE SEGURIDAD", "ESTAMPILLA", "APREHENCIÓN Y DECOMISO DE MERCANCIAS", "PASAPORTE", "OTROS", "NO TRIBUTARIO", "IMPUESTO TASA DE GASOLINA"];
  const funcionarios = ["Adalberto Vasquez", "Benjamin Acosta Gordillo", "Carlos Peña", "Cesar Enrique Gomez", "Cristian Felipe Arana", "Claudia Mosquera", "Daniela Riascos", "Diego Fernando Ortiz", "Diego Fernando Lopez", "Eliana Salamanca", "Frank Mauricio Restrepo", "Gustavo Adolfo Valencia", "Ibeth Restrepo Espitia", "Isabel Cristina Quintero", "Jhon Helber Samboni", "Jorge Arias", "Jose Fernando Moreno", "Juan Manuel Pizo", "Katherine Salamanca", "Karol Tatiana Lopez", "Luis Andres Botia Riascos", "Maria Cristina Posso", "Maria Jose Cerquera", "Olga Lucia Gomez Aristizabal", "Robinson Rosero", "Samuel Orozco", "Sara Millán", "Wilson Quiñónez", "Yaleydy Mosquera", "Yamid Bolaños Manquillo", "Yohana Estrada", "Maira Alejandra Cardona", "Nailen Andrea Arias", "Diana Patricia Osorio Ospina"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      const records = (result[SHEET_NAMES.BASE_OLGA] || []).map((row: any, i: number) => ({
        ...row,
        id: `row-${i + 2}`
      }));
      setData(records);
    } catch (error) { 
      toast.error("Error al cargar datos de Google Sheets"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (formData: any) => {
    try {
      // Mapeo EXACTO por columnas A hasta AG basado en image_56ed3d.png
      const rowData = [
        "", // A (ID/Fórmula)
        formData.consecutivo || "", formData.canalIngreso || "", formData.areaRemitente || "", // B, C, D
        formData.planilla || "", formData.expediente || "", formData.fechaRadicacion || "", // E, F, G
        formData.actoAdministrativo || "", formData.numeroActo || "", formData.fechaActo || "", // H, I, J
        "", // K (MES - FÓRMULA)
        formData.placa || "", formData.identificacion || "", formData.contribuyente || "", // L, M, N
        formData.ciudadDepartamento || "", formData.observaciones || "", formData.funcionarioEncargado || "", // O, P, Q
        formData.nota || "", // R
        formData.fechaRecibido || "", // S: FECHA DE RECIBIDO
        formData.tipoRenta || "", // T: TIPO DE RENTA
        formData.tipoTramite || "", // U: TIPO DE TRAMITE
        formData.item || "", // V: ITEM
        formData.tipoRentaOtro || "", // W: ESPECIFICAR SI ES OTRO
        formData.prelacionLegal || "", formData.baseFuncionario1ra || "", formData.numeroResolucion || "", // X, Y, Z
        formData.numeroSadeSalida || "", formData.fechaResolucionSadeSalida || "", // AA, AB
        formData.tipoRespuesta || "", formData.noPlanillaSalida || "", formData.fechaDePlanillaSalida || "", // AC, AD, AE
        formData.fechaEjecutoria || "", formData.traslado || "" // AF, AG
      ];

      if (editingItem) {
        const rowNumber = editingItem.id.replace('row-', '');
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, `A${rowNumber}:AG${rowNumber}`, rowData);
      } else {
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
      }
      
      setIsDialogOpen(false);
      fetchData();
      toast.success("¡Datos guardados correctamente en Traza Rentas!");
      reset({});
    } catch (error) { 
      toast.error("Error al sincronizar con Google Sheets"); 
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabecera del Módulo */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Traza Rentas</h1>
          <p className="text-slate-500 text-sm">Gestión de Base Olga - Control de Ingresos</p>
        </div>
        <Button onClick={() => { reset({}); setEditingItem(undefined); setIsDialogOpen(true); }} className="bg-blue-700 hover:bg-blue-800 text-white font-bold">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">Formulario de Entrada de Datos</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* BLOQUE 1: Radicación (Incluye S) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-4 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Consecutivo (B)</Label><Input {...register("consecutivo")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Expediente (F)</Label><Input {...register("expediente")} className="bg-white h-9" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-700">FECHA ACTO (J)</Label><Input {...register("fechaActo")} className="bg-white h-9 border-blue-300" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-orange-700">FECHA DE RECIBIDO (S)</Label>
                <Input {...register("fechaRecibido")} className="bg-white h-9 border-orange-300" placeholder="DD/MM/AAAA" />
              </div>
            </div>

            {/* BLOQUE 2: Contribuyente y Renta (Incluye T y W) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">2. Información del Contribuyente y Renta</h3>
              <div className="space-y-1 col-span-2"><Label className="text-xs font-bold">CONTRIBUYENTE (N)</Label><Input {...register("contribuyente")} className="bg-white h-9" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">FUNCIONARIO ENCARGADO (Q)</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                  <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RENTA (T)</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)}>
                  <SelectTrigger className="bg-white h-9 border-green-200"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposRenta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* COLUMNA W: Lógica dinámica para 'OTROS' */}
              {selectedTipoRenta === "OTROS" && (
                <div className="space-y-1 animate-in zoom-in duration-200">
                  <Label className="text-[10px] font-bold text-red-600">W: ESPECIFICAR OTRO TIPO DE RENTA</Label>
                  <Input {...register("tipoRentaOtro")} className="bg-white h-9 border-red-300" placeholder="¿Cuál renta?" autoFocus />
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE TRÁMITE (U)</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)}>
                  <SelectTrigger className="bg-white h-9 border-green-200"><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>{tiposTramite.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* BLOQUE 3: Clasificación y Fechas Finales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">3. Clasificación y Respuesta (V a AG)</h3>
              <div className="space-y-1">
                <Label className="text-xs font-bold font-mono text-orange-700">ITEM (V)</Label>
                <Input {...register("item")} className="bg-white h-9 border-orange-200" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold font-mono text-red-600 text-[10px]">FECHA EJECUTORIA (AF)</Label>
                <Input {...register("fechaEjecutoria")} className="bg-white h-9 border-red-200" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">NOTA (R)</Label>
                <Input {...register("nota")} className="bg-white h-9" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold text-white hover:bg-black">
              <Save className="mr-2" /> Guardar Todo en Base Olga
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
