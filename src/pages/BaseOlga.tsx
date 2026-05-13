// ... (mismos imports anteriores)
import { useForm } from "react-hook-form";

export default function BaseOlga() {
  // ... (mismos estados anteriores)
  
  // 1. Agregamos 'watch' para monitorear los cambios en el formulario en tiempo real
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  
  // Observamos el valor del campo "tipoRenta"
  const selectedTipoRenta = watch("tipoRenta");

  // ... (misma función fetchData y onSubmit)

  return (
    <div className="p-6 space-y-6">
      {/* ... cabecera ... */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">Formulario de Gestión</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* 1. Radicación e Ingreso (Sin cambios) */}

            {/* 2. Información del Contribuyente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">2. Información del Contribuyente</h3>
              {/* ... campos anteriores ... */}
              
              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE RENTA (T)</Label>
                <Select onValueChange={(v) => setValue("tipoRenta", v)}>
                  <SelectTrigger className="bg-white h-9 border-green-200">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposRenta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* LÓGICA PARA COLUMNA W: Aparece solo si selecciona 'OTROS' */}
              {selectedTipoRenta === "OTROS" && (
                <div className="space-y-1 animate-in fade-in zoom-in duration-200">
                  <Label className="text-xs font-bold text-red-600 font-bold">ESPECIFICAR OTRO (W)</Label>
                  <Input 
                    {...register("tipoRentaOtro")} 
                    className="bg-white h-9 border-red-300 ring-offset-red-500" 
                    placeholder="¿Cuál renta?"
                    autoFocus
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs font-bold">TIPO DE TRAMITE (U)</Label>
                <Select onValueChange={(v) => setValue("tipoTramite", v)}>
                  <SelectTrigger className="bg-white h-9 border-green-200">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposTramite.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 3. Clasificación y Respuesta (Donde está el ITEM V) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">3. Clasificación y Respuesta (V a AG)</h3>
              
              <div className="space-y-1">
                <Label className="text-xs font-bold font-mono">ITEM (V)</Label>
                <Input {...register("item")} className="bg-white h-9 border-orange-200" placeholder="Descripción del item" />
              </div>

              {/* Aquí podrías mover el campo W si prefieres que esté en esta sección, 
                  pero lo ideal es que esté junto al selector del Tipo de Renta */}

              <div className="space-y-1">
                <Label className="text-xs font-bold font-mono text-red-600 font-bold text-[10px]">FECHA EJECUTORIA (AF)</Label>
                <Input {...register("fechaEjecutoria")} className="bg-white h-9 border-red-200" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold text-white hover:bg-black">
              <Save className="mr-2" /> Guardar Todo
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
