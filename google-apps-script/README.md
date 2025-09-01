# Google Apps Script Setup Instructions

## การตั้งค่า Google Apps Script Web App

### ขั้นตอนที่ 1: สร้าง Google Apps Script Project

1. ไปที่ [Google Apps Script Console](https://script.google.com/)
2. คลิก "New Project"
3. ลบโค้ดเดิมออกและคัดลอกโค้ดจากไฟล์ `Code.gs` มาใส่
4. ตั้งชื่อโปรเจค เช่น "iCare Battery Report API"

### ขั้นตอนที่ 2: Deploy Web App

1. คลิก "Deploy" > "New deployment"
2. เลือก type: "Web app"
3. กำหนดค่า:
   - **Description**: "iCare Battery Report API v1"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone (เพื่อให้เว็บไซต์เข้าถึงได้)

4. คลิก "Deploy"
5. อนุญาตสิทธิ์ที่ต้องการ
6. คัดลอก **Web app URL** ที่ได้

### ขั้นตอนที่ 3: ทดสอบ API

เปิด URL ที่ได้ + parameter ต่อไปนี้:

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getHealth
```

ควรได้ Response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "branches": 39
  },
  "lastUpdated": "2024-08-30T...",
  "timestamp": 1693123456789
}
```

### API Endpoints ที่มี

1. **Get All Data** (default)
   ```
   GET: YOUR_WEB_APP_URL?action=getAllData
   ```

2. **Get Single Branch Data**
   ```
   GET: YOUR_WEB_APP_URL?action=getBranchData&branchId=227
   ```

3. **Health Check**
   ```
   GET: YOUR_WEB_APP_URL?action=getHealth
   ```

### การอัพเดท API

1. แก้ไขโค้ดใน Google Apps Script Editor
2. คลิก "Deploy" > "Manage deployments"
3. คลิก "Edit" icon ข้าง deployment ที่มีอยู่
4. เปลี่ยน Version เป็น "New version"
5. คลิก "Deploy"

### หมายเหตุสำคัญ

- **สิทธิ์**: Script ต้องมีสิทธิ์เข้าถึง Google Sheets ทั้งหมด
- **CORS**: Web App จะมี CORS headers อัตโนมัติ
- **Rate Limiting**: Google Apps Script มีข้อจำกัดจำนวนการเรียกใช้
- **Cache**: ควร implement caching ในฝั่ง frontend

### Troubleshooting

1. **Permission Denied**: ตรวจสอบว่า Script มีสิทธิ์เข้าถึง Sheets
2. **Sheet Not Found**: ตรวจสอบ sheetId ใน BRANCHES array
3. **Timeout**: ลด timeout หรือเพิ่ม error handling