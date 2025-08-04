// Hotel Serra do Roncador - JavaScript Functionality

// Data Storage (In production, this would connect to a backend)
let hotelData = {
    rooms: [
        {
            id: 'standard',
            name: 'Quarto Standard',
            description: 'Confortável quarto com vista para o jardim, perfeito para relaxar após um dia de aventuras.',
            price: 280,
            features: ['Wi-Fi Gratuito', 'Ar Condicionado', 'TV Smart', 'Frigobar'],
            capacity: 2
        },
        {
            id: 'deluxe',
            name: 'Quarto Deluxe',
            description: 'Espaçoso quarto com varanda privativa e vista parcial da serra.',
            price: 380,
            features: ['Wi-Fi Gratuito', 'Ar Condicionado', 'TV Smart', 'Frigobar', 'Varanda', 'Cofre'],
            capacity: 3
        },
        {
            id: 'suite',
            name: 'Suíte Premium',
            description: 'Nossa suíte mais luxuosa com vista panorâmica da Serra do Roncador.',
            price: 580,
            features: ['Wi-Fi Gratuito', 'Ar Condicionado', 'TV Smart', 'Frigobar', 'Varanda', 'Cofre', 'Banheira', 'Sala de Estar'],
            capacity: 4
        }
    ],
    
    products: [
        {
            id: 'agua',
            name: 'Água Mineral 500ml',
            price: 8,
            category: 'Bebidas',
            description: 'Água mineral natural'
        },
        {
            id: 'refrigerante',
            name: 'Refrigerante Lata 350ml',
            price: 12,
            category: 'Bebidas',
            description: 'Coca-Cola, Pepsi, Guaraná'
        },
        {
            id: 'cerveja',
            name: 'Cerveja Long Neck',
            price: 18,
            category: 'Bebidas',
            description: 'Cervejas nacionais e importadas'
        },
        {
            id: 'snack',
            name: 'Mix de Castanhas',
            price: 25,
            category: 'Snacks',
            description: 'Mix gourmet de castanhas do cerrado'
        },
        {
            id: 'chocolate',
            name: 'Chocolate Artesanal',
            price: 35,
            category: 'Doces',
            description: 'Chocolate artesanal local'
        },
        {
            id: 'biscoito',
            name: 'Biscoitos Caseiros',
            price: 22,
            category: 'Snacks',
            description: 'Biscoitos artesanais da região'
        }
    ],
    
    reservations: JSON.parse(localStorage.getItem('hotelReservations') || '[]'),
    purchases: JSON.parse(localStorage.getItem('hotelPurchases') || '[]')
};

// Admin Configuration
const ADMIN_PASSWORD = 'serra2024';

// Utility Functions
function generateReservationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'RSR-';
    for (let i = 0; i < 3; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function calculateNights(checkin, checkout) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function isActiveReservation(reservation) {
    const today = new Date();
    const checkin = new Date(reservation.checkin);
    const checkout = new Date(reservation.checkout);
    return today >= checkin && today <= checkout;
}

// DOM Manipulation Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--verde-claro)' : 'var(--terra)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-small);
        box-shadow: var(--shadow);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Modal Functions
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modal-checkin').min = today;
    document.getElementById('modal-checkout').min = today;
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function openGuestModal() {
    document.getElementById('guestModal').style.display = 'block';
}

function closeGuestModal() {
    document.getElementById('guestModal').style.display = 'none';
    document.getElementById('guestLoginView').style.display = 'block';
    document.getElementById('guestDashboard').style.display = 'none';
}

function openAdminModal() {
    document.getElementById('adminModal').style.display = 'block';
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('adminLoginView').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Rooms Rendering
function renderRooms() {
    const roomsGrid = document.getElementById('roomsGrid');
    roomsGrid.innerHTML = '';
    
    hotelData.rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        
        roomCard.innerHTML = `
            <div class="room-image ${room.id}">
            </div>
            <div class="room-content">
                <h3 class="room-title">${room.name}</h3>
                <p class="room-description">${room.description}</p>
                <div class="room-features">
                    ${room.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="room-price">
                    <div>
                        <span class="price">${formatCurrency(room.price)}</span>
                        <span class="price-unit">/ noite</span>
                    </div>
                    <button class="btn btn-primary" onclick="selectRoom('${room.id}')">
                        Reservar
                    </button>
                </div>
            </div>
        `;
        
        roomsGrid.appendChild(roomCard);
    });
}

function selectRoom(roomId) {
    const roomSelect = document.getElementById('room-type');
    roomSelect.value = roomId;
    openBookingModal();
    updateBookingSummary();
}

// Booking System
function updateBookingSummary() {
    const checkin = document.getElementById('modal-checkin').value;
    const checkout = document.getElementById('modal-checkout').value;
    const roomType = document.getElementById('room-type').value;
    
    if (!checkin || !checkout || !roomType) return;
    
    const nights = calculateNights(checkin, checkout);
    const room = hotelData.rooms.find(r => r.id === roomType);
    const total = nights * room.price;
    
    document.getElementById('summary-period').textContent = `${formatDate(checkin)} - ${formatDate(checkout)}`;
    document.getElementById('summary-nights').textContent = `${nights} noite${nights > 1 ? 's' : ''}`;
    document.getElementById('summary-room').textContent = room.name;
    document.getElementById('summary-total').textContent = formatCurrency(total);
}

function processBooking(formData) {
    const reservation = {
        id: generateReservationCode(),
        ...formData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        total: calculateNights(formData.checkin, formData.checkout) * 
               hotelData.rooms.find(r => r.id === formData.roomType).price
    };
    
    hotelData.reservations.push(reservation);
    localStorage.setItem('hotelReservations', JSON.stringify(hotelData.reservations));
    
    // Send admin notification (simulated)
    sendAdminNotification('Nova Reserva', `Reserva ${reservation.id} confirmada para ${reservation.guestName}`);
    
    showNotification(`Reserva confirmada! Código: ${reservation.id}`);
    closeBookingModal();
    
    return reservation;
}

// Guest Area
function authenticateGuest(email, reservationCode) {
    return hotelData.reservations.find(r => 
        r.guestEmail.toLowerCase() === email.toLowerCase() && 
        r.id === reservationCode
    );
}

function renderGuestDashboard(reservation) {
    const dashboard = document.getElementById('guestDashboard');
    const isActive = isActiveReservation(reservation);
    
    dashboard.innerHTML = `
        <h2>Bem-vindo, ${reservation.guestName.split(' ')[0]}!</h2>
        <div class="guest-info">
            <div class="reservation-card">
                <h3>Sua Reserva</h3>
                <p><strong>Código:</strong> ${reservation.id}</p>
                <p><strong>Período:</strong> ${formatDate(reservation.checkin)} - ${formatDate(reservation.checkout)}</p>
                <p><strong>Quarto:</strong> ${hotelData.rooms.find(r => r.id === reservation.roomType).name}</p>
                <p><strong>Status:</strong> <span class="status ${reservation.status}">${reservation.status === 'confirmed' ? 'Confirmada' : reservation.status}</span></p>
            </div>
            
            ${isActive ? `
                <div class="qr-section">
                    <h3><i class="fas fa-qrcode"></i> Seu QR Code</h3>
                    <div class="qr-code" data-reservation="${reservation.id}">
                        <div class="qr-placeholder">
                            <i class="fas fa-qrcode"></i>
                            <p>QR Code do Quarto</p>
                            <small>${reservation.id}</small>
                        </div>
                    </div>
                    <p>Use este QR Code para comprar produtos e serviços</p>
                </div>
                
                <div class="products-section">
                    <h3><i class="fas fa-shopping-cart"></i> Produtos Disponíveis</h3>
                    <div class="products-grid">
                        ${renderGuestProducts(reservation.id)}
                    </div>
                </div>
            ` : `
                <div class="inactive-message">
                    <i class="fas fa-info-circle"></i>
                    <p>Os produtos estarão disponíveis durante sua estadia (${formatDate(reservation.checkin)} - ${formatDate(reservation.checkout)})</p>
                </div>
            `}
        </div>
    `;
}

function renderGuestProducts(reservationId) {
    return hotelData.products.map(product => `
        <div class="product-card">
            <h4>${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">${formatCurrency(product.price)}</span>
                <button class="btn btn-primary btn-small" onclick="addToCart('${product.id}', '${reservationId}')">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId, reservationId) {
    const product = hotelData.products.find(p => p.id === productId);
    const purchase = {
        id: Date.now().toString(),
        reservationId,
        productId,
        productName: product.name,
        price: product.price,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    hotelData.purchases.push(purchase);
    localStorage.setItem('hotelPurchases', JSON.stringify(hotelData.purchases));
    
    // Send admin notification
    sendAdminNotification('Nova Compra', `Produto: ${product.name} - Reserva: ${reservationId}`);
    
    showNotification(`${product.name} adicionado ao seu consumo!`);
}

// Admin Panel
function authenticateAdmin(password) {
    return password === ADMIN_PASSWORD;
}

function renderAdminDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    
    const activeReservations = hotelData.reservations.filter(isActiveReservation);
    const todayPurchases = hotelData.purchases.filter(p => {
        const today = new Date().toDateString();
        const purchaseDate = new Date(p.timestamp).toDateString();
        return today === purchaseDate;
    });
    
    dashboard.innerHTML = `
        <div class="admin-header">
            <h2>Painel Administrativo</h2>
            <div class="admin-stats">
                <div class="stat-card">
                    <h3>${hotelData.reservations.length}</h3>
                    <p>Total Reservas</p>
                </div>
                <div class="stat-card">
                    <h3>${activeReservations.length}</h3>
                    <p>Hóspedes Ativos</p>
                </div>
                <div class="stat-card">
                    <h3>${todayPurchases.length}</h3>
                    <p>Compras Hoje</p>
                </div>
            </div>
        </div>
        
        <div class="admin-sections">
            <div class="admin-section">
                <h3>Reservas Ativas</h3>
                <div class="reservations-list">
                    ${activeReservations.map(renderReservationCard).join('') || '<p>Nenhuma reserva ativa</p>'}
                </div>
            </div>
            
            <div class="admin-section">
                <h3>Compras Recentes</h3>
                <div class="purchases-list">
                    ${hotelData.purchases.slice(-10).reverse().map(renderPurchaseCard).join('') || '<p>Nenhuma compra registrada</p>'}
                </div>
            </div>
            
            <div class="admin-section">
                <h3>Gestão</h3>
                <div class="admin-actions">
                    <button class="btn btn-secondary" onclick="exportData()">
                        <i class="fas fa-download"></i> Exportar Dados
                    </button>
                    <button class="btn btn-secondary" onclick="clearOldData()">
                        <i class="fas fa-trash"></i> Limpar Dados Antigos
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderReservationCard(reservation) {
    const room = hotelData.rooms.find(r => r.id === reservation.roomType);
    return `
        <div class="reservation-card admin">
            <div class="reservation-header">
                <strong>${reservation.guestName}</strong>
                <span class="reservation-code">${reservation.id}</span>
            </div>
            <p>${room.name} - ${formatDate(reservation.checkin)} a ${formatDate(reservation.checkout)}</p>
            <p>Total: ${formatCurrency(reservation.total)}</p>
            <p>Contato: ${reservation.guestPhone} | ${reservation.guestEmail}</p>
        </div>
    `;
}

function renderPurchaseCard(purchase) {
    const reservation = hotelData.reservations.find(r => r.id === purchase.reservationId);
    return `
        <div class="purchase-card">
            <div class="purchase-header">
                <strong>${purchase.productName}</strong>
                <span class="purchase-price">${formatCurrency(purchase.price)}</span>
            </div>
            <p>Reserva: ${purchase.reservationId} - ${reservation ? reservation.guestName : 'N/A'}</p>
            <p>Data: ${new Date(purchase.timestamp).toLocaleString('pt-BR')}</p>
        </div>
    `;
}

// Notifications
function sendAdminNotification(title, message) {
    // In a real application, this would send emails/WhatsApp
    console.log(`[ADMIN NOTIFICATION] ${title}: ${message}`);
    
    // Store notification for admin panel
    const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    notifications.push({
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
}

// Data Management
function exportData() {
    const data = {
        reservations: hotelData.reservations,
        purchases: hotelData.purchases,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hotel-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Dados exportados com sucesso!');
}

function clearOldData() {
    if (confirm('Deseja remover reservas e compras antigas (mais de 30 dias)?')) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const oldReservations = hotelData.reservations.length;
        const oldPurchases = hotelData.purchases.length;
        
        hotelData.reservations = hotelData.reservations.filter(r => 
            new Date(r.checkout) > thirtyDaysAgo
        );
        
        hotelData.purchases = hotelData.purchases.filter(p => 
            new Date(p.timestamp) > thirtyDaysAgo
        );
        
        localStorage.setItem('hotelReservations', JSON.stringify(hotelData.reservations));
        localStorage.setItem('hotelPurchases', JSON.stringify(hotelData.purchases));
        
        const removedReservations = oldReservations - hotelData.reservations.length;
        const removedPurchases = oldPurchases - hotelData.purchases.length;
        
        showNotification(`Removidos: ${removedReservations} reservas e ${removedPurchases} compras antigas`);
        renderAdminDashboard();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Render initial content
    renderRooms();
    
    // Navigation
    document.querySelector('.nav-toggle').addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Guest area access
    document.querySelector('.guest-access').addEventListener('click', function(e) {
        e.preventDefault();
        openGuestModal();
    });
    
    // Admin access
    document.querySelector('.admin-access').addEventListener('click', function(e) {
        e.preventDefault();
        openAdminModal();
    });
    
    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            checkin: document.getElementById('modal-checkin').value,
            checkout: document.getElementById('modal-checkout').value,
            guests: document.getElementById('modal-guests').value,
            roomType: document.getElementById('room-type').value,
            guestName: document.getElementById('guest-name').value,
            guestEmail: document.getElementById('guest-email').value,
            guestPhone: document.getElementById('guest-phone').value,
            guestCpf: document.getElementById('guest-cpf').value
        };
        
        if (new Date(formData.checkin) >= new Date(formData.checkout)) {
            showNotification('Data de check-out deve ser posterior ao check-in', 'error');
            return;
        }
        
        processBooking(formData);
    });
    
    // Guest login
    document.getElementById('guestLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('guest-login-email').value;
        const code = document.getElementById('guest-code').value;
        
        const reservation = authenticateGuest(email, code);
        if (reservation) {
            document.getElementById('guestLoginView').style.display = 'none';
            document.getElementById('guestDashboard').style.display = 'block';
            renderGuestDashboard(reservation);
        } else {
            showNotification('Dados de acesso inválidos', 'error');
        }
    });
    
    // Admin login
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('admin-password').value;
        
        if (authenticateAdmin(password)) {
            document.getElementById('adminLoginView').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            renderAdminDashboard();
        } else {
            showNotification('Senha incorreta', 'error');
        }
    });
    
    // Booking form updates
    ['modal-checkin', 'modal-checkout', 'room-type'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateBookingSummary);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Set minimum dates for booking
    const today = new Date().toISOString().split('T')[0];
    const checkinInputs = document.querySelectorAll('input[type="date"]');
    checkinInputs.forEach(input => {
        input.min = today;
    });
});

// CSS for dynamic elements
const additionalStyles = `
<style>
.admin-header {
    margin-bottom: 2rem;
}

.admin-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.stat-card {
    background: var(--cinza-claro);
    padding: 1rem;
    border-radius: var(--border-radius-small);
    text-align: center;
}

.stat-card h3 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.admin-sections {
    display: grid;
    gap: 2rem;
}

.admin-section {
    background: var(--cinza-claro);
    padding: 1.5rem;
    border-radius: var(--border-radius);
}

.admin-section h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.reservations-list, .purchases-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.reservation-card.admin, .purchase-card {
    background: var(--branco);
    padding: 1rem;
    border-radius: var(--border-radius-small);
    border-left: 4px solid var(--primary-color);
}

.reservation-header, .purchase-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.reservation-code {
    background: var(--primary-color);
    color: var(--branco);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
}

.purchase-price {
    font-weight: 600;
    color: var(--primary-color);
}

.admin-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.guest-info {
    display: grid;
    gap: 2rem;
}

.reservation-card {
    background: var(--cinza-claro);
    padding: 1.5rem;
    border-radius: var(--border-radius);
}

.qr-section {
    text-align: center;
    background: var(--branco);
    padding: 2rem;
    border-radius: var(--border-radius);
}

.qr-placeholder {
    width: 200px;
    height: 200px;
    margin: 1rem auto;
    background: var(--cinza-claro);
    border: 2px dashed var(--primary-color);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
}

.qr-placeholder i {
    font-size: 3rem;
    margin-bottom: 0.5rem;
}

.products-section {
    background: var(--branco);
    padding: 2rem;
    border-radius: var(--border-radius);
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.product-card {
    background: var(--cinza-claro);
    padding: 1rem;
    border-radius: var(--border-radius-small);
}

.product-card h4 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.product-description {
    font-size: 0.9rem;
    color: var(--text-light);
    margin-bottom: 1rem;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.product-price {
    font-weight: 600;
    color: var(--primary-color);
}

.btn-small {
    padding: 0.5rem;
    font-size: 0.9rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.inactive-message {
    text-align: center;
    padding: 2rem;
    color: var(--text-light);
}

.inactive-message i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.status {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
}

.status.confirmed {
    background: var(--verde-claro);
    color: var(--branco);
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

@media (max-width: 768px) {
    .admin-stats {
        grid-template-columns: 1fr;
    }
    
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .admin-actions {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
