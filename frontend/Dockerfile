# Dockerfile สำหรับ Frontend (Node.js)
# ใช้ Node.js เวอร์ชัน 14 เป็นฐาน
FROM node:14  

# ตั้งค่า working directory
WORKDIR /app  

# คัดลอก package.json และ package-lock.json
COPY package*.json ./  

# ติดตั้ง dependencies
RUN npm install  

# คัดลอกไฟล์โปรเจกต์ทั้งหมด
COPY . .  

# เปิดพอร์ตที่แอปพลิเคชันจะทำงาน
EXPOSE 5173  # ใช้พอร์ต 5173 แทน 5001

# คำสั่งในการรันแอปพลิเคชัน
CMD ["npm", "start"]  # แนะนำให้ใช้ npm start หากใช้ script ใน package.json
