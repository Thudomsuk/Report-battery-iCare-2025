/**
 * Google Apps Script Web App for iCare Battery Booking Report
 * This script aggregates data from multiple Google Sheets and returns JSON data with CORS support
 */

// กำหนดข้อมูลสาขาทั้งหมด
const BRANCHES = [
  { id: 227, name: 'iCare-Paradise Park-Srinakarin', sheetId: '1H9rVD_1056Hu-c1I0XeYnezpG6bLrkgZJXkv6EW3hEw' },
  { id: 602, name: 'iCare-Market Village-Huahin', sheetId: '1CSz92ui3F1wC-PVyNg84JnEPM8Wc1LQc5t83tbpAWKk' },
  { id: 603, name: 'iCare-Central-Phitsanulok', sheetId: '10JAsU7Gvy4NBWvjCw6wXtDvmgg3jmn3Bc1EKUO3GS4c' },
  { id: 606, name: 'iCare-Central-Chiangmai Airport', sheetId: '1TPgeu2XgmxnZAMmQyzqTCG65NvXxrZVGf-A3Fp8hZOw' },
  { id: 614, name: 'iCare-The Mall- Bangkapi', sheetId: '1tOZqIH59U7MWlDoxMsKBpDklssRVrWBWD36PWxL2Xw8' },
  { id: 615, name: 'iCare-Future Park-Rangsit', sheetId: '1tNbrmOhr6o2_2tqq8L48ZEidygobdPnr92bRqju8kD8' },
  { id: 616, name: 'iCare-Robinson-Suphanburi', sheetId: '1S9SivRD8-0rA9qJjcbqI4EmRh4ZeLxQIIvhi3WXR60w' },
  { id: 617, name: 'iCare-Central-Udonthani', sheetId: '1x4TD_l5FfTEC4ZwsiAEDgVYGOYfG84ll4ZKjrwEosVw' },
  { id: 628, name: 'iCare-Central-Khonkaen', sheetId: '1fvydTGIMWXMZ-cDnLtyoxZoifdi-8Lp9OX4epN2uNhI' },
  { id: 630, name: 'iCare-The Mall-Korat', sheetId: '1gNOZfDOm5rCvLAOsk_hpkzHYxYJDhoDc9CA2-WLiDMA' },
  { id: 638, name: 'iCare-Central-Chonburi', sheetId: '1Zh8wfwqoR1ZbI_woIx_FgLaYXHCqkh4CSHJOnoxr8Fc' },
  { id: 641, name: 'Drop-Point-iCare', sheetId: '1JwBWj3jWh7WuterkEXGhoVSGpLHU62bgrSOgQmfhoL4' },
  { id: 658, name: 'iCare-Central-Westgate2.1', sheetId: '1js8h1gNKkeIxx3gdejhEIOgSH9ESxsI3I4j5qVYOHd0' },
  { id: 678, name: 'iCare-Central-Rama2', sheetId: '1VhxfCUP9iyJlDrbpsllEq9BYh1UHklLHwDtRGSFoOlg' },
  { id: 688, name: 'iCare-Central-Suratthani', sheetId: '1EkIVVgYZq1XUs3LWxy9bLXweqw4-KULYvkOOI3FC_yw' },
  { id: 711, name: 'iCare-Central-Salaya', sheetId: '1u81zgyulenII9IYAp_PEY7DAsKTpq-E5Wg2VNTnnhuo' },
  { id: 718, name: 'iCare-The Mall-Bangkae', sheetId: '1tDqyp4WTqEAfzW82As6mhH0Acg577bS0QvXeWIqUSP4' },
  { id: 721, name: 'iCare-Central-Pattaya', sheetId: '1gMWV1zjxvoMD1H_zIY2c1bxLqe-GWoWNZJICzcFqoF8' },
  { id: 731, name: 'iCare-V Square-Nakhonsawan', sheetId: '18inOpUNlbqaLs64j00Qp4SwQqWqoL2zEKI85RDmiKYk' },
  { id: 739, name: 'iCare-Robinson-Saraburi', sheetId: '11EC3lra29cbcojUXZiFzxE68ukuffrGejga-uZd4tfI' },
  { id: 769, name: 'iCare-Mega-Bangna', sheetId: '14na1igyeKG_OB_CpP-Zm8QSPrqqFvPA9eLOVA-VLhwM' },
  { id: 897, name: 'iCare-MAYA-Chiangmai', sheetId: '14L5-0NSHsFLZbXzDeFKusTw4YkQG6X8Vvjm8G73Oi-k' },
  { id: 1118, name: 'iCare-Central-East Vile', sheetId: '1BL_nuQwX7bXMdMtMkscBPHlizjCpJgQZp6T59etTz24' },
  { id: 1561, name: 'iCare-Central-Mueang-Ayutthaya', sheetId: '168eyPnv0GEtGM-PBqPQKY4JpeW7FUJZ0pdd4iwmyLUg' },
  { id: 1625, name: 'iCare-Robinson-Mueang-Chachoengsao', sheetId: '1VzduEyHTuMePBu6SptXhf3u3yjd16Gq1qkzBlPJwAjk' },
  { id: 1704, name: 'iCare-Central (Pinklao)-Bangkoknoi-Bangkok', sheetId: '1boblsmJdqo7EzEWmuIz6G9xT2Wn2lwSU4O6bJPfK1FY' },
  { id: 1786, name: 'iCare(S7)-Central-Mueang-Phitsanulok 2', sheetId: '1nEh-wah3Fp5A2OazJTOuIh64o5wv8vZw_hQxm7HD8I4' },
  { id: 1989, name: 'iCare(S7)-Future Park-Rangsit-Pathaumthani R.2', sheetId: '1qci5Ny55ADS8CTFICI0l89tSniyVMZVz8EFtV16wbYk' },
  { id: 2303, name: 'iCare-Central-Ladprao-Bangkok', sheetId: '1zpJVqXh3rQA8mpP1Tk8b1QVadSvPnbd7wnejxG1BlBk' },
  { id: 2304, name: 'iCare(S7)-Central-Pattaya-Chonburi', sheetId: '1uc12PjQYf3tS8auhU3l9pWiRDdR2e80ZDAyRP5T9XlQ' },
  { id: 2305, name: 'iCare Central-Chiangmai Festival', sheetId: '1QlhCfzWQbXyF6HXYhn9ddHzNobA_ex1IElVyH6VJnqw' },
  { id: 2306, name: 'iCare(S7)-Central-Pinklao-Bongkok', sheetId: '1jKd-AJK54u1noXrZP7igLJU99Y7A_CsI1S3JQLDDH1g' },
  { id: 2307, name: 'iCare(S7)-Central-Westgate-Nonthaburi', sheetId: '1gDdTPYyCXfZAK_JSzP9JVD33m5o9rt3lpGkZD7H0KJ4' },
  { id: 2352, name: 'iCare(S7)-The Mall-Bangkae', sheetId: '1VsE64Tcctq1A1A2mZdy2B-pI9qpIogzXDnTyz4LYU9w' },
  { id: 2353, name: 'iCare(S7)-The Mall-Bangkapi', sheetId: '10vEQxeeGYuyFsq8pWy0yH8wt_GfcB8I4-YPZdT-D4fY' },
  { id: 2547, name: 'iCare(S7)-Emquartier-Sukhumvit', sheetId: '1ZlXTPSnHFTXAr2VpBSoyziJVC4OZ67NGmGRFuEqAceg' },
  { id: 2548, name: 'iCare(S7)-Emsphere-Khlongtoei', sheetId: '1avn5vWTrwuKhzX9drEuaRVPtb3D2_dHd8OLKNM3Gfd4' },
  { id: 2559, name: 'iCare(S7)-Central-Salaya', sheetId: '1L_C7GowpdeVX-lmrkAFtP0_29pgmJUd6Eh-6_RgxpQs' },
  { id: 2573, name: 'iCare-Central-Hatyai', sheetId: '1rFc2q_Phh5blM3jXRMd9pENN4dmjP-uEQXejtkgQcoY' }
];

/**
 * Main function to handle HTTP requests
 */
function doGet(e) {
  // Enable CORS
  const response = {
    success: true,
    data: [],
    lastUpdated: new Date().toISOString(),
    timestamp: new Date().getTime()
  };

  try {
    // Get action parameter (default: 'getAllData')
    const action = e.parameter.action || 'getAllData';
    
    switch (action) {
      case 'getAllData':
        response.data = getAllBranchesData();
        break;
      case 'getBranchData':
        const branchId = parseInt(e.parameter.branchId);
        response.data = getSingleBranchData(branchId);
        break;
      case 'getHealth':
        response.data = { status: 'healthy', branches: BRANCHES.length };
        break;
      default:
        response.success = false;
        response.error = 'Invalid action parameter';
    }
  } catch (error) {
    response.success = false;
    response.error = error.toString();
    response.data = [];
  }

  // Return JSON response with CORS headers
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests (same as GET for this use case)
 */
function doPost(e) {
  return doGet(e);
}

/**
 * Get data from all branches
 */
function getAllBranchesData() {
  const allData = [];
  
  BRANCHES.forEach(branch => {
    try {
      const branchData = getSingleBranchData(branch.id);
      allData.push({
        branch: branch,
        data: branchData,
        success: true,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error fetching data for branch ${branch.name}:`, error);
      allData.push({
        branch: branch,
        data: [],
        success: false,
        error: error.toString(),
        lastUpdated: new Date().toISOString()
      });
    }
  });
  
  return allData;
}

/**
 * Get data from a single branch
 */
function getSingleBranchData(branchId) {
  const branch = BRANCHES.find(b => b.id === branchId);
  if (!branch) {
    throw new Error(`Branch with ID ${branchId} not found`);
  }

  try {
    // เปิด Google Sheet
    const spreadsheet = SpreadsheetApp.openById(branch.sheetId);
    
    // ลองหา sheet ที่มีข้อมูล summary ก่อน
    let sheet = null;
    const sheetNames = ['Summary_ByBranch', 'Summary_ByCategory', 'Summary_ByMonth', 'Sheet1', 'แผ่นงาน1'];
    
    for (let name of sheetNames) {
      try {
        sheet = spreadsheet.getSheetByName(name);
        if (sheet) break;
      } catch (e) {
        continue;
      }
    }
    
    // หากไม่เจอ sheet ที่ต้องการ ให้ใช้ sheet แรก
    if (!sheet) {
      sheet = spreadsheet.getSheets()[0];
    }

    // ดึงข้อมูลทั้งหมด
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length === 0) {
      return [];
    }

    // แปลงข้อมูลเป็น JSON
    const headers = values[0];
    const data = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j] ? headers[j].toString().trim() : `col_${j}`;
        const value = values[i][j];
        row[header] = value;
      }
      data.push(row);
    }

    return data;
    
  } catch (error) {
    console.error(`Error accessing sheet for branch ${branch.name}:`, error);
    throw new Error(`Failed to access sheet: ${error.toString()}`);
  }
}

/**
 * Test function for debugging
 */
function testGetAllData() {
  const result = getAllBranchesData();
  console.log('Total branches processed:', result.length);
  console.log('Successful branches:', result.filter(r => r.success).length);
  console.log('Failed branches:', result.filter(r => !r.success).length);
  return result;
}