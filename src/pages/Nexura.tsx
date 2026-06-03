import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { appendToSheet } from '../lib/googleSheets';

export default function NexuraForm() {
  const { register, handleSubmit, reset } = useForm();
  const [status, setStatus] = useState('');

  const onSubmit = async (data: any) => {
    setStatus('Guardando...');
    try {
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
      setStatus('¡Éxito! Registro completo guardado.');
      reset();
    } catch (e) {
      setStatus('Error al guardar. Revisa los datos.');
    }
  };

  const inputStyle = { width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' };

  // Helper para generar los 46 inputs
  const fields = [
    "canal_ingreso", "base_informe", "no", "radicacion", "radicacion_ext", "secretaria", "tipo_solicitud", 
    "prioritaria", "canal_ingreso_2", "tema", "condicion", "responsable", "fecha_registro", "fecha_ingreso", 
    "fecha_limite", "fecha_respuesta", "dias_habiles_rest", "dias_habiles_trans", "dias_habiles_trans_total", 
    "estado", "tipo_persona", "nit", "digito", "tipo_doc", "num_doc", "duplicados", "nombre_solicitante", 
    "telefono", "email", "termino", "requerimiento", "func_encargado", "tipo_renta", "tipo_tramite", 
    "item", "tipo_renta_otro", "tipo_respuesta", "fecha_respuesta_final", "no_sade", "prelacion", 
    "semaforo", "dias_pendientes", "no_expediente", "anio_ingreso", "mes_ingreso", "repetida"
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Registro Completo - Base NEXURA</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {fields.map((field) => (
            <input key={field} {...register(field)} placeholder={field.replace('_', ' ').toUpperCase()} style={inputStyle} />
          ))}
        </div>
        <button type="submit" style={{ marginTop: '20px', padding: '15px', width: '100%', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          GUARDAR TODOS LOS 46 CAMPOS
        </button>
      </form>
      <p>{status}</p>
    </div>
  );
}
