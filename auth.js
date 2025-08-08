// Sistema de autenticação com Supabase
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.init();
    }

    async init() {
        // Verificar se há usuário logado
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            await this.setCurrentUser(user);
        }

        // Escutar mudanças na autenticação
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                await this.setCurrentUser(session.user);
                this.showNotification('Login realizado com sucesso!', 'success');
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.isAdmin = false;
                this.updateUI();
                this.showNotification('Logout realizado com sucesso!', 'info');
            }
        });

        this.updateUI();
    }

    async setCurrentUser(user) {
        this.currentUser = user;
        
        // Verificar se é admin
        try {
            const { data: profile } = await supabaseClient
                .from('user_profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single();
            
            this.isAdmin = profile?.is_admin || false;
        } catch (error) {
            console.error('Erro ao verificar perfil admin:', error);
            this.isAdmin = false;
        }

        this.updateUI();
    }

    async login(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { success: true, user: data.user };
        } catch (error) {
            this.showNotification('Erro no login: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    async register(email, password, fullName) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) throw error;
            
            this.showNotification('Conta criada! Verifique seu email para confirmar.', 'success');
            return { success: true, user: data.user };
        } catch (error) {
            this.showNotification('Erro no registro: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            this.showNotification('Erro no logout: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    updateUI() {
        // Atualizar elementos da interface
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const adminPanel = document.getElementById('adminPanel');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            // Usuário logado
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = this.currentUser.user_metadata?.full_name || this.currentUser.email;
            
            // Mostrar painel admin se for admin
            if (adminPanel) {
                adminPanel.style.display = this.isAdmin ? 'block' : 'none';
            }
        } else {
            // Usuário não logado
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
            if (adminPanel) adminPanel.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Criar notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Adicionar ao body
        document.body.appendChild(notification);

        // Remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Verificar se usuário está logado antes de fazer reserva
    checkAuthForReservation() {
        if (!this.currentUser) {
            this.showLoginModal();
            return false;
        }
        return true;
    }

    showLoginModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideLoginModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    toggleAuthMode() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authTitle = document.getElementById('authTitle');

        if (loginForm.style.display === 'none') {
            // Mostrar login
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            authTitle.textContent = 'Entrar';
        } else {
            // Mostrar registro
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            authTitle.textContent = 'Criar Conta';
        }
    }
}

// Inicializar sistema de autenticação quando Supabase estiver pronto
let authSystem;
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar Supabase carregar
    const checkSupabase = setInterval(() => {
        if (window.supabaseClient) {
            authSystem = new AuthSystem();
            clearInterval(checkSupabase);
        }
    }, 100);
});

// Funções globais para uso nos formulários
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = await authSystem.login(email, password);
    if (result.success) {
        authSystem.hideLoginModal();
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const fullName = document.getElementById('registerFullName').value;
    
    const result = await authSystem.register(email, password, fullName);
    if (result.success) {
        authSystem.hideLoginModal();
    }
}

async function handleLogout() {
    await authSystem.logout();
}

function showReservationForm() {
    if (authSystem.checkAuthForReservation()) {
        // Mostrar formulário de reserva
        document.getElementById('reservationModal').style.display = 'flex';
    }
}
