-- Sample data for NestJS Learning project
-- This script runs after the schema initialization

-- Insert sample categories
INSERT INTO categories (name, description, color) VALUES 
('Development', 'Web development related bookmarks', '#28a745'),
('Documentation', 'Official documentation and guides', '#007bff'),
('Tools', 'Development tools and utilities', '#ffc107'),
('Learning', 'Educational resources and tutorials', '#17a2b8'),
('Design', 'UI/UX and design resources', '#e83e8c')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users (passwords are hashed with bcrypt for 'password123')
INSERT INTO users (email, password, first_name, last_name) VALUES 
('john.doe@example.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptpT1fxB4FGAuxZrm', 'John', 'Doe'),
('jane.smith@example.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptpT1fxB4FGAuxZrm', 'Jane', 'Smith'),
('admin@example.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptpT1fxB4FGAuxZrm', 'Admin', 'User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample bookmarks using the user IDs
WITH user_ids AS (
    SELECT id, email FROM users WHERE email IN ('john.doe@example.com', 'jane.smith@example.com', 'admin@example.com')
)
INSERT INTO bookmarks (title, description, link, user_id, tags, is_favorite) 
SELECT 
    title, 
    description, 
    link, 
    user_ids.id, 
    tags, 
    is_favorite
FROM (VALUES
    ('NestJS Documentation', 'Official NestJS framework documentation with examples and guides', 'https://docs.nestjs.com', 'john.doe@example.com', ARRAY['nestjs', 'documentation', 'backend'], true),
    ('TypeScript Handbook', 'Complete guide to TypeScript language features and best practices', 'https://www.typescriptlang.org/docs', 'john.doe@example.com', ARRAY['typescript', 'documentation', 'programming'], true),
    ('PostgreSQL Documentation', 'Official PostgreSQL database documentation', 'https://www.postgresql.org/docs', 'jane.smith@example.com', ARRAY['postgresql', 'database', 'sql'], false),
    ('Docker Official Docs', 'Complete Docker documentation for containerization', 'https://docs.docker.com', 'jane.smith@example.com', ARRAY['docker', 'containers', 'devops'], true),
    ('React Documentation', 'Official React library documentation', 'https://react.dev', 'admin@example.com', ARRAY['react', 'frontend', 'javascript'], false),
    ('VS Code Extensions', 'Marketplace for Visual Studio Code extensions', 'https://marketplace.visualstudio.com', 'admin@example.com', ARRAY['vscode', 'tools', 'development'], false),
    ('GitHub REST API', 'Documentation for GitHub REST API', 'https://docs.github.com/en/rest', 'john.doe@example.com', ARRAY['github', 'api', 'git'], false),
    ('MDN Web Docs', 'Mozilla Developer Network documentation for web technologies', 'https://developer.mozilla.org', 'jane.smith@example.com', ARRAY['html', 'css', 'javascript', 'web'], true),
    ('Tailwind CSS', 'Utility-first CSS framework documentation', 'https://tailwindcss.com/docs', 'admin@example.com', ARRAY['css', 'tailwind', 'design', 'frontend'], false),
    ('JWT.io', 'JSON Web Token introduction and debugger', 'https://jwt.io', 'john.doe@example.com', ARRAY['jwt', 'authentication', 'security'], false)
) AS bookmark_data(title, description, link, user_email, tags, is_favorite)
JOIN user_ids ON user_ids.email = bookmark_data.user_email;

-- Create associations between bookmarks and categories
WITH category_ids AS (
    SELECT id, name FROM categories
),
bookmark_ids AS (
    SELECT id, title FROM bookmarks
)
INSERT INTO bookmark_categories (bookmark_id, category_id)
SELECT bookmark_ids.id, category_ids.id
FROM (VALUES
    ('NestJS Documentation', 'Documentation'),
    ('NestJS Documentation', 'Development'),
    ('TypeScript Handbook', 'Documentation'),
    ('TypeScript Handbook', 'Development'),
    ('PostgreSQL Documentation', 'Documentation'),
    ('Docker Official Docs', 'Tools'),
    ('Docker Official Docs', 'Documentation'),
    ('React Documentation', 'Development'),
    ('React Documentation', 'Documentation'),
    ('VS Code Extensions', 'Tools'),
    ('GitHub REST API', 'Development'),
    ('GitHub REST API', 'Tools'),
    ('MDN Web Docs', 'Documentation'),
    ('MDN Web Docs', 'Learning'),
    ('Tailwind CSS', 'Design'),
    ('Tailwind CSS', 'Development'),
    ('JWT.io', 'Development'),
    ('JWT.io', 'Tools')
) AS associations(bookmark_title, category_name)
JOIN bookmark_ids ON bookmark_ids.title = associations.bookmark_title
JOIN category_ids ON category_ids.name = associations.category_name
ON CONFLICT (bookmark_id, category_id) DO NOTHING;