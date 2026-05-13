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
import { BaseNexura } from "@/types/processes";

const nexuraSchema = z.object({
  canalIngreso: z.string().min(1, "Canal de ingreso es requerido"),
  radicacion: z.string().min(1, "Número de radicación es requerido"),
  radicacionExterno: z.string().optional(),
  secretaria: z.string().min(1, "Secretaría es requerida"),
  tipoSolicitud: z.string().min(1, "Tipo de solicitud es requerido"),
  condicionSolicitud: z.string().min(1, "Condición de solicitud es requerida"),
  responsable: z.string().min(1, "Responsable es requerido"),
  fechaIngreso: z.date({ required_error: "Fecha de ingreso es requerida" }),
  fechaLimiteRespuesta: z.date({ required_error: "Fecha límite de respuesta es requerida" }),
  fechaRespuesta: z.date().optional(),
  diasHabilesRestantes: z.number().min(0),
  diasHabilesTranscurridos: z.number().min(0),
  nombreSolicitante: z.string().min(1, "Nombre del solicitante es requerido"),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  funcionarioEncargado: z.string().min(1, "Funcionario encargado es requerido"),
  tipoRenta: z.string().min(1, "Tipo de renta es requerido"),
  tipoTramite: z.string().min(1, "Tipo de trámite es requerido"),
  item: z.string().optional(),
  tipoRespuesta: z.string().optional(),
  numeroSadeSalida: z.string().optional(),
});

type NexuraFormData = z.infer<typeof nexuraSchema>;

interface NexuraFormProps {
  onSubmit: (data: BaseNexura) => void;
  initialData?: Partial<BaseNexura>;
  mode?: 'create' | 'edit';
}

export function NexuraForm({ onSubmit, initialData, mode = 'create' }: NexuraFormProps) {
  const form = useForm<NexuraFormData>({
    resolver: zodResolver(nexuraSchema),
    defaultValues: {
      canalIngreso: initialData?.canalIngreso || "",
      radicacion: initialData?.radicacion || "",
      radicacionExterno: initialData?.radicacionExterno || "",
      secretaria: initialData?.secretaria || "",
      tipoSolicitud: initialData?.tipoSolicitud || "",
      condicionSolicitud: initialData?.condicionSolicitud || "",
      responsable: initialData?.responsable || "",
      diasHabilesRestantes: initialData?.diasHabilesRestantes || 0,
      diasHabilesTranscurridos: initialData?.diasHabilesTranscurridos || 0,
      nombreSolicitante: initialData?.nombreSolicitante || "",
      telefono: initialData?.telefono || "",
      email: initialData?.email || "",
      funcionarioEncargado: initialData?.funcionarioEncargado || "",
      tipoRenta: initialData?.tipoRenta || "",
      tipoTramite: initialData?.tipoTramite || "",
      item: initialData?.item || "",
      tipoRespuesta: initialData?.tipoRespuesta || "",
      numeroSadeSalida: initialData?.numeroSadeSalida || "",
    },
  });

  const handleSubmit = (data: NexuraFormData) => {
    const processData: BaseNexura = {
      id: initialData?.id || crypto.randomUUID(),
      canalIngreso: data.canalIngreso,
      radicacion: data.radicacion,
      radicacionExterno: data.radicacionExterno || "",
      secretaria: data.secretaria,
      tipoSolicitud: data.tipoSolicitud,
      condicionSolicitud: data.condicionSolicitud,
      responsable: data.responsable,
      fechaIngreso: data.fechaIngreso.toISOString(),
      fechaLimiteRespuesta: data.fechaLimiteRespuesta.toISOString(),
      fechaRespuesta: data.fechaRespuesta?.toISOString() || "",
      diasHabilesRestantes: data.diasHabilesRestantes,
      diasHabilesTranscurridos: data.diasHabilesTranscurridos,
      nombreSolicitante: data.nombreSolicitante,
      telefono: data.telefono || "",
      email: data.email || "",
      funcionarioEncargado: data.funcionarioEncargado,
      tipoRenta: data.tipoRenta,
      tipoTramite: data.tipoTramite,
      item: data.item || "",
      tipoRespuesta: data.tipoRespuesta || "",
      numeroSadeSalida: data.numeroSadeSalida || "",
      fechaVencimiento: data.fechaLimiteRespuesta.toISOString(),
      diasPendientes: Math.ceil((new Date(data.fechaLimiteRespuesta).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      semaforo: 'verde' as const,
      estado: 'pendiente' as const,
    };
    onSubmit(processData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Nueva' : 'Editar'} PQRSD - Base Nexura</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="radicacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Radicación</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="radicacionExterno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Radicación Externo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secretaria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secretaría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar secretaría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hacienda">Secretaría de Hacienda</SelectItem>
                        <SelectItem value="gobierno">Secretaría de Gobierno</SelectItem>
                        <SelectItem value="infraestructura">Secretaría de Infraestructura</SelectItem>
                        <SelectItem value="desarrollo">Secretaría de Desarrollo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoSolicitud"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Solicitud</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="peticion">Petición</SelectItem>
                        <SelectItem value="queja">Queja</SelectItem>
                        <SelectItem value="reclamo">Reclamo</SelectItem>
                        <SelectItem value="sugerencia">Sugerencia</SelectItem>
                        <SelectItem value="denuncia">Denuncia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombreSolicitante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Solicitante</FormLabel>
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
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diasHabilesRestantes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días Hábiles Restantes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diasHabilesTranscurridos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días Hábiles Transcurridos</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaIngreso"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Ingreso</FormLabel>
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
                name="fechaLimiteRespuesta"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Límite de Respuesta</FormLabel>
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
                name="fechaRespuesta"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Respuesta</FormLabel>
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
                name="condicionSolicitud"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condición de Solicitud</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar condición" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nueva">Nueva</SelectItem>
                        <SelectItem value="reiterada">Reiterada</SelectItem>
                        <SelectItem value="complementaria">Complementaria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable</FormLabel>
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
                        <SelectItem value="peticion">Petición</SelectItem>
                        <SelectItem value="queja">Queja</SelectItem>
                        <SelectItem value="reclamo">Reclamo</SelectItem>
                        <SelectItem value="sugerencia">Sugerencia</SelectItem>
                        <SelectItem value="denuncia">Denuncia</SelectItem>
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
                    <FormLabel>Número de SADE de Salida</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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