{/* Bloque de Seguimiento Técnico - Letras J a la T - Orden Estricto */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
  <h3 className="col-span-1 md:col-span-3 font-bold text-slate-700 border-b border-slate-300 pb-2">
    Seguimiento de Trámite (J a T)
  </h3>

  {/* Columna J */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-600 text-[10px]">FECHA ACTO (DD-MM-AAAA)</Label>
    <Input {...register("fechaActo")} className="bg-white h-9" placeholder="DD-MM-AAAA" />
  </div>

  {/* Columna K: MES (Fórmula en Excel - Solo lectura) */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-400 text-[10px]">MES (Automático en Excel)</Label>
    <Input disabled placeholder="Calculado por fórmula" className="bg-slate-100 h-9 border-dashed" />
  </div>

  {/* Columna L */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-600">PLACA</Label>
    <Input {...register("placa")} className="bg-white h-9" />
  </div>

  {/* Columna M */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-600">No. DE IDENTIFICACION</Label>
    <Input {...register("identificacion")} className="bg-white h-9" />
  </div>

  {/* Columna N */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-600">CONTRIBUYENTE</Label>
    <Input {...register("contribuyente")} className="bg-white h-9" />
  </div>

  {/* Columna O */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-600">CIUDAD-DEPARTAMENTO</Label>
    <Input {...register("ciudadDepartamento")} className="bg-white h-9" />
  </div>

  {/* Columna P: OBSERVACIONES (Posición 15 según tu conteo) */}
  <div className="col-span-1 md:col-span-2 space-y-1">
    <Label className="text-xs font-bold text-slate-600">OBSERVACIONES</Label>
    <Input {...register("observaciones")} className="bg-white h-9" />
  </div>

  {/* Columna Q */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-600 text-[10px]">FUNCIONARIO ENCARGADO</Label>
    <Select onValueChange={(v) => setValue("funcionarioEncargado", v)} defaultValue={editingItem?.['FUNCIONARIO ENCARGADO']}>
      <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
      <SelectContent>
        {funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>

  {/* Columna R */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-600 text-[10px]">NOTA:</Label>
    <Input {...register("nota")} className="bg-white h-9" />
  </div>

  {/* Columna S */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-600 text-[10px]">FECHA DE RECIBIDO</Label>
    <Input {...register("fechaRecibido")} className="bg-white h-9" />
  </div>

  {/* Columna T */}
  <div className="space-y-1">
    <Label className="text-xs font-bold text-slate-600 text-[10px]">TIPO DE RENTA</Label>
    <Select onValueChange={(v) => setValue("tipoRenta", v)} defaultValue={editingItem?.['TIPO DE RENTA']}>
      <SelectTrigger className="bg-white h-9"><SelectValue placeholder="-" /></SelectTrigger>
      <SelectContent>
        {tiposRenta.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
</div>
