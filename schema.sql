-- Création de la table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  pole VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des tâches
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  pole VARCHAR(100),
  assignee INTEGER REFERENCES users(id),
  due_date DATE,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion d'utilisateurs de test
INSERT INTO users (username, email, password, role, pole) 
VALUES 
  ('Admin User', 'admin@example.com', 'hashed_password_here', 'admin', 'IT'),
  ('Test User', 'user@example.com', 'hashed_password_here', 'user', 'Marketing')
ON CONFLICT (email) DO NOTHING;

-- Insertion de tâches de test
INSERT INTO tasks (title, description, status, priority, pole, assignee, due_date, created_by)
VALUES 
  ('Tâche de test', 'Description de la tâche de test', 'pending', 'medium', 'IT', 2, CURRENT_DATE + INTERVAL '7 days', 1),
  ('Tâche urgente', 'Cette tâche est urgente', 'in_progress', 'high', 'Marketing', 2, CURRENT_DATE + INTERVAL '3 days', 1),
  ('Tâche terminée', 'Cette tâche est déjà terminée', 'completed', 'low', 'IT', 1, CURRENT_DATE - INTERVAL '1 day', 1)
ON CONFLICT (id) DO NOTHING;