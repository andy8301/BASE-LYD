import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const reportTypes = [
  { id: 'cumplimiento', name: 'Cumplimiento de Metas', description: 'Reporte de cumplimiento por proceso y funcionario' },
  { id: 'atencion', name: 'Atención por Canal', description: 'Número de usuarios atendidos por canal de ingreso' },
  { id: 'tiempos', name: 'Tiempos de Atención', description: 'Tiempos promedio vs término legal' },
  { id: 'vencimientos', name: 'Procesos Vencidos', description: 'Cantidad de atenciones por fuera de tiempo' },
  { id: 'eficiencia', name: 'Eficiencia y Eficacia', description: 'Indicadores de gestión institucional' }
];

const mockReportData = {
  cumplimiento: [
    { proceso: 'Base Olga', meta: 90, cumplimiento: 87, pendientes: 12 },
    { proceso: 'Correos', meta: 85, cumplimiento: 92, pendientes: 8 },
    { proceso: 'Nexura', meta: 90, cumplimiento: 88, pendientes: 15 },
    { proceso: 'Tutelas', meta: 95, cumplimiento: 89, pendientes: 2 }
  ],
  atencionPorCanal: [
    { canal: 'Presencial', usuarios: 847, porcentaje: 35 },
    { canal: 'Virtual', usuarios: 623, porcentaje: 26 },
    { canal: 'Correo', usuarios: 445, porcentaje: 18 },
    { canal: 'Nexura', usuarios: 378, porcentaje: 16 },
    { canal: 'Telefónico', usuarios: 127, porcentaje: 5 }
  ]
};

export default function ReportesPage() {
  const [selectedReport, setSelectedReport] = useState('cumplimiento');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const [selectedFuncionario, setSelectedFuncionario] = useState('all');

  const handleExport = (format: 'excel' | 'pdf') => {
    // Simulación de exportación
    console.log(`Exporting ${selectedReport} as ${format}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Reportes e Indicadores
        </h1>
        <p className="text-muted-foreground text-lg">
          Informes automáticos y análisis de gestión institucional
        </p>
      </div>

      {/* KPIs Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Total Procesos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2,420</div>
            <p className="text-xs text-muted-foreground">Todos los procesos</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Resueltos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">2,118</div>
            <p className="text-xs text-muted-foreground">87.5% del total</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">267</div>
            <p className="text-xs text-muted-foreground">11.0% del total</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Vencidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">35</div>
            <p className="text-xs text-muted-foreground">1.5% del total</p>
          </CardContent>
        </Card>
      </div>

      {/* Generador de Reportes */}
      <Card className="shadow-corporate">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Generador de Reportes
          </CardTitle>
          <CardDescription>
            Genere informes personalizados con filtros específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="report-type">Tipo de Reporte</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-from">Fecha Desde</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date-to">Fecha Hasta</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="funcionario">Funcionario</Label>
              <Select value={selectedFuncionario} onValueChange={setSelectedFuncionario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los funcionarios</SelectItem>
                  <SelectItem value="maria">María García</SelectItem>
                  <SelectItem value="carlos">Carlos Rodríguez</SelectItem>
                  <SelectItem value="laura">Laura Martínez</SelectItem>
                  <SelectItem value="ana">Ana Torres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Button onClick={() => handleExport('excel')} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Excel
            </Button>
            <Button onClick={() => handleExport('pdf')} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>

          {/* Preview del Reporte */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <h4 className="font-semibold mb-2">
              {reportTypes.find(t => t.id === selectedReport)?.name}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {reportTypes.find(t => t.id === selectedReport)?.description}
            </p>

            {selectedReport === 'cumplimiento' && (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockReportData.cumplimiento}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="proceso" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="cumplimiento" fill="hsl(214, 84%, 56%)" name="Cumplimiento %" />
                    <Bar dataKey="meta" fill="hsl(142, 71%, 45%)" name="Meta %" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mockReportData.cumplimiento.map((item, index) => (
                    <Card key={index} className="p-3">
                      <div className="text-sm font-medium">{item.proceso}</div>
                      <div className="text-lg font-bold text-primary">{item.cumplimiento}%</div>
                      <div className="text-xs text-muted-foreground">Meta: {item.meta}%</div>
                      <Badge variant={item.pendientes > 10 ? "destructive" : "secondary"} className="text-xs">
                        {item.pendientes} pendientes
                      </Badge>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedReport === 'atencion' && (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockReportData.atencionPorCanal}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, porcentaje }) => `${name} ${porcentaje}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="usuarios"
                    >
                      {mockReportData.atencionPorCanal.map((entry, index) => {
                        const colors = ['hsl(214, 84%, 56%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(262, 83%, 58%)'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockReportData.atencionPorCanal.map((item, index) => (
                    <Card key={index} className="p-3">
                      <div className="text-sm font-medium">{item.canal}</div>
                      <div className="text-lg font-bold text-primary">{item.usuarios.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{item.porcentaje}% del total</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}