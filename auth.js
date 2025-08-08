// Sistema de autenticação com Supabase
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.init();
    }

    async init() {
        try {
            // Aguardar inicialização do Supabase
            const client = await waitForSupabase();

            if (!client || !client.auth) {
                throw new Error('Cliente Supabase não foi inicializado corretamente');
            }

            // Verificar se há usuário logado
            const { data: { user }, error } = await client.auth.getUser();
            if (error) {
                console.error('❌ Erro ao verificar usuário logado:', JSON.stringify(error, null, 2));
            } else if (user) {
                await this.setCurrentUser(user);
            }

            // Escutar mudanças na autenticação
            if (typeof client.auth.onAuthStateChange === 'function') {
                client.auth.onAuthStateChange(async (event, session) => {
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
            } else {
                console.warn('⚠️ onAuthStateChange não está disponível no cliente Supabase');
            }

            this.updateUI();
            console.log('✅ Sistema de autenticação inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro na inicialização do sistema de autenticação:', JSON.stringify(error, null, 2));
            this.showNotification('Erro ao conectar com o servidor. Tente novamente.', 'error');
        }
    }

    async setCurrentUser(user) {
        this.currentUser = user;

        // Verificar se é admin
        try {
            const client = await waitForSupabase();
            const { data: profile, error } = await client
                .from('user_profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('❌ Erro ao verificar perfil admin:', JSON.stringify(error, null, 2));
                this.isAdmin = false;
            } else {
                this.isAdmin = profile?.is_admin || false;
            }
        } catch (error) {
            console.error('❌ Erro ao verificar perfil admin:', JSON.stringify(error, null, 2));
            this.isAdmin = false;
        }

        this.updateUI();
    }

    async login(email, password) {
        try {
            const client = await waitForSupabase();
            const { data, error } = await client.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error('Erro de login:', error);
                throw error;
            }
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Erro no login:', error);
            let errorMessage = 'Erro no login';

            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'Email ou senha incorretos';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Erro de conexão. Verifique sua internet.';
            } else {
                errorMessage = 'Erro no login: ' + error.message;
            }

            this.showNotification(errorMessage, 'error');
            return { success: false, error: error.message };
        }
    }

    async register(email, password, fullName) {
        try {
            const client = await waitForSupabase();
            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) {
                console.error('Erro de registro:', error);
                throw error;
            }

            this.showNotification('Conta criada! Verifique seu email para confirmar.', 'success');
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Erro no registro:', error);
            let errorMessage = 'Erro no registro';

            if (error.message.includes('User already registered')) {
                errorMessage = 'Este email já está cadastrado';
            } else if (error.message.includes('Password should be')) {
                errorMessage = 'A senha deve ter pelo menos 6 caracteres';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Erro de conexão. Verifique sua internet.';
            } else {
                errorMessage = 'Erro no registro: ' + error.message;
            }

            this.showNotification(errorMessage, 'error');
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            const client = await waitForSupabase();
            const { error } = await client.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Erro no logout:', error);
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
    // Aguardar Supabase carregar com timeout
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos no máximo

    const checkSupabase = setInterval(() => {
        attempts++;
        if (window.supabaseClient) {
            authSystem = new AuthSystem();
            clearInterval(checkSupabase);
            console.log('✅ AuthSystem inicializado após', attempts, 'tentativas');
        } else if (attempts >= maxAttempts) {
            clearInterval(checkSupabase);
            console.error('❌ Timeout ao aguardar inicialização do Supabase');
            authSystem = new AuthSystem(); // Tentar inicializar mesmo assim
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
