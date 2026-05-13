import { supabase } from "@/integrations/supabase/client";

// Mapping of internal base names to actual Google Sheet names
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

export async function getSheetNames(): Promise<SheetInfo[]> {
  const { data, error } = await supabase.functions.invoke('google-sheets', {
    body: { action: 'getSheetNames' },
  });

  if (error) {
    console.error('Error fetching sheet names:', error);
    throw error;
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch sheet names');
  }

  return data.data;
}

export async function readSheet(sheetName?: string, range?: string): Promise<Record<string, any[]>> {
  const { data, error } = await supabase.functions.invoke('google-sheets', {
    body: { action: 'read', sheetName, range },
  });

  if (error) {
    console.error('Error reading sheet:', error);
    throw error;
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to read sheet');
  }

  return data.data;
}

export async function appendToSheet(sheetName: string, rowData: string[]): Promise<any> {
  const { data, error } = await supabase.functions.invoke('google-sheets', {
    body: { action: 'append', sheetName, data: rowData },
  });

  if (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to append to sheet');
  }

  return data.data;
}

export async function updateSheetRow(sheetName: string, range: string, rowData: string[]): Promise<any> {
  const { data, error } = await supabase.functions.invoke('google-sheets', {
    body: { action: 'update', sheetName, range, data: rowData },
  });

  if (error) {
    console.error('Error updating sheet:', error);
    throw error;
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to update sheet');
  }

  return data.data;
}
