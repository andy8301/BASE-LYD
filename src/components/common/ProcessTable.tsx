import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Filter, Download, Search } from "lucide-react";
import { BaseProcess } from "@/types/processes";

interface ProcessTableProps {
  title: string;
  description: string;
  data: BaseProcess[];
  columns: Array<{
    key: keyof BaseProcess | string;
    label: string;
    render?: (item: BaseProcess) => React.ReactNode;
  }>;
  onEdit?: (item: BaseProcess) => void;
}

export function ProcessTable({ title, description, data, columns, onEdit }: ProcessTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [semaforoFilter, setSemaforoFilter] = useState("all");

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === "all" || item.estado === statusFilter;
    const matchesSemaforo = semaforoFilter === "all" || item.semaforo === semaforoFilter;
    
    return matchesSearch && matchesStatus && matchesSemaforo;
  });

  const getSemaforoVariant = (semaforo: string) => {
    switch (semaforo) {
      case 'rojo': return 'destructive';
      case 'amarillo': return 'default';
      case 'verde': return 'secondary';
      default: return 'outline';
    }
  };

  const getEstadoVariant = (estado: string) => {
    switch (estado) {
      case 'resuelto': return 'secondary';
      case 'en_proceso': return 'default';
      case 'pendiente': return 'outline';
      case 'vencido': return 'destructive';
      default: return 'outline';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'resuelto': return 'Resuelto';
      case 'en_proceso': return 'En Proceso';
      case 'pendiente': return 'Pendiente';
      case 'vencido': return 'Vencido';
      default: return estado;
    }
  };

  return (
    <Card className="shadow-corporate">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar en todos los campos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en_proceso">En Proceso</SelectItem>
              <SelectItem value="resuelto">Resuelto</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>

          <Select value={semaforoFilter} onValueChange={setSemaforoFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semáforo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="verde">Verde</SelectItem>
              <SelectItem value="amarillo">Amarillo</SelectItem>
              <SelectItem value="rojo">Rojo</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Más filtros
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key.toString()}>{column.label}</TableHead>
                ))}
                <TableHead>Estado</TableHead>
                <TableHead>Semáforo</TableHead>
                <TableHead>Días Pendientes</TableHead>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={column.key.toString()}>
                      {column.render 
                        ? column.render(item)
                        : String((item as any)[column.key] || '-')
                      }
                    </TableCell>
                  ))}
                  <TableCell>
                    <Badge variant={getEstadoVariant(item.estado)}>
                      {getEstadoLabel(item.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSemaforoVariant(item.semaforo)}>
                      {item.semaforo.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={
                      item.diasPendientes <= 3 ? 'text-destructive font-semibold' :
                      item.diasPendientes <= 7 ? 'text-warning font-semibold' :
                      'text-foreground'
                    }>
                      {item.diasPendientes}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit?.(item)}
                      disabled={!onEdit}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No se encontraron procesos con los filtros aplicados</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
          <span>Mostrando {filteredData.length} de {data.length} procesos</span>
        </div>
      </CardContent>
    </Card>
  );
}