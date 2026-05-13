import { KPICard } from "@/components/dashboard/KPICard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  Users,
  Timer
} from "lucide-react";
import { 
  mockKPIData, 
  mockAlerts, 
  mockChartData 
} from "@/data/mockData";

export default function Dashboard() {
  const kpiData = mockKPIData;
  const alerts = mockAlerts;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard - Control de Procesos
        </h1>
        <p className="text-muted-foreground text-lg">
          Panel de control integral para el seguimiento de procesos de la Subgerencia
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Procesos Ingresados"
          value={kpiData.procesosIngresados}
          subtitle="Total en el sistema"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Procesos Resueltos"
          value={kpiData.procesosResueltos}
          subtitle="Completados exitosamente"
          icon={CheckCircle}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Procesos Pendientes"
          value={kpiData.procesosPendientes}
          subtitle="En trámite"
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Procesos Vencidos"
          value={kpiData.procesosVencidos}
          subtitle="Requieren atención"
          icon={AlertTriangle}
          variant="destructive"
          trend={{ value: -15, isPositive: false }}
        />
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Tiempo Promedio"
          value={`${kpiData.tiempoPromedioAtencion} días`}
          subtitle="Tiempo de atención"
          icon={Timer}
        />
        <KPICard
          title="Eficiencia"
          value={`${kpiData.eficiencia}%`}
          subtitle="Procesos en tiempo"
          icon={Target}
          variant="success"
        />
        <KPICard
          title="Eficacia"
          value={`${kpiData.eficacia}%`}
          subtitle="Metas alcanzadas"
          icon={TrendingUp}
          variant="success"
        />
        <KPICard
          title="Funcionarios Activos"
          value={12}
          subtitle="Personal asignado"
          icon={Users}
        />
      </div>

      {/* Alerts and Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <AlertsPanel alerts={alerts} />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground shadow-corporate">
              <h3 className="text-lg font-semibold mb-2">Cumplimiento Global</h3>
              <div className="text-3xl font-bold mb-2">87.5%</div>
              <p className="text-primary-foreground/80 text-sm">
                Meta mensual: 85%
              </p>
              <div className="mt-4 bg-primary-foreground/20 rounded-full h-2">
                <div 
                  className="bg-primary-foreground h-2 rounded-full transition-all duration-500"
                  style={{ width: '87.5%' }}
                />
              </div>
            </div>

            <div className="bg-gradient-success rounded-lg p-6 text-success-foreground shadow-corporate">
              <h3 className="text-lg font-semibold mb-2">Usuarios Atendidos</h3>
              <div className="text-3xl font-bold mb-2">1,247</div>
              <p className="text-success-foreground/80 text-sm">
                Este mes
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+23% vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <ChartsSection 
        cumplimientoPorProceso={mockChartData.cumplimientoPorProceso}
        distribucionPorFuncionario={mockChartData.distribucionPorFuncionario}
        evolucionMensual={mockChartData.evolucionMensual}
        procesosPorCanal={mockChartData.procesosPorCanal}
      />
    </div>
  );
}