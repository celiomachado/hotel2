// Sistema do painel cliente
class ClientSystem {
    constructor() {
        this.userProfile = null;
        this.userReservations = [];
        this.roomTypes = [];
        this.currentStep = 1;
        this.reservationData = {
            checkIn: '',
            checkOut: '',
            guests: 1,
            roomType: null,
            specialRequests: ''
        };
        this.init();
    }

    async init() {
        // Verificar se usuário está logado
        this.checkUserAccess();
        
        // Configurar navegação
        this.setupNavigation();
        
        // Carregar dados do usuário
        await this.loadUserProfile();
        await this.loadUserReservations();
        await this.loadRoomTypes();
        
        // Configurar formulários
        this.setupDateValidation();
    }

    checkUserAccess() {
        // Redirecionar se não estiver logado
        if (!authSystem?.currentUser) {
            window.location.href = 'index.html';
            return;
        }

        // Atualizar nome do usuário na interface
        const userName = document.getElementById('clientUserName');
        if (userName) {
            userName.textContent = authSystem.currentUser.user_metadata?.full_name || authSystem.currentUser.email;
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
        const tabs = document.querySelectorAll('.client-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Mostrar aba selecionada
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Reset wizard se for nova reserva
        if (tabId === 'new-reservation') {
            this.resetReservationWizard();
        }
    }

    async loadUserProfile() {
        try {
            const { data: profile, error } = await supabaseClient
                .from('user_profiles')
                .select('*')
                .eq('id', authSystem.currentUser.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            this.userProfile = profile || {};
            this.fillProfileForm();

        } catch (error) {
            console.error('❌ Erro ao carregar perfil:', JSON.stringify(error, null, 2));
        }
    }

    fillProfileForm() {
        document.getElementById('fullName').value = this.userProfile.full_name || '';
        document.getElementById('email').value = authSystem.currentUser.email;
        document.getElementById('phone').value = this.userProfile.phone || '';
        document.getElementById('dateOfBirth').value = this.userProfile.date_of_birth || '';
    }

    async saveProfile() {
        try {
            const profileData = {
                id: authSystem.currentUser.id,
                full_name: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                date_of_birth: document.getElementById('dateOfBirth').value || null,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabaseClient
                .from('user_profiles')
                .upsert(profileData);

            if (error) throw error;

            this.userProfile = profileData;
            this.showNotification('Perfil atualizado com sucesso!', 'success');

        } catch (error) {
            console.error('❌ Erro ao salvar perfil:', JSON.stringify(error, null, 2));
            this.showNotification('Erro ao salvar perfil: ' + error.message, 'error');
        }
    }

    async loadUserReservations() {
        try {
            const { data: reservations, error } = await supabaseClient
                .from('reservations')
                .select('*')
                .eq('user_id', authSystem.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.userReservations = reservations || [];
            this.renderReservations();

        } catch (error) {
            console.error('❌ Erro ao carregar reservas:', JSON.stringify(error, null, 2));
        }
    }

    renderReservations() {
        const container = document.getElementById('reservationsList');
        if (!container) return;

        if (this.userReservations.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="padding: 3rem;">
                    <h3>Nenhuma reserva encontrada</h3>
                    <p>Você ainda não fez nenhuma reserva.</p>
                    <button onclick="clientSystem.showTab('new-reservation')" class="btn btn-primary">Fazer Primeira Reserva</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.userReservations.map(reservation => `
            <div class="reservation-card">
                <div class="reservation-header">
                    <span class="reservation-id">Reserva #${reservation.id}</span>
                    <span class="reservation-status status-${reservation.status}">
                        ${this.getStatusText(reservation.status)}
                    </span>
                </div>
                <div class="reservation-details">
                    <div class="detail-item">
                        <span class="detail-label">Check-in</span>
                        <span class="detail-value">${this.formatDate(reservation.check_in_date)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Check-out</span>
                        <span class="detail-value">${this.formatDate(reservation.check_out_date)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Hóspedes</span>
                        <span class="detail-value">${reservation.guests_count}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Quarto</span>
                        <span class="detail-value">${reservation.room_type || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total</span>
                        <span class="detail-value">R$ ${(reservation.total_amount || 0).toFixed(2)}</span>
                    </div>
                </div>
                ${reservation.special_requests ? `
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                        <span class="detail-label">Solicitações especiais:</span>
                        <p style="margin-top: 0.5rem; color: #64748b;">${reservation.special_requests}</p>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    async loadRoomTypes() {
        try {
            const { data: roomTypes, error } = await supabaseClient
                .from('room_types')
                .select('*')
                .eq('is_available', true)
                .order('price_per_night');

            if (error) throw error;

            this.roomTypes = roomTypes || [];

        } catch (error) {
            console.error('❌ Erro ao carregar tipos de quartos:', JSON.stringify(error, null, 2));
        }
    }

    setupDateValidation() {
        const checkInInput = document.getElementById('checkIn');
        const checkOutInput = document.getElementById('checkOut');

        if (checkInInput && checkOutInput) {
            // Data mínima é hoje
            const today = new Date().toISOString().split('T')[0];
            checkInInput.min = today;
            checkOutInput.min = today;

            checkInInput.addEventListener('change', () => {
                // Check-out deve ser pelo menos um dia após check-in
                const checkInDate = new Date(checkInInput.value);
                checkInDate.setDate(checkInDate.getDate() + 1);
                checkOutInput.min = checkInDate.toISOString().split('T')[0];
                
                if (checkOutInput.value && new Date(checkOutInput.value) <= new Date(checkInInput.value)) {
                    checkOutInput.value = '';
                }
            });
        }
    }

    // Wizard de reserva
    resetReservationWizard() {
        this.currentStep = 1;
        this.showWizardStep(1);
        this.reservationData = {
            checkIn: '',
            checkOut: '',
            guests: 1,
            roomType: null,
            specialRequests: ''
        };
    }

    showWizardStep(step) {
        // Esconder todos os steps
        const steps = document.querySelectorAll('.wizard-step');
        steps.forEach(s => s.classList.remove('active'));

        // Mostrar step atual
        const currentStepEl = document.getElementById(`step${step}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }

        this.currentStep = step;

        // Carregar dados específicos do step
        if (step === 2) {
            this.renderRoomTypes();
        } else if (step === 3) {
            this.updateReservationSummary();
        }
    }

    nextStep() {
        if (this.currentStep === 1) {
            // Validar datas
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;
            const guests = document.getElementById('guests').value;

            if (!checkIn || !checkOut) {
                this.showNotification('Por favor, selecione as datas de check-in e check-out', 'error');
                return;
            }

            if (new Date(checkOut) <= new Date(checkIn)) {
                this.showNotification('A data de check-out deve ser posterior ao check-in', 'error');
                return;
            }

            this.reservationData.checkIn = checkIn;
            this.reservationData.checkOut = checkOut;
            this.reservationData.guests = parseInt(guests);

            this.showWizardStep(2);
        } else if (this.currentStep === 2) {
            // Validar seleção de quarto
            if (!this.reservationData.roomType) {
                this.showNotification('Por favor, selecione um tipo de quarto', 'error');
                return;
            }

            this.showWizardStep(3);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.showWizardStep(this.currentStep - 1);
        }
    }

    renderRoomTypes() {
        const container = document.getElementById('roomTypesList');
        if (!container) return;

        const filteredRooms = this.roomTypes.filter(room => 
            room.max_guests >= this.reservationData.guests
        );

        if (filteredRooms.length === 0) {
            container.innerHTML = `
                <div class="text-center">
                    <p>Nenhum quarto disponível para ${this.reservationData.guests} hóspedes.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredRooms.map(room => `
            <div class="room-type-card" onclick="clientSystem.selectRoomType(${room.id})" data-room-id="${room.id}">
                <div class="room-type-header">
                    <span class="room-type-name">${room.name}</span>
                    <span class="room-type-price">R$ ${room.price_per_night}/noite</span>
                </div>
                <div class="room-type-description">${room.description}</div>
                <div class="room-amenities">
                    ${(room.amenities || []).map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                </div>
                <div style="margin-top: 1rem; color: #64748b; font-size: 0.875rem;">
                    Até ${room.max_guests} hóspedes
                </div>
            </div>
        `).join('');
    }

    selectRoomType(roomId) {
        // Remover seleção anterior
        const cards = document.querySelectorAll('.room-type-card');
        cards.forEach(card => card.classList.remove('selected'));

        // Selecionar novo quarto
        const selectedCard = document.querySelector(`[data-room-id="${roomId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        this.reservationData.roomType = this.roomTypes.find(room => room.id === roomId);
        
        // Habilitar botão próximo
        const nextBtn = document.getElementById('nextStepBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }

    updateReservationSummary() {
        const checkInDate = new Date(this.reservationData.checkIn);
        const checkOutDate = new Date(this.reservationData.checkOut);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalAmount = nights * this.reservationData.roomType.price_per_night;

        document.getElementById('summaryCheckIn').textContent = this.formatDate(this.reservationData.checkIn);
        document.getElementById('summaryCheckOut').textContent = this.formatDate(this.reservationData.checkOut);
        document.getElementById('summaryGuests').textContent = this.reservationData.guests;
        document.getElementById('summaryRoomType').textContent = this.reservationData.roomType.name;
        document.getElementById('summaryNights').textContent = nights;
        document.getElementById('summaryTotal').textContent = `R$ ${totalAmount.toFixed(2)}`;
    }

    async confirmReservation() {
        try {
            const checkInDate = new Date(this.reservationData.checkIn);
            const checkOutDate = new Date(this.reservationData.checkOut);
            const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
            const totalAmount = nights * this.reservationData.roomType.price_per_night;

            const reservationData = {
                user_id: authSystem.currentUser.id,
                guest_name: this.userProfile.full_name || authSystem.currentUser.email,
                guest_email: authSystem.currentUser.email,
                guest_phone: this.userProfile.phone || '',
                check_in_date: this.reservationData.checkIn,
                check_out_date: this.reservationData.checkOut,
                guests_count: this.reservationData.guests,
                room_type: this.reservationData.roomType.name,
                special_requests: document.getElementById('specialRequests').value,
                total_amount: totalAmount,
                status: 'pending'
            };

            const { data, error } = await supabaseClient
                .from('reservations')
                .insert([reservationData])
                .select()
                .single();

            if (error) throw error;

            // Mostrar modal de sucesso
            document.getElementById('reservationNumber').textContent = `#${data.id}`;
            document.getElementById('successModal').style.display = 'flex';

            // Recarregar reservas
            await this.loadUserReservations();

        } catch (error) {
            console.error('❌ Erro ao confirmar reserva:', JSON.stringify(error, null, 2));
            this.showNotification('Erro ao confirmar reserva: ' + error.message, 'error');
        }
    }

    closeSuccessModal() {
        document.getElementById('successModal').style.display = 'none';
        this.showTab('reservations');
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
function saveProfile() {
    clientSystem.saveProfile();
}

function nextStep() {
    clientSystem.nextStep();
}

function prevStep() {
    clientSystem.prevStep();
}

function confirmReservation() {
    clientSystem.confirmReservation();
}

function closeSuccessModal() {
    clientSystem.closeSuccessModal();
}

// Inicializar sistema cliente
let clientSystem;
document.addEventListener('DOMContentLoaded', () => {
    const checkAuth = setInterval(() => {
        if (window.authSystem && window.supabaseClient) {
            clientSystem = new ClientSystem();
            clearInterval(checkAuth);
        }
    }, 100);
});
