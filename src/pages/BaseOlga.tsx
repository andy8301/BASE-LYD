{/* 1. Radicación e Ingreso - Basado en image_63ab00.png */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
  <h3 className="col-span-1 md:col-span-4 font-bold text-blue-700 flex items-center gap-2">
    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
    Radicación e Ingreso
  </h3>
  
  {/* Columna B */}
  <div className="space-y-1">
    <Label className="text-xs">No. consecutivo</Label>
    <Input {...register("consecutivo")} className="bg-white h-8" />
  </div>

  {/* Columna C */}
  <div className="space-y-1">
    <Label className="text-xs">Canal de ingreso</Label>
    <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.['Canal de ingreso']}>
      <SelectTrigger className="bg-white h-8"><SelectValue placeholder="-" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="SADE">SADE</SelectItem>
        <SelectItem value="NEXURA">NEXURA</SelectItem>
        <SelectItem value="Correo electrónico">Correo electrónico</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Columna D */}
  <div className="space-y-1">
    <Label className="text-xs">Area Remitente</Label>
    <Input {...register("areaRemitente")} className="bg-white h-8" />
  </div>

  {/* Columna E */}
  <div className="space-y-1">
    <Label className="text-xs">No. PLANILLA</Label>
    <Input {...register("planilla")} className="bg-white h-8" />
  </div>

  {/* Columna F */}
  <div className="space-y-1">
    <Label className="text-xs">No. EXPEDIENTE</Label>
    <Input {...register("expediente")} className="bg-white h-8" />
  </div>

  {/* Columna G */}
  <div className="space-y-1">
    <Label className="text-xs">Fecha Radicacion (DD/MM/AAAA)</Label>
    <Input {...register("fechaRadicacion")} className="bg-white h-8" placeholder="Ej: 09/12/2025" />
  </div>

  {/* Columna H */}
  <div className="space-y-1">
    <Label className="text-xs">ACTO ADMINISTRA-TIVO</Label>
    <Input {...register("actoAdministrativo")} className="bg-white h-8" />
  </div>

  {/* Columna I y J agrupadas */}
  <div className="space-y-1">
    <Label className="text-xs">No. ACTO / SADE</Label>
    <Input {...register("numeroActo")} className="bg-white h-8" />
  </div>
  
  <div className="space-y-1">
    <Label className="text-xs">FECHA ACTO</Label>
    <Input {...register("fechaActo")} className="bg-white h-8" />
  </div>
</div>
