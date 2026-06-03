import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { appendToSheet } from '../lib/googleSheets'; // Ajusta esta ruta si es necesario

export default function NexuraForm() {
  const { register, handleSubmit } = useForm();
  const [status, setStatus] = useState('');

  const onSubmit = async (data: any) => {
    setStatus('Enviando...');
    try {
      const rowData = [
        data.canal_ingreso || "", data.base_informe || "", data.no || "", 
        data.radicacion || "", data.radicacion_ext || ""
        // ... (Agrega el resto de tus 46 campos aquí después)
      ];
      await appendToSheet('Base NEXURA', rowData);
      setStatus('¡Guardado con éxito!');
    } catch (e) {
      setStatus('Error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
      <h1>Módulo NEXURA</h1>
      <input {...register("radicacion")} placeholder="No. Radicación" style={{ display: 'block', margin: '10px 0', padding: '8px' }} />
      <input {...register("nombre_solicitante")} placeholder="Nombre Solicitante" style={{ display: 'block', margin: '10px 0', padding: '8px' }} />
      <button type="submit" style={{ padding: '10px 20px' }}>Guardar</button>
      <p>{status}</p>
    </form>
  );
}
