import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import GoogleMapComponent from './GoogleMapComponent';

function App() {

  const [temperatureData, setTemperatureData] = useState([]);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 13.7563, lng: 100.5018 });
  const [activeTab, setActiveTab] = useState('map'); // Manage active tab state


// พิกัดของจังหวัด
  const provinceCoordinates = {
  "Phichit ": { lat: 16.435, lng: 100.3592 },
  "Bangkok": { lat: 13.7563, lng: 100.5018 },
  "Phuket": { lat: 7.8804, lng: 98.3923 },
  "Krabi": { lat: 8.0863, lng: 98.9063 },
  "Nakhon Ratchasima": { lat: 14.9750, lng: 102.0950 },
  "Chon Buri": { lat: 13.3646, lng: 100.9865 },
  "Nakhon Si Thammarat": { lat: 8.4332, lng: 99.9611 },
  "Udon Thani": { lat: 17.4132, lng: 102.7854 },
  "Surat Thani": { lat: 9.1399, lng: 99.3210 },
  "Rayong": { lat: 12.6887, lng: 101.2717 },
  "Samut Prakan": { lat: 13.5990, lng: 100.6016 },
  "Phitsanulok": { lat: 16.8333, lng: 100.25 },
  "Ratchaburi": { lat: 13.5413, lng: 99.8124 },
  "Songkhla": { lat: 7.1974, lng: 100.6073 },
  "Phetchaburi": { lat: 12.7374, lng: 99.9560 },
  "Lampang": { lat: 18.2882, lng: 99.5055 },
  "Prachuap Khiri Khan": { lat: 11.6178, lng: 99.7759 },
  "Nakhon Sawan": { lat: 15.7089, lng: 100.1352 },
  "Sukhothai": { lat: 17.0073, lng: 99.8227 },
  "Kamphaeng Phet": { lat: 16.3915, lng: 99.5163 },
  "Chumphon": { lat: 10.4941, lng: 99.1780 },
  "Uthai Thani": { lat: 15.3627, lng: 99.9525 },
  "Nong Khai": { lat: 17.8799, lng: 102.7403 },
  "Kanchanaburi": { lat: 14.0230, lng: 99.5395 },
  "Mukdahan": { lat: 16.5754, lng: 104.7450 },
  "Yasothon": { lat: 15.8026, lng: 104.4362 },
  "Buriram": { lat: 14.9640, lng: 103.1607 },
  "Trat": { lat: 12.2483, lng: 102.5169 },
  "Sa Kaeo": { lat: 13.8167, lng: 102.0667 },
  "Ang Thong": { lat: 14.5966, lng: 100.4477 },
  "Phra Nakhon Si Ayutthaya": { lat: 14.3515, lng: 100.5780 },
  "Saraburi": { lat: 14.5186, lng: 100.8343 },
  "Phetchabun": { lat: 16.4213, lng: 101.1880 },
  "Nan": { lat: 18.7753, lng: 100.7735 },
  "Phangnga": { lat: 8.4667, lng: 98.5333 },
  "Ranong": { lat: 9.9757, lng: 98.6350 },
  "Roi Et": { lat: 16.0800, lng: 103.6453 },
  "Nakhon Pathom": { lat: 13.8171, lng: 100.0541 },
  "Loei": { lat: 17.4908, lng: 101.7368 },
  "Chaiyaphum": { lat: 15.8028, lng: 102.0336 },
  "Phayao": { lat: 19.1620, lng: 99.8414 },
  "Nong Bua Lam Phu": { lat: 16.3138, lng: 102.5007 },
  "Surin": { lat: 14.8837, lng: 103.4930 },
  "Prachin Buri": { lat: 14.0565, lng: 101.3893 },
  "Sakon Nakhon": { lat: 17.1550, lng: 104.1438 },
  "Chachoengsao": { lat: 13.6840, lng: 101.0791 },
  "Nakhon Phanom": { lat: 17.4341, lng: 104.7690 },
  "Chai Nat": { lat: 15.1653, lng: 100.1246 },
  "Sisaket": { lat: 15.1340, lng: 104.3410 },
  "Samut Songkhram": { lat: 13.4344, lng: 99.9787 },
  "Samut Sakhon": { lat: 13.5400, lng: 100.281 },
  "Uttaradit": { lat: 17.6150, lng: 100.0950 },
  "Nonthaburi": { lat: 13.8412, lng: 100.5103 },
  "Khon Kaen": { lat: 16.4333, lng: 102.8333 },
  "Tak, Thailand": { lat: 16.8667, lng: 99.1333 }, // จังหวัดตาก
  "Trang": { lat: 7.5578, lng: 99.6080 }, // จังหวัดตรัง
  "Mae Hong Son": { lat: 19.3046, lng: 97.9631 }, // จังหวัดแม่ฮ่องสอน
  "Chanthaburi": { lat: 12.6, lng: 102.15 },
  "Ubon Ratchathani": { lat: 15.2331, lng: 104.8631 },
  "Phrae": { lat: 18.15, lng: 100.1333 },
  "Lamphun": { lat: 18.575, lng: 99.0061 },
  "Lopburi": { lat: 14.7981, lng: 100.652 },
  "Nakhon Nayok": { lat: 14.2071, lng: 101.2035 },
  "Bueng Kan": { lat: 17.9897, lng: 103.5667 },
  "Amnat Charoen": { lat: 15.8585, lng: 104.6288 },
  "Kalasin": { lat: 16.4281, lng: 103.4739 },
  "Sing Buri": { lat: 14.8963, lng: 100.3905 },
  "Pattani": { lat: 6.888, lng: 101.2742 },
  "Yala": { lat: 6.5428, lng: 101.2836 },
  "Narathiwat": { lat: 6.4342, lng: 101.8347 },
  "Satun": { lat: 6.6167, lng: 100.0667 },
  "Pathum Thani": { lat: 14.0005, lng: 100.5203 },
  "Suphan Buri": { lat: 14.4690, lng: 100.1895 },
  "Pai,Mae Hong Son": { lat: 19.3553, lng: 98.4353 },
  "Suan Phueng,Ratchaburi": { lat: 13.6472, lng: 99.6807 },
  //เชียงใหม่
  "Chiang Mai": { lat: 18.7883, lng: 98.9853 },
  "Chom Thong, Chiang Mai": { lat: 18.4269, lng: 98.6781 },
  "Mae Chaem, Chiang Mai": { lat: 18.4972, lng: 98.3711 },
  "Chiang Dao, Chiang Mai": { lat: 19.3667, lng: 98.9667 },
  "Doi Saket, Chiang Mai": { lat: 18.8744, lng: 99.1356 },
  "Mae Taeng, Chiang Mai": { lat: 19.1167, lng: 98.95 },
  "Mae Rim, Chiang Mai": { lat: 18.9122, lng: 98.9397 },
  "Samoeng, Chiang Mai": { lat: 18.8503, lng: 98.7328 },
  "Fang, Chiang Mai": { lat: 19.9167, lng: 99.2167 },
  "Mae Ai, Chiang Mai": { lat: 20.0333, lng: 99.3167 },
  "Phrao, Chiang Mai": { lat: 19.3667, lng: 99.2167 },
  "San Pa Tong, Chiang Mai": { lat: 18.6247, lng: 98.8944 },
  "San Sai, Chiang Mai": { lat: 18.8522, lng: 99.0453 },
  "Hang Dong, Chiang Mai": { lat: 18.6872, lng: 98.9167 },
  "Hot, Chiang Mai": { lat: 18.19, lng: 98.6089 },
  "Doi Tao, Chiang Mai": { lat: 17.9, lng: 98.7333 },
  "Omkoi, Chiang Mai": { lat: 17.8, lng:98.3667 },
  "Saraphi, Chiang Mai": { lat: 18.7142, lng: 99.0353 },
  "Wiang Haeng, Chiang Mai": { lat: 19.5333, lng: 98.65 },
  "Doi Lo, Chiang Mai": { lat: 18.45, lng: 98.7833 },

  //เชียงราย
  "Chiang Rai": { lat: 19.9153, lng: 99.8309 },
  "Mae Sai, Chiang Rai": { lat: 20.43, lng: 99.8858 },
  "Mae Suai, Chiang Rai": { lat: 19.65, lng: 99.55 },
  "Mae Chan, Chiang Rai": { lat: 20.1472, lng: 99.8539 },
  "Mae Fah Luang, Chiang Rai": { lat: 20.2011, lng: 99.8003 },
  "Wiang Pa Pao, Chiang Rai": { lat: 19.3667, lng: 99.5 },
  "Paya Meng Rai, Chiang Rai": { lat: 19.85, lng: 100.1333 },
  "Chiang Khong, Chiang Rai": { lat: 20.2833, lng: 100.4 },
  "Doi Luang, Chiang Rai": { lat: 20.3, lng: 100.3333 },
  "Thoeng, Chiang Rai": { lat: 19.6833, lng: 100.2 },
  "Pa Tan, Khun Tan, Chiang Rai": { lat: 19.85, lng: 100.2667 },
  "Pa Daet, Chiang Rai": { lat: 19.5, lng: 100.0 },
  "Phan, Chiang Rai": { lat: 19.4667, lng: 99.7167 },
  "Rong Khwang, Chiang Rai": { lat: 20.0139, lng: 100.0758 },
  //"Boon Nakh, Chiang Rai": { lat: 19.7650, lng: 99.6253 },
  "Mae Tha, Chiang Rai": { lat: 20.3, lng: 100.25 },
  "Huai Rai, Chiang Rai": { lat: 20.1061, lng: 100.0739 },
  "Chiang Saen, Chiang Rai": { lat: 20.1472, lng: 99.8539 },
  "Wiang Chai, Chiang Rai": { lat: 19.8833, lng: 99.9167 }

  };

  const fetchAllTemperatures = async () => {
    try {

      const temps = await Promise.all(
        // ใช้ Object.keys เพื่อดึงชื่อจังหวัด
        Object.keys(provinceCoordinates).map(async (province) => {
          // เรียก API เพื่อดึงข้อมูลอุณหภูมิ
          const response = await fetch(`http://localhost:5002/api/temperature/${province}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          

        //// ส่งข้อมูลไปยัง API เพื่อบันทึกในฐานข้อมูล
        await fetch('http://localhost:5002/api/weather', {  // เปลี่ยนที่นี่
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            province:data.province, // ชื่อจังหวัด
            temperature: data.temperature, 
            humidity: data.humidity,
            cloud: data.cloud,
            gust_kph: data.gust_kph,
            uv: data.uv,
            pm25: data.pm25,
            condition: data.condition.text
         
          }),
        });
        
          
          return { 
            province, // ใช้ชื่อจังหวัดที่ได้จาก Object.keys
            temperature: data.temperature, 
            humidity: data.humidity,
            cloud: data.cloud,
            gust_kph: data.gust_kph,
            uv: data.uv,
            condition: data.condition,
            pm25: data.pm25
          };
        })
      );
      setTemperatureData(temps);
    } catch (error) {
      //setError('Error fetching temperatures: ' + error.message);
    }
  };
  
  const markers = Object.entries(provinceCoordinates).map(([province, coords]) => {
    const provinceTemperatureData = temperatureData.find(temp => temp.province === province);
    const provinceTemperature = provinceTemperatureData ? provinceTemperatureData.temperature : null;
  
    return {
      province,
      coords,
      temperature: typeof provinceTemperature === 'number' ? provinceTemperature : null,
      humidity: provinceTemperatureData ? provinceTemperatureData.humidity : null,
      cloud: provinceTemperatureData ? provinceTemperatureData.cloud : null,
      gust_kph: provinceTemperatureData ? provinceTemperatureData.gust_kph : null,
      uv: provinceTemperatureData ? provinceTemperatureData.uv : null,
      condition: provinceTemperatureData ? provinceTemperatureData.condition : null,
      pm25: provinceTemperatureData ? provinceTemperatureData.pm25 : null // เพิ่ม PM2.5
    };
  });
  
  const getTemperatureColor = (temp) => {
    if (temp >= 45) return '#8B0000'; // สีแดงเข้มมาก (Dark Red)
    if (temp >= 40) return '#C8102E'; // สีแดงเข้ม (Red)
    if (temp >= 35) return '#FF4500'; // สีส้มแดง (Orange Red)
    if (temp >= 30) return '#FFA500'; // สีส้ม (Orange)
    if (temp >= 25) return '#F5B800'; // สีเหลือง (Yellow)
    if (temp >= 20) return '#0057A4'; // สีน้ำเงินเข้ม (Dark Blue) '#003366'; // สีน้ำเงินเข้มมาก (Navy Blue) '#001F3F'; // สีน้ำเงินเข้มที่สุด (Dark Navy Blue)
    if (temp >= 15) return '#56A6D0'; // สีฟ้าปานกลาง (Blue)'#0057A4'; // สีน้ำเงินเข้ม (Dark Blue)
    if (temp >= 10) return '#A2D4E9'; // สีฟ้าอ่อน (Light Blue) '#0072B5'; // สีฟ้าปานกลาง (Blue)
    if (temp >= 5) return  '#B7E9F7'; // สีฟ้าอ่อน (Light Blue)'#0072B5'; // สีฟ้าปานกลาง (Blue)
    if (temp >= 0) return '#B7E9F7'; // สีฟ้าอ่อน (Light Blue)
    return '#001B44'; // สีน้ำเงินเข้มลึกสำหรับอุณหภูมิต่ำกว่า 0°C (Deep Blue)
  };

  const getHumidityColor = (humidity) => {
    if (humidity < 30) return '#2ecc71'; // ดีมาก
    if (humidity >= 30 && humidity < 50) return '#27ae60'; // ปกติ
    if (humidity >= 50 && humidity < 70) return '#f1c40f'; // ต้องระวัง
    return '#e74c3c'; // อันตราย
  };
  
  const getColorForCloudCover = (cloud) => {
    if (cloud < 20) return '#2ecc71'; // ดีมาก
    if (cloud >= 20 && cloud < 50) return '#27ae60'; // ปกติ
    if (cloud >= 50 && cloud < 80) return '#f1c40f'; // ต้องระวัง
    return '#e74c3c'; // อันตราย
  };
  
  const getColorForGust = (gust) => {
    if (gust < 5) return '#2ecc71'; // ดีมาก
    if (gust >= 5 && gust < 15) return '#27ae60'; // ปกติ
    if (gust >= 15 && gust < 25) return '#f1c40f'; // ต้องระวัง
    return '#e74c3c'; // อันตราย
  };
  
  const getColorForPM25 = (pm25) => {
    if (pm25 < 12) return '#2ecc71'; // ดีมาก
    if (pm25 >= 12 && pm25 < 25) return '#27ae60'; // ปกติ
    if (pm25 >= 25 && pm25 < 50) return '#f1c40f'; // ต้องระวัง
    return '#e74c3c'; // อันตราย
  };

  const getColorForUV = (uv) => {
    if (uv < 3) return '#2ecc71'; // สีเขียวสำหรับ UV ต่ำ
    if (uv < 6) return '#f1c40f'; // สีเหลืองสำหรับ UV ปานกลาง
    if (uv < 8) return '#e67e22'; // สีส้มสำหรับ UV สูง
    return '#e74c3c'; // สีแดงสำหรับ UV อันตราย
  };
  
  useEffect(() => {

    const provinces = Object.keys(provinceCoordinates); // ดึงชื่อจังหวัด
  
    if (provinces.length > 0) {
      // เรียกข้อมูลอุณหภูมิครั้งแรก
      fetchAllTemperatures();
      // สร้าง interval เพื่อเรียก fetchAllTemperatures ทุก 60 วินาที
      const interval = setInterval(() => {
        fetchAllTemperatures();
      }, 180000); // 60000 = ทุก 60 วินาที   300000 = ทุก 5 นาที   180000 = 3 นาที 
  
      // ล้าง interval เมื่อ component ถูก unmount
      return () => clearInterval(interval);
    }
  }, []); // โหลดครั้งแรกครั้งเดียว ไม่มี dependency
  
  return (
        <div className="App">
          <div className="header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <div className="weather-credit" style={{ marginRight: '20px', position: 'absolute', left: '20px' }}>
              <a href="https://www.weatherapi.com/" title="Free Weather API">
                <img 
                  src="//cdn.weatherapi.com/v4/images/weatherapi_logo.png" 
                  alt="Weather data by WeatherAPI.com" 
                  className="weather-logo" 
                  style={{ maxWidth: '70px' }} // ปรับขนาดโลโก้
                />
              </a>
            </div>
            <h1 className="text-dark" style={{ fontSize: '24px', margin: 0 }}>
            Real-Time Weather in Thailand
            </h1>
          </div>



            {error && <div className="alert alert-danger my-4">{error}</div>}


          {/* Tabs Navigation */}
          <div className="tabs">
        <button onClick={() => setActiveTab('map')} className={activeTab === 'map' ? 'active' : ''}>Map</button>
        <button onClick={() => setActiveTab('data')} className={activeTab === 'data' ? 'active' : ''}>Data</button>
        <button onClick={() => setActiveTab('about')} className={activeTab === 'about' ? 'active' : ''}>About</button>
          </div>

          {/* Tabs Content */}
          <div className="tab-content">

        {activeTab === 'map' && (
          <div className="map-container">
            <GoogleMapComponent 
            
            markers={markers} 
            center={mapCenter} 
            />
          </div>
        )}
        

        {activeTab === 'data' && (
  <div className="data-container">
    <table className="table">
      <thead style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
        <tr style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Province</th>
          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Condition</th>
          <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Temp (°C)</th>
          <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Humidity (%)</th>
          <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Cloud (%)</th>
          <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Gust (km/h)</th>
          <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>UV</th>
          <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>PM2.5 (µg/m³)</th>
        </tr>
      </thead>


      <tbody>
  {temperatureData.length > 0 ? (
    temperatureData.map((data, index) => (
      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff' }}>
        <td data-label="Province" style={{ padding: '12px', fontWeight: 'bold', color: '#007bff', textAlign: 'left' }}>
          {data.province}
        </td>
        <td data-label="Condition" style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>
          {data.condition ? (
            <>
              <img
                src={data.condition.icon}
                alt={data.condition.text}
                style={{ width: '20px', height: 'auto', marginRight: '5px' }}
              />
              {data.condition.text}
            </>
          ) : 'N/A'}
        </td>
        <td data-label="Temperature" style={{ padding: '12px', color: getTemperatureColor(data.temperature), fontWeight: 'bold', textAlign: 'right' }}>
          {data.temperature ? data.temperature.toFixed(2) : 'N/A'}
        </td>
        <td data-label="Humidity" style={{ padding: '12px', color: getHumidityColor(data.humidity), fontWeight: 'bold', textAlign: 'right' }}>
          {data.humidity ? data.humidity.toFixed(2) : 'N/A'}
        </td>
        <td data-label="Cloud Cover" style={{ padding: '12px', color: getColorForCloudCover(data.cloud), fontWeight: 'bold', textAlign: 'right' }}>
          {data.cloud !== undefined ? `${data.cloud} %` : 'N/A'}
        </td>
        <td data-label="Gust" style={{ padding: '12px', color: getColorForGust(data.gust_kph), fontWeight: 'bold', textAlign: 'right' }}>
          {data.gust_kph !== undefined ? `${data.gust_kph} km/h` : 'N/A'}
        </td>
        <td data-label="UV" style={{ padding: '12px', color: getColorForUV(data.uv), fontWeight: 'bold', textAlign: 'right' }}>
          {data.uv !== undefined ? data.uv : 'N/A'}
        </td>
        <td data-label="PM2.5" style={{ padding: '12px', color: getColorForPM25(data.pm25), fontWeight: 'bold', textAlign: 'right' }}>
          {data.pm25 !== undefined ? `${data.pm25} µg/m³` : 'N/A'}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
        No data available.
      </td>
    </tr>
  )}
      </tbody>

          


    </table>
  </div>
)}



        
        {activeTab === 'about' && (
            <div className="about-container" style={{ 
    maxWidth: '100%', 
    margin: 'auto', 
    padding: '2rem', 
    borderRadius: '10px', 
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)', 
    backgroundColor: '#f8f9fa', 
    fontFamily: 'Arial, sans-serif', 
    lineHeight: '1.75' 
}}>

 
    <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#444', fontSize: '1.4rem', fontWeight: '600', marginBottom: '.75rem' }}>วัตถุประสงค์</h3>
        <p style={{ color: '#555', fontSize: '1rem' }}>
            โปรแกรมนี้ถูกพัฒนาขึ้นเพื่อให้ผู้ใช้สามารถเข้าถึงข้อมูลสภาพอากาศแบบเรียลไทม์ได้อย่างสะดวกและรวดเร็ว โดยมีการเก็บข้อมูลสภาพอากาศลงในฐานข้อมูล <strong>PostgreSQL</strong> เพื่อการวิเคราะห์ข้อมูลระยะยาว ทั้งยังสามารถเพิ่มข้อมูลระดับอำเภอ และขยายไปยังประเทศอื่น ๆ ได้ตามความต้องการของผู้ใช้งาน ทำให้ข้อมูลมีความยืดหยุ่นและครอบคลุมมากยิ่งขึ้น
        </p>
    </section>

    <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#444', fontSize: '1.4rem', fontWeight: '600', marginBottom: '.75rem' }}>คุณสมบัติที่สำคัญ</h3>
        <ul style={{ color: '#555', fontSize: '1rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '.5rem' }}>ดึงข้อมูลสภาพอากาศจาก API แบบเรียลไทม์</li>
            <li style={{ marginBottom: '.5rem' }}>รองรับการบันทึกข้อมูลลงใน PostgreSQL เพื่อการใช้งานในระยะยาว</li>
            <li style={{ marginBottom: '.5rem' }}>สามารถนำไปพัฒนาเพิ่มข้อมูล อำเภอและประเทศใหม่ๆ ได้ตามต้องการ</li>
            <li style={{ marginBottom: '.5rem' }}>แสดงข้อมูลสำคัญ เช่น อุณหภูมิ, ความชื้น, ความเร็วลม, ความปกคลุมของเมฆ, ค่ารังสี UV, และ PM2.5</li>
        </ul>
    </section>

    <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#444', fontSize: '1.4rem', fontWeight: '600', marginBottom: '.75rem' }}>วิธีการทำงาน</h3>
        <p style={{ color: '#555', fontSize: '1rem' }}>
            โปรแกรมนี้เรียกใช้ข้อมูลสภาพอากาศจาก <strong style={{ color: '#000' }}>WeatherAPI</strong> ซึ่งเป็น API ที่น่าเชื่อถือและอัปเดตข้อมูลสภาพอากาศแบบเรียลไทม์ โดยทุกครั้งที่มีการร้องขอข้อมูล โปรแกรมจะเชื่อมต่อกับ WeatherAPI เพื่อดึงข้อมูลล่าสุดและจัดเก็บลงในฐานข้อมูล <strong>PostgreSQL</strong> เพื่อให้สามารถเก็บข้อมูลย้อนหลังและนำมาวิเคราะห์ได้ ทั้งยังแสดงผลข้อมูลในหน้าแอปพลิเคชันในรูปแบบที่สวยงามและอ่านง่าย นอกจากนี้ โปรแกรมยังรองรับการเพิ่มข้อมูลสภาพอากาศของอำเภอและประเทศต่าง ๆ ได้ตามความต้องการของผู้ใช้
        </p>
    </section>

    <section style={{ marginBottom: '1.5rem' }}>
    <h3 style={{ color: '#444', fontSize: '1.4rem', fontWeight: '600', marginBottom: '.75rem' }}>เทคโนโลยีที่ใช้</h3>
    <p style={{ color: '#555', fontSize: '1rem' }}>
        โปรแกรมนี้พัฒนาขึ้นโดยใช้เทคโนโลยี <strong style={{ color: '#000' }}>Node.js</strong> และ <strong style={{ color: '#000' }}>React</strong> ซึ่งช่วยในการสร้างอินเทอร์เฟซที่มีความทันสมัยและใช้งานได้ง่าย ข้อมูลทั้งหมดถูกจัดเก็บใน <strong>PostgreSQL</strong> ที่มีประสิทธิภาพสูงในการจัดการข้อมูล โดยสามารถเข้าถึงและวิเคราะห์ข้อมูลย้อนหลังได้อย่างมีประสิทธิภาพ ทำให้สามารถนำข้อมูลสภาพอากาศที่เก็บไว้ไปใช้ในการสร้างรายงานหรือการวิเคราะห์เชิงลึกตามความต้องการของผู้ใช้ได้อย่างหลากหลาย
    </p>
    <p style={{ color: '#555', fontSize: '1rem' }}>
        นอกจากนี้โปรแกรมยังมีการใช้ <strong style={{ color: '#000' }}>API</strong> ที่ช่วยให้สามารถดึงข้อมูลสภาพอากาศจากแหล่งต่างๆ ได้อย่างแม่นยำและทันเวลา พร้อมทั้งรองรับการทำงานแบบเรียลไทม์ ด้วยการเชื่อมต่อกับ <strong style={{ color: '#000' }}>Weather API</strong> และ <strong style={{ color: '#000' }}>Google Maps API</strong> เพื่อเพิ่มความสะดวกในการแสดงผลข้อมูลและการวิเคราะห์เชิงลึก
    </p>
    </section>


    <section>
        <h3 style={{ color: '#444', fontSize: '1.4rem', fontWeight: '600', marginBottom: '.75rem' }}>ผู้พัฒนาและที่ปรึกษา</h3>
        <p style={{ color: '#555', fontSize: '1rem' }}>
            โปรแกรมนี้พัฒนาโดย <strong style={{ color: '#000' }}>ณัชพล เกิดชนะ</strong> นักศึกษาระดับปริญญาโท สาขาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยธุรกิจบัณฑิต ภายใต้คำแนะนำของ <strong style={{ color: '#000' }}>
            <a href="https://cite.dpu.ac.th/ResumeDean.html" target="_blank" style={{ color: '#007bff', textDecoration: 'none' }}>ผู้ช่วยศาสตราจารย์ ดร. ชัยพร เขมะภาตะพันธ์</a>
            </strong> คณบดี วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี (CITE) และผู้อำนวยการหลักสูตรสาขาวิชาวิศวกรรมคอมพิวเตอร์ ท่านได้ให้คำแนะนำและสนับสนุนในการพัฒนาโครงการนี้ตั้งแต่ขั้นตอนการออกแบบ จนถึงการเลือกเทคโนโลยีที่เหมาะสมเพื่อให้โปรแกรมสามารถตอบสนองการใช้งานได้อย่างมีประสิทธิภาพ
        </p>
    </section>
        {/* โลโก้ที่ด้านล่างขวา */}
        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
          
          <a href="https://cite.dpu.ac.th/ct/master-ct/" target="_blank" rel="noopener noreferrer">
            <img 
                src="https://cite.dpu.ac.th/ct/master-ct/images/logo-cite.jpg?t=11" 
                alt="CITE Master Logo" 
                style={{ 
                    width: 'auto', 
                    height: '60px',
                    borderRadius: '5px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }} 
              />
          </a>
        </div>
</div>


          

        )}





        </div>


        </div>
  );
}

export default App;
