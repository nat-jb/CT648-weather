-- init.sql
CREATE TABLE IF NOT EXISTS weather (
    id SERIAL PRIMARY KEY,
    province VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    wind_speed DECIMAL(5, 2),
    gusts DECIMAL(5, 2),
    condition VARCHAR(255),
    cloud_cover DECIMAL(5, 2),
    uv_index DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
