// 1. Asegúrate de incluir 'watch' en la desestructuración de useForm
const { register, handleSubmit, setValue, reset, watch } = useForm();

// 2. Creamos una constante para observar el valor del Tipo de Renta (Columna T)
const tipoRentaSeleccionada = watch("tipoRenta");

// ... (fetchData y el resto de la lógica se mantienen igual)

{/* 3. Dentro del DialogContent, en la sección de Clasificación */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
  <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">
    3. Clasificación y Respuesta (V a AG)
  </h3>
  
  {/* ITEM (V) */}
  <div className="space-y-1">
    <Label className="text-xs font-bold font-mono text-orange-700">ITEM (V)</Label>
    <Input {...register("item")} className="bg-white h-9 border-orange-200" placeholder="Descripción del item" />
  </div>

  {/* COLUMNA W: Lógica condicional basada en la imagen image_56ed3d.png */}
  {tipoRentaSeleccionada === "OTROS" && (
    <div className="space-y-1 animate-in fade-in slide-in-from-left-2 duration-300">
      <Label className="text-[10px] font-bold text-red-600 leading-none">
        W: SI EL TIPO DE RENTA ES OTRO (ESPECIFICAR EN ESTA COLUMNA)
      </Label>
      <Input 
        {...register("tipoRentaOtro")} 
        className="bg-white h-9 border-red-300 focus:ring-red-500" 
        placeholder="Detalle el tipo de renta..."
        autoFocus
      />
    </div>
  )}

  {/* FECHA EJECUTORIA (AF) */}
  <div className="space-y-1">
    <Label className="text-xs font-bold font-mono text-red-600 text-[10px]">FECHA EJECUTORIA (AF)</Label>
    <Input {...register("fechaEjecutoria")} className="bg-white h-9 border-red-200" />
  </div>
</div>
