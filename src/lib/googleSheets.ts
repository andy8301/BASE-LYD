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

// Usamos JSONP nativo para saltarnos el CORS y el error 302 al leer de Google Sheets
export async function readSheet(sheetName?: string, range?: string): Promise<Record<string, any[]>> {
  const targetSheet = sheetName || "Base Olga";
  
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    
    // Función global que ejecutará Google Apps Script al responder
    (window as any)[callbackName] = function(data: any) {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      if (data && data.error) {
        reject(new Error(data.error));
      } else {
        resolve({
          [targetSheet]: data[targetSheet] || []
        });
      }
    };

    const script = document.createElement('script');
    script.src = `${WEB_APP_URL}?sheetName=${encodeURIComponent(targetSheet)}&callback=${callbackName}`;
    script.onerror = function() {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      reject(new Error("Error al conectar con Google Sheets"));
    };
    
    document.body.appendChild(script);
  });
}

export async function appendToSheet(sheetName: string, rowData: any[]): Promise<any> {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
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
