// Configuração do Supabase
const SUPABASE_CONFIG = {
    url: 'https://rxdialhyznmtteztky.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGlhbGhoeXpubXR0ZXp0a2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjA2MjEsImV4cCI6MjA3MDE5NjYyMX0.dBTMs_roLMap7De9zO_tPPxJsjdQ2RFVot0CkiOJ0pI'
};

// Variável para controlar se o Supabase foi inicializado
let supabaseInitialized = false;
let initializationPromise = null;

// Função para inicializar Supabase
function initSupabase() {
    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = new Promise((resolve, reject) => {
        // Verificar se o Supabase já está carregado
        if (window.supabase) {
            try {
                window.supabaseClient = window.supabase.createClient(
                    SUPABASE_CONFIG.url,
                    SUPABASE_CONFIG.anonKey,
                    {
                        auth: {
                            autoRefreshToken: true,
                            persistSession: true,
                            detectSessionInUrl: false
                        },
                        global: {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    }
                );
                supabaseInitialized = true;
                console.log('✅ Supabase conectado com sucesso!');
                resolve(window.supabaseClient);
            } catch (error) {
                console.error('❌ Erro ao criar cliente Supabase:', JSON.stringify(error, null, 2));
                reject(error);
            }
            return;
        }

        // Carregar Supabase via CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@supabase/supabase-js@2';
        
        script.onload = () => {
            try {
                if (!window.supabase) {
                    throw new Error('Supabase não foi carregado corretamente');
                }

                window.supabaseClient = window.supabase.createClient(
                    SUPABASE_CONFIG.url,
                    SUPABASE_CONFIG.anonKey,
                    {
                        auth: {
                            autoRefreshToken: true,
                            persistSession: true,
                            detectSessionInUrl: false
                        },
                        global: {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    }
                );

                supabaseInitialized = true;
                console.log('✅ Supabase conectado com sucesso via CDN!');
                resolve(window.supabaseClient);
            } catch (error) {
                console.error('❌ Erro ao criar cliente Supabase:', JSON.stringify(error, null, 2));
                reject(error);
            }
        };
        
        script.onerror = () => {
            const error = new Error('❌ Falha ao carregar biblioteca Supabase via CDN');
            console.error(error);
            reject(error);
        };
        
        document.head.appendChild(script);
    });

    return initializationPromise;
}

// Função para aguardar inicialização
async function waitForSupabase() {
    if (supabaseInitialized && window.supabaseClient && window.supabaseClient.auth && window.supabaseClient.from) {
        return window.supabaseClient;
    }

    try {
        const client = await initSupabase();

        // Validar que o cliente tem todas as funções necessárias
        if (!client || !client.auth || !client.from) {
            throw new Error('Cliente Supabase incompleto - faltam métodos essenciais');
        }

        // Validar que as funções de auth estão disponíveis
        if (typeof client.auth.getUser !== 'function' || typeof client.auth.signInWithPassword !== 'function') {
            throw new Error('Métodos de autenticação não estão disponíveis');
        }

        console.log('✅ Cliente Supabase validado e pronto para uso');
        return client;
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', JSON.stringify(error, null, 2));
        throw error;
    }
}

// Funções para reservas com tratamento de erro aprimorado
async function saveReservation(reservationData) {
    try {
        const client = await waitForSupabase();
        const { data, error } = await client
            .from('reservations')
            .insert([reservationData]);
        
        if (error) {
            console.error('❌ Erro do Supabase ao salvar reserva:', JSON.stringify(error, null, 2));
            throw error;
        }
        return { success: true, data };
    } catch (error) {
        console.error('❌ Erro ao salvar reserva:', JSON.stringify(error, null, 2));
        return { success: false, error: error.message };
    }
}

async function getReservations() {
    try {
        const client = await waitForSupabase();
        const { data, error } = await client
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Erro do Supabase ao buscar reservas:', JSON.stringify(error, null, 2));
            throw error;
        }
        return { success: true, data };
    } catch (error) {
        console.error('❌ Erro ao buscar reservas:', JSON.stringify(error, null, 2));
        return { success: false, error: error.message };
    }
}

// Função de teste de conexão
async function testConnection() {
    try {
        const client = await waitForSupabase();
        const { data, error } = await client
            .from('landing_sections')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Erro na conexão de teste:', JSON.stringify(error, null, 2));
            return false;
        }
        
        console.log('Conexão com Supabase testada com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Falha no teste de conexão:', JSON.stringify(error, null, 2));
        return false;
    }
}

// Inicializar automaticamente quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Iniciando inicialização do Supabase...');
        await initSupabase();
        console.log('✅ Supabase inicializado na carga da página');

        // Teste de conexão após delay
        setTimeout(async () => {
            console.log('🔍 Testando conexão com Supabase...');
            const connected = await testConnection();
            if (!connected) {
                console.warn('⚠️ Problema na conexão com Supabase detectado');
            } else {
                console.log('✅ Conexão com Supabase funcionando corretamente');
            }
        }, 1500);

    } catch (error) {
        console.error('❌ Erro na inicialização do Supabase:', JSON.stringify(error, null, 2));
    }
});

// Exportar para uso global
window.waitForSupabase = waitForSupabase;
window.testConnection = testConnection;
