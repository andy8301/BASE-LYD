export interface BaseProcess {
  id: string;
  canalIngreso: string;
  funcionarioEncargado: string;
  tipoRenta: string;
  tipoTramite: string;
  fechaVencimiento: string;
  diasPendientes: number;
  semaforo: 'verde' | 'amarillo' | 'rojo';
  estado: 'pendiente' | 'en_proceso' | 'resuelto' | 'vencido';
  fechaIngreso: string;
}

export interface BaseOlga extends BaseProcess {
  consecutivo: string;
  areaRemitente: string;
  planilla: string;
  expediente: string;
  fechaRadicacion: string;
  actoAdministrativo: string;
  numeroActo: string;
  fechaActo: string;
  placa: string;
  identificacion: string;
  contribuyente: string;
  ciudadDepartamento: string;
  fechaRecibido: string;
  item: string;
  numeroResolucion: string;
  numeroSadeSalida: string;
  fechaResolucion: string;
  tipoRespuesta: string;
  fechaEjecutoria: string;
  traslado: string;
  cerradoPasadoArchivo: string;
  ubicacionFisica: string;
  observacionSade: string;
  anoIngreso: string;
  mes: string;
  fechaPlanilla: string;
  diasTranscurridos: string;
  clasificacionPdtes: string;
  tipoRentaOtro: string;
  tipoResolucion: string;
  trasladoArchivoFuncionario: string;
  semaforoExpedientes: string;
  baseFuncionario1ra: string;
  baseFuncionario2da: string;
  baseFuncionario3ra: string;
  nota: string;
  sadeRepetido: string;
  tipoRespuestaFinal: string;
}

export interface BaseCorreos extends BaseProcess {
  mes: string;
  fechaAsignacion: string;
  correoFuncionario: string;
  asuntoCorreo: string;
  fechaCorreo: string;
  contribuyenteSolicitante: string;
  item: string;
  placa: string;
  fechaRespuesta: string;
  tipoRespuesta: string;
  numeroSadeSalida: string;
  observaciones: string;
}

export interface BaseNexura extends BaseProcess {
  radicacion: string;
  radicacionExterno: string;
  secretaria: string;
  tipoSolicitud: string;
  condicionSolicitud: string;
  responsable: string;
  fechaLimiteRespuesta: string;
  fechaRespuesta: string;
  diasHabilesRestantes: number;
  diasHabilesTranscurridos: number;
  nombreSolicitante: string;
  telefono: string;
  email: string;
  item: string;
  tipoRespuesta: string;
  numeroSadeSalida: string;
}

export interface Traslados extends BaseProcess {
  sadeIngreso: string;
  numeroActoSade: string;
  planilla: string;
  expediente: string;
  fechaPlanilla: string;
  actoAdministrativo: string;
  numeroSadeSalida: string;
}

export interface Resoluciones extends BaseProcess {
  sadeIngreso: string;
  numeroActoSadeSalida: string;
  planilla: string;
  fechaPlanilla: string;
  actoAdministrativo: string;
  numeroSadeSalida: string;
  expediente: string;
}

export interface Fiscalizacion extends BaseProcess {
  planilla: string;
  expediente: string;
  actoAdministrativo: string;
  fechaPlanillaIngreso: string;
  proceso: string;
  contribuyente: string;
  impuesto: string;
  estadoProceso: string;
  resolucionSadeSalida: string;
  fechaResolucionSade: string;
  fechaEjecutoria: string;
  semaforoVencimiento: 'verde' | 'amarillo' | 'rojo';
}

export interface Tutelas extends BaseProcess {
  mes: string;
  fechaAsignacion: string;
  asuntoCorreo: string;
  remitente: string;
  fechaRespuestaPeticion: string;
  fechaRespuestaJuridica: string;
  observaciones: string;
}

export interface ConsolidadoBases extends BaseProcess {
  numeroActoSade: string;
  fechaActo: string;
  anoIngreso: string;
  mesIngreso: string;
  item: string;
  fechaRespuesta: string;
  diasFaltantes: number;
  tipoRespuesta: string;
  observacion: string;
}

export interface ProcessSummary {
  total: number;
  pendientes: number;
  enProceso: number;
  resueltos: number;
  vencidos: number;
  porcentajeCumplimiento: number;
}

export interface AlertProcess {
  id: string;
  tipo: string;
  funcionario: string;
  descripcion: string;
  diasPendientes: number;
  semaforo: 'verde' | 'amarillo' | 'rojo';
  fechaVencimiento: string;
}

export interface KPIData {
  procesosIngresados: number;
  procesosResueltos: number;
  procesosPendientes: number;
  procesosVencidos: number;
  tiempoPromedioAtencion: number;
  eficiencia: number;
  eficacia: number;
}