CREATE DATABASE cms_db;
USE cms_db;

-- ======================
-- ROLES TABLE
-- ======================
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

INSERT INTO roles (id, name) VALUES
(1, 'Student'),
(2, 'Staff'),
(3, 'Manager'),
(4, 'Administrator'),
(5, 'IT Staff'),
(6, 'Maintenance Staff'),
(7, 'Electrical Staff'),
(8, 'Cleaning Staff');

-- ======================
-- USERS TABLE (UPDATED)
-- ======================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT,
  role_id INT,
  phone VARCHAR(20),
  department VARCHAR(100),
  image VARCHAR(250),
  gender VARCHAR(20),
  bio TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  tax_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO users VALUES
(1,'Muhammad Ali Husnain','alihusnainmughal215@gmail.com','hash',4,'0307','CS','img','Male',NOW()),
(2,'Hafsa Don','hafsa@don.com','hash',1,'0307','CS','img','Female',NOW()),
(4,'Nabiha','nabiha@gmail.com','hash',5,'0307','CS','img','Female',NOW()),
(5,'Mahmooda','mahmooda@cms.com','hash',3,'0307','CS','img','Female',NOW()),
(6,'Roha','roha@cms.com','hash',1,'0307','CS','img','Female',NOW()),
(7,'Malaika','malaika@xyz.com','hash',6,'0307','ME','img','Female',NOW());

-- ======================
-- COMPLAINT TYPES
-- ======================
CREATE TABLE complaint_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO complaint_types (name, role_id) VALUES
('IT',5),
('Maintenance',6),
('Electrical',7),
('Cleaning',8),
('Plumbing',6),
('Furniture',6);

-- ======================
-- COMPLAINTS (FIXED)
-- ======================
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id VARCHAR(20) UNIQUE,
  title VARCHAR(255),
  complaint_type_id INT,
  priority VARCHAR(20),
  description TEXT,
  status ENUM('pending','open','in_process','resolved','completed','rejected') DEFAULT 'pending',
  created_by INT,
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (complaint_type_id) REFERENCES complaint_types(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- ======================
-- SAMPLE COMPLAINT DATA
-- ======================
INSERT INTO complaints (complaint_id,title,complaint_type_id,priority,description,created_by)
VALUES
('C-001','WiFi Issue',1,'Low','Internet not working',2),
('C-002','AC Broken',2,'High','AC not cooling',1),
('C-003','Light Issue',3,'Medium','Light flickering',2),
('C-004','Dirty Floor',4,'Low','Needs cleaning',6);

-- ======================
-- FEEDBACK
-- ======================
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT,
  user_id INT,
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id)
);