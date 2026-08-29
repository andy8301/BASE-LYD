<form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4 pb-10">
            
            {/* 1. Radicación e Ingreso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="col-span-3 font-bold text-blue-800 border-b border-blue-200 pb-1 text-sm">1. Radicación e Ingreso</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Consecutivo</Label><Input {...register("consecutivo")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Canal de Ingreso</Label><Input {...register("canalIngreso")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Área Remitente</Label><Input {...register("areaRemitente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Planilla</Label><Input {...register("planilla")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Expediente</Label><Input {...register("expediente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Radicación</Label><Input {...register("fechaRadicacion")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Acto Administrativo</Label><Input {...register("actoAdministrativo")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Acto / SADE</Label><Input {...register("numeroActo")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold text-blue-700">Fecha de Acto</Label><Input {...register("fechaActo")} type="date" className="bg-white h-8 border-blue-300" /></div>
            </div>

            {/* 2. Contribuyente y Renta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <h3 className="col-span-3 font-bold text-green-800 border-b border-green-200 pb-1 text-sm">2. Información del Contribuyente</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Placa</Label><Input {...register("placa")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Identificación</Label><Input {...register("identificacion")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Contribuyente</Label><Input {...register("contribuyente")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Ciudad / Departamento</Label><Input {...register("ciudadDepartamento")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Observaciones</Label><Input {...register("observaciones")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Funcionario Encargado</Label>
                <Select onValueChange={(v) => setValue("funcionarioEncargado", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione funcionario..." /></SelectTrigger>
                  <SelectContent>{funcionarios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold text-green-700">Nota</Label><Input {...register("nota")} className="bg-white h-8 border-green-300" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Recibido</Label><Input {...register("fechaRecibido")} type="date" className="bg-white h-8" /></div>
            </div>

            {/* 3. Clasificación y Respuesta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <h3 className="col-span-3 font-bold text-orange-800 border-b border-orange-200 pb-1 text-sm">3. Clasificación y Respuesta</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Ítem</Label><Input {...register("item")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Tipo de Renta (Otro)</Label><Input {...register("tipoRentaOtro")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Resolución</Label><Input {...register("numeroResolucion")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">SADE de Salida</Label><Input {...register("numeroSadeSalida")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Res. Salida</Label><Input {...register("fechaResolucionSadeSalida")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Respuesta</Label>
                <Select onValueChange={(v) => setValue("tipoRespuesta", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione respuesta..." /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold text-red-600">Fecha de Ejecutoria</Label><Input {...register("fechaEjecutoria")} type="date" className="bg-white h-8 border-red-200" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Traslado</Label><Input {...register("traslado")} className="bg-white h-8" /></div>
            </div>

            {/* 4. Segunda y Tercera Instancia */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="col-span-3 font-bold text-purple-800 border-b border-purple-200 pb-1 text-sm">4. Instancias y Vencimiento</h3>
              <div className="space-y-1"><Label className="text-xs font-bold">Observación</Label><Input {...register("observacionAH")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Base Func. 2da Instancia</Label><Input {...register("baseFuncionario2daAI")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Resolución (2da Inst.)</Label><Input {...register("numResolucionAJ")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. SADE (2da Inst.)</Label><Input {...register("numSadeAK")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha Res. / SADE</Label><Input {...register("fechaResolucionAL")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">No. Planilla</Label><Input {...register("numPlanillaAM")} className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Planilla</Label><Input {...register("fechaPlanillaAN")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Fecha de Ejecutoria</Label><Input {...register("fechaEjecutoriaAO")} type="date" className="bg-white h-8" /></div>
              <div className="space-y-1"><Label className="text-xs font-bold">Traslado</Label><Input {...register("trasladoAP")} className="bg-white h-8" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tipo de Respuesta</Label>
                <Select onValueChange={(v) => setValue("tipoRespuestaAQ", v)}>
                  <SelectTrigger className="bg-white h-8"><SelectValue placeholder="Seleccione respuesta..." /></SelectTrigger>
                  <SelectContent>{respuestas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs font-bold">Base Func. 3ra Instancia</Label><Input {...register("baseFunc3raAR")} className="bg-white h-8 border-purple-200" /></div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-red-700">Fecha de Vencimiento</Label>
                <Input {...register("fechaVencimientoBD")} type="date" className="bg-white h-8 border-red-300" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 py-6 text-xl font-bold text-white hover:bg-black"><Save className="mr-2 h-6 w-6" /> Guardar Todo en Sheets</Button>
          </form>
