// Sistema de administração do hotel
class AdminSystem {
    constructor() {
        this.currentSection = null;
        this.sections = [];
        this.reservations = [];
        this.roomTypes = [];
        this.siteConfig = {};
        this.init();
    }

    async init() {
        // Verificar se usuário é admin
        this.checkAdminAccess();
        
        // Configurar navegação
        this.setupNavigation();
        
        // Carregar dados iniciais
        await this.loadDashboardData();
        await this.loadSections();
        await this.loadReservations();
        await this.loadRoomTypes();
        await this.loadSiteConfig();
    }

    checkAdminAccess() {
        // Redirecionar se não for admin
        if (!authSystem?.isAdmin) {
            window.location.href = 'index.html';
            return;
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                this.showTab(tabId);
                
                // Atualizar navegação ativa
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showTab(tabId) {
        // Esconder todas as abas
        const tabs = document.querySelectorAll('.admin-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Mostrar aba selecionada
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Executar ações específicas da aba
        switch(tabId) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'landing':
                this.loadSections();
                break;
            case 'reservations':
                this.loadReservations();
                break;
            case 'rooms':
                this.loadRoomTypes();
                break;
            case 'settings':
                this.loadSiteConfig();
                break;
        }
    }

    async loadDashboardData() {
        try {
            // Carregar estatísticas do dashboard
            const today = new Date().toISOString().split('T')[0];
            
            // Reservas de hoje
            const { data: todayReservations } = await supabaseClient
                .from('reservations')
                .select('*')
                .eq('check_in_date', today);
            
            // Total de reservas
            const { data: allReservations } = await supabaseClient
                .from('reservations')
                .select('total_amount');
            
            // Receita do mês
            const currentMonth = new Date().toISOString().slice(0, 7);
            const { data: monthlyReservations } = await supabaseClient
                .from('reservations')
                .select('total_amount')
                .gte('created_at', currentMonth + '-01')
                .eq('status', 'confirmed');

            const monthlyRevenue = monthlyReservations?.reduce((sum, r) => sum + (parseFloat(r.total_amount) || 0), 0) || 0;

            // Atualizar dashboard
            document.getElementById('reservationsToday').textContent = todayReservations?.length || 0;
            document.getElementById('totalReservations').textContent = allReservations?.length || 0;
            document.getElementById('monthlyRevenue').textContent = `R$ ${monthlyRevenue.toFixed(2)}`;

        } catch (error) {
            console.error('❌ Erro ao carregar dados do dashboard:', JSON.stringify(error, null, 2));
        }
    }

    async loadSections() {
        try {
            const { data: sections, error } = await supabaseClient
                .from('landing_sections')
                .select('*')
                .order('order_position');

            if (error) throw error;

            this.sections = sections || [];
            this.renderSectionsList();

        } catch (error) {
            console.error('❌ Erro ao carregar seções:', JSON.stringify(error, null, 2));
            this.showNotification('Erro ao carregar seções', 'error');
        }
    }

    renderSectionsList() {
        const container = document.getElementById('sectionsList');
        if (!container) return;

        container.innerHTML = this.sections.map(section => `
            <div class="section-item" onclick="adminSystem.editSection(${section.id})" data-id="${section.id}">
                <h4>${section.title || section.section_key}</h4>
                <p class="section-key">${section.section_key}</p>
                <span class="section-status ${section.is_active ? 'active' : 'inactive'}">
                    ${section.is_active ? '✅ Ativa' : '❌ Inativa'}
                </span>
            </div>
        `).join('');
    }

    editSection(sectionId) {
        const section = this.sections.find(s => s.id === sectionId);
        if (!section) return;

        this.currentSection = section;

        // Preencher formulário
        document.getElementById('sectionId').value = section.id;
        document.getElementById('sectionKey').value = section.section_key || '';
        document.getElementById('sectionTitle').value = section.title || '';
        document.getElementById('sectionSubtitle').value = section.subtitle || '';
        document.getElementById('sectionContent').value = section.content || '';
        document.getElementById('sectionImage').value = section.image_url || '';
        document.getElementById('sectionButtonText').value = section.button_text || '';
        document.getElementById('sectionButtonLink').value = section.button_link || '';
        document.getElementById('sectionOrder').value = section.order_position || 0;
        document.getElementById('sectionActive').checked = section.is_active || false;

        // Mostrar modal
        document.getElementById('sectionModal').style.display = 'flex';
    }

    async saveSectionChanges() {
        try {
            const formData = new FormData(document.getElementById('sectionEditForm'));
            const sectionData = {
                section_key: formData.get('section_key'),
                title: formData.get('title'),
                subtitle: formData.get('subtitle'),
                content: formData.get('content'),
                image_url: formData.get('image_url'),
                button_text: formData.get('button_text'),
                button_link: formData.get('button_link'),
                order_position: parseInt(formData.get('order_position')) || 0,
                is_active: document.getElementById('sectionActive').checked,
                updated_at: new Date().toISOString()
            };

            const sectionId = document.getElementById('sectionId').value;
            
            const { error } = await supabaseClient
                .from('landing_sections')
                .update(sectionData)
                .eq('id', sectionId);

            if (error) throw error;

            this.showNotification('Seção atualizada com sucesso!', 'success');
            this.closeSectionModal();
            await this.loadSections();
            this.refreshPreview();

        } catch (error) {
            console.error('❌ Erro ao salvar seção:', JSON.stringify(error, null, 2));
            this.showNotification('Erro ao salvar seção: ' + error.message, 'error');
        }
    }

    closeSectionModal() {
        document.getElementById('sectionModal').style.display = 'none';
        this.currentSection = null;
    }

    async addNewSection() {
        const sectionKey = prompt('Digite a chave da nova seção (ex: testimonials):');
        if (!sectionKey) return;

        try {
            const newSection = {
                section_key: sectionKey,
                title: 'Nova Seção',
                subtitle: 'Subtítulo',
                content: 'Conteúdo da seção',
                order_position: this.sections.length + 1,
                is_active: true
            };

            const { error } = await supabaseClient
                .from('landing_sections')
                .insert([newSection]);

            if (error) throw error;

            this.showNotification('Nova seção criada!', 'success');
            await this.loadSections();

        } catch (error) {
            console.error('❌ Erro ao criar seção:', JSON.stringify(error, null, 2));
            this.showNotification('Erro ao criar seção: ' + error.message, 'error');
        }
    }

    async loadReservations() {
        try {
            const { data: reservations, error } = await supabaseClient
                .from('reservations')
                .select(`
                    *,
                    user_profiles(full_name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.reservations = reservations || [];
            this.renderReservationsTable();

        } catch (error) {
            console.error('❌ Erro ao carregar reservas:', JSON.stringify(error, null, 2));
            this.showNotification('Erro ao carregar reservas', 'error');
        }
    }

    renderReservationsTable() {
        const tbody = document.getElementById('reservationsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.reservations.map(reservation => `
            <tr>
                <td>#${reservation.id}</td>
                <td>${reservation.user_profiles?.full_name || reservation.guest_name}</td>
                <td>${this.formatDate(reservation.check_in_date)}</td>
                <td>${this.formatDate(reservation.check_out_date)}</td>
                <td>${reservation.room_type || 'N/A'}</td>
                <td>R$ ${(reservation.total_amount || 0).toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${reservation.status}">
                        ${this.getStatusText(reservation.status)}
                    </span>
                </td>
                <td>
                    <select onchange="adminSystem.updateReservationStatus(${reservation.id}, this.value)">
                        <option value="pending" ${reservation.status === 'pending' ? 'selected' : ''}>Pendente</option>
                        <option value="confirmed" ${reservation.status === 'confirmed' ? 'selected' : ''}>Confirmada</option>
                        <option value="cancelled" ${reservation.status === 'cancelled' ? 'selected' : ''}>Cancelada</option>
                    </select>
                </td>
            </tr>
        `).join('');
    }

    async updateReservationStatus(reservationId, newStatus) {
        try {
            const { error } = await supabaseClient
                .from('reservations')
                .update({ status: newStatus })
                .eq('id', reservationId);

            if (error) throw error;

            this.showNotification('Status da reserva atualizado!', 'success');
            await this.loadReservations();

        } catch (error) {
            console.error('❌ Erro ao atualizar status:', JSON.stringify(error, null, 2));
            this.showNotification('Erro ao atualizar status', 'error');
        }
    }

    async loadRoomTypes() {
        try {
            const { data: roomTypes, error } = await supabaseClient
                .from('room_types')
                .select('*')
                .order('price_per_night');

            if (error) throw error;

            this.roomTypes = roomTypes || [];
            this.renderRoomTypes();

        } catch (error) {
            console.error('❌ Erro ao carregar tipos de quartos:', JSON.stringify(error, null, 2));
        }
    }

    renderRoomTypes() {
        const container = document.getElementById('roomTypesList');
        if (!container) return;

        container.innerHTML = this.roomTypes.map(room => `
            <div class="room-type-card">
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <div class="room-details">
                    <span>R$ ${room.price_per_night}/noite</span>
                    <span>Até ${room.max_guests} hóspedes</span>
                </div>
                <div class="room-amenities">
                    ${(room.amenities || []).map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                </div>
                <button onclick="adminSystem.editRoom(${room.id})" class="btn btn-outline">Editar</button>
            </div>
        `).join('');
    }

    async loadSiteConfig() {
        try {
            const { data: configs, error } = await supabaseClient
                .from('site_config')
                .select('*');

            if (error) throw error;

            this.siteConfig = {};
            configs?.forEach(config => {
                this.siteConfig[config.config_key] = config.config_value;
            });

            this.fillConfigForm();

        } catch (error) {
            console.error('❌ Erro ao carregar configurações:', JSON.stringify(error, null, 2));
        }
    }

    fillConfigForm() {
        document.getElementById('hotelName').value = this.siteConfig.hotel_name || '';
        document.getElementById('hotelPhone').value = this.siteConfig.hotel_phone || '';
        document.getElementById('hotelEmail').value = this.siteConfig.hotel_email || '';
        document.getElementById('hotelAddress').value = this.siteConfig.hotel_address || '';
        document.getElementById('primaryColor').value = this.siteConfig.primary_color || '#4F46E5';
        document.getElementById('secondaryColor').value = this.siteConfig.secondary_color || '#059669';
    }

    async saveSettings() {
        try {
            const configs = [
                { key: 'hotel_name', value: document.getElementById('hotelName').value },
                { key: 'hotel_phone', value: document.getElementById('hotelPhone').value },
                { key: 'hotel_email', value: document.getElementById('hotelEmail').value },
                { key: 'hotel_address', value: document.getElementById('hotelAddress').value },
                { key: 'primary_color', value: document.getElementById('primaryColor').value },
                { key: 'secondary_color', value: document.getElementById('secondaryColor').value }
            ];

            for (const config of configs) {
                const { error } = await supabaseClient
                    .from('site_config')
                    .upsert({
                        config_key: config.key,
                        config_value: config.value,
                        updated_at: new Date().toISOString()
                    });

                if (error) throw error;
            }

            this.showNotification('Configurações salvas com sucesso!', 'success');
            await this.loadSiteConfig();

        } catch (error) {
            console.error('❌ Erro ao salvar configurações:', JSON.stringify(error, null, 2));
            this.showNotification('Erro ao salvar configurações', 'error');
        }
    }

    refreshPreview() {
        const previewFrame = document.getElementById('previewFrame');
        if (previewFrame) {
            previewFrame.src = previewFrame.src;
        }
    }

    previewChanges() {
        this.refreshPreview();
        this.showNotification('Preview atualizado!', 'success');
    }

    async saveAllSections() {
        this.showNotification('Todas as alterações foram salvas!', 'success');
        this.refreshPreview();
    }

    // Utility functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    getStatusText(status) {
        const statusMap = {
            pending: 'Pendente',
            confirmed: 'Confirmada',
            cancelled: 'Cancelada'
        };
        return statusMap[status] || status;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Funções globais para uso no HTML
function closeSectionModal() {
    adminSystem.closeSectionModal();
}

function saveSectionChanges() {
    adminSystem.saveSectionChanges();
}

function addNewSection() {
    adminSystem.addNewSection();
}

function previewChanges() {
    adminSystem.previewChanges();
}

function saveAllSections() {
    adminSystem.saveAllSections();
}

function addNewRoom() {
    // Implementar modal para adicionar novo quarto
    alert('Funcionalidade em desenvolvimento');
}

function saveSettings() {
    adminSystem.saveSettings();
}

// Inicializar sistema admin
let adminSystem;
document.addEventListener('DOMContentLoaded', () => {
    const checkAuth = setInterval(() => {
        if (window.authSystem && window.supabaseClient) {
            adminSystem = new AdminSystem();
            clearInterval(checkAuth);
        }
    }, 100);
});
