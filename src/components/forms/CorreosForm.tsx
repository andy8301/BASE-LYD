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
import { BaseCorreos } from "@/types/processes";

const correosSchema = z.object({
  canalIngreso: z.string().min(1, "Canal de ingreso es requerido"),
  mes: z.string().min(1, "Mes es requerido"),
  fechaAsignacion: z.date({ required_error: "Fecha de asignación es requerida" }),
  correoFuncionario: z.string().email("Email válido es requerido"),
  funcionarioEncargado: z.string().min(1, "Funcionario encargado es requerido"),
  asuntoCorreo: z.string().min(1, "Asunto del correo es requerido"),
  fechaCorreo: z.date({ required_error: "Fecha del correo es requerida" }),
  contribuyenteSolicitante: z.string().min(1, "Contribuyente o solicitante es requerido"),
  tipoRenta: z.string().min(1, "Tipo de renta es requerido"),
  tipoTramite: z.string().min(1, "Tipo de trámite es requerido"),
  item: z.string().optional(),
  placa: z.string().optional(),
  fechaRespuesta: z.date().optional(),
  tipoRespuesta: z.string().optional(),
  numeroSadeSalida: z.string().optional(),
  observaciones: z.string().optional(),
  fechaVencimiento: z.date({ required_error: "Fecha de vencimiento es requerida" }),
});

type CorreosFormData = z.infer<typeof correosSchema>;

interface CorreosFormProps {
  onSubmit: (data: BaseCorreos) => void;
  initialData?: Partial<BaseCorreos>;
  mode?: 'create' | 'edit';
}

export function CorreosForm({ onSubmit, initialData, mode = 'create' }: CorreosFormProps) {
  const form = useForm<CorreosFormData>({
    resolver: zodResolver(correosSchema),
    defaultValues: {
      canalIngreso: initialData?.canalIngreso || "",
      mes: initialData?.mes || "",
      correoFuncionario: initialData?.correoFuncionario || "",
      funcionarioEncargado: initialData?.funcionarioEncargado || "",
      asuntoCorreo: initialData?.asuntoCorreo || "",
      contribuyenteSolicitante: initialData?.contribuyenteSolicitante || "",
      tipoRenta: initialData?.tipoRenta || "",
      tipoTramite: initialData?.tipoTramite || "",
      item: initialData?.item || "",
      placa: initialData?.placa || "",
      tipoRespuesta: initialData?.tipoRespuesta || "",
      numeroSadeSalida: initialData?.numeroSadeSalida || "",
      observaciones: initialData?.observaciones || "",
    },
  });

  const handleSubmit = (data: CorreosFormData) => {
    const processData: BaseCorreos = {
      id: initialData?.id || crypto.randomUUID(),
      canalIngreso: data.canalIngreso,
      mes: data.mes,
      fechaAsignacion: data.fechaAsignacion.toISOString(),
      correoFuncionario: data.correoFuncionario,
      funcionarioEncargado: data.funcionarioEncargado,
      asuntoCorreo: data.asuntoCorreo,
      fechaCorreo: data.fechaCorreo.toISOString(),
      contribuyenteSolicitante: data.contribuyenteSolicitante,
      tipoRenta: data.tipoRenta,
      tipoTramite: data.tipoTramite,
      item: data.item || "",
      placa: data.placa || "",
      fechaRespuesta: data.fechaRespuesta?.toISOString() || "",
      tipoRespuesta: data.tipoRespuesta || "",
      numeroSadeSalida: data.numeroSadeSalida || "",
      observaciones: data.observaciones || "",
      fechaVencimiento: data.fechaVencimiento.toISOString(),
      fechaIngreso: data.fechaCorreo.toISOString(),
      diasPendientes: Math.ceil((new Date(data.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      semaforo: 'verde' as const,
      estado: 'pendiente' as const,
    };
    onSubmit(processData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Nuevo' : 'Editar'} Correo Electrónico</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectItem value="correo">Correo Electrónico</SelectItem>
                        <SelectItem value="chat">Chat en Línea</SelectItem>
                        <SelectItem value="formulario">Formulario Web</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mes</FormLabel>
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
                name="correoFuncionario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Funcionario Encargado</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
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
                name="contribuyenteSolicitante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribuyente o Solicitante</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                        <SelectItem value="consulta">Consulta</SelectItem>
                        <SelectItem value="solicitud">Solicitud</SelectItem>
                        <SelectItem value="reclamo">Reclamo</SelectItem>
                        <SelectItem value="informacion">Información</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaCorreo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Correo</FormLabel>
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
                name="fechaAsignacion"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Asignación</FormLabel>
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
                name="placa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
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
                        <SelectItem value="informativa">Informativa</SelectItem>
                        <SelectItem value="resolutiva">Resolutiva</SelectItem>
                        <SelectItem value="remision">Remisión</SelectItem>
                        <SelectItem value="archivo">Archivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroSadeSalida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. de SADE de Salida</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
            </div>

            <FormField
              control={form.control}
              name="asuntoCorreo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto del Correo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
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