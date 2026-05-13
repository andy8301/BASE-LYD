import { BaseOlga, BaseCorreos, BaseNexura, ProcessSummary, AlertProcess, KPIData } from '@/types/processes';

// Mock data para Base Olga
export const mockBaseOlga: BaseOlga[] = [
  {
    id: '1',
    consecutivo: '001',
    canalIngreso: 'Presencial',
    areaRemitente: 'Fiscalización',
    planilla: 'PL001',
    expediente: 'EXP001',
    fechaRadicacion: '2024-01-15',
    actoAdministrativo: 'Resolución',
    numeroActo: 'RES001',
    fechaActo: '2024-01-20',
    placa: 'ABC123',
    identificacion: '12345678',
    contribuyente: 'Juan Pérez',
    ciudadDepartamento: 'Bogotá - Cundinamarca',
    funcionarioEncargado: 'María García',
    fechaRecibido: '2024-01-16',
    tipoRenta: 'Vehicular',
    tipoTramite: 'Matricula',
    item: 'IT001',
    numeroResolucion: 'RES001',
    numeroSadeSalida: 'SADE001',
    fechaResolucion: '2024-02-15',
    tipoRespuesta: 'Favorable',
    fechaEjecutoria: '2024-02-20',
    traslado: 'No',
    cerradoPasadoArchivo: 'No',
    ubicacionFisica: 'Archivo A1',
    fechaVencimiento: '2024-12-20',
    diasPendientes: 15,
    semaforo: 'amarillo' as const,
    observacionSade: 'En proceso de revisión',
    estado: 'en_proceso' as const,
    fechaIngreso: '2024-01-15',
    anoIngreso: '2024', mes: '1', fechaPlanilla: '', diasTranscurridos: '', clasificacionPdtes: '', tipoRentaOtro: '', tipoResolucion: '', trasladoArchivoFuncionario: '', semaforoExpedientes: '', baseFuncionario1ra: '', baseFuncionario2da: '', baseFuncionario3ra: '', nota: '', sadeRepetido: '', tipoRespuestaFinal: ''
  },
  {
    id: '2',
    consecutivo: '002',
    canalIngreso: 'Virtual',
    areaRemitente: 'Tributaria',
    planilla: 'PL002',
    expediente: 'EXP002',
    fechaRadicacion: '2024-01-10',
    actoAdministrativo: 'Auto',
    numeroActo: 'AUTO001',
    fechaActo: '2024-01-12',
    placa: 'DEF456',
    identificacion: '87654321',
    contribuyente: 'Ana López',
    ciudadDepartamento: 'Medellín - Antioquia',
    funcionarioEncargado: 'Carlos Rodríguez',
    fechaRecibido: '2024-01-11',
    tipoRenta: 'Predial',
    tipoTramite: 'Avalúo',
    item: 'IT002',
    numeroResolucion: 'RES002',
    numeroSadeSalida: 'SADE002',
    fechaResolucion: '2024-02-10',
    tipoRespuesta: 'Desfavorable',
    fechaEjecutoria: '2024-02-15',
    traslado: 'Sí',
    cerradoPasadoArchivo: 'No',
    ubicacionFisica: 'Archivo B2',
    fechaVencimiento: '2024-12-10',
    diasPendientes: 3,
    semaforo: 'rojo' as const,
    observacionSade: 'Requiere documentación adicional',
    estado: 'vencido' as const,
    fechaIngreso: '2024-01-10',
    anoIngreso: '2024', mes: '1', fechaPlanilla: '', diasTranscurridos: '', clasificacionPdtes: '', tipoRentaOtro: '', tipoResolucion: '', trasladoArchivoFuncionario: '', semaforoExpedientes: '', baseFuncionario1ra: '', baseFuncionario2da: '', baseFuncionario3ra: '', nota: '', sadeRepetido: '', tipoRespuestaFinal: ''
  }
];

// Mock data para Base Correos
export const mockBaseCorreos: BaseCorreos[] = [
  {
    id: '3',
    canalIngreso: 'Correo Electrónico',
    mes: 'Enero',
    fechaAsignacion: '2024-01-18',
    correoFuncionario: 'funcionario@entidad.gov.co',
    funcionarioEncargado: 'Laura Martínez',
    asuntoCorreo: 'Consulta sobre impuesto vehicular',
    fechaCorreo: '2024-01-17',
    contribuyenteSolicitante: 'Pedro González',
    tipoRenta: 'Vehicular',
    tipoTramite: 'Consulta',
    item: 'IT003',
    placa: 'GHI789',
    fechaRespuesta: '2024-01-25',
    tipoRespuesta: 'Informativa',
    numeroSadeSalida: 'SADE003',
    observaciones: 'Respuesta enviada satisfactoriamente',
    fechaVencimiento: '2024-12-25',
    diasPendientes: 8,
    semaforo: 'verde' as const,
    estado: 'resuelto' as const,
    fechaIngreso: '2024-01-17'
  }
];

// Mock data para Base Nexura
export const mockBaseNexura: BaseNexura[] = [
  {
    id: '4',
    canalIngreso: 'NEXURA',
    radicacion: 'RAD001',
    radicacionExterno: 'REXT001',
    secretaria: 'Hacienda',
    tipoSolicitud: 'PQRSD',
    condicionSolicitud: 'Nueva',
    responsable: 'Ana Torres',
    fechaIngreso: '2024-01-20',
    fechaLimiteRespuesta: '2024-02-20',
    fechaRespuesta: '2024-02-15',
    diasHabilesRestantes: 10,
    diasHabilesTranscurridos: 20,
    nombreSolicitante: 'Roberto Silva',
    telefono: '3001234567',
    email: 'roberto@email.com',
    funcionarioEncargado: 'Ana Torres',
    tipoRenta: 'Predial',
    tipoTramite: 'PQRSD',
    item: 'IT004',
    tipoRespuesta: 'Satisfactoria',
    numeroSadeSalida: 'SADE004',
    fechaVencimiento: '2024-12-15',
    diasPendientes: 12,
    semaforo: 'verde' as const,
    estado: 'resuelto' as const
  }
];

// Resumen de procesos
export const mockProcessSummary: ProcessSummary = {
  total: 156,
  pendientes: 45,
  enProceso: 67,
  resueltos: 38,
  vencidos: 6,
  porcentajeCumplimiento: 87.5
};

// Alertas de procesos críticos
export const mockAlerts: AlertProcess[] = [
  {
    id: '1',
    tipo: 'Base Olga',
    funcionario: 'Carlos Rodríguez',
    descripcion: 'Expediente EXP002 próximo a vencer',
    diasPendientes: 3,
    semaforo: 'rojo',
    fechaVencimiento: '2024-12-10'
  },
  {
    id: '2',
    tipo: 'Base Correos',
    funcionario: 'María García',
    descripcion: 'Correo pendiente de respuesta',
    diasPendientes: 15,
    semaforo: 'amarillo',
    fechaVencimiento: '2024-12-20'
  }
];

// KPIs del sistema
export const mockKPIData: KPIData = {
  procesosIngresados: 156,
  procesosResueltos: 105,
  procesosPendientes: 45,
  procesosVencidos: 6,
  tiempoPromedioAtencion: 12.5,
  eficiencia: 87.5,
  eficacia: 92.3
};

// Datos para gráficas
export const mockChartData = {
  cumplimientoPorProceso: [
    { proceso: 'Base Olga', cumplimiento: 85, meta: 90 },
    { proceso: 'Correos', cumplimiento: 92, meta: 85 },
    { proceso: 'Nexura', cumplimiento: 88, meta: 90 },
    { proceso: 'Traslados', cumplimiento: 95, meta: 92 },
    { proceso: 'Resoluciones', cumplimiento: 82, meta: 88 },
    { proceso: 'Fiscalización', cumplimiento: 90, meta: 85 },
    { proceso: 'Tutelas', cumplimiento: 78, meta: 80 }
  ],
  distribucionPorFuncionario: [
    { funcionario: 'María García', procesos: 32 },
    { funcionario: 'Carlos Rodríguez', procesos: 28 },
    { funcionario: 'Laura Martínez', procesos: 24 },
    { funcionario: 'Ana Torres', procesos: 22 },
    { funcionario: 'Pedro Sánchez', procesos: 18 }
  ],
  evolucionMensual: [
    { mes: 'Ene', ingresados: 45, resueltos: 38 },
    { mes: 'Feb', ingresados: 52, resueltos: 41 },
    { mes: 'Mar', ingresados: 48, resueltos: 45 },
    { mes: 'Abr', ingresados: 41, resueltos: 39 },
    { mes: 'May', ingresados: 55, resueltos: 48 },
    { mes: 'Jun', ingresados: 49, resueltos: 52 }
  ],
  procesosPorCanal: [
    { canal: 'Presencial', value: 45 },
    { canal: 'Virtual', value: 38 },
    { canal: 'Correo', value: 32 },
    { canal: 'Nexura', value: 28 },
    { canal: 'Telefónico', value: 13 }
  ]
};