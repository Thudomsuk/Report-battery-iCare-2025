# 🚀 Production Deployment Guide

## ขั้นตอนการ Deploy ไป Production

### 1. Setup Google Apps Script (ต้องทำก่อน)

1. **สร้าง Google Apps Script Project**
   - ไปที่ https://script.google.com/
   - สร้าง New Project
   - คัดลอกโค้ดจาก `google-apps-script/Code.gs`
   - ตั้งชื่อโปรเจค: "iCare Battery Report API"

2. **Deploy Web App**
   - Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - คัดลอก Web app URL ที่ได้

3. **ทดสอบ API**
   ```bash
   curl "YOUR_WEB_APP_URL?action=getHealth"
   ```

### 2. Deploy to Vercel

#### ทางที่ 1: ใช้ Vercel CLI (แนะนำ)

1. **ติดตั้ง Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **ตั้งค่า Environment Variables**
   ```bash
   # สร้างไฟล์ .env.local และเพิ่ม
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   VITE_ENVIRONMENT=production
   ```

4. **Build และ Deploy**
   ```bash
   # Build local เพื่อทดสอบ
   npm run build
   
   # Deploy to Vercel
   vercel --prod
   ```

5. **ตั้งค่า Environment Variables ใน Vercel Dashboard**
   - ไปที่ Vercel Dashboard
   - เลือกโปรเจค
   - Settings > Environment Variables
   - เพิ่ม:
     - `VITE_GOOGLE_APPS_SCRIPT_URL`: URL ของ Google Apps Script
     - `VITE_ENVIRONMENT`: `production`

#### ทางที่ 2: ใช้ Vercel Dashboard

1. **เชื่อมต่อ GitHub Repository**
   - ไปที่ https://vercel.com/
   - New Project
   - Import จาก GitHub

2. **กำหนดค่า Build Settings**
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **ตั้งค่า Environment Variables**
   - เพิ่มตัวแปร Environment ตามด้านบน

### 3. ทดสอบ Production

1. **ทดสอบหน้าหลัก**
   ```
   https://your-project.vercel.app/
   ```

2. **ทดสอบ API Connection**
   - เปิด Developer Console
   - ดูว่าไม่มี CORS errors
   - ตรวจสอบว่าข้อมูลโหลดได้

3. **ทดสอบทุก Tab**
   - Summary By Branch
   - Summary By Category  
   - Total By Category
   - Summary By Month

### 4. Custom Domain (Optional)

1. **เพิ่ม Domain ใน Vercel**
   - Project Settings > Domains
   - เพิ่ม domain ที่ต้องการ

2. **ตั้งค่า DNS**
   - CNAME: your-domain.com → cname.vercel-dns.com

### 5. การจัดการหลัง Deploy

#### Performance Monitoring
- ใช้ Vercel Analytics
- ติดตาม Core Web Vitals

#### Error Monitoring  
- เช็ค Vercel Function Logs
- ติดตาม Google Apps Script Execution Logs

#### Data Updates
- ข้อมูลจะอัพเดททุก 5 นาที
- Google Apps Script รองรับ concurrent requests

### 6. Troubleshooting

#### ปัญหาที่พบบ่อย

1. **CORS Errors**
   - ตรวจสอบ Google Apps Script deployment
   - ให้แน่ใจว่าตั้ง "Who has access" เป็น "Anyone"

2. **Environment Variables ไม่ทำงาน**
   - ใน Vercel ต้องใส่ `VITE_` prefix
   - Redeploy หลังจากเปลี่ยน env vars

3. **Google Apps Script Timeout**
   - แยกการดึงข้อมูลเป็นชุดย่อย
   - เพิ่ม retry logic

4. **Rate Limiting**
   - Implement client-side caching
   - ใช้ staleTime ใน React Query

### 7. การอัพเดทระบบ

#### อัพเดท Frontend
1. Push code ไป GitHub
2. Vercel จะ auto-deploy

#### อัพเดท Google Apps Script
1. แก้โค้ดใน Script Editor
2. Deploy > Manage deployments > Edit
3. New version > Deploy

### 8. Backup และ Recovery

- **Code**: อยู่ใน GitHub repository
- **Google Apps Script**: Export ไฟล์ .gs เป็น backup
- **Environment Variables**: เก็บไว้ใน password manager

---

## 📋 Checklist สำหรับ Production

- [ ] Google Apps Script deployed และทดสอบแล้ว
- [ ] Environment variables ตั้งค่าแล้ว
- [ ] Build ผ่านโดยไม่มี errors
- [ ] ทดสอบทุก tabs
- [ ] ทดสอบ responsive design
- [ ] ทดสอบการ refresh data
- [ ] ตั้งค่า custom domain (ถ้าต้องการ)
- [ ] Monitor performance
- [ ] เตรียม backup plan

🎉 **เสร็จแล้ว! ระบบพร้อมใช้งาน Production**