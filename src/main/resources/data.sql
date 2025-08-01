-- Inserir usuário administrador
INSERT INTO users (username, password, email, full_name, role, created_at, updated_at, is_active) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@admiverde.pt', 'Administrador Admiverde', 'ADMIN', NOW(), NOW(), true);

-- Inserir usuário cliente de exemplo
INSERT INTO users (username, password, email, full_name, role, created_at, updated_at, is_active) 
VALUES ('cliente1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente1@email.com', 'João Silva', 'CLIENT', NOW(), NOW(), true);

-- Inserir usuário jestevao
INSERT INTO users (username, password, email, full_name, role, created_at, updated_at, is_active) 
VALUES ('jestevao', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jestevao@email.com', 'João Estevão', 'CLIENT', NOW(), NOW(), true);

-- Inserir prédios
INSERT INTO buildings (name, address, postal_code, city, total_apartments, construction_year, building_type, created_at, updated_at) 
VALUES ('Residencial Parque Verde', 'Rua das Flores, 123', '2800-000', 'Almada', 24, 2010, 'APARTMENT', NOW(), NOW());

INSERT INTO buildings (name, address, postal_code, city, total_apartments, construction_year, building_type, created_at, updated_at) 
VALUES ('Edifício Marina', 'Avenida da Liberdade, 456', '2800-001', 'Almada', 12, 2015, 'APARTMENT', NOW(), NOW());

-- Inserir apartamentos
INSERT INTO apartments (number, floor, total_area, useful_area, number_of_rooms, monthly_fee, building_id, owner_id, created_at, updated_at) 
VALUES ('1A', '1', 85.5, 75.2, 2, 150.00, 1, 2, NOW(), NOW());

INSERT INTO apartments (number, floor, total_area, useful_area, number_of_rooms, monthly_fee, building_id, owner_id, created_at, updated_at) 
VALUES ('2B', '2', 95.0, 82.1, 3, 180.00, 1, 2, NOW(), NOW());

INSERT INTO apartments (number, floor, total_area, useful_area, number_of_rooms, monthly_fee, building_id, owner_id, created_at, updated_at) 
VALUES ('1C', '1', 120.0, 105.5, 3, 220.00, 2, 2, NOW(), NOW());

-- Inserir pagamentos
INSERT INTO payments (description, amount, due_date, payment_date, status, payment_type, apartment_id, building_id, created_at, updated_at) 
VALUES ('Quota Condomínio Janeiro 2024', 150.00, '2024-01-31', '2024-01-15', 'PAID', 'MONTHLY_FEE', 1, 1, NOW(), NOW());

INSERT INTO payments (description, amount, due_date, payment_date, status, payment_type, apartment_id, building_id, created_at, updated_at) 
VALUES ('Quota Condomínio Fevereiro 2024', 150.00, '2024-02-29', NULL, 'PENDING', 'MONTHLY_FEE', 1, 1, NOW(), NOW());

INSERT INTO payments (description, amount, due_date, payment_date, status, payment_type, apartment_id, building_id, created_at, updated_at) 
VALUES ('Quota Condomínio Janeiro 2024', 180.00, '2024-01-31', '2024-01-20', 'PAID', 'MONTHLY_FEE', 2, 1, NOW(), NOW());

INSERT INTO payments (description, amount, due_date, payment_date, status, payment_type, apartment_id, building_id, created_at, updated_at) 
VALUES ('Quota Condomínio Fevereiro 2024', 180.00, '2024-02-29', NULL, 'PENDING', 'MONTHLY_FEE', 2, 1, NOW(), NOW());

INSERT INTO payments (description, amount, due_date, payment_date, status, payment_type, apartment_id, building_id, created_at, updated_at) 
VALUES ('Quota Condomínio Janeiro 2024', 220.00, '2024-01-31', NULL, 'OVERDUE', 'MONTHLY_FEE', 3, 2, NOW(), NOW());

INSERT INTO payments (description, amount, due_date, payment_date, status, payment_type, apartment_id, building_id, created_at, updated_at) 
VALUES ('Quota Condomínio Fevereiro 2024', 220.00, '2024-02-29', NULL, 'PENDING', 'MONTHLY_FEE', 3, 2, NOW(), NOW());

INSERT INTO payments (description, amount, due_date, payment_date, status, payment_type, apartment_id, building_id, created_at, updated_at) 
VALUES ('Taxa Extraordinária Elevador', 500.00, '2024-03-31', NULL, 'PENDING', 'EXTRAORDINARY_FEE', 1, 1, NOW(), NOW()); 