import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { appendToSheet } from '@/lib/googleSheets';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const NexuraForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Mapeo de los 46 campos en orden exacto según tu Excel
      const rowData = [
        data.canal_ingreso, data.base_informe, data.no, data.radicacion, data.radicacion_ext,
        data.secretaria, data.tipo_solicitud, data.prioritaria, data.canal_ingreso_2,
        data.tema, data.condicion, data.responsable, data.fecha_registro, data.fecha_ingreso,
        data.fecha_limite, data.fecha_respuesta, data.dias_habiles_rest, data.dias_habiles_trans,
        data.dias_habiles_trans_total, data.estado, data.tipo_persona, data.nit, data.digito,
        data.tipo_doc, data.num_doc, data.duplicados, data.nombre_solicitante, data.telefono,
        data.email, data.termino, data.requerimiento, data.func_encargado, data.tipo_renta,
        data.tipo_tramite, data.item, data.tipo_renta_otro, data.tipo_respuesta, data.fecha_respuesta_final,
        data.no_sade, data.prelacion, data.semaforo, data.dias_pendientes, data.no_expediente,
        data.anio_ingreso, data.mes_ingreso, data.repetida
      ];
      
      await appendToSheet('Base NEXURA', rowData);
      toast.success('Registro guardado exitosamente');
      reset();
    } catch (error) {
      toast.error('Error al guardar en Google Sheets');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="ingreso">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="ingreso">Datos Ingreso</TabsTrigger>
          <TabsTrigger value="solicitante">Solicitante</TabsTrigger>
          <TabsTrigger value="gestion">Gestión</TabsTrigger>
        </TabsList>

        <TabsContent value="ingreso" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input {...register("radicacion")} placeholder="No. Radicación" />
            <Input {...register("radicacion_ext")} placeholder="No. Radicación Externo" />
            <Select onValueChange={(v) => register("tipo_solicitud").onChange({ target: { value: v } })}>
              <SelectTrigger><SelectValue placeholder="Tipo de Solicitud" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Petición de interés general">Petición de interés general</SelectItem>
                <SelectItem value="Reclamo">Reclamo</SelectItem>
                <SelectItem value="Solicitud de información">Solicitud de información</SelectItem>
              </SelectContent>
            </Select>
            <Input {...register("tema")} placeholder="Tema" />
          </div>
        </TabsContent>

        <TabsContent value="solicitante" className="space-y-4">
          <Input {...register("nombre_solicitante")} placeholder="Nombre del Solicitante" />
          <Input {...register("email")} placeholder="Email" />
          <Input {...register("telefono")} placeholder="Teléfono" />
        </TabsContent>

        <TabsContent value="gestion" className="space-y-4">
          <Select onValueChange={(v) => register("estado").onChange({ target: { value: v } })}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Atendida">Atendida</SelectItem>
              <SelectItem value="En proceso">En proceso</SelectItem>
            </SelectContent>
          </Select>
          <Input {...register("dias_pendientes")} placeholder="Días Pendientes" type="number" />
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
      </Button>
    </form>
  );
};
