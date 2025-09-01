import { Branch } from '../types/branch';

// Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

export const fetchSheetData = async (branch: Branch): Promise<any[]> => {
  // ใช้ Google Apps Script API แทน CSV export
  if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    throw new Error('Google Apps Script URL not configured. Please set VITE_GOOGLE_APPS_SCRIPT_URL in .env.local');
  }

  const url = `${GOOGLE_APPS_SCRIPT_URL}?action=getBranchData&branchId=${branch.id}&cacheBuster=${Date.now()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch data for branch ${branch.name}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || `Failed to get data for branch ${branch.name}`);
    }

    return result.data || [];
  } catch (error) {
    console.error(`Error fetching data for branch ${branch.name}:`, error);
    throw error;
  }
};

export const fetchAllBranchesData = async (_branches: Branch[]) => {
  // Debug: แสดง URL ที่ใช้
  console.log('🔗 Google Apps Script URL:', GOOGLE_APPS_SCRIPT_URL ? 'Set ✅' : 'Not set ❌');
  
  // ใช้ Google Apps Script API endpoint เดียวที่ดึงข้อมูลทุกสาขาพร้อมกัน
  if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    console.error('❌ Google Apps Script URL not configured!');
    throw new Error('Google Apps Script URL not configured. Please set VITE_GOOGLE_APPS_SCRIPT_URL in Vercel dashboard');
  }

  const url = `${GOOGLE_APPS_SCRIPT_URL}?action=getAllData&cacheBuster=${Date.now()}`;
  console.log('🌐 Making request to:', url.substring(0, 100) + '...');
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch data from Google Apps Script`);
    }

    const result = await response.json();
    console.log('📦 Response data size:', JSON.stringify(result).length, 'characters');
    
    if (!result.success) {
      console.error('❌ API returned error:', result.error);
      throw new Error(result.error || 'Failed to get data from Google Apps Script');
    }

    console.log('✅ Successfully received data from', result.data?.length || 0, 'branches');
    return result.data || [];
  } catch (error) {
    console.error('💥 Error fetching all branches data:', error);
    throw error;
  }
};