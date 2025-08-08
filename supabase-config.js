// Configuração do Supabase
const SUPABASE_CONFIG = {
    url: 'https://rxdialhyznmtteztky.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGlhbGhoeXpubXR0ZXp0a2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjA2MjEsImV4cCI6MjA3MDE5NjYyMX0.dBTMs_roLMap7De9zO_tPPxJsjdQ2RFVot0CkiOJ0pI'
};

// Função para inicializar Supabase (usando CDN)
function initSupabase() {
    // Carregar Supabase via CDN
    if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@supabase/supabase-js@2';
        script.onload = () => {
            window.supabaseClient = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );
            console.log('Supabase conectado com sucesso!');
        };
        document.head.appendChild(script);
    } else {
        window.supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
    }
}

// Funções para reservas
async function saveReservation(reservationData) {
    try {
        const { data, error } = await window.supabaseClient
            .from('reservations')
            .insert([reservationData]);
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Erro ao salvar reserva:', error);
        return { success: false, error: error.message };
    }
}

async function getReservations() {
    try {
        const { data, error } = await window.supabaseClient
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        return { success: false, error: error.message };
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initSupabase);
