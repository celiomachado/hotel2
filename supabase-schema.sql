-- =====================================================
-- SCHEMA COMPLETO PARA HOTEL - EXECUTE NO SUPABASE SQL EDITOR
-- =====================================================

-- Criar tabela de seções da landing page
CREATE TABLE landing_sections (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL, -- hero, about, rooms, amenities, etc.
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    button_text TEXT,
    button_link TEXT,
    order_position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de configurações gerais
CREATE TABLE site_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de reservas
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INTEGER DEFAULT 1,
    room_type VARCHAR(100),
    special_requests TEXT,
    total_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de tipos de quartos
CREATE TABLE room_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10,2) NOT NULL,
    max_guests INTEGER DEFAULT 2,
    amenities TEXT[], -- array de amenities
    image_urls TEXT[], -- array de URLs de imagens
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de perfis de usuário
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    date_of_birth DATE,
    is_admin BOOLEAN DEFAULT false,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir seções padrão da landing page
INSERT INTO landing_sections (section_key, title, subtitle, content, order_position) VALUES
('hero', 'Bem-vindo ao Hotel Paradise', 'Sua experiência única nos aguarda', 'Descubra o conforto e a elegância em cada detalhe do nosso hotel.', 1),
('about', 'Sobre Nós', 'História e Tradição', 'Com mais de 20 anos de excelência em hospitalidade, oferecemos uma experiência única.', 2),
('rooms', 'Nossos Quartos', 'Conforto e Elegância', 'Quartos cuidadosamente planejados para seu máximo conforto e relaxamento.', 3),
('amenities', 'Comodidades', 'Tudo que você precisa', 'Piscina, spa, restaurante gourmet e muito mais para sua estadia perfeita.', 4),
('contact', 'Contato', 'Fale Conosco', 'Entre em contato e faça sua reserva. Estamos aqui para ajudar.', 5);

-- Inserir configurações padrão do site
INSERT INTO site_config (config_key, config_value, description) VALUES
('hotel_name', 'Hotel Paradise', 'Nome do hotel'),
('hotel_phone', '(11) 99999-9999', 'Telefone do hotel'),
('hotel_email', 'contato@hotelparadise.com', 'Email do hotel'),
('hotel_address', 'Rua das Flores, 123 - Centro', 'Endereço do hotel'),
('primary_color', '#4F46E5', 'Cor primária do site'),
('secondary_color', '#059669', 'Cor secundária do site');

-- Inserir tipos de quartos padrão
INSERT INTO room_types (name, description, price_per_night, max_guests, amenities) VALUES
('Quarto Standard', 'Quarto confortável com todas as comodidades básicas', 150.00, 2, ARRAY['Wi-Fi', 'TV', 'Ar-condicionado', 'Frigobar']),
('Quarto Deluxe', 'Quarto espaçoso com vista para o mar', 250.00, 3, ARRAY['Wi-Fi', 'TV', 'Ar-condicionado', 'Frigobar', 'Vista para o mar', 'Varanda']),
('Suíte Premium', 'Suíte luxuosa com jacuzzi e sala de estar', 450.00, 4, ARRAY['Wi-Fi', 'TV', 'Ar-condicionado', 'Frigobar', 'Jacuzzi', 'Sala de estar', 'Vista panorâmica']);

-- Habilitar RLS (Row Level Security)
ALTER TABLE landing_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança

-- Landing sections - todos podem ler, apenas admins podem editar
CREATE POLICY "Public can view landing sections" ON landing_sections
FOR SELECT USING (true);

CREATE POLICY "Admin can manage landing sections" ON landing_sections
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.is_admin = true
    )
);

-- Site config - todos podem ler, apenas admins podem editar
CREATE POLICY "Public can view site config" ON site_config
FOR SELECT USING (true);

CREATE POLICY "Admin can manage site config" ON site_config
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.is_admin = true
    )
);

-- Room types - todos podem ler, apenas admins podem editar
CREATE POLICY "Public can view room types" ON room_types
FOR SELECT USING (true);

CREATE POLICY "Admin can manage room types" ON room_types
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.is_admin = true
    )
);

-- Reservations - usuários podem ver suas próprias reservas e criar novas
CREATE POLICY "Users can view own reservations" ON reservations
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations" ON reservations
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all reservations" ON reservations
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.is_admin = true
    )
);

-- User profiles - usuários podem ver/editar próprio perfil, admins veem todos
CREATE POLICY "Users can view own profile" ON user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON user_profiles
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.is_admin = true
    )
);

-- Função para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil ao registrar
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar primeiro usuário admin (substitua o email)
-- EXECUTE DEPOIS DE CRIAR SUA CONTA:
-- INSERT INTO user_profiles (id, full_name, is_admin) 
-- VALUES ((SELECT id FROM auth.users WHERE email = 'seu-email@admin.com'), 'Admin User', true);
