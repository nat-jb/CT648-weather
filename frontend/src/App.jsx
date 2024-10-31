import React, { useState, useEffect } from 'react';
import './App.css';
//import { Line } from 'react-chartjs-2';
//import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from 'react-paginate';
//import GoogleMapComponent from './GoogleMapComponent'; // นำเข้า GoogleMapComponent
//ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

function App() {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState('');
  const [ws, setWs] = useState(null);
  const [activeTab, setActiveTab] = useState('weather'); // State สำหรับจัดการแท็บที่เลือก
  const [queryResult, setQueryResult] = useState(null); // สำหรับเก็บผลลัพธ์ของ SQL query
  const [queryError, setQueryError] = useState(''); // สำหรับเก็บข้อผิดพลาดจาก query
  

  {/* const markers = [
    { lat: 13.7563, lng: 100.5018 }, // ตัวอย่าง marker (กรุงเทพฯ)
    { lat: 13.759, lng: 100.564 },    // ตัวอย่าง marker อีกตัว
  ];*/}

  useEffect(() => {
    fetchProvinces();
    const websocket = new WebSocket('ws://localhost:5001');
    setWs(websocket);

    websocket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log('New data received:', newData);
      if (newData.district.trim() === selectedDistrict.trim()) {
        //console.log('อำเภอเข้าตรงกัน');
        fetchWeatherHistory(selectedDistrict);
      }
    };

    websocket.onerror = (error) => {
      console.log('WebSocket Error:', error);
    };

    return () => {
      websocket.close();
    };
  }, [selectedDistrict]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/provinces');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched provinces:', data);
      setProvinces(data);
    } catch (error) {
      setError('Error fetching provinces: ' + error.message);
    }
  };

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    }
  }, [selectedProvince]);

  const fetchDistricts = async (province) => {
    try {
      const response = await fetch(`http://localhost:5002/api/districts/${province}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched districts:', data);
      setDistricts(data);
    } catch (error) {
      setError('Error fetching districts: ' + error.message);
    }
  };

  useEffect(() => {
    if (selectedDistrict) {
      fetchWeatherHistory(selectedDistrict);
    }
  }, [selectedDistrict]);

  const fetchWeatherHistory = async (district) => {
    setLoadingWeather(true);
    try {
      const response = await fetch(`http://localhost:5002/api/weather_history/${district}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched weather history:', data);
      setWeatherHistory(data);
    } catch (error) {
      setError('Error fetching weather history: ' + error.message);
    } finally {
      setLoadingWeather(false);
    }
  };

  // ฟังก์ชันสำหรับจัดการการส่ง query
  const handleQuerySubmit = async (event) => {
    event.preventDefault();
    const query = event.target.query.value;
    console.log('Query submitted:', query);
    
    try {
      const response = await fetch('http://localhost:5002/api/execute_query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      console.log('Query result:', result);
      setQueryResult(result); // เก็บผลลัพธ์ใน state
      setQueryError(''); // เคลียร์ข้อผิดพลาด
    } catch (error) {
      console.error('Error executing query:', error);
      setQueryError('Error executing query: ' + error.message); // เก็บข้อผิดพลาดใน state
      setQueryResult(null); // เคลียร์ผลลัพธ์
    }
  };


  return (
    <div className="App">
      <a href="https://www.weatherapi.com/" title="Free Weather API">
        <img
          src="//cdn.weatherapi.com/v4/images/weatherapi_logo.png"
          alt="Weather data by WeatherAPI.com"
          border="0"
          style={{ position: 'absolute', top: '10px', left: '10px' }}
        />
      </a>
      <h1 style={{ marginTop: '50px' }}>Historical Weather Data in Thailand</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}


{/* Tab Links */}
<div style={{ marginBottom: '20px', textAlign: 'center' }}>
  <button 
    onClick={() => setActiveTab('weather')} 
    style={{
      padding: '10px 20px',
      marginRight: '10px',
      backgroundColor: activeTab === 'weather' ? '#007bff' : '#ccc',
      color: activeTab === 'weather' ? '#fff' : '#333',
      border: 'none',
      borderRadius: '8px',
      
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s',
      fontWeight: 'bold'
    }}
  >
    Weather History
  </button>
  <button 
    onClick={() => setActiveTab('query')} 
    style={{
      padding: '10px 20px',
      backgroundColor: activeTab === 'query' ? '#007bff' : '#ccc',
      color: activeTab === 'query' ? '#fff' : '#333',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s',
      fontWeight: 'bold'
    }}
  >
    Query Editor
  </button>
</div>

      
      {/* Weather History Tab */}
      {activeTab === 'weather' && (
        <div>
          {/* Province Dropdown */}
          <div className="dropdown-container">
            <label htmlFor="province">Select Province:</label>
            <select
              id="province"
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedDistrict('');
                setWeatherHistory([]);
              }}
            >
              <option value="">-- Select Province --</option>
              {provinces.map((province, index) => (
                

                <option key={index} value={province.province}>
                  {province.province}


                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div className="dropdown-container">
            <label htmlFor="district">Select District:</label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedProvince}
            >
              <option value="">-- Select District --</option>
              {districts.map((district, index) => (


                <option key={index} value={district.district}>
                  {district.district}

                </option>
              ))}
            </select>
          </div>

         {/* <GoogleMapComponent markers={markers} /> */}


          {/* Weather History Table */}
          {selectedDistrict && (
            <div className="weather-history-container">
              <h2>Weather History for {selectedDistrict}</h2>
              {loadingWeather ? (
                <p>Loading...</p>
              ) : (
                <table className="weather-table">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>อุณหภูมิ (°C)</th>
                      <th>ความชื้น (%)</th>
                      <th>ความเร็วลม (m/s)</th>
                      <th>ลมกระโชก (m/s)</th>
                      <th>สภาพอากาศ</th>
                      <th>การปกคลุมของเมฆ (%)</th>
                      <th>ดัชนี UV</th>
                    </tr>
                  </thead>
                  <tbody>

                    {weatherHistory.map((record, index) => (
                    

                      <tr key={record.created_at || index}>
                        <td>{record.created_at}</td>
                        <td>{record.temperature}</td>
                        <td>{record.humidity}</td>
                        <td>{record.wind_speed}</td>
                        <td>{record.gusts}</td>
                        <td>{record.condition}</td>
                        <td>{record.cloud_cover}</td>
                        <td>{record.uv_index}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* Query Editor Tab */}
      {activeTab === 'query' && (
  <div className="query-editor-container" style={{ textAlign: 'center', marginTop: '20px' }}>
    <h2 style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '20px' }}>Query Editor</h2>
    <form onSubmit={handleQuerySubmit} style={{ display: 'inline-block', width: '100%', maxWidth: '600px' }}>
      <textarea
        name="query"
        rows="5"
        cols="50"
        placeholder="Enter your SQL query here..."
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '16px',
          border: '2px solid #66b3ff',
          borderRadius: '8px',
          resize: 'vertical',
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      ></textarea>
      <br />
      <button 
        type="submit" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          fontSize: '16px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
      >
        Submit Query
      </button>
    </form>

{/* แสดงผลลัพธ์จาก query */}
{queryError && (
  <p style={{ color: 'red', marginTop: '15px' }}>{queryError}</p>
)}
{queryResult && queryResult.length > 0 ? (
  <div style={{ marginTop: '30px', overflowX: 'auto' }}>
    <h3 style={{ color: '#333', fontWeight: 'bold' }}>Query Result:</h3>
    <table className="query-result-table">
      <thead>
        <tr>
          {Object.keys(queryResult[0]).map((key, index) => (
            <th key={index}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {queryResult.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, idx) => (
              <td key={idx}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p style={{ color: '#666', marginTop: '15px' }}>No results found.</p>
)}








  </div>
      )}
    </div>
  );
}

export default App;
