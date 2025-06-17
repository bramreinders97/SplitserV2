CREATE TABLE IF NOT EXISTS v2_rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver ENUM('Anne', 'Bram') NOT NULL,
    distance FLOAT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
    exported BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS v2_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    payer ENUM('Anne', 'Bram') NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exported BOOLEAN DEFAULT FALSE
);
