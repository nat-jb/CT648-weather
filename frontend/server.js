// server.js
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import fetch from 'node-fetch'; // ต้องติดตั้ง node-fetch
import WebSocket from 'ws'; // เพิ่มไลบรารี ws

const app = express();
const port = 5001;   
const API_KEY = '0d33acf579c643da933101854242010'; // API Key สำหรับ WeatherAPI.com
const CHECK_INTERVAL = 300000;//  300000; // ตรวจสอบทุก 300000 มิลลิวินาที = 5 นาที

// รายชื่อจังหวัดในประเทศไทย
const locations = {
  'Bangkok': [
  'Phra Nakhon',
  'Dusit',
  'Nong Chok',
  'Bang Khen',
  'Sai Mai',
  'Khlong Sam Wa',
  'Bang Kapi',
  'Huai Khwang',
  'Watthana',
  'Khlong Toei',
  'Suan Luang',
  'Prawet',
  'Min Buri',
  'Lat Krabang',
  'Yan Nawa',
  'Sathorn',
  'Bang Rak',
  'Pathum Wan',
  'Ratchathewi',
  'Phaya Thai',
  'Chatuchak',
  'Bang Sue',
  'Din Daeng',
  'Bang Khae',
  'Taling Chan',
  'Bang Phlat',
  'Thon Buri',
  'Khlong San',
  'Bangkok Yai',
  'Bang Na',
  'Rat Burana',
  'Thung Khru',
  'Bang Khun Thian',
  'Khan Na Yao',
  'Wang Thonglang',
  'Lat Phrao',
  'Wang Thonglang',
  'Bang Khae',
  'Bang Na',
  'Bang Phlat',
  'Din Daeng',
  'Khlong Toei',
  'Ratchathewi',
  'Sai Mai',
  'Yan Nawa'
],
  'Amnat Charoen': [
    'Mueang Amnat Charoen',
    'Chanuman',
    'Phana',
    'Lue Amnat',
    'Samrong'
  ],
  'Ang Thong': [
    'Mueang Ang Thong',
    'Chaiyo',
    'Sawaeng Ha',
    'Pa Mok',
    'Nong Saeng',
    'Wiset Chai Chan'
  ],
  'Bueng Kan': [
    'Mueang Bueng Kan',
    'Bung Khla',
    'So Phisai',
    'Phon Charoen',
    'Tao Ngoi',
    'Si Wilai'
  ],
  'Buriram': [
    'Mueang Buriram',
    'Khaen Dong',
    'Lam Plai Mat',
    'Nang Rong',
    'Chaloem Phra Kiat',
    'Sangkhla Buri',
    'Buriram',
    'Non Daeng',
    'Prakhon Chai',
    'Satuk'
  ],
  'Chachoengsao': [
    'Mueang Chachoengsao',
    'Bang Khla',
    'Phanom Sarakham',
    'Khlong Khuean',
    'Ban Pho',
    'Sathon',
    'Sanam Chai Khet'
  ],
  'Chai Nat': [
    'Mueang Chai Nat',
    'Chai Badan',
    'Sappaya',
    'Huang Sam Mo',
    'Noen Kham',
    'Phrom Buri'
  ],
  'Chaiyaphum': [
    'Mueang Chaiyaphum',
    'Chatturat',
    'Phu Khiao',
    'Thep Sathit',
    'Bamboo',
    'Ban Khwao',
    'Nong Bua Daeng'
  ],
  'Chanthaburi': [
    'Mueang Chanthaburi',
    'Laem Sing',
    'Khao Khitchakut',
    'Pong Nam Ron',
    'Nong Sakae',
    'Makham'
  ],
  'Chiang Mai': [
    'Mueang Chiang Mai',
    'Hang Dong',
    'San Kamphaeng',
    'Doi Saket',
    'Mae Rim',
    'Chiang Dao',
    'Fang',
    'Payap',
    'Doi Tao',
    'Om Koi',
    'Chai Prakan',
    'Hot',
    'Phrao',
    'San Sai',
    'Saraphi',
    'Suthep'
  ],
  'Chiang Rai': [
    'Mueang Chiang Rai',
    'Chiang Khong',
    'Doi Luang',
    'Doi Saket',
    'Mae Fah Luang',
    'Mae Chan',
    'Mae Sai',
    'Phaya Mengrai',
    'Wiang Chiang Rung'
  ],
  'Chonburi': [
    'Mueang Chonburi',
    'Bang Saen',
    'Sattahip',
    'Pattaya',
    'Nong Nooch',
    'Bang Lamung',
    'Sri Racha',
    'Bo Thong'
  ],
  'Chumphon': [
    'Mueang Chumphon',
    'Thung Tako',
    'Lang Suan',
    'Sukhothai',
    'Chum Kho',
    'Pathio',
    'Pha Thale',
    'Wang Thong'
  ],
  'Kalasin': [
    'Mueang Kalasin',
    'Kamalasai',
    'Kuchinarai',
    'Khong Chai',
    'Sikhottabong',
    'Yang Talat'
  ],
  'Kamphaeng Phet': [
    'Mueang Kamphaeng Phet',
    'Khlong Lan',
    'Phranakhon Si Ayutthaya',
    'Khanu Woralaksaburi',
    'Suwannakhuha'
  ],
  'Kanchanaburi': [
    'Mueang Kanchanaburi',
    'Sai Yok',
    'Thamaka',
    'Erawan',
    'Dan Makham Tia',
    'Sangkhla Buri',
    'Huai Krachao'
  ],
  'Khon Kaen': [
    'Mueang Khon Kaen',
    'Nong Rua',
    'Chonnabot',
    'Khon Kaen',
    'Nong Song Hong',
    'Phu Wiang'
  ],
  'Krabi': [
    'Mueang Krabi',
    'Ao Luek',
    'Klong Thom',
    'Koh Lanta',
    'Nong Thale',
    'Poda'
  ],
  'Lampang': [
    'Mueang Lampang',
    'Ko Kha',
    'Mae Tha',
    'Thoen',
    'Hang Chat'
  ],
  'Lamphun': [
    'Mueang Lamphun',
    'Thung Hua Chang',
    'Pa Sang',
    'Li',
    'Chae Hom'
  ],
  'Loei': [
    'Mueang Loei',
    'Phu Ruea',
    'Na Haeo',
    'Dan Sai',
    'Wang Saphung'
  ],
  'Lopburi': [
    'Mueang Lopburi',
    'Phatthana Nikhom',
    'Nong Saeng',
    'Chai Badan',
    'Khaeng Khoi'
  ],
  'Mae Hong Son': [
    'Mueang Mae Hong Son',
    'Pai',
    'Hoshan',
    'Sop Moei',
    'Maehongson'
  ],
  'Maha Sarakham': [
    'Mueang Maha Sarakham',
    'Kae Dam',
    'Nong Sang',
    'Chai Mongkhon',
    'Na Chueak'
  ],
  'Mukdahan': [
    'Mueang Mukdahan',
    'Nikhom Kham Soi',
    'Sang Khom',
    'Don Tan',
    'Khamcha-i'
  ],
  'Nakhon Nayok': [
    'Mueang Nakhon Nayok',
    'Ban Na',
    'Nakhon Chai Si',
    'Pak Phli'
  ],
  'Nakhon Pathom': [
    'Mueang Nakhon Pathom',
    'Nakhon Chai Si',
    'Phutthamonthon',
    'Sam Phran'
  ],
  'Nakhon Phanom': [
    'Mueang Nakhon Phanom',
    'Na Kham',
    'Sangkhom',
    'Chak Khiri',
    'Bung Kan'
  ],
  'Nakhon Ratchasima': [
    'Mueang Nakhon Ratchasima',
    'Chok Chai',
    'Pak Chong',
    'Bua Yai',
    'Wang Nam Khiao'
  ],
  'Nakhon Sawan': [
    'Mueang Nakhon Sawan',
    'Chom Tha',
    'Banphot Phisai',
    'Kao Liao',
    'Takhli'
  ],
  'Nakhon Si Thammarat': [
    'Mueang Nakhon Si Thammarat',
    'Chaloem Phra Kiat',
    'Thasala',
    'Lom Sak',
    'Nopphitam'
  ],
  'Nan': [
    'Mueang Nan',
    'Bo Kluea',
    'Chaloem Phra Kiat',
    'Na Muen',
    'Song Khwae'
  ],
  'Narathiwat': [
    'Mueang Narathiwat',
    'Rueso',
    'Sungai Kolok',
    'Waeng',
    'Su-ngai Padi'
  ],
  'Nong Bua Lam Phu': [
    'Mueang Nong Bua Lam Phu',
    'Na Wang',
    'Mueang Na Phu',
    'So Phisai'
  ],
  'Nong Khai': [
    'Mueang Nong Khai',
    'Sangkhom',
    'Thakhek',
    'Kham Khuean Kaeo'
  ],
  'Nonthaburi': [
    'Mueang Nonthaburi',
    'Bang Kruai',
    'Bang Yai',
    'Bang Bua Thong',
    'Sai Noi',
    'Pak Kret'
  ],
  'Pathum Thani': [
    'Mueang Pathum Thani',
    'Khlong Luang',
    'Lam Luk Ka',
    'Sam Khok',
    'Thanyaburi'
  ],
  'Pattani': [
    'Mueang Pattani',
    'Yarang',
    'Yala',
    'Nong Chik',
    'Mai Kaen'
  ],
  'Phang Nga': [
    'Mueang Phang Nga',
    'Koh Yao',
    'Takuapa',
    'Kapong',
    'Koh Panyee'
  ],
  'Phatthalung': [
    'Mueang Phatthalung',
    'Khuan Khanun',
    'Pa Phayom',
    'Pak Phayun',
    'Khao Chaison'
  ],
  'Phayao': [
    'Mueang Phayao',
    'Chiang Kham',
    'Pho Khun Ngam',
    'Mae Chai'
  ],
  'Phra Nakhon Si Ayutthaya': [
    'Mueang Phra Nakhon Si Ayutthaya',
    'Bang Ban',
    'Bang Pahan',
    'Wang Noi',
    'Phak Hai'
  ],
  'Prachuap Khiri Khan': [
    'Mueang Prachuap Khiri Khan',
    'Hua Hin',
    'Pranburi',
    'Sam Roi Yot'
  ],
  'Ranong': [
    'Mueang Ranong',
    'Koh Phayam',
    'Koh Surin',
    'Koh Ra'
  ],
  'Ratchaburi': [
    'Mueang Ratchaburi',
    'Damnoen Saduak',
    'Suan Phueng',
    'Phetchaburi'
  ],
  'Rayong': [
    'Mueang Rayong',
    'Ban Chang',
    'Klaeng',
    'Nong Lalok',
    'Koh Samet'
  ],
  'Roi Et': [
    'Mueang Roi Et',
    'Kaset Wisai',
    'Suwannaphum',
    'Selaphum'
  ],
  'Sa Kaeo': [
    'Mueang Sa Kaeo',
    'Aranyaprathet',
    'Wang Nam Yen',
    'Khao Chakan'
  ],
  'Sakon Nakhon': [
    'Mueang Sakon Nakhon',
    'Nong Han',
    'Khamcha-i',
    'Phon Sawan'
  ],
  'Samut Prakan': [
    'Mueang Samut Prakan',
    'Bang Phli',
    'Phra Pradaeng',
    'Samut Khlong'
  ],
  'Samut Sakhon': [
    'Mueang Samut Sakhon',
    'Krathum Baen',
    'Mahachai',
    'Ban Phaeo'
  ],
  'Saraburi': [
    'Mueang Saraburi',
    'Kaeng Khoi',
    'Wang Muang',
    'Nong Khae'
  ],
  'Satun': [
    'Mueang Satun',
    'La-ngu',
    'Koh Lipe',
    'Koh Tarutao'
  ],
  'Sing Buri': [
    'Mueang Sing Buri',
    'Bang Rachan',
    'In Buri',
    'Phrom Buri'
  ],
  'Sisaket': [
    'Mueang Sisaket',
    'Kantharalak',
    'Khun Han',
    'Si Sa Ket'
  ],
  'Songkhla': [
    'Mueang Songkhla',
    'Hat Yai',
    'Sadao',
    'Kao Seng'
  ],
  'Sukhothai': [
    'Mueang Sukhothai',
    'Khiri Mat',
    'Si Satchanalai',
    'Sukhothai Thani'
  ],
  'Suphan Buri': [
    'Mueang Suphan Buri',
    'Don Chedi',
    'Sam Chuk',
    'Song Phi Nong'
  ],
  'Surat Thani': [
    'Mueang Surat Thani',
    'Koh Samui',
    'Koh Pha Ngan',
    'Chaiya'
  ],
  'Surin': [
    'Mueang Surin',
    'Chom Phra',
    'Sangkhla Buri',
    'Kap Choeng'
  ],
  'Tak': [
    'Mueang Tak',
    'Mae Sot',
    'Tha Song Yang',
    'Um Phang',
    'Ban Tak'
  ],
  'Trang': [
    'Mueang Trang',
    'Hat Yai',
    'Koh Kradan',
    'Koh Muk'
  ],
  'Trat': [
    'Mueang Trat',
    'Koh Chang',
    'Koh Kood',
    'Koh Mak'
  ],
  'Ubon Ratchathani': [
    'Mueang Ubon Ratchathani',
    'Warin Chamrap',
    'Nong Waeng',
    'Si Sa Ket'
  ],
  'Udon Thani': [
    'Mueang Udon Thani',
    'Nong Wua So',
    'Na Yung',
    'Ban Phue',
    'Khueang Nai'
  ],
  'Uthai Thani': [
    'Mueang Uthai Thani',
    'Lan Sak',
    'Bannang Sata',
    'Huai Khot'
  ],
  'Yala': [
    'Mueang Yala',
    'Bantalad',
    'Yaha',
    'Betong',
    'Koh Pha Yao'
  ],
  'Yasothon': [
    'Mueang Yasothon',
    'Khaen Thong',
    'Sai Mun',
    'Loei'
  ],
  'Phetchabun': [
    'Mueang Phetchabun',
    'Lom Sak',
    'Khao Kho',
    'Wichian Buri',
    'Si Thep',
    'Nong Phai',
    'Bueng Sam Phan',
    'Nam Nao',
    'Chon Daen',
    'Dong Charoen',
    'Lom Kao'
]
  // เพิ่มจังหวัดและอำเภออื่น ๆ ตามต้องการ
};

// ตั้งค่า CORS
app.use(cors());
app.use(express.json());

// ตั้งค่าการเชื่อมต่อ PostgreSQL
const pool = new Pool({
  user: 'weather',
  host: 'localhost',
  database: 'Weather',
  password: 'weather',
  port: 5432,
});

// ฟังก์ชันเพื่อตรวจสอบการเชื่อมต่อ PostgreSQL
const checkConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL:', res.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};



// ฟังก์ชันเพื่อตรวจสอบและจัดเก็บข้อมูลสภาพอากาศ
const fetchAndStoreWeatherData = async () => {
  for (const [province, subLocations] of Object.entries(locations)) {
    for (const district of subLocations) {
      try {
        // ดึงข้อมูลจาก WeatherAPI.com
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(`${district}, ${province}`)}`);

        // เช็คสถานะของการตอบสนอง
        if (!response.ok) {
          const errorText = await response.text(); // รับข้อความ error
          console.error(`Error fetching weather data: ${response.status} - ${response.statusText}: ${errorText}`);
          continue; // ข้ามไปยังรายการถัดไป
        }

        let weatherData;
        try {
          weatherData = await response.json();
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
          continue; // ข้ามไปยังรายการถัดไป
        }

        // เช็คว่ามีข้อมูลหรือไม่
        const { current } = weatherData;
        const { temp_c, humidity, wind_kph, gust_kph, condition, cloud, uv } = current;

        // ตรวจสอบข้อมูลในฐานข้อมูล
        const query = 'SELECT * FROM weather WHERE province = $1 AND district = $2 ORDER BY created_at DESC LIMIT 1';
        const result = await pool.query(query, [province, district]);

        // เช็คว่ามีข้อมูลล่าสุดหรือไม่
        if (result.rows.length === 0 || (
            result.rows[0].temperature !== temp_c ||
            result.rows[0].humidity !== humidity ||
            result.rows[0].wind_speed !== wind_kph ||
            result.rows[0].gusts !== gust_kph ||
            result.rows[0].condition !== condition.text ||
            result.rows[0].cloud_cover !== cloud ||
            result.rows[0].uv_index !== uv
        )) {
          // เพิ่มข้อมูลลงในฐานข้อมูล
          const insertQuery = 'INSERT INTO weather (province, district, temperature, humidity, wind_speed, gusts, condition, cloud_cover, uv_index, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())';
          await pool.query(insertQuery, [province, district, temp_c, humidity, wind_kph, gust_kph, condition.text, cloud, uv]);
          //log
          console.log(`Weather data for ${district} in ${province} updated successfully.`);
          // ส่งข้อมูลไปยัง WebSocket
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                province,
                district,
                temperature: temp_c,
                humidity,
                wind_speed: wind_kph,
                gusts: gust_kph,
                condition: condition.text,
                cloud_cover: cloud,
                uv_index: uv
              }));
            }
          });
        } else {
          //console.log(`No update needed for ${district} in ${province}.`);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  }
};




// เรียกใช้ฟังก์ชันเพื่อเช็คการเชื่อมต่อกับ PostgreSQL
checkConnection();

// ตั้งค่าการทำงานของ WebSocket
const wss = new WebSocket.Server({ noServer: true });

// เมื่อมีการเชื่อมต่อ WebSocket
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
});

// ตั้งค่าการอัพเกรดจาก HTTP ไปเป็น WebSocket
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลสภาพอากาศทุกๆ 5 นาที
setInterval(fetchAndStoreWeatherData, CHECK_INTERVAL);

// API เพื่อดึงรายชื่อจังหวัด
app.get('/api/provinces', (req, res) => {
  res.json(Object.keys(locations));
});

// API เพื่อดึงรายชื่ออำเภอในจังหวัดที่เลือก
app.get('/api/districts/:province', (req, res) => {
  const province = req.params.province;
  if (locations[province]) {
    res.json(locations[province].map(district => [district]));
  } else {
    res.status(404).json({ error: 'Province not found' });
  }
});

// API เพื่อดึงประวัติอากาศ
app.get('/api/weather_history/:district', async (req, res) => {
  const district = req.params.district;
  try {
    const result = await pool.query('SELECT * FROM weather WHERE district = $1 ORDER BY created_at DESC', [district]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching weather history:', error);
    res.status(500).json({ error: 'Error fetching weather history' });
  }
});
