import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Fiscalizacion } from "@/types/processes";

const fiscalizacionSchema = z.object({
  canalIngreso: z.string().min(1, "Canal de ingreso es requerido"),
  planilla: z.string().min(1, "No. Planilla es requerido"),
  expediente: z.string().min(1, "No. Expediente es requerido"),
  actoAdministrativo: z.string().min(1, "Acto administrativo es requerido"),
  fechaPlanillaIngreso: z.date({ required_error: "Fecha planilla ingreso es requerida" }),
  proceso: z.string().min(1, "Proceso es requerido"),
  contribuyente: z.string().min(1, "Contribuyente es requerido"),
  impuesto: z.string().min(1, "Impuesto es requerido"),
  tipoRenta: z.string().min(1, "Tipo de renta es requerido"),
  tipoTramite: z.string().min(1, "Tipo de trámite es requerido"),
  funcionarioEncargado: z.string().min(1, "Funcionario encargado es requerido"),
  estadoProceso: z.string().min(1, "Estado del proceso es requerido"),
  resolucionSadeSalida: z.string().optional(),
  fechaResolucionSade: z.date().optional(),
  fechaEjecutoria: z.date().optional(),
  fechaVencimiento: z.date({ required_error: "Fecha de vencimiento es requerida" }),
  semaforoVencimiento: z.enum(['verde', 'amarillo', 'rojo']),
});

type FiscalizacionFormData = z.infer<typeof fiscalizacionSchema>;

interface FiscalizacionFormProps {
  onSubmit: (data: Fiscalizacion) => void;
  initialData?: Partial<Fiscalizacion>;
  mode?: 'create' | 'edit';
}

export function FiscalizacionForm({ onSubmit, initialData, mode = 'create' }: FiscalizacionFormProps) {
  const form = useForm<FiscalizacionFormData>({
    resolver: zodResolver(fiscalizacionSchema),
    defaultValues: {
      canalIngreso: initialData?.canalIngreso || "",
      planilla: initialData?.planilla || "",
      expediente: initialData?.expediente || "",
      actoAdministrativo: initialData?.actoAdministrativo || "",
      proceso: initialData?.proceso || "",
      contribuyente: initialData?.contribuyente || "",
      impuesto: initialData?.impuesto || "",
      tipoRenta: initialData?.tipoRenta || "",
      tipoTramite: initialData?.tipoTramite || "",
      funcionarioEncargado: initialData?.funcionarioEncargado || "",
      estadoProceso: initialData?.estadoProceso || "",
      resolucionSadeSalida: initialData?.resolucionSadeSalida || "",
      semaforoVencimiento: initialData?.semaforoVencimiento || 'verde',
    },
  });

  const handleSubmit = (data: FiscalizacionFormData) => {
    const processData: Fiscalizacion = {
      id: initialData?.id || crypto.randomUUID(),
      canalIngreso: data.canalIngreso,
      planilla: data.planilla,
      expediente: data.expediente,
      actoAdministrativo: data.actoAdministrativo,
      fechaPlanillaIngreso: data.fechaPlanillaIngreso.toISOString(),
      proceso: data.proceso,
      contribuyente: data.contribuyente,
      impuesto: data.impuesto,
      tipoRenta: data.tipoRenta,
      tipoTramite: data.tipoTramite,
      funcionarioEncargado: data.funcionarioEncargado,
      estadoProceso: data.estadoProceso,
      resolucionSadeSalida: data.resolucionSadeSalida || "",
      fechaResolucionSade: data.fechaResolucionSade?.toISOString() || "",
      fechaEjecutoria: data.fechaEjecutoria?.toISOString() || "",
      fechaVencimiento: data.fechaVencimiento.toISOString(),
      semaforoVencimiento: data.semaforoVencimiento,
      fechaIngreso: data.fechaPlanillaIngreso.toISOString(),
      diasPendientes: Math.ceil((new Date(data.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      semaforo: data.semaforoVencimiento,
      estado: 'pendiente' as const,
    };
    onSubmit(processData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Nuevo' : 'Editar'} Traslado Fiscalización</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="planilla"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Planilla</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expediente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Expediente</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contribuyente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribuyente</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="impuesto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impuesto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar impuesto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="predial">Predial</SelectItem>
                        <SelectItem value="vehicular">Vehicular</SelectItem>
                        <SelectItem value="industria_comercio">Industria y Comercio</SelectItem>
                        <SelectItem value="sobretasa_gasolina">Sobretasa Gasolina</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proceso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proceso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proceso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fiscalizacion">Fiscalización</SelectItem>
                        <SelectItem value="liquidacion">Liquidación</SelectItem>
                        <SelectItem value="cobro_persuasivo">Cobro Persuasivo</SelectItem>
                        <SelectItem value="cobro_coactivo">Cobro Coactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estadoProceso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado del Proceso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="iniciado">Iniciado</SelectItem>
                        <SelectItem value="en_proceso">En Proceso</SelectItem>
                        <SelectItem value="pendiente_documentos">Pendiente Documentos</SelectItem>
                        <SelectItem value="resuelto">Resuelto</SelectItem>
                        <SelectItem value="archivado">Archivado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaPlanillaIngreso"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Planilla Ingreso</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="pointer-events-auto"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoRenta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Renta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vehicular">Vehicular</SelectItem>
                        <SelectItem value="predial">Predial</SelectItem>
                        <SelectItem value="industria_comercio">Industria y Comercio</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoTramite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Trámite</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar trámite" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fiscalizacion">Fiscalización</SelectItem>
                        <SelectItem value="liquidacion">Liquidación</SelectItem>
                        <SelectItem value="cobro_persuasivo">Cobro Persuasivo</SelectItem>
                        <SelectItem value="cobro_coactivo">Cobro Coactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resolucionSadeSalida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolución/SADE Salida</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaResolucionSade"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Resolución/SADE de Salida</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="pointer-events-auto"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaEjecutoria"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Ejecutoria</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="pointer-events-auto"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaVencimiento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Vencimiento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="pointer-events-auto"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semaforoVencimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semáforo de Vencimiento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar semáforo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="verde">Verde</SelectItem>
                        <SelectItem value="amarillo">Amarillo</SelectItem>
                        <SelectItem value="rojo">Rojo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="submit">
                {mode === 'create' ? 'Crear Registro' : 'Actualizar Registro'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}