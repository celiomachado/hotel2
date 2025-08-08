// Sistema agressivo para forçar modo offline quando há problemas de conectividade
(function() {
    'use strict';
    
    let offlineModeForced = false;
    let errorCount = 0;
    const MAX_ERRORS = 3;
    
    // Interceptar fetch global para detectar erros
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).catch(error => {
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                handleNetworkError();
            }
            throw error;
        });
    };
    
    // Interceptar console.error para detectar erros do Supabase
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const errorMessage = args.join(' ');
        
        if (errorMessage.includes('Failed to fetch') || 
            errorMessage.includes('AuthRetryableFetchError') ||
            errorMessage.includes('AuthSessionMissingError') ||
            errorMessage.includes('[object Object]')) {
            handleNetworkError();
        }
        
        // Melhorar visualização de objetos
        const processedArgs = args.map(arg => {
            if (typeof arg === 'object' && arg !== null && arg.toString() === '[object Object]') {
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
    
    // Interceptar erros não capturados
    window.addEventListener('error', function(event) {
        if (event.error && event.error.message) {
            const message = event.error.message;
            if (message.includes('Failed to fetch') || 
                message.includes('NetworkError') ||
                message.includes('AuthRetryableFetchError')) {
                handleNetworkError();
            }
        }
    });
    
    // Interceptar promessas rejeitadas
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message) {
            const message = event.reason.message;
            if (message.includes('Failed to fetch') || 
                message.includes('NetworkError') ||
                message.includes('AuthRetryableFetchError')) {
                handleNetworkError();
                event.preventDefault(); // Evitar log adicional
            }
        }
    });
    
    function handleNetworkError() {
        errorCount++;
        
        if (errorCount >= MAX_ERRORS && !offlineModeForced) {
            console.log(`🚨 ${errorCount} erros de rede detectados. Forçando modo offline...`);
            forceOfflineModeNow();
        }
    }
    
    function forceOfflineModeNow() {
        if (offlineModeForced) return;
        
        offlineModeForced = true;
        
        // Marcar no localStorage
        localStorage.setItem('force_offline_mode', 'true');
        localStorage.setItem('offline_forced_reason', 'network_errors');
        
        // Ativar sistema offline se disponível
        if (window.offlineFallback) {
            window.offlineFallback.enableOfflineMode();
        }
        
        // Substituir cliente Supabase imediatamente
        createOfflineSupabaseClient();
        
        // Mostrar notificação grande
        showOfflineNotification();
        
        // Recarregar sistemas que dependem do Supabase
        restartSystemsInOfflineMode();
    }
    
    function createOfflineSupabaseClient() {
        // Dados offline
        const offlineUsers = [
            {
                id: 'admin-demo',
                email: 'admin@hotel.com',
                password: '123456',
                user_metadata: { full_name: 'Administrador Demo' },
                is_admin: true
            },
            {
                id: 'cliente-demo',
                email: 'cliente@hotel.com', 
                password: '123456',
                user_metadata: { full_name: 'Cliente Demo' },
                is_admin: false
            }
        ];
        
        let currentOfflineUser = null;
        
        // Cliente Supabase simulado
        window.supabaseClient = {
            auth: {
                signInWithPassword: async ({ email, password }) => {
                    await new Promise(resolve => setTimeout(resolve, 300)); // Simular latência
                    
                    const user = offlineUsers.find(u => u.email === email && u.password === password);
                    if (!user) {
                        throw new Error('Invalid login credentials');
                    }
                    
                    currentOfflineUser = user;
                    localStorage.setItem('offline_current_user', JSON.stringify(user));
                    
                    return { data: { user }, error: null };
                },
                
                signUp: async ({ email, password, options }) => {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    const existingUser = offlineUsers.find(u => u.email === email);
                    if (existingUser) {
                        throw new Error('User already registered');
                    }
                    
                    const newUser = {
                        id: 'user-' + Date.now(),
                        email,
                        password,
                        user_metadata: { full_name: options?.data?.full_name || 'Usuário' },
                        is_admin: false
                    };
                    
                    offlineUsers.push(newUser);
                    return { data: { user: newUser }, error: null };
                },
                
                getUser: async () => {
                    const savedUser = localStorage.getItem('offline_current_user');
                    if (savedUser) {
                        currentOfflineUser = JSON.parse(savedUser);
                        return { data: { user: currentOfflineUser }, error: null };
                    }
                    return { data: { user: null }, error: null };
                },
                
                signOut: async () => {
                    currentOfflineUser = null;
                    localStorage.removeItem('offline_current_user');
                    return { error: null };
                }
            },
            
            from: (table) => ({
                select: (fields) => ({
                    eq: (field, value) => ({
                        single: async () => {
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            if (table === 'user_profiles' && currentOfflineUser) {
                                return {
                                    data: {
                                        id: currentOfflineUser.id,
                                        full_name: currentOfflineUser.user_metadata.full_name,
                                        is_admin: currentOfflineUser.is_admin
                                    },
                                    error: null
                                };
                            }
                            
                            return { data: null, error: null };
                        },
                        
                        limit: async (n) => {
                            await new Promise(resolve => setTimeout(resolve, 100));
                            return { data: [], error: null };
                        }
                    }),
                    
                    order: () => ({
                        limit: async (n) => {
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            if (table === 'landing_sections') {
                                return {
                                    data: [
                                        {
                                            id: 1,
                                            section_key: 'hero',
                                            title: 'Hospede-se no coração da natureza',
                                            subtitle: 'Hotel Serra do Roncador - Demo Offline',
                                            is_active: true
                                        }
                                    ],
                                    error: null
                                };
                            }
                            
                            return { data: [], error: null };
                        }
                    }),
                    
                    limit: async (n) => {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        return { data: [], error: null };
                    }
                }),
                
                insert: async (data) => {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    return { data, error: null };
                },
                
                update: () => ({
                    eq: async () => {
                        await new Promise(resolve => setTimeout(resolve, 200));
                        return { data: {}, error: null };
                    }
                })
            })
        };
        
        console.log('✅ Cliente Supabase offline criado com sucesso');
    }
    
    function showOfflineNotification() {
        // Remover notificação anterior se existir
        const existing = document.getElementById('offline-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.id = 'offline-notification';
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            animation: slideDown 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <strong>🔄 MODO DEMONSTRAÇÃO ATIVADO</strong><br>
                <span style="font-size: 0.9rem;">
                    Sistema funcionando offline devido a problemas de conectividade<br>
                    <strong>Login de teste:</strong> admin@hotel.com / 123456
                </span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: rgba(255,255,255,0.2); border: none; color: white; 
                               padding: 0.25rem 0.5rem; border-radius: 4px; margin-left: 1rem; cursor: pointer;">
                    ✕
                </button>
            </div>
        `;
        
        // Adicionar CSS da animação
        if (!document.getElementById('offline-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'offline-notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remover após 15 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideDown 0.5s ease-out reverse';
                setTimeout(() => notification.remove(), 500);
            }
        }, 15000);
    }
    
    function restartSystemsInOfflineMode() {
        // Reinicializar sistemas que dependem do Supabase
        setTimeout(() => {
            // Reinicializar preview da landing page
            if (window.landingPreview && window.landingPreview.init) {
                window.landingPreview.init();
            }
            
            // Reinicializar sistema de auth
            if (window.authSystem && window.authSystem.init) {
                window.authSystem.init();
            }
            
            console.log('🔄 Sistemas reinicializados em modo offline');
        }, 1000);
    }
    
    // Verificar se modo offline já foi forçado anteriormente
    if (localStorage.getItem('force_offline_mode') === 'true') {
        setTimeout(() => {
            console.log('🔄 Modo offline já estava ativo, mantendo...');
            forceOfflineModeNow();
        }, 500);
    }
    
    // Função global para forçar modo offline manualmente
    window.forceOfflineMode = function() {
        console.log('🔄 Modo offline forçado manualmente');
        forceOfflineModeNow();
    };
    
    // Função para voltar ao modo online
    window.enableOnlineMode = function() {
        localStorage.removeItem('force_offline_mode');
        localStorage.removeItem('offline_forced_reason');
        localStorage.removeItem('offline_current_user');
        location.reload();
    };
    
    console.log('🛡️ Sistema de interceptação de erros ativado');
})();
