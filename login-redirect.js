// Sistema de login simplificado que redireciona sempre para página dedicada
// Para evitar problemas de conectividade complexos

function setupSimpleLogin() {
    // Substituir todos os botões de login para redirecionar
    const loginButtons = document.querySelectorAll('#loginBtn, .btn-login, [onclick*="login"]');
    
    loginButtons.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'login-simple.html';
        };
    });
    
    // Substituir função showLoginModal
    window.showLoginModal = function() {
        window.location.href = 'login-simple.html';
    };
    
    // Substituir função showReservationForm
    window.showReservationForm = function() {
        // Verificar se há um token de sessão simples
        const hasSession = localStorage.getItem('simple_auth_token');
        
        if (hasSession) {
            window.location.href = 'cliente.html#new-reservation';
        } else {
            window.location.href = 'login-simple.html';
        }
    };
    
    console.log('Sistema de login simplificado ativado - sempre redireciona para página dedicada');
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
