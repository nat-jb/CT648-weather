# Dockerfile สำหรับ Node.js Server
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

# เปิดพอร์ตที่ server จะทำงาน
EXPOSE 5001

# คำสั่งในการรัน server
CMD ["node", "server.js"]  # รัน server.js
