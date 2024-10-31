# Dockerfile สำหรับ Backend (Flask)
# ใช้ Python เวอร์ชัน 3.9 เป็นฐาน
FROM python:3.9  

# ตั้งค่า working directory
WORKDIR /usr/src/app  # สร้างและตั้งค่า working directory เป็น /usr/src/app

# คัดลอกไฟล์ requirements.txt และติดตั้ง dependencies
COPY requirements.txt ./  
RUN pip install --no-cache-dir -r requirements.txt  

# คัดลอกไฟล์โปรเจกต์ทั้งหมด
COPY . .  

# ตั้งค่า environment variables (ถ้ามี)
ENV FLASK_APP=app.py  
ENV FLASK_RUN_HOST=0.0.0.0  
ENV FLASK_RUN_PORT=5002  #เปลี่ยนเป็น 5002 เพื่อให้ตรงกับ docker-compose.yml

# เปิดพอร์ตที่แอปพลิเคชันจะทำงาน
EXPOSE 5002  #เปลี่ยนเป็น 5002

# คำสั่งในการรันแอปพลิเคชัน
CMD ["flask", "run"]  # รันคำสั่งเพื่อเริ่มแอปพลิเคชัน Flask
