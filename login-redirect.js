// Sistema de login simplificado que redireciona sempre para página dedicada
// Para evitar problemas de conectividade complexos

function setupSimpleLogin() {
    // Verificar se há muitos erros - usar login garantido
    const errorCount = (console.error.errorCount || 0);
    const targetLogin = errorCount > 5 ? 'login-working.html' : 'login-simple.html';

    // Substituir todos os botões de login para redirecionar
    const loginButtons = document.querySelectorAll('#loginBtn, .btn-login, [onclick*="login"]');

    loginButtons.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            window.location.href = targetLogin;
        };
    });

    // Substituir função showLoginModal
    window.showLoginModal = function() {
        window.location.href = targetLogin;
    };

    // Substituir função showReservationForm
    window.showReservationForm = function() {
        // Verificar se há um token de sessão simples
        const hasSession = localStorage.getItem('demo_logged_in') === 'true' ||
                          localStorage.getItem('simple_auth_token');

        if (hasSession) {
            window.location.href = 'cliente.html#new-reservation';
        } else {
            window.location.href = targetLogin;
        }
    };

    console.log(`Sistema de login simplificado ativado - redirecionando para ${targetLogin}`);
}

// Detectar erros de rede automaticamente
let networkErrorCount = 0;
const originalConsoleError = console.error;

console.error = function(...args) {
    const errorMessage = args.join(' ');

    if (errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('AuthRetryableFetchError')) {
        networkErrorCount++;

        if (networkErrorCount >= 3) {
            console.log('🚨 Muitos erros de rede detectados, forçando login garantido');

            // Substituir todos os links de login
            setTimeout(() => {
                const loginLinks = document.querySelectorAll('a[href*="login"]');
                loginLinks.forEach(link => {
                    if (link.href.includes('login-simple.html')) {
                        link.href = 'login-working.html';
                    }
                });

                // Mostrar sugestão
                showNetworkErrorSuggestion();
            }, 1000);
        }
    }

    originalConsoleError.apply(console, args);
};

function showNetworkErrorSuggestion() {
    const suggestion = document.createElement('div');
    suggestion.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    suggestion.innerHTML = `
        <strong>⚠️ Problemas de Conectividade</strong><br>
        <small>Use o login garantido para melhor experiência</small><br>
        <button onclick="window.location.href='login-working.html'"
                style="background: white; color: #dc3545; border: none;
                       padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem; cursor: pointer;">
            Ir para Login Garantido
        </button>
        <button onclick="this.parentElement.remove()"
                style="background: transparent; border: none; color: white;
                       float: right; cursor: pointer; font-size: 1.2rem;">✕</button>
    `;

    document.body.appendChild(suggestion);

    // Auto-remover após 10 segundos
    setTimeout(() => {
        if (suggestion.parentElement) {
            suggestion.remove();
        }
    }, 10000);
}

// Ativar sistema simplificado quando página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco e verificar se há problemas
    setTimeout(() => {
        // Se há muitos erros no console ou problemas de conectividade
        if (document.querySelectorAll('.notification-error').length > 0 || 
            !window.supabaseClient || 
            !window.supabase) {
            console.log('Detectados problemas de conectividade, ativando sistema simplificado');
            setupSimpleLogin();
        }
    }, 3000);
});

// Função para forçar modo simplificado
window.forceSimpleMode = function() {
    setupSimpleLogin();
    localStorage.setItem('force_simple_mode', 'true');
    console.log('Modo simplificado forçado e salvo');
};

// Verificar se modo simplificado está forçado
if (localStorage.getItem('force_simple_mode') === 'true') {
    document.addEventListener('DOMContentLoaded', setupSimpleLogin);
}
