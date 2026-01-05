-- Create tables for inventory management system

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER DEFAULT 10,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('IN', 'OUT', 'ADJUSTMENT')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created ON stock_movements(created_at);

-- Insert sample data for categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and components'),
('Furniture', 'Office and home furniture'),
('Stationery', 'Office supplies and stationery'),
('Tools', 'Hardware and tools'),
('Clothing', 'Apparel and accessories');

-- Insert sample suppliers
INSERT INTO suppliers (name, email, phone, address) VALUES
('Tech Supplies Co.', 'contact@techsupplies.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA'),
('Furniture World', 'sales@furnitureworld.com', '+1-555-0102', '456 Design Ave, New York, NY'),
('Office Essentials', 'info@officeessentials.com', '+1-555-0103', '789 Supply Rd, Chicago, IL');

-- Insert sample products
INSERT INTO products (name, sku, description, category_id, supplier_id, price, stock, min_stock) VALUES
('Wireless Mouse', 'ELEC-001', 'Ergonomic wireless mouse with USB receiver', 1, 1, 29.99, 45, 10),
('Office Chair', 'FURN-001', 'Ergonomic office chair with lumbar support', 2, 2, 299.99, 12, 5),
('Notebook A4', 'STAT-001', 'Premium quality A4 notebook, 200 pages', 3, 3, 5.99, 150, 30),
('LED Monitor 24"', 'ELEC-002', '24-inch Full HD LED monitor', 1, 1, 199.99, 8, 5),
('Standing Desk', 'FURN-002', 'Adjustable height standing desk', 2, 2, 499.99, 6, 3),
('Pen Set', 'STAT-002', 'Premium ballpoint pen set, 10 pieces', 3, 3, 12.99, 200, 50);

-- Insert sample stock movements
INSERT INTO stock_movements (product_id, quantity, movement_type, notes) VALUES
(1, 50, 'IN', 'Initial stock'),
(2, 15, 'IN', 'Initial stock'),
(3, 200, 'IN', 'Initial stock'),
(1, -5, 'OUT', 'Sold to customer'),
(3, -50, 'OUT', 'Bulk order'),
(2, -3, 'OUT', 'Office setup order');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
