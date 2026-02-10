CREATE DATABASE tally_db;
USE tally_db;

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  address VARCHAR(255)
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  unit_price DECIMAL(10,2),
  vat_rate DECIMAL(5,2)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT,
  product_id INT,
  quantity INT,
  total_price DECIMAL(10,2),
  vat_amount DECIMAL(10,2),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
