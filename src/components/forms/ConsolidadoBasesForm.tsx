import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ConsolidadoBases } from "@/types/processes";

const consolidadoBasesSchema = z.object({
  canalIngreso: z.string().min(1, "Canal de ingreso es requerido"),
  numeroActoSade: z.string().min(1, "No. Acto Administrativo y No. SADE es requerido"),
  fechaActo: z.date({ required_error: "Fecha acto es requerida" }),
  anoIngreso: z.string().min(1, "Año ingreso es requerido"),
  mesIngreso: z.string().min(1, "Mes ingreso es requerido"),
  funcionarioEncargado: z.string().min(1, "Funcionario encargado es requerido"),
  tipoRenta: z.string().min(1, "Tipo de renta es requerido"),
  tipoTramite: z.string().min(1, "Tipo de trámite es requerido"),
  item: z.string().optional(),
  fechaRespuesta: z.date().optional(),
  fechaVencimiento: z.date({ required_error: "Fecha de vencimiento es requerida" }),
  diasFaltantes: z.number().min(0),
  tipoRespuesta: z.string().optional(),
  observacion: z.string().optional(),
});

type ConsolidadoBasesFormData = z.infer<typeof consolidadoBasesSchema>;

interface ConsolidadoBasesFormProps {
  onSubmit: (data: ConsolidadoBases) => void;
  initialData?: Partial<ConsolidadoBases>;
  mode?: 'create' | 'edit';
}

export function ConsolidadoBasesForm({ onSubmit, initialData, mode = 'create' }: ConsolidadoBasesFormProps) {
  const form = useForm<ConsolidadoBasesFormData>({
    resolver: zodResolver(consolidadoBasesSchema),
    defaultValues: {
      canalIngreso: initialData?.canalIngreso || "",
      numeroActoSade: initialData?.numeroActoSade || "",
      anoIngreso: initialData?.anoIngreso || "",
      mesIngreso: initialData?.mesIngreso || "",
      funcionarioEncargado: initialData?.funcionarioEncargado || "",
      tipoRenta: initialData?.tipoRenta || "",
      tipoTramite: initialData?.tipoTramite || "",
      item: initialData?.item || "",
      diasFaltantes: initialData?.diasFaltantes || 0,
      tipoRespuesta: initialData?.tipoRespuesta || "",
      observacion: initialData?.observacion || "",
    },
  });

  const handleSubmit = (data: ConsolidadoBasesFormData) => {
    const processData: ConsolidadoBases = {
      id: initialData?.id || crypto.randomUUID(),
      canalIngreso: data.canalIngreso,
      numeroActoSade: data.numeroActoSade,
      fechaActo: data.fechaActo.toISOString(),
      anoIngreso: data.anoIngreso,
      mesIngreso: data.mesIngreso,
      funcionarioEncargado: data.funcionarioEncargado,
      tipoRenta: data.tipoRenta,
      tipoTramite: data.tipoTramite,
      item: data.item || "",
      fechaRespuesta: data.fechaRespuesta?.toISOString() || "",
      fechaVencimiento: data.fechaVencimiento.toISOString(),
      diasFaltantes: data.diasFaltantes,
      tipoRespuesta: data.tipoRespuesta || "",
      observacion: data.observacion || "",
      fechaIngreso: data.fechaActo.toISOString(),
      diasPendientes: Math.ceil((new Date(data.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      semaforo: 'verde' as const,
      estado: 'pendiente' as const,
    };
    onSubmit(processData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Nuevo' : 'Editar'} Consolidado de Bases</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numeroActoSade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Acto Administrativo y No. SADE</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anoIngreso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año Ingreso</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mesIngreso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mes Ingreso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar mes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="enero">Enero</SelectItem>
                        <SelectItem value="febrero">Febrero</SelectItem>
                        <SelectItem value="marzo">Marzo</SelectItem>
                        <SelectItem value="abril">Abril</SelectItem>
                        <SelectItem value="mayo">Mayo</SelectItem>
                        <SelectItem value="junio">Junio</SelectItem>
                        <SelectItem value="julio">Julio</SelectItem>
                        <SelectItem value="agosto">Agosto</SelectItem>
                        <SelectItem value="septiembre">Septiembre</SelectItem>
                        <SelectItem value="octubre">Octubre</SelectItem>
                        <SelectItem value="noviembre">Noviembre</SelectItem>
                        <SelectItem value="diciembre">Diciembre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="funcionarioEncargado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funcionario Encargado</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaActo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Acto</FormLabel>
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
                        <SelectItem value="liquidacion">Liquidación</SelectItem>
                        <SelectItem value="revision">Revisión</SelectItem>
                        <SelectItem value="fiscalizacion">Fiscalización</SelectItem>
                        <SelectItem value="devolucion">Devolución</SelectItem>
                        <SelectItem value="consulta">Consulta</SelectItem>
                        <SelectItem value="peticion">Petición</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaRespuesta"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Respuesta</FormLabel>
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
                name="diasFaltantes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días Faltantes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoRespuesta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Respuesta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="favorable">Favorable</SelectItem>
                        <SelectItem value="desfavorable">Desfavorable</SelectItem>
                        <SelectItem value="parcial">Parcialmente Favorable</SelectItem>
                        <SelectItem value="informativa">Informativa</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="canalIngreso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canal de Ingreso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar canal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="telefono">Teléfono</SelectItem>
                        <SelectItem value="correo">Correo</SelectItem>
                        <SelectItem value="nexura">Nexura</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observación</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
               )}
            />

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