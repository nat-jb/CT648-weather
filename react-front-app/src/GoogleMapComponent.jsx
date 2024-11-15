import React, { useEffect, useRef, useState } from 'react';

const GoogleMapComponent = ({ markers, center }) => {
  const [googleApiKey, setGoogleApiKey] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerObjects = useRef([]);

  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        //const response = await fetch('http://localhost:5001/api/config');
        const response = await fetch('http://localhost:5002/api/googlekey');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.googleApiKey) {
          setGoogleApiKey(data.googleApiKey);
        } else {
          console.error('Google API Key not found in response:', data);
        }
      } catch (error) {
        console.error('Error fetching API key:', error);
      }
    };

    fetchGoogleApiKey();
  }, []);

  useEffect(() => {
    if (googleApiKey) {
      const initializeMap = () => {
        if (mapRef.current && !mapInstance.current) {
          mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: center || { lat: 13.7367, lng: 100.5231 },
            zoom: 6,
          });
        }

        // สร้าง markers ใหม่ทุกครั้งเมื่อข้อมูล markers เปลี่ยนแปลง
        updateMarkers();
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initializeMap`;
      script.async = true;
      script.defer = true;
      window.initializeMap = initializeMap;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        delete window.initializeMap;
      };
    }
  }, [googleApiKey]);

//ลบmarkerทั้งหมดก่อนแล้วสร้างใหม่
  useEffect(() => {
    if (mapInstance.current) {
      // ล้าง markers เก่า
      markerObjects.current.forEach((marker) => marker.setMap(null));
      markerObjects.current = [];

      // สร้าง markers ใหม่ด้วยสีที่ถูกต้อง
      updateMarkers();
    }
  }, [markers, googleApiKey]);



  const updateMarkers = () => {
    markerObjects.current = markers.map((marker) => {
      const googleMarker = new window.google.maps.Marker({
        position: marker.coords,
        map: mapInstance.current,
        title: marker.province,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: getMarkerColor(marker.temperature),
          fillOpacity: 1,
          strokeColor: 'black',
          strokeWeight: 1,
        },
      });


    // สร้าง URL สำหรับดึงภาพจาก Google Street View Static API
    const streetViewImageUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${marker.coords.lat},${marker.coords.lng}&fov=90&heading=235&pitch=10&key=${googleApiKey}`;
   
   const infowindow = new window.google.maps.InfoWindow({
    content: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 10px; background-color: #fefefe; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 600px; width: fit-content; overflow: hidden; box-sizing: border-box;">
  
        <!-- ใช้ Flexbox จัดข้อมูลให้เป็น 2 คอลัมน์ -->
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
  
          <!-- คอลัมน์แรก: รูปภาพจาก Google Maps และ Street View -->
          <div style="flex: 1 1 200px;">
            <img src="https://maps.googleapis.com/maps/api/staticmap?center=${marker.coords.lat},${marker.coords.lng}&zoom=15&size=400x200&maptype=roadmap&markers=color:red%7C${marker.coords.lat},${marker.coords.lng}&key=${googleApiKey}"
                 alt="Location Map" style="width: 100%; height: auto; border-radius: 10px; margin-bottom: 10px;"/>
  
            <img src="${streetViewImageUrl}" alt="Street View" style="width: 100%; height: auto; border-radius: 10px;"/>
          </div>
  
          <!-- คอลัมน์ที่สอง: ข้อมูล -->
          <div style="flex: 1 1 200px;">
  
            <strong style="font-size: 18px; color: #2c3e50; font-weight: bold; margin-bottom: 10px; display: block;">${marker.province}</strong>
  
            <!-- แสดงไอคอนและข้อความ -->
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <img src="${marker.condition ? marker.condition.icon : ''}" alt="${marker.condition ? marker.condition.text : 'No icon'}" style="width: 40px; height: auto; margin-right: 10px;"/>
              <span style="font-size: 16px; color: #333; font-weight: bold;">${marker.condition ? marker.condition.text : 'No condition available'}</span>
            </div>
  
            <hr style="border: 1px solid #ddd; margin: 5px 0;"/>
  
            <!-- ตารางข้อมูล -->
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 0; padding: 0; table-layout: auto;">
              <tbody>
                <tr>
                  <td style="padding: 5px; border: 1px solid #ddd; color: ${getColorForTemperature(marker.temperature)}; font-weight: bold; word-wrap: break-word;">
                    Temp: ${marker.temperature !== null ? marker.temperature.toFixed(1) + ' °C' : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px; border: 1px solid #ddd; color: ${getColorForHumidity(marker.humidity)}; font-weight: bold; word-wrap: break-word;">
                    Humidity: ${marker.humidity !== null ? `${marker.humidity} %` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px; border: 1px solid #ddd; color: ${getColorForCloudCover(marker.cloud)}; font-weight: bold; word-wrap: break-word;">
                    Cloud: ${marker.cloud !== null ? `${marker.cloud} %` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px; border: 1px solid #ddd; color: ${getColorForGust(marker.gust_kph)}; font-weight: bold; word-wrap: break-word;">
                    Gust: ${marker.gust_kph !== null ? `${marker.gust_kph} km/h` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px; border: 1px solid #ddd; color: ${getColorForUV(marker.uv)}; font-weight: bold; word-wrap: break-word;">
                    UV: ${marker.uv !== null ? `${marker.uv}` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px; border: 1px solid #ddd; color: ${getColorForPM25(marker.pm25)}; font-weight: bold; word-wrap: break-word;">
                    PM2.5: ${marker.pm25 !== null ? `${marker.pm25} µg/m³` : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
  
          </div>
  
        </div>
  
      </div>
    `,
  });
  
  
  

      
      
      

        googleMarker.addListener('click', () => {
        infowindow.open(mapInstance.current, googleMarker);
      });


     

      return googleMarker;
    });
  };




//สี Marker
  const getMarkerColor = (temperature) => {
    if (temperature >= 45) {
      return '#8B0000'; // สีแดงเข้มมาก (Dark Red)
    } else if (temperature >= 40) {
      return '#C8102E'; // สีแดงเข้ม (Red)
    } else if (temperature >= 35) {
      return '#FF4500'; // สีส้มแดง (Orange Red)
    } else if (temperature >= 30) {
      return '#FFA500'; // สีส้ม (Orange)
    } else if (temperature >= 25) {
      return '#FAD26F'; // สีเหลือง (Yellow)
    } else if (temperature >= 20) {
      return '#0057A4'; // สีฟ้าปานกลาง (Blue)
    } else if (temperature >= 15) {
      return '#56A6D0'; // สีฟ้าอ่อน (Light Blue)
    } else if (temperature >= 10) {
      return '#A2D4E9'; // สีฟ้าอ่อน (Light Blue)
    } else if (temperature >= 5) {
      return '#A0D3DB'; // สีฟ้าอ่อน (Light Blue)
    } else if (temperature >= 0) {
      return '#B7E9F7'; // สีฟ้าอ่อน (Light Blue)
    } else {
      return '#001B44'; // สีน้ำเงินเข้มลึกสำหรับอุณหภูมิต่ำกว่า 0°C (Deep Blue)
    }
  };
  

  const getColorForTemperature = (temp) => {
    if (temp >= 45) return '#8B0000'; // สีแดงเข้มมาก (Dark Red)
    if (temp >= 40) return '#C8102E'; // สีแดงเข้ม (Red)
    if (temp >= 35) return '#FF4500'; // สีส้มแดง (Orange Red)
    if (temp >= 30) return '#FFA500'; // สีส้ม (Orange)
    if (temp >= 25) return '#FAD26F'; // สีเหลือง (Yellow)
    if (temp >= 20) return '#0057A4'; // สีน้ำเงินเข้ม (Dark Blue) '#003366'; // สีน้ำเงินเข้มมาก (Navy Blue) '#001F3F'; // สีน้ำเงินเข้มที่สุด (Dark Navy Blue)
    if (temp >= 15) return '#56A6D0'; // สีฟ้าปานกลาง (Blue)'#0057A4'; // สีน้ำเงินเข้ม (Dark Blue)
    if (temp >= 10) return '#A2D4E9'; // สีฟ้าอ่อน (Light Blue) '#0072B5'; // สีฟ้าปานกลาง (Blue)
    if (temp >= 5) return  '#A0D3DB'; // สีฟ้าอ่อน (Light Blue)'#0072B5'; // สีฟ้าปานกลาง (Blue)
    if (temp >= 0) return '#B7E9F7'; // สีฟ้าอ่อน (Light Blue)
    return '#001B44'; // สีน้ำเงินเข้มลึกสำหรับอุณหภูมิต่ำกว่า 0°C (Deep Blue)
  };

  const getColorForHumidity = (humidity) => {
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

  return <div ref={mapRef} style={{ height: '100%', width: '99vw' }} />;

};

export default GoogleMapComponent;
