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
  const targetSheet = sheetName || "Base Olga";
  
  try {
    const url = `${WEB_APP_URL}?sheetName=${encodeURIComponent(targetSheet)}`;
    const response = await fetch(url);
    const text = await response.text();
    
    // Limpiamos cualquier posible redirección de Google para extraer el JSON puro
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      // Si viene envuelto en texto o HTML de redirección, intentamos buscar el JSON dentro
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        result = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      } else {
        throw new Error("Formato de respuesta inválido");
      }
    }

    if (result.error) {
      throw new Error(result.error);
    }

    const rawRows = result[targetSheet] || [];

    // Mapeamos los datos para que Lovable los pinte sin importar los nombres de las columnas
    const formattedRows = rawRows.map((row: any, index: number) => ({
      id: row["No consecutivo"] || row["ID"] || `row-${index}`,
      ...row
    }));

    return {
      [targetSheet]: formattedRows
    };
  } catch (error) {
    console.error('Error al leer la hoja:', error);
    // Devolvemos un arreglo vacío en caso de fallo para que la aplicación no se congele
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
