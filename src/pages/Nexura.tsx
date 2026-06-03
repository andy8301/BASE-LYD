import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { appendToSheet } from '../lib/googleSheets';

export default function NexuraForm() {
  const { register, handleSubmit, reset } = useForm();
  const [status, setStatus] = useState('');

  const onSubmit = async (data: any) => {
    setStatus('Guardando...');
    try {
      // Orden exacto de los 46 campos de tu Excel
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
      setStatus('¡Éxito! Registro guardado.');
      reset();
    } catch (e) {
      setStatus('Error al guardar, revisa la conexión.');
    }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Módulo NEXURA - Registro Completo</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input {...register("radicacion")} placeholder="No. Radicación" style={inputStyle} />
          <input {...register("radicacion_ext")} placeholder="No. Radicación Externo" style={inputStyle} />
          <input {...register("nombre_solicitante")} placeholder="Nombre Solicitante" style={inputStyle} />
          <input {...register("email")} placeholder="Email" style={inputStyle} />
          <select {...register("estado")} style={inputStyle}>
            <option value="En proceso">En proceso</option>
            <option value="Atendida">Atendida</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Guardar Registro Completo
        </button>
      </form>
      <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>
    </div>
  );
}
