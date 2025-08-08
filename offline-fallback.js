// Sistema de fallback offline para demonstração quando Supabase não funciona
class OfflineFallback {
    constructor() {
        this.isOfflineMode = false;
        this.users = [
            {
                id: 'admin-1',
                email: 'admin@hotel.com',
                password: '123456',
                full_name: 'Administrador do Hotel',
                is_admin: true
            },
            {
                id: 'user-1',
                email: 'cliente@hotel.com',
                password: '123456',
                full_name: 'Cliente Teste',
                is_admin: false
            }
        ];
        this.currentUser = null;
        this.sections = [
            {
                id: 1,
                section_key: 'hero',
                title: 'Hospede-se no coração da natureza',
                subtitle: 'Descubra a perfeita harmonia entre conforto e natureza no Hotel Serra do Roncador',
                content: 'Uma experiência única de hospedagem no coração do Mato Grosso.',
                order_position: 1,
                is_active: true
            },
            {
                id: 2,
                section_key: 'about',
                title: 'O Hotel Serra do Roncador',
                subtitle: 'Uma experiência única de hospedagem no coração do Mato Grosso',
                content: 'Localizado estrategicamente à margem da BR 158, a apenas 1000 metros do centro de Água Boa - MT.',
                order_position: 2,
                is_active: true
            }
        ];
        this.siteConfig = {
            hotel_name: 'Hotel Serra do Roncador',
            hotel_phone: '(66) 3468-2001',
            hotel_email: 'reservas@serradoncador.com.br',
            hotel_address: 'BR 158 - Água Boa, MT',
            primary_color: '#B8341C',
            secondary_color: '#D4581F'
        };
        this.reservations = [];
    }

    enableOfflineMode() {
        this.isOfflineMode = true;
        console.log('🔄 Modo offline ativado - usando dados de demonstração');
        
        // Substituir funções do Supabase
        this.setupOfflineFunctions();
        
        // Mostrar notificação
        this.showOfflineNotification();
    }

    setupOfflineFunctions() {
        // Substituir sistema de auth
        window.supabaseClientOffline = {
            auth: {
                signInWithPassword: (credentials) => this.offlineLogin(credentials),
                signUp: (credentials) => this.offlineRegister(credentials),
                getUser: () => this.offlineGetUser(),
                signOut: () => this.offlineLogout()
            },
            from: (table) => ({
                select: (fields) => ({
                    eq: (field, value) => ({
                        single: () => this.offlineSelect(table, fields, field, value, true),
                        limit: (n) => this.offlineSelect(table, fields, field, value, false, n)
                    }),
                    order: (field, options) => this.offlineSelect(table, fields, null, null, false, null, field, options),
                    limit: (n) => this.offlineSelect(table, fields, null, null, false, n)
                }),
                insert: (data) => this.offlineInsert(table, data),
                update: (data) => ({
                    eq: (field, value) => this.offlineUpdate(table, data, field, value)
                })
            })
        };

        // Substituir cliente global se não existe
        if (!window.supabaseClient) {
            window.supabaseClient = window.supabaseClientOffline;
        }
    }

    async offlineLogin(credentials) {
        await this.delay(500); // Simular latência
        
        const user = this.users.find(u => 
            u.email === credentials.email && u.password === credentials.password
        );
        
        if (!user) {
            throw new Error('Invalid login credentials');
        }
        
        this.currentUser = user;
        localStorage.setItem('offline_user', JSON.stringify(user));
        
        return {
            data: { user },
            error: null
        };
    }

    async offlineRegister(credentials) {
        await this.delay(500);
        
        const existingUser = this.users.find(u => u.email === credentials.email);
        if (existingUser) {
            throw new Error('User already registered');
        }
        
        const newUser = {
            id: 'user-' + Date.now(),
            email: credentials.email,
            password: credentials.password,
            full_name: credentials.options?.data?.full_name || 'Usuário',
            is_admin: false
        };
        
        this.users.push(newUser);
        
        return {
            data: { user: newUser },
            error: null
        };
    }

    async offlineGetUser() {
        const savedUser = localStorage.getItem('offline_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            return {
                data: { user: this.currentUser },
                error: null
            };
        }
        
        return {
            data: { user: null },
            error: null
        };
    }

    async offlineLogout() {
        this.currentUser = null;
        localStorage.removeItem('offline_user');
        return { error: null };
    }

    async offlineSelect(table, fields, filterField, filterValue, single = false, limit = null, orderField = null, orderOptions = null) {
        await this.delay(200);
        
        let data = [];
        
        switch(table) {
            case 'landing_sections':
                data = [...this.sections];
                break;
            case 'site_config':
                data = Object.keys(this.siteConfig).map(key => ({
                    config_key: key,
                    config_value: this.siteConfig[key]
                }));
                break;
            case 'user_profiles':
                if (this.currentUser) {
                    data = [{
                        id: this.currentUser.id,
                        full_name: this.currentUser.full_name,
                        is_admin: this.currentUser.is_admin
                    }];
                }
                break;
            case 'reservations':
                data = [...this.reservations];
                break;
            case 'room_types':
                data = [
                    {
                        id: 1,
                        name: 'Quarto Standard',
                        description: 'Quarto confortável com todas as comodidades básicas',
                        price_per_night: 150.00,
                        max_guests: 2
                    },
                    {
                        id: 2,
                        name: 'Quarto Deluxe',
                        description: 'Quarto espaçoso com vista para o mar',
                        price_per_night: 250.00,
                        max_guests: 3
                    }
                ];
                break;
        }
        
        // Aplicar filtro
        if (filterField && filterValue !== undefined) {
            data = data.filter(item => item[filterField] === filterValue);
        }
        
        // Aplicar ordenação
        if (orderField) {
            data.sort((a, b) => {
                const aVal = a[orderField];
                const bVal = b[orderField];
                if (orderOptions?.ascending === false) {
                    return bVal > aVal ? 1 : -1;
                }
                return aVal > bVal ? 1 : -1;
            });
        }
        
        // Aplicar limite
        if (limit) {
            data = data.slice(0, limit);
        }
        
        if (single) {
            return {
                data: data[0] || null,
                error: null
            };
        }
        
        return {
            data,
            error: null
        };
    }

    async offlineInsert(table, insertData) {
        await this.delay(300);
        
        const data = Array.isArray(insertData) ? insertData : [insertData];
        
        switch(table) {
            case 'reservations':
                data.forEach(item => {
                    item.id = this.reservations.length + 1;
                    item.created_at = new Date().toISOString();
                    this.reservations.push(item);
                });
                break;
        }
        
        return {
            data,
            error: null
        };
    }

    async offlineUpdate(table, updateData, filterField, filterValue) {
        await this.delay(300);
        
        switch(table) {
            case 'landing_sections':
                const section = this.sections.find(s => s[filterField] === filterValue);
                if (section) {
                    Object.assign(section, updateData);
                }
                break;
        }
        
        return {
            data: updateData,
            error: null
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showOfflineNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2563eb;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 0.9rem;
            max-width: 90%;
        `;
        
        notification.innerHTML = `
            🔄 <strong>Modo Demonstração Ativado</strong><br>
            Usando dados locais (Supabase indisponível)<br>
            <small>Login: admin@hotel.com / 123456</small>
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 10 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    // Método para testar conectividade
    async testSupabaseConnection() {
        try {
            const response = await fetch('https://rxdialhyznmtteztky.supabase.co/rest/v1/', {
                method: 'HEAD',
                headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGlhbGhoeXpubXR0ZXp0a2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjA2MjEsImV4cCI6MjA3MDE5NjYyMX0.dBTMs_roLMap7De9zO_tPPxJsjdQ2RFVot0CkiOJ0pI'
                }
            });
            
            return response.ok;
        } catch (error) {
            console.log('Supabase não acessível:', error.message);
            return false;
        }
    }
}

// Instância global
window.offlineFallback = new OfflineFallback();

// Auto-detectar problemas de conectividade
async function autoDetectConnectivityIssues() {
    // Aguardar um pouco para ver se há erros
    setTimeout(async () => {
        const hasConnectionIssues = 
            !window.supabaseClient || 
            document.querySelectorAll('[class*="error"]').length > 2 ||
            localStorage.getItem('force_offline_mode') === 'true';
        
        if (hasConnectionIssues) {
            console.log('🔍 Problemas de conectividade detectados, ativando modo offline');
            window.offlineFallback.enableOfflineMode();
        } else {
            // Testar conectividade real
            const isConnected = await window.offlineFallback.testSupabaseConnection();
            if (!isConnected) {
                console.log('🔍 Supabase inacessível, ativando modo offline');
                window.offlineFallback.enableOfflineMode();
            }
        }
    }, 2000);
}

// Função para forçar modo offline
window.forceOfflineMode = function() {
    localStorage.setItem('force_offline_mode', 'true');
    window.offlineFallback.enableOfflineMode();
    console.log('Modo offline forçado e salvo');
};

// Função para voltar ao modo online
window.enableOnlineMode = function() {
    localStorage.removeItem('force_offline_mode');
    location.reload();
};

// Inicializar detecção automática
document.addEventListener('DOMContentLoaded', autoDetectConnectivityIssues);

// Tratar erros não capturados
window.addEventListener('error', (event) => {
    if (event.error && event.error.message && 
        (event.error.message.includes('Failed to fetch') || 
         event.error.message.includes('NetworkError'))) {
        console.log('🔍 Erro de rede detectado, considerando modo offline');
        // Não ativar automaticamente aqui para evitar loop
    }
});

// Melhorar logs de erro
const originalConsoleError = console.error;
console.error = function(...args) {
    // Converter objetos para strings legíveis
    const processedArgs = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
            try {
                return JSON.stringify(arg, null, 2);
            } catch {
                return '[Objeto não serializável]';
            }
        }
        return arg;
    });
    
    originalConsoleError.apply(console, processedArgs);
};
