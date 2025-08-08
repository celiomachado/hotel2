-- SQL para criar usuário admin no sistema
-- Email: admin@hotel.com
-- UID: 254cb0fd-7463-498b-8d37-dfa6c78c5089

-- Inserir ou atualizar perfil do usuário como admin
INSERT INTO user_profiles (id, full_name, is_admin, created_at, updated_at) 
VALUES (
    '254cb0fd-7463-498b-8d37-dfa6c78c5089', 
    'Administrador do Hotel', 
    true, 
    NOW(), 
    NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
    is_admin = true,
    full_name = COALESCE(user_profiles.full_name, 'Administrador do Hotel'),
    updated_at = NOW();

-- Verificar se o usuário foi criado corretamente
SELECT 
    up.id,
    up.full_name,
    up.is_admin,
    au.email,
    up.created_at
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE up.id = '254cb0fd-7463-498b-8d37-dfa6c78c5089';
