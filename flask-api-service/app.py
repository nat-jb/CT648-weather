from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import requests
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv('../config-service/.env')

API_KEY = os.getenv('WEATHER_API_KEY')  # เข้าถึง API Key

def get_db_connection():
    try:
        # ดึงค่าจาก environment variables
        
        db_host = os.getenv("DB_HOST")
        db_name = os.getenv("DB_NAME")
        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD") 
        
        # ใช้ with statement เพื่อให้การเชื่อมต่อถูกปิดอัตโนมัติ
        with psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_password
        ) as conn:
            return conn
    except psycopg2.Error as e:
        # จัดการข้อผิดพลาดโดยการ log หรือแสดงผล
        print(f"Error connecting to the database: {e}")
        return None


@app.route('/api/temperature/<province>', methods=['GET'])
def get_temperature_by_province(province):
    # URL ของ Weather API (ตัวอย่าง)
    weather_api_url = f"https://api.weatherapi.com/v1/current.json?key={API_KEY}&q={province}&aqi=yes"
    
    try:
        response = requests.get(weather_api_url)
        response.raise_for_status()  # ตรวจสอบว่า HTTP request สำเร็จ
        data = response.json()  # แปลงข้อมูล JSON

        # ดึงข้อมูลอุณหภูมิ
        temperature = data['current']['temp_c']  # หรือ temp_f ขึ้นอยู่กับ API ที่ใช้
        air_quality = data['current']['air_quality']  # ข้อมูลคุณภาพอากาศ
        humidity = data['current']['humidity'] 
        cloud = data['current']['cloud'] 
        gust_kph = data['current']['gust_kph']
        uv = data['current']['uv']
        # ดึงค่า PM2.5 (หากมีในข้อมูล)
        pm25 = air_quality.get('pm2_5', None)  # ใช้ .get() เพื่อป้องกัน KeyError


        # ดึงข้อมูลสภาพอากาศ
        condition = {
            'text': data['current']['condition']['text'],
            'icon': data['current']['condition']['icon'],
            'code': data['current']['condition']['code']
        }

        return jsonify({'province': province,
                         'temperature': temperature,
                         'air_quality': air_quality,
                         'humidity': humidity,
                          'pm25': pm25,  # เพิ่มข้อมูล PM2.5
                          'cloud': cloud,
                          'gust_kph':gust_kph,
                          'uv':uv,
                         'condition': condition  # เพิ่มข้อมูลสภาพอากาศเข้ามา
                         }), 200

    except requests.exceptions.RequestException as e:
        print(f"Error fetching weather data: {e}")
        return jsonify({'error': 'ไม่สามารถดึงข้อมูลอากาศได้'}), 500
    except KeyError:
        return jsonify({'error': 'ไม่พบข้อมูลสำหรับจังหวัดนี้'}), 404


@app.route('/api/weather', methods=['POST'])
def store_weather_data():
    data = request.json
    province = data.get('province')
    temperature = data.get('temperature')
    humidity = data.get('humidity')
    cloud = data.get('cloud')
    gust_kph = data.get('gust_kph')
    uv = data.get('uv')
    condition = data.get('condition')
    pm25 = data.get('pm25')

    # ตรวจสอบค่าที่ได้รับ
    #print(f"Received data: {data}")  # ใช้เพื่อตรวจสอบข้อมูลที่ได้รับ

    conn = get_db_connection()
    cursor = conn.cursor()

    # ตรวจสอบข้อมูลที่มีในฐานข้อมูลภายใน 3 นาทีที่ผ่านมา
    select_query = '''
        SELECT * FROM weather_data
        WHERE location_name = %s
        AND temperature = %s
        AND humidity = %s
        AND cloud = %s
        AND gust_kph = %s
        AND uv = %s
        AND condition = %s
        AND pm25 = %s
        AND created_at >= NOW() - INTERVAL '3 minute'
        ORDER BY created_at DESC LIMIT 1
    '''
    cursor.execute(select_query, (province, temperature, humidity, cloud, gust_kph, uv, condition, pm25))
    existing_data = cursor.fetchone()

    # ถ้ามีข้อมูลที่เหมือนกันในช่วงเวลา 5 นาทีที่ผ่านมา ก็ไม่ต้องบันทึก
    if existing_data:
        
        print("\033[31m" + f"{province}: Temperature data already exists within the last 3 minutes" + "\033[0m")
        return jsonify({'message': 'Data already exists within the last 3 minutes, not saving.'}), 200


    # ถ้าไม่มีข้อมูล ก็ทำการบันทึกข้อมูลใหม่
    insert_query = '''
        INSERT INTO weather_data (location_name, temperature, humidity, cloud, gust_kph, uv, condition, pm25)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    '''
    cursor.execute(insert_query, (province, temperature, humidity, cloud, gust_kph, uv, condition, pm25))
    conn.commit()
    print("\033[32m" + f"{province}:Add data Successfully" + "\033[0m")

    cursor.close()
    conn.close()

    return jsonify({'message': 'Temperature data added successfully'}), 201




if __name__ == '__main__':
    app.run(debug=False, port=5002)
