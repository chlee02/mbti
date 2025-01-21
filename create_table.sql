DROP TABLE IF EXISTS memes;

CREATE TABLE memes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(10) NOT NULL,
  url TEXT NOT NULL,
  alt VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE start_index_tracker (
  type VARCHAR(10) PRIMARY KEY,
  start_index INT NOT NULL DEFAULT 1
);