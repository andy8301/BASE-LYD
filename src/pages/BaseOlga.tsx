{/* 1. Radicación e Ingreso - Siguiendo el orden exacto de image_639916.png */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
  <h3 className="col-span-1 md:col-span-3 font-bold text-blue-700 flex items-center gap-2 mb-2">
    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
    Radicación e Ingreso
  </h3>
  
  {/* Columna B */}
  <div className="space-y-1">
    <Label className="text-xs font-semibold">No. consecutivo</Label>
    <Input {...register("consecutivo")} className="bg-white h-9" />
  </div>

  {/* Columna C */}
  <div className="space-y-1">
    <Label className="text-xs font-semibold">Canal de ingreso</Label>
    <Select onValueChange={(v) => setValue("canalIngreso", v)} defaultValue={editingItem?.['Canal de ingreso']}>
      <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
      <SelectContent>
        <SelectItem value="SADE">SADE</SelectItem>
        <SelectItem value="NEXURA">NEXURA</SelectItem>
        <SelectItem value="Correo electrónico">Correo electrónico</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Columna D: Area Remitente - Justo después de Canal de Ingreso */}
  <div className="space-y-1">
    <Label className="text-xs font-semibold">Area Remitente</Label>
    <Select onValueChange={(v) => setValue("areaRemitente", v)} defaultValue={editingItem?.['Area Remitente']}>
      <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
      <SelectContent>
        <SelectItem value="Traslado subgerencia gestión de Cobranzas">Traslado subgerencia gestión de Cobranzas</SelectItem>
        <SelectItem value="Traslado subdirección técnica Jurídica">Traslado subdirección técnica Jurídica</SelectItem>
        <SelectItem value="Traslado subgerencia de Fiscalización">Traslado subgerencia de Fiscalización</SelectItem>
        <SelectItem value="Traslado Gerencia">Traslado Gerencia</SelectItem>
        <SelectItem value="Traslado Notificaciones">Traslado Notificaciones</SelectItem>
        <SelectItem value="Otro (especificar)">Otro (especificar)</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Columna E */}
  <div className="space-y-1">
    <Label className="text-xs font-semibold">No. PLANILLA</Label>
    <Input {...register("planilla")} className="bg-white h-9" />
  </div>

  {/* Columna F */}
  <div className="space-y-1">
    <Label className="text-xs font-semibold">No. EXPEDIENTE</Label>
    <Input {...register("expediente")} className="bg-white h-9" />
  </div>

  {/* Columna G */}
  <div className="space-y-1">
    <Label className="text-xs font-semibold">Fecha Radicacion expediente (DD/MM/YYYY)</Label>
    <Input {...register("fechaRadicacion")} className="bg-white h-9" placeholder="DD/MM/YYYY" />
  </div>

  {/* Columna H */}
  <div className="col-span-1 md:col-span-3 space-y-1">
    <Label className="text-xs font-semibold">ACTO ADMINISTRA-TIVO</Label>
    <Input {...register("actoAdministrativo")} className="bg-white h-9" />
  </div>

  {/* Columna I */}
  <div className="space-y-1">
    <Label className="text-xs font-semibold">No. ACTO ADMINISTRATIVO Y No. SADE</Label>
    <Input {...register("numeroActo")} className="bg-white h-9" />
  </div>

  {/* Columna J */}
  <div className="space-y-1">
    <Label className="text-xs font-semibold">FECHA ACTO (DD-MM-AAAA)</Label>
    <Input {...register("fechaActo")} className="bg-white h-9" placeholder="DD-MM-AAAA" />
  </div>
</div>
