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

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby06Oi2pADk8qxOk_v892vIXEpkuh6XSBirwg7xT_mSjKNwMlRsvSt1kG5L1dVqn3m49Q/exec";

export async function getSheetNames(): Promise<SheetInfo[]> {
  return Object.values(SHEET_NAMES).map((name, index) => ({
    title: name,
    sheetId: index,
    index: index
  }));
}

export async function readSheet(sheetName?: string, range?: string): Promise<Record<string, any[]>> {
  try {
    const targetSheet = sheetName || "Base Olga";
    const url = `${WEB_APP_URL}?sheetName=${encodeURIComponent(targetSheet)}`;
    
    // Usamos mode: 'cors' y cabeceras limpias
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow'
    });
    
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Respuesta no es JSON válido:", text);
      throw new Error("Respuesta inválida del servidor de Google");
    }
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    return {
      [targetSheet]: result[targetSheet] || []
    };
  } catch (error) {
    console.error('Error reading sheet:', error);
    throw error;
  }
}

export async function appendToSheet(sheetName: string, rowData: any[]): Promise<any> {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'append', sheetName, rowData })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Failed to append to sheet');
    return result;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}

export async function updateSheetRow(sheetName: string, range: string, rowData: any[]): Promise<any> {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'update', sheetName, rangeStr: range, rowData })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Failed to update sheet');
    return result;
  } catch (error) {
    console.error('Error updating sheet:', error);
    throw error;
  }
}
