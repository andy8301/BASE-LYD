import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Eye } from "lucide-react";
import { AlertProcess } from "@/types/processes";

interface AlertsPanelProps {
  alerts: AlertProcess[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getSemaforoVariant = (semaforo: string) => {
    switch (semaforo) {
      case 'rojo':
        return 'destructive';
      case 'amarillo':
        return 'default';
      case 'verde':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getSemaforoColor = (semaforo: string) => {
    switch (semaforo) {
      case 'rojo':
        return 'text-destructive';
      case 'amarillo':
        return 'text-warning';
      case 'verde':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-corporate">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Alertas Críticas
        </CardTitle>
        <CardDescription>
          Procesos que requieren atención inmediata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No hay alertas críticas en este momento</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {alert.tipo}
                    </Badge>
                    <Badge 
                      variant={getSemaforoVariant(alert.semaforo)}
                      className="text-xs"
                    >
                      {alert.semaforo.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm text-foreground mb-1">
                    {alert.descripcion}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Funcionario: {alert.funcionario}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.diasPendientes} días pendientes
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className={`w-3 h-3 rounded-full ${getSemaforoColor(alert.semaforo)} bg-current opacity-20`}>
                    <div className={`w-full h-full rounded-full ${getSemaforoColor(alert.semaforo)} bg-current`} />
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}