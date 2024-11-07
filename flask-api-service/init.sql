-- init.sql
CREATE TABLE weather_data (
    id SERIAL PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    cloud DECIMAL(5, 2),
    gust_kph DECIMAL(5, 2),
    uv DECIMAL(5, 2),
    condition VARCHAR(200),
    pm25 DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
