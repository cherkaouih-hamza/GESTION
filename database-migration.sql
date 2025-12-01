-- Migration : Ajouter le champ phone et is_active à la table users
-- Fichier: database-migration.sql

-- Vérifier si le champ phone existe déjà, sinon l'ajouter
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
    END IF;
END $$;

-- Vérifier si le champ is_active existe déjà, sinon l'ajouter
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Mettre à jour les rôles existants pour utiliser 'utilisateur' au lieu de 'user'
UPDATE users SET role = 'utilisateur' WHERE role = 'user';

-- Afficher la structure de la table pour vérification
\d users