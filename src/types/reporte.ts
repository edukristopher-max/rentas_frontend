export interface ReporteGenerado {
  id: number;
  tipoReporte: string;
  fechaGeneracion: string;
  usuario: string;
  filtros: string;
  totalRegistros: number;
}

export interface CreateReporteGeneradoDto {
  tipoReporte: string;
  filtros: string;
  totalRegistros: number;
}

export interface DashboardMetrics {
  totalContribuyentes: number;
  totalPredios: number;
  totalRecaudado: number;
  deudaPorCobrar: number;
  licenciasActivas: number;
  totalLicencias: number;
}

export interface MonthlyRevenueDto {
  mes: string;
  recaudado: number;
  deuda: number;
}

export interface RevenueTypeDto {
  tipo: string;
  monto: number;
  fill: string;
}
