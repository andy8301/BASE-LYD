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
import { Resoluciones } from "@/types/processes";

const resolucionesSchema = z.object({
  canalIngreso: z.string().min(1, "Canal de ingreso es requerido"),
  sadeIngreso: z.string().min(1, "SADE de ingreso es requerido"),
  numeroActoSadeSalida: z.string().min(1, "No. Acto Administrativo y No. SADE de salida es requerido"),
  planilla: z.string().min(1, "No. Planilla es requerido"),
  fechaPlanilla: z.date({ required_error: "Fecha planilla es requerida" }),
  actoAdministrativo: z.string().min(1, "Acto administrativo es requerido"),
  numeroSadeSalida: z.string().optional(),
  expediente: z.string().min(1, "No. expediente es requerido"),
  funcionarioEncargado: z.string().min(1, "Funcionario encargado es requerido"),
  tipoRenta: z.string().min(1, "Tipo de renta es requerido"),
  tipoTramite: z.string().min(1, "Tipo de trámite es requerido"),
  fechaVencimiento: z.date({ required_error: "Fecha de vencimiento es requerida" }),
});

type ResolucionesFormData = z.infer<typeof resolucionesSchema>;

interface ResolucionesFormProps {
  onSubmit: (data: Resoluciones) => void;
  initialData?: Partial<Resoluciones>;
  mode?: 'create' | 'edit';
}

export function ResolucionesForm({ onSubmit, initialData, mode = 'create' }: ResolucionesFormProps) {
  const form = useForm<ResolucionesFormData>({
    resolver: zodResolver(resolucionesSchema),
    defaultValues: {
      canalIngreso: initialData?.canalIngreso || "",
      sadeIngreso: initialData?.sadeIngreso || "",
      numeroActoSadeSalida: initialData?.numeroActoSadeSalida || "",
      planilla: initialData?.planilla || "",
      actoAdministrativo: initialData?.actoAdministrativo || "",
      numeroSadeSalida: initialData?.numeroSadeSalida || "",
      expediente: initialData?.expediente || "",
      funcionarioEncargado: initialData?.funcionarioEncargado || "",
      tipoRenta: initialData?.tipoRenta || "",
      tipoTramite: initialData?.tipoTramite || "",
    },
  });

  const handleSubmit = (data: ResolucionesFormData) => {
    const processData: Resoluciones = {
      id: initialData?.id || crypto.randomUUID(),
      canalIngreso: data.canalIngreso,
      sadeIngreso: data.sadeIngreso,
      numeroActoSadeSalida: data.numeroActoSadeSalida,
      planilla: data.planilla,
      fechaPlanilla: data.fechaPlanilla.toISOString(),
      actoAdministrativo: data.actoAdministrativo,
      numeroSadeSalida: data.numeroSadeSalida || "",
      expediente: data.expediente,
      funcionarioEncargado: data.funcionarioEncargado,
      tipoRenta: data.tipoRenta,
      tipoTramite: data.tipoTramite,
      fechaVencimiento: data.fechaVencimiento.toISOString(),
      fechaIngreso: data.fechaPlanilla.toISOString(),
      diasPendientes: Math.ceil((new Date(data.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      semaforo: 'verde' as const,
      estado: 'pendiente' as const,
    };
    onSubmit(processData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Nueva' : 'Editar'} Resolución</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sadeIngreso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SADE de Ingreso</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroActoSadeSalida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Acto Administrativo y No. SADE de Salida</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="fechaPlanilla"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Planilla</FormLabel>
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
                name="actoAdministrativo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acto Administrativo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroSadeSalida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No de SADE de Salida</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        <SelectItem value="resolucion">Resolución</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="acta">Acta</SelectItem>
                        <SelectItem value="circular">Circular</SelectItem>
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