from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="Weather",
            user="weather",
            password="weather"
        )
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to the database: {e}")
        return None

def execute_query(query, params=None):
    conn = get_db_connection()
    if conn is None:
        return {'error': 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้'}, 500
    
    try:
        with conn.cursor() as cur:
            cur.execute(query, params)
            # ดึงผลลัพธ์หากเป็น SELECT query
            if query.strip().upper().startswith("SELECT"):
                columns = [desc[0] for desc in cur.description]  # ดึงชื่อคอลัมน์
                rows = cur.fetchall()  # ดึงข้อมูลทั้งหมด
                # สร้าง list ของ dictionaries
                results = [dict(zip(columns, row)) for row in rows]
                return results  # ส่งกลับผลลัพธ์ในรูปแบบ list ของ dicts
            
            conn.commit()  # คอมมิตสำหรับ INSERT, UPDATE, DELETE
            return {'message': 'รัน query สำเร็จ'}, 200
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return {'error': str(e)}, 500
    finally:
        conn.close()



def is_safe_query(query):
    # กำหนดคำสั่งที่ไม่อนุญาต
    unsafe_commands = ['DELETE','DROP', 'UPDATE', 'INSERT']  #'DELETE', 
    return not any(command in query.strip().upper() for command in unsafe_commands)





@app.route('/api/provinces', methods=['GET'])
def get_provinces():
    provinces = execute_query('SELECT DISTINCT province FROM weather ORDER BY province')
    return jsonify(provinces) if isinstance(provinces, list) else jsonify(provinces[0]), provinces[1] if isinstance(provinces, tuple) else 200

@app.route('/api/districts/<province>', methods=['GET'])
def get_districts(province):
    districts = execute_query('SELECT DISTINCT district FROM weather WHERE province = %s ORDER BY district', (province,))
    return jsonify(districts) if isinstance(districts, list) else jsonify(districts[0]), districts[1] if isinstance(districts, tuple) else 200

@app.route('/api/weather_history/<district>', methods=['GET'])
def get_weather_history(district):
    weather_history = execute_query('''SELECT temperature, humidity, wind_speed, gusts, condition, cloud_cover, uv_index, created_at 
                                       FROM weather 
                                       WHERE district = %s ORDER BY created_at DESC''', (district,))
    return jsonify(weather_history) if isinstance(weather_history, list) else jsonify(weather_history[0]), weather_history[1] if isinstance(weather_history, tuple) else 200



# Endpoint ใหม่สำหรับการรัน SQL query
@app.route('/api/execute_query', methods=['POST'])
def execute_sql_query():
    data = request.get_json()
    query = data.get('query')

    if not query:
        return jsonify({'error': 'ไม่มี query ที่ให้มา'}), 400


    # ตรวจสอบว่าคำสั่ง SQL นั้นปลอดภัยหรือไม่
    if not is_safe_query(query):
        return jsonify({'error': 'คำสั่ง SQL ไม่ปลอดภัย'}), 400

    result = execute_query(query)
    return jsonify(result) if isinstance(result, list) else jsonify(result[0]), result[1] if isinstance(result, tuple) else 200


if __name__ == '__main__':
    app.run(debug=True, port=5002)
