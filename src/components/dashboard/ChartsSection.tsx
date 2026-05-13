import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ChartsSectionProps {
  cumplimientoPorProceso: any[];
  distribucionPorFuncionario: any[];
  evolucionMensual: any[];
  procesosPorCanal: any[];
}

const COLORS = ['hsl(214, 84%, 56%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(262, 83%, 58%)'];

export function ChartsSection({ 
  cumplimientoPorProceso, 
  distribucionPorFuncionario, 
  evolucionMensual, 
  procesosPorCanal 
}: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cumplimiento por Proceso */}
      <Card className="shadow-corporate">
        <CardHeader>
          <CardTitle>Cumplimiento por Proceso</CardTitle>
          <CardDescription>Comparativo cumplimiento vs meta establecida</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cumplimientoPorProceso}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="proceso" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="cumplimiento" fill="hsl(214, 84%, 56%)" name="Cumplimiento %" />
              <Bar dataKey="meta" fill="hsl(142, 71%, 45%)" name="Meta %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Evolución Mensual */}
      <Card className="shadow-corporate">
        <CardHeader>
          <CardTitle>Evolución Mensual</CardTitle>
          <CardDescription>Procesos ingresados vs resueltos por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucionMensual}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="ingresados" 
                stroke="hsl(214, 84%, 56%)" 
                strokeWidth={3}
                name="Ingresados"
              />
              <Line 
                type="monotone" 
                dataKey="resueltos" 
                stroke="hsl(142, 71%, 45%)" 
                strokeWidth={3}
                name="Resueltos"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribución por Funcionario */}
      <Card className="shadow-corporate">
        <CardHeader>
          <CardTitle>Carga de Trabajo por Funcionario</CardTitle>
          <CardDescription>Número de procesos asignados</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distribucionPorFuncionario} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis 
                dataKey="funcionario" 
                type="category" 
                tick={{ fontSize: 12 }}
                width={120}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="procesos" fill="hsl(214, 84%, 56%)" name="Procesos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Procesos por Canal */}
      <Card className="shadow-corporate">
        <CardHeader>
          <CardTitle>Distribución por Canal de Ingreso</CardTitle>
          <CardDescription>Porcentaje de procesos por canal</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={procesosPorCanal}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {procesosPorCanal.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}