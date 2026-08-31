export const SHEET_NAMES = {
  BASE_OLGA: 'Base Olga',
  CORREOS: 'BASE CORREOS ELECTRONICOS',
  NEXURA: 'Base NEXURA',
  FISCALIZACION: 'Base Traslados Fiscalización',
  TUTELAS: 'BASE TUTELAS',
  CONSOLIDADO: 'CONSOLIDADO BASES',
  RESOLUCIONES: 'RES',
} as const;

export type SheetName = typeof SHEET_NAMES[keyof typeof SHEET_NAMES];

export interface SheetInfo {
  title: string;
  sheetId: number;
  index: number;
}

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz1WcsmeV2TfiJ-y2IQBZ4D3E_i2CHpKrRxLw8i7MoMXjKt4jJUgxgW6EiWO_SvZNf2bg/exec";

export async function getSheetNames(): Promise<SheetInfo[]> {
  return Object.values(SHEET_NAMES).map((name, index) => ({
    title: name,
    sheetId: index,
    index: index
  }));
}

export async function readSheet(sheetName?: string, range?: string): Promise<Record<string, any[]>> {
  const targetSheet = sheetName || "Base Olga";
  
  try {
    const url = `${WEB_APP_URL}?sheetName=${encodeURIComponent(targetSheet)}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    const proxyData = await response.json();
    
    if (!proxyData.contents) {
      throw new Error("No se pudo conectar con el servidor");
    }

    const result = JSON.parse(proxyData.contents);
    const rawRows = result[targetSheet] || result.data || [];

    // Formateamos las filas para que la tabla de Lovable las lea de inmediato
    const formattedRows = Array.isArray(rawRows) ? rawRows.map((row: any, index: number) => ({
      id: row["No consecutivo"] || row["ID"] || `row-${index}`,
      ...row
    })) : [];

    return {
      [targetSheet]: formattedRows
    };
  } catch (error) {
    console.error('Error al leer la hoja:', error);
    return {
      [targetSheet]: []
    };
  }
}

export async function appendToSheet(sheetName: string, rowData: any[]): Promise<any> {
  const response = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'append', sheetName, rowData })
  });
  return await response.json();
}

export async function updateSheetRow(sheetName: string, range: string, rowData: any[]): Promise<any> {
  const response = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'update', sheetName, rangeStr: range, rowData })
  });
  return await response.json();
}
