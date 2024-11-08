// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 

// โหลดค่าตัวแปรจากไฟล์ .env
dotenv.config();

const app = express();
const port = 5001;  // หรือพอร์ตที่คุณต้องการให้เซิร์ฟเวอร์ทำงาน

// เปิดใช้งาน CORS
app.use(cors());  // เปิดให้ทุกโดเมนสามารถเข้าถึงได้

// สร้าง API เพื่อส่งข้อมูล API keys
app.get('/api/config', (req, res) => {
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const weatherApiKey = process.env.WEATHER_API_KEY;
    // ดึงข้อมูลฐานข้อมูลจาก environment variables
    const dbHost = process.env.DB_HOST;
    const dbName = process.env.DB_NAME;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;

    res.json({
        googleApiKey: googleApiKey,
        weatherApiKey: weatherApiKey,
        dbHost: dbHost,
        dbName: dbName,
        dbUser: dbUser,
        dbPassword: dbPassword
    });
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Config Service is running at port:${port}`);
});
