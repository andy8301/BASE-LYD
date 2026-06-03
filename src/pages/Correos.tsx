import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { appendToSheet } from '../lib/googleSheets';

export default function Correos() {
  const { register, handleSubmit, reset } = useForm();
  const [status, setStatus] = useState('');

  const onSubmit = async (data: any) => {
    setStatus('Guardando...');
    try {
      // Mapeo completo de las 26 columnas de tu base de correos
      const rowData = [
        data.canal_ingreso, data.mes, data.fecha_asignacion, data.correo_funcionario,
        data.funcionario, data.asunto, data.fecha_correo, data.contribuyente,
        data.correo_solicitante, data.tipo_renta, data.tipo_renta_otro, data.tipo_tramite,
        data.item, data.placa, data.fecha_respuesta, data.tipo_respuesta,
        data.no_sade, data.observaciones, data.prelacion, data.fecha_vencimiento,
        data.dias_pendientes, data.semaforo, data.no_expediente, data.anio_ingreso,
        data.mes_ingreso, data.es_formula
      ];
      
      await appendToSheet('BASE CORREOS ELECTRONICOS', rowData);
      setStatus('¡Guardado exitosamente!');
      reset();
    } catch (e) {
      setStatus('Error al guardar, intenta de nuevo.');
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Módulo de Correos Electrónicos</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          {/* Campos clave del formulario */}
          <div>
            <label>CANAL DE INGRESO</label>
            <input {...register("canal_ingreso")} style={inputStyle} />
          </div>
          <div>
            <label>MES</label>
            <input {...register("mes")} style={inputStyle} />
          </div>
          <div>
            <label>ASUNTO CORREO</label>
            <input {...register("asunto")} style={inputStyle} />
          </div>
          <div>
            <label>CONTRIBUYENTE</label>
            <input {...register("contribuyente")} style={inputStyle} />
          </div>
          {/* Agrega aquí el resto de los 26 campos siguiendo este mismo patrón */}
        </div>
        <button type="submit" style={{ padding: '15px 30px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          GUARDAR REGISTRO
        </button>
      </form>
      <p>{status}</p>
    </div>
  );
}
