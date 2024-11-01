# Dockerfile สำหรับ Frontend (React/Vite)
# ใช้ Node.js เวอร์ชัน 18 เป็นฐาน
FROM node:18

# ตั้งค่า working directory
WORKDIR /usr/src/app 

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --silent

# คัดลอกไฟล์โปรเจกต์ทั้งหมด
COPY . .

# เปิดพอร์ตที่แอปพลิเคชันจะทำงาน
EXPOSE 5173

# คำสั่งในการรันแอปพลิเคชัน
CMD ["npm", "run", "dev"]  # ใช้คำสั่ง npm run dev สำหรับการพัฒนา
