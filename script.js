// Hotel Serra do Roncador - JavaScript Functionality

// Carousel functionality
let currentSlideIndex = 0;
let slides = [];
let indicators = [];
let totalSlides = 0;

function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current slide and indicator
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
}

function previousSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto-play carousel
let carouselInterval;

function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// Initialize carousel elements
function initCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    indicators = document.querySelectorAll('.indicator');
    totalSlides = slides.length;

    if (totalSlides > 0) {
        showSlide(0);
    }
}

// Pause on hover
function initCarouselEvents() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarousel);
        carouselContainer.addEventListener('mouseleave', startCarousel);
    }
}

// Hotel Serra do Roncador - Main JavaScript Functionality

// Data Storage (In production, this would connect to a backend)
let hotelData = {
    rooms: [
        {
            id: 'standard',
            name: 'Apartamento Standard',
            description: 'Apartamento moderno e confortável equipado com todas as comodidades essenciais.',
            price: 280,
            features: ['Frigobar', 'TV', 'Ar Condicionado', 'Mesa de Trabalho', 'Internet Banda Larga', 'Wi-Fi', 'Serviço de Quarto'],
            capacity: 2,
            images: [
                {
                    src: 'https://cdn.builder.io/api/v1/image/assets%2Fa53abce3361241f699f719346ad0e3df%2Ff3d2ef19a657470183f2b6f40c843758?format=webp&width=1200',
                    alt: 'Apartamento Standard - Vista Geral',
                    description: 'Apartamento aconchegante com decoração moderna e todas as comodidades essenciais'
                },
                {
                    src: 'https://cdn.builder.io/api/v1/image/assets%2Fa53abce3361241f699f719346ad0e3df%2F316fe399b61a4428945622d3450b69a2?format=webp&width=1200',
                    alt: 'Apartamento Standard - Área Externa',
                    description: 'Vista da área externa e jardim do hotel'
                },
                {
                    src: 'https://cdn.builder.io/api/v1/image/assets%2F1762ab1c919245729991c11ce81cbf92%2F2527191ae3454c8f85288dd6459e6cd8?format=webp&width=1200',
                    alt: 'Apartamento Standard - Fachada',
                    description: 'Fachada moderna do Hotel Serra do Roncador'
                }
            ]
        },
        {
            id: 'deluxe',
            name: 'Apartamento Deluxe',
            description: 'Apartamento espaçoso com comodidades premium e ambiente sofisticado.',
            price: 380,
            features: ['Frigobar', 'TV', 'Ar Condicionado', 'Mesa de Trabalho', 'Internet Banda Larga', 'Wi-Fi', 'Varanda', 'Cofre', 'Serviço de Quarto'],
            capacity: 3,
            images: [
                {
                    src: 'https://cdn.builder.io/api/v1/image/assets%2Fa53abce3361241f699f719346ad0e3df%2Fe7b58cf3f12c45ec90b7e7626c5a101e?format=webp&width=1200',
                    alt: 'Apartamento Deluxe - Vista Geral',
                    description: 'Apartamento espaçoso com decoração elegante e comodidades premium'
                },
                {
                    src: 'https://cdn.builder.io/api/v1/image/assets%2F1762ab1c919245729991c11ce81cbf92%2F633454aca8f64200ad9a4ac796b01b8a?format=webp&width=1200',
                    alt: 'Apartamento Deluxe - Área da Piscina',
                    description: 'Área de lazer com piscina e vista privilegiada'
                },
                {
                    src: 'https://cdn.builder.io/api/v1/image/assets%2Fa53abce3361241f699f719346ad0e3df%2F316fe399b61a4428945622d3450b69a2?format=webp&width=1200',
                    alt: 'Apartamento Deluxe - Jardim',
                    description: 'Bela vista do jardim e área verde do hotel'
                }
            ]
        },
        {
            id: 'suite',
            name: 'Suíte Premium',
            description: 'Nossa suíte mais luxuosa com amplo espaço e vista privilegiada.',
            price: 580,
            features: ['Frigobar', 'TV', 'Ar Condicionado', 'Mesa de Trabalho', 'Internet Banda Larga', 'Wi-Fi', 'Varanda', 'Cofre', 'Banheira', 'Sala de Estar', 'Serviço de Quarto'],
            capacity: 4,
            images: [
                {
                    src: 'https://cdn.builder.io/api/v1/image/assets%2Fa53abce3361241f699f719346ad0e3df%2F84b98a812b3e463c9a7b303544089fbf?format=webp&width=1200',
                    alt: 'Suíte Premium - Vista Geral',
                    description: 'Suíte luxuosa com amplo espaço e decoração sofisticada'
                },
                {
                    src: 'https://cdn.builder.io/api/v1/image/assets%2F1762ab1c919245729991c11ce81cbf92%2F2527191ae3454c8f85288dd6459e6cd8?format=webp&width=1200',
                    alt: 'Suíte Premium - Vista Externa',
                    description: 'Vista externa do hotel com arquitetura moderna'
                },
                {
                    src: 'https://cdn.builder.io/api/v1/image/assets%2F1762ab1c919245729991c11ce81cbf92%2F633454aca8f64200ad9a4ac796b01b8a?format=webp&width=1200',
                    alt: 'Suíte Premium - Área de Lazer',
                    description: 'Área de lazer exclusiva com piscina e ambiente relaxante'
                }
            ]
        }
    ],
    
    products: [
        // Bebidas
        {
            id: 'agua',
            name: 'Água Mineral 500ml',
            price: 8,
            category: 'Bebidas',
            description: 'Água mineral natural gelada'
        },
        {
            id: 'refrigerante',
            name: 'Refrigerante Lata 350ml',
            price: 12,
            category: 'Bebidas',
            description: 'Coca-Cola, Pepsi, Guaraná Antarctica'
        },
        {
            id: 'cerveja',
            name: 'Cerveja Long Neck',
            price: 18,
            category: 'Bebidas',
            description: 'Skol, Brahma, Heineken'
        },
        {
            id: 'suco',
            name: 'Suco Natural 300ml',
            price: 15,
            category: 'Bebidas',
            description: 'Laranja, maracujá, abacaxi'
        },
        {
            id: 'energetico',
            name: 'Energético Red Bull',
            price: 22,
            category: 'Bebidas',
            description: 'Energético 250ml gelado'
        },
        // Snacks e Doces
        {
            id: 'chocolate',
            name: 'Chocolate Artesanal',
            price: 35,
            category: 'Doces',
            description: 'Chocolate local com castanha do cerrado'
        },
        {
            id: 'biscoito',
            name: 'Biscoitos Caseiros',
            price: 22,
            category: 'Snacks',
            description: 'Biscoitos artesanais da região'
        },
        {
            id: 'amendoim',
            name: 'Amendoim Doce',
            price: 12,
            category: 'Snacks',
            description: 'Amendoim doce caseiro'
        },
        {
            id: 'paçoca',
            name: 'Paçoca Artesanal',
            price: 8,
            category: 'Doces',
            description: 'Paçoca caseira individual'
        },
        // Produtos de Higiene
        {
            id: 'kit_higiene',
            name: 'Kit Higiene Completo',
            price: 45,
            category: 'Higiene',
            description: 'Shampoo, condicionador, sabonete'
        },
        {
            id: 'escova_dental',
            name: 'Kit Dental',
            price: 25,
            category: 'Higiene',
            description: 'Escova, pasta de dente, fio dental'
        }
    ],

    laundryServices: [
        {
            id: 'camisa',
            name: 'Camisa Social',
            price: 10,
            category: 'Roupas',
            description: 'Lavagem e passagem profissional'
        },
        {
            id: 'calca',
            name: 'Calça',
            price: 15,
            category: 'Roupas',
            description: 'Lavagem e passagem'
        },
        {
            id: 'terno',
            name: 'Terno Completo',
            price: 30,
            category: 'Roupas',
            description: 'Lavagem a seco e passagem'
        },
        {
            id: 'vestido',
            name: 'Vestido',
            price: 20,
            category: 'Roupas',
            description: 'Lavagem delicada e passagem'
        },
        {
            id: 'roupa_intima',
            name: 'Roupas Íntimas (5 peças)',
            price: 12,
            category: 'Roupas',
            description: 'Lavagem sanitária'
        },
        {
            id: 'sapato',
            name: 'Limpeza de Sapatos',
            price: 18,
            category: 'Calçados',
            description: 'Limpeza e lustração profissional'
        },
        {
            id: 'lavagem_expressa',
            name: 'Lavagem Expressa (2h)',
            price: 25,
            category: 'Serviços',
            description: 'Lavagem rápida até 3 peças'
        }
    ],
    
    reservations: JSON.parse(localStorage.getItem('hotelReservations') || '[]'),
    purchases: JSON.parse(localStorage.getItem('hotelPurchases') || '[]')
};

// Admin Configuration
const ADMIN_PASSWORD = 'admin123';
let adminMode = false;
let guestMode = false;

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
    if (!modal) return;

    modal.style.display = 'block';

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('modal-checkin');
    const checkoutInput = document.getElementById('modal-checkout');

    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.style.display = 'none';
}

function openGuestModal() {
    const modal = document.getElementById('guestModal');
    if (modal) modal.style.display = 'block';
}

function closeGuestModal() {
    const modal = document.getElementById('guestModal');
    const loginView = document.getElementById('guestLoginView');
    const dashboard = document.getElementById('guestDashboard');

    if (modal) modal.style.display = 'none';
    if (loginView) loginView.style.display = 'block';
    if (dashboard) dashboard.style.display = 'none';
}

function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.style.display = 'block';
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    const loginView = document.getElementById('adminLoginView');
    const dashboard = document.getElementById('adminDashboard');

    if (modal) modal.style.display = 'none';
    if (loginView) loginView.style.display = 'block';
    if (dashboard) dashboard.style.display = 'none';
}

// Rooms Rendering
function renderRooms() {
    const roomsGrid = document.getElementById('roomsGrid');
    roomsGrid.innerHTML = '';
    
    hotelData.rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';

        const roomIcons = {
            'standard': 'fas fa-bed',
            'deluxe': 'fas fa-star',
            'suite': 'fas fa-crown'
        };

        roomCard.innerHTML = `
            <div class="room-image ${room.id}" onclick="openImageGallery('${room.id}')">
                <i class="${roomIcons[room.id]}"></i>
                <span>${room.name}</span>
                <div class="image-overlay">
                    <i class="fas fa-search-plus"></i>
                    <span>Ver fotos</span>
                </div>
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
    if (roomSelect) {
        roomSelect.value = roomId;
        openBookingModal();
        updateBookingSummary();
    }
}

// Image Gallery Functions
let currentGalleryRoom = null;
let currentGalleryIndex = 0;

function openImageGallery(roomId) {
    const room = hotelData.rooms.find(r => r.id === roomId);
    if (!room || !room.images || room.images.length === 0) return;

    currentGalleryRoom = room;
    currentGalleryIndex = 0;

    const modal = document.getElementById('imageGalleryModal');
    const mainImage = document.getElementById('galleryMainImage');
    const imageTitle = document.getElementById('galleryImageTitle');
    const imageDescription = document.getElementById('galleryImageDescription');
    const thumbnailsContainer = document.getElementById('galleryThumbnails');

    // Set main image
    showGalleryImage(0);

    // Create thumbnails
    thumbnailsContainer.innerHTML = room.images.map((image, index) => `
        <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" onclick="showGalleryImage(${index})">
            <img src="${image.src}" alt="${image.alt}">
        </div>
    `).join('');

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeImageGallery() {
    const modal = document.getElementById('imageGalleryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentGalleryRoom = null;
    currentGalleryIndex = 0;
}

function showGalleryImage(index) {
    if (!currentGalleryRoom || !currentGalleryRoom.images) return;

    const images = currentGalleryRoom.images;
    if (index < 0 || index >= images.length) return;

    currentGalleryIndex = index;
    const image = images[index];

    const mainImage = document.getElementById('galleryMainImage');
    const imageTitle = document.getElementById('galleryImageTitle');
    const imageDescription = document.getElementById('galleryImageDescription');

    mainImage.src = image.src;
    mainImage.alt = image.alt;
    imageTitle.textContent = currentGalleryRoom.name;
    imageDescription.textContent = image.description;

    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function nextGalleryImage() {
    if (!currentGalleryRoom) return;
    const nextIndex = (currentGalleryIndex + 1) % currentGalleryRoom.images.length;
    showGalleryImage(nextIndex);
}

function previousGalleryImage() {
    if (!currentGalleryRoom) return;
    const prevIndex = (currentGalleryIndex - 1 + currentGalleryRoom.images.length) % currentGalleryRoom.images.length;
    showGalleryImage(prevIndex);
}

// Booking System
function updateBookingSummary() {
    const checkinInput = document.getElementById('modal-checkin');
    const checkoutInput = document.getElementById('modal-checkout');
    const roomTypeInput = document.getElementById('room-type');

    if (!checkinInput || !checkoutInput || !roomTypeInput) return;

    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const roomType = roomTypeInput.value;

    if (!checkin || !checkout || !roomType) return;

    const nights = calculateNights(checkin, checkout);
    const room = hotelData.rooms.find(r => r.id === roomType);

    if (!room) return;

    const total = nights * room.price;

    const summaryPeriod = document.getElementById('summary-period');
    const summaryNights = document.getElementById('summary-nights');
    const summaryRoom = document.getElementById('summary-room');
    const summaryTotal = document.getElementById('summary-total');

    if (summaryPeriod) summaryPeriod.textContent = `${formatDate(checkin)} - ${formatDate(checkout)}`;
    if (summaryNights) summaryNights.textContent = `${nights} noite${nights > 1 ? 's' : ''}`;
    if (summaryRoom) summaryRoom.textContent = room.name;
    if (summaryTotal) summaryTotal.textContent = formatCurrency(total);
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

// Guest Area - Mock mode (sem login real)
function authenticateGuest(email, reservationCode) {
    // Modo demo - aceita qualquer email/código para demonstração
    if (email && reservationCode) {
        return {
            id: 'DEMO-001',
            guestName: 'João Silva',
            guestEmail: email,
            checkin: new Date().toISOString().split('T')[0],
            checkout: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            roomType: 'deluxe',
            status: 'confirmed',
            total: 1140
        };
    }
    return null;
}

function renderGuestDashboard(reservation) {
    const dashboard = document.getElementById('guestDashboard');
    guestMode = true;

    dashboard.innerHTML = `
        <h2>Bem-vindo, ${reservation.guestName.split(' ')[0]}!</h2>
        <div class="guest-info">
            <div class="reservation-card">
                <h3>Sua Reserva</h3>
                <p><strong>Código:</strong> ${reservation.id}</p>
                <p><strong>Período:</strong> ${formatDate(reservation.checkin)} - ${formatDate(reservation.checkout)}</p>
                <p><strong>Quarto:</strong> ${hotelData.rooms.find(r => r.id === reservation.roomType)?.name || 'Apartamento Deluxe'}</p>
                <p><strong>Status:</strong> <span class="status confirmed">Ativa</span></p>
            </div>

            <div class="guest-services">
                <div class="service-tabs">
                    <button class="tab-btn active" onclick="showGuestTab('products')">Produtos</button>
                    <button class="tab-btn" onclick="showGuestTab('laundry')">Lavanderia</button>
                    <button class="tab-btn" onclick="showGuestTab('orders')">Meus Pedidos</button>
                </div>

                <div id="guest-products" class="tab-content active">
                    <h3><i class="fas fa-shopping-cart"></i> Produtos Disponíveis</h3>
                    <div class="category-filter">
                        <button class="filter-btn active" onclick="filterProducts('all')">Todos</button>
                        <button class="filter-btn" onclick="filterProducts('Bebidas')">Bebidas</button>
                        <button class="filter-btn" onclick="filterProducts('Snacks')">Snacks</button>
                        <button class="filter-btn" onclick="filterProducts('Doces')">Doces</button>
                        <button class="filter-btn" onclick="filterProducts('Higiene')">Higiene</button>
                    </div>
                    <div class="products-grid">
                        ${renderGuestProducts(reservation.id)}
                    </div>
                </div>

                <div id="guest-laundry" class="tab-content">
                    <h3><i class="fas fa-tshirt"></i> Serviços de Lavanderia</h3>
                    <p class="service-info">Horário de coleta: 08:00 às 18:00 | Entrega em 24h</p>
                    <div class="laundry-grid">
                        ${renderLaundryServices(reservation.id)}
                    </div>
                </div>

                <div id="guest-orders" class="tab-content">
                    <h3><i class="fas fa-list"></i> Meus Pedidos</h3>
                    <div class="orders-list">
                        ${renderGuestOrders(reservation.id)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderGuestProducts(reservationId) {
    return hotelData.products.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-header">
                <h4>${product.name}</h4>
                <span class="product-category">${product.category}</span>
            </div>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">${formatCurrency(product.price)}</span>
                <button class="btn btn-primary btn-small" onclick="addToCart('${product.id}', '${reservationId}', 'product')">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderLaundryServices(reservationId) {
    return hotelData.laundryServices.map(service => `
        <div class="service-card">
            <div class="service-header">
                <h4>${service.name}</h4>
                <span class="service-category">${service.category}</span>
            </div>
            <p class="service-description">${service.description}</p>
            <div class="service-footer">
                <span class="service-price">${formatCurrency(service.price)}</span>
                <button class="btn btn-primary btn-small" onclick="addToCart('${service.id}', '${reservationId}', 'laundry')">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderGuestOrders(reservationId) {
    const userOrders = hotelData.purchases.filter(p => p.reservationId === reservationId);
    if (userOrders.length === 0) {
        return '<p class="no-orders">Nenhum pedido realizado ainda.</p>';
    }

    return userOrders.reverse().map(order => `
        <div class="order-card">
            <div class="order-header">
                <strong>${order.productName}</strong>
                <span class="order-price">${formatCurrency(order.price)}</span>
            </div>
            <p class="order-time">${new Date(order.timestamp).toLocaleString('pt-BR')}</p>
            <span class="order-status ${order.status}">${order.status === 'pending' ? 'Processando' : 'Entregue'}</span>
        </div>
    `).join('');
}

function addToCart(itemId, reservationId, type = 'product') {
    let item;
    if (type === 'product') {
        item = hotelData.products.find(p => p.id === itemId);
    } else {
        item = hotelData.laundryServices.find(s => s.id === itemId);
    }

    if (!item) return;

    const purchase = {
        id: Date.now().toString(),
        reservationId,
        productId: itemId,
        productName: item.name,
        price: item.price,
        type: type,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    hotelData.purchases.push(purchase);
    localStorage.setItem('hotelPurchases', JSON.stringify(hotelData.purchases));

    // Send admin notification
    sendAdminNotification('Novo Pedido', `${type === 'product' ? 'Produto' : 'Serviço'}: ${item.name} - Reserva: ${reservationId}`);

    showNotification(`${item.name} adicionado aos seus pedidos!`);

    // Refresh orders tab if it's active
    if (document.getElementById('guest-orders').classList.contains('active')) {
        setTimeout(() => {
            document.getElementById('guest-orders').innerHTML = `
                <h3><i class="fas fa-list"></i> Meus Pedidos</h3>
                <div class="orders-list">
                    ${renderGuestOrders(reservationId)}
                </div>
            `;
        }, 500);
    }
}

// Admin Panel
function authenticateAdmin(password) {
    return password === ADMIN_PASSWORD;
}

function renderAdminDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    adminMode = true;

    const activeReservations = hotelData.reservations.filter(isActiveReservation);
    const todayPurchases = hotelData.purchases.filter(p => {
        const today = new Date().toDateString();
        const purchaseDate = new Date(p.timestamp).toDateString();
        return today === purchaseDate;
    });

    dashboard.innerHTML = `
        <div class="admin-header">
            <h2>Painel Administrativo</h2>
            <p class="admin-welcome">Sistema de gestão completa do Hotel Serra do Roncador</p>
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
                    <p>Pedidos Hoje</p>
                </div>
                <div class="stat-card">
                    <h3>${formatCurrency(todayPurchases.reduce((sum, p) => sum + p.price, 0))}</h3>
                    <p>Faturamento Hoje</p>
                </div>
            </div>
        </div>

        <div class="admin-tabs">
            <button class="admin-tab-btn active" onclick="showAdminTab('dashboard')">Dashboard</button>
            <button class="admin-tab-btn" onclick="showAdminTab('content')">Editar Site</button>
            <button class="admin-tab-btn" onclick="showAdminTab('products')">Produtos</button>
            <button class="admin-tab-btn" onclick="showAdminTab('orders')">Pedidos</button>
            <button class="admin-tab-btn" onclick="showAdminTab('settings')">Configurações</button>
        </div>

        <div class="admin-content">
            <div id="admin-dashboard" class="admin-tab-content active">
                ${renderAdminDashboardTab()}
            </div>

            <div id="admin-content" class="admin-tab-content">
                ${renderAdminContentTab()}
            </div>

            <div id="admin-products" class="admin-tab-content">
                ${renderAdminProductsTab()}
            </div>

            <div id="admin-orders" class="admin-tab-content">
                ${renderAdminOrdersTab()}
            </div>

            <div id="admin-settings" class="admin-tab-content">
                ${renderAdminSettingsTab()}
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

// Admin Tab Functions
function showAdminTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab and mark button as active
    document.getElementById(`admin-${tabName}`).classList.add('active');
    event.target.classList.add('active');
}

function showGuestTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab and mark button as active
    document.getElementById(`guest-${tabName}`).classList.add('active');
    event.target.classList.add('active');
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update button states
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter products
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function renderAdminDashboardTab() {
    const activeReservations = hotelData.reservations.filter(isActiveReservation);
    const recentPurchases = hotelData.purchases.slice(-5).reverse();

    return `
        <div class="admin-section">
            <h3>Reservas Ativas</h3>
            <div class="reservations-list">
                ${activeReservations.map(renderReservationCard).join('') || '<p>Nenhuma reserva ativa no momento</p>'}
            </div>
        </div>

        <div class="admin-section">
            <h3>Pedidos Recentes</h3>
            <div class="purchases-list">
                ${recentPurchases.map(renderPurchaseCard).join('') || '<p>Nenhum pedido registrado</p>'}
            </div>
        </div>
    `;
}

function renderAdminContentTab() {
    return `
        <div class="content-editor">
            <h3>Editor de Conte��do do Site</h3>
            <div class="editor-sections">
                <div class="editor-section">
                    <h4>Informações Principais</h4>
                    <div class="form-group">
                        <label for="hotel-name">Nome do Hotel</label>
                        <input type="text" id="hotel-name" value="Hotel Serra do Roncador" onchange="updateSiteContent('name', this.value)">
                    </div>
                    <div class="form-group">
                        <label for="hotel-subtitle">Subtítulo</label>
                        <textarea id="hotel-subtitle" onchange="updateSiteContent('subtitle', this.value)">Localizado na BR 158 em Água Boa - MT, oferecemos 50 apartamentos modernos e confortáveis para sua estadia</textarea>
                    </div>
                    <div class="form-group">
                        <label for="hotel-description">Descrição Principal</label>
                        <textarea id="hotel-description" onchange="updateSiteContent('description', this.value)">O Hotel Serra do Roncador está localizado à margem da BR 158, cerca de 1000 metros do centro da cidade de Água Boa – MT. Possuímos 50 apartamentos modernos e confortáveis...</textarea>
                    </div>
                </div>

                <div class="editor-section">
                    <h4>Pre��os dos Quartos</h4>
                    <div class="room-prices">
                        <div class="price-item">
                            <label>Standard</label>
                            <input type="number" value="280" onchange="updateRoomPrice('standard', this.value)">
                        </div>
                        <div class="price-item">
                            <label>Deluxe</label>
                            <input type="number" value="380" onchange="updateRoomPrice('deluxe', this.value)">
                        </div>
                        <div class="price-item">
                            <label>Suíte Premium</label>
                            <input type="number" value="580" onchange="updateRoomPrice('suite', this.value)">
                        </div>
                    </div>
                </div>

                <div class="editor-section">
                    <h4>Contato</h4>
                    <div class="form-group">
                        <label for="hotel-phone">Telefone</label>
                        <input type="tel" id="hotel-phone" value="(66) 3468-2001" onchange="updateSiteContent('phone', this.value)">
                    </div>
                    <div class="form-group">
                        <label for="hotel-email">E-mail</label>
                        <input type="email" id="hotel-email" value="reservas@serradoncador.com.br" onchange="updateSiteContent('email', this.value)">
                    </div>
                </div>
            </div>

            <div class="editor-actions">
                <button class="btn btn-primary" onclick="saveChanges()">
                    <i class="fas fa-save"></i> Salvar Alterações
                </button>
                <button class="btn btn-secondary" onclick="previewChanges()">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
            </div>
        </div>
    `;
}

function renderAdminProductsTab() {
    return `
        <div class="products-manager">
            <div class="manager-header">
                <h3>Gerenciar Produtos e Serviços</h3>
                <button class="btn btn-primary" onclick="openProductModal()">
                    <i class="fas fa-plus"></i> Adicionar Produto
                </button>
            </div>

            <div class="product-categories">
                <div class="category-section">
                    <h4>Produtos do Frigobar</h4>
                    <div class="products-list">
                        ${hotelData.products.map(renderProductItem).join('')}
                    </div>
                </div>

                <div class="category-section">
                    <h4>Serviços de Lavanderia</h4>
                    <div class="services-list">
                        ${hotelData.laundryServices.map(renderServiceItem).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAdminOrdersTab() {
    const allOrders = hotelData.purchases.slice().reverse();
    const pendingOrders = allOrders.filter(o => o.status === 'pending');

    return `
        <div class="orders-manager">
            <div class="manager-header">
                <h3>Gerenciar Pedidos</h3>
                <div class="order-stats">
                    <span class="stat">Pendentes: ${pendingOrders.length}</span>
                    <span class="stat">Total: ${allOrders.length}</span>
                </div>
            </div>

            <div class="orders-filter">
                <button class="filter-btn active" onclick="filterOrders('all')">Todos</button>
                <button class="filter-btn" onclick="filterOrders('pending')">Pendentes</button>
                <button class="filter-btn" onclick="filterOrders('completed')">Concluídos</button>
            </div>

            <div class="orders-list">
                ${allOrders.map(renderOrderManagementCard).join('') || '<p>Nenhum pedido registrado</p>'}
            </div>
        </div>
    `;
}

function renderAdminSettingsTab() {
    return `
        <div class="settings-manager">
            <h3>Configurações do Sistema</h3>

            <div class="settings-sections">
                <div class="settings-section">
                    <h4>Backup e Dados</h4>
                    <div class="settings-actions">
                        <button class="btn btn-secondary" onclick="exportData()">
                            <i class="fas fa-download"></i> Exportar Dados
                        </button>
                        <button class="btn btn-secondary" onclick="clearOldData()">
                            <i class="fas fa-trash"></i> Limpar Dados Antigos
                        </button>
                        <button class="btn btn-secondary" onclick="resetToDefaults()">
                            <i class="fas fa-undo"></i> Restaurar Padrões
                        </button>
                    </div>
                </div>

                <div class="settings-section">
                    <h4>Notificações</h4>
                    <div class="settings-options">
                        <label class="setting-option">
                            <input type="checkbox" checked> Notificar novos pedidos
                        </label>
                        <label class="setting-option">
                            <input type="checkbox" checked> Notificar novas reservas
                        </label>
                        <label class="setting-option">
                            <input type="checkbox"> Relatórios diários por email
                        </label>
                    </div>
                </div>

                <div class="settings-section">
                    <h4>Horários de Funcionamento</h4>
                    <div class="time-settings">
                        <div class="time-item">
                            <label>Check-in</label>
                            <input type="time" value="14:00">
                        </div>
                        <div class="time-item">
                            <label>Check-out</label>
                            <input type="time" value="12:00">
                        </div>
                        <div class="time-item">
                            <label>Lavanderia</label>
                            <input type="time" value="08:00"> até <input type="time" value="18:00">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderProductItem(product) {
    return `
        <div class="product-item">
            <div class="item-info">
                <strong>${product.name}</strong>
                <span class="item-price">${formatCurrency(product.price)}</span>
            </div>
            <div class="item-actions">
                <button class="btn-icon" onclick="editProduct('${product.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon danger" onclick="deleteProduct('${product.id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function renderServiceItem(service) {
    return `
        <div class="service-item">
            <div class="item-info">
                <strong>${service.name}</strong>
                <span class="item-price">${formatCurrency(service.price)}</span>
            </div>
            <div class="item-actions">
                <button class="btn-icon" onclick="editService('${service.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon danger" onclick="deleteService('${service.id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function renderOrderManagementCard(order) {
    const reservation = hotelData.reservations.find(r => r.id === order.reservationId);
    return `
        <div class="order-management-card" data-status="${order.status}">
            <div class="order-info">
                <div class="order-header">
                    <strong>${order.productName}</strong>
                    <span class="order-type">${order.type === 'laundry' ? 'Lavanderia' : 'Produto'}</span>
                </div>
                <p>Reserva: ${order.reservationId} ${reservation ? `- ${reservation.guestName}` : ''}</p>
                <p>Data: ${new Date(order.timestamp).toLocaleString('pt-BR')}</p>
                <p>Valor: ${formatCurrency(order.price)}</p>
            </div>
            <div class="order-actions">
                <select onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendente</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processando</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Concluído</option>
                </select>
            </div>
        </div>
    `;
}

// Content Management Functions
function updateSiteContent(field, value) {
    showNotification(`${field} atualizado!`, 'success');
}

function updateRoomPrice(roomType, price) {
    const room = hotelData.rooms.find(r => r.id === roomType);
    if (room) {
        room.price = parseFloat(price);
        renderRooms();
        showNotification(`Preço do ${room.name} atualizado!`, 'success');
    }
}

function saveChanges() {
    showNotification('Alterações salvas com sucesso!', 'success');
}

function previewChanges() {
    showNotification('Abrindo visualização...', 'success');
}

function updateOrderStatus(orderId, newStatus) {
    const order = hotelData.purchases.find(p => p.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('hotelPurchases', JSON.stringify(hotelData.purchases));
        showNotification(`Status do pedido atualizado para: ${newStatus}`, 'success');
    }
}

function filterOrders(status) {
    const orders = document.querySelectorAll('.order-management-card');
    const buttons = document.querySelectorAll('.orders-filter .filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    orders.forEach(order => {
        if (status === 'all' || order.dataset.status === status) {
            order.style.display = 'block';
        } else {
            order.style.display = 'none';
        }
    });
}

function resetToDefaults() {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
        showNotification('Configurações restauradas!', 'success');
    }
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
    // Initialize carousel
    initCarousel();
    initCarouselEvents();

    if (totalSlides > 1) {
        startCarousel();
    }

    // Force update room data and render
    hotelData.rooms = [
        {
            id: 'standard',
            name: 'Apartamento Standard',
            description: 'Apartamento moderno e confortável equipado com todas as comodidades essenciais.',
            price: 280,
            features: ['Frigobar', 'TV', 'Ar Condicionado', 'Mesa de Trabalho', 'Internet Banda Larga', 'Wi-Fi', 'Serviço de Quarto'],
            capacity: 2
        },
        {
            id: 'deluxe',
            name: 'Apartamento Deluxe',
            description: 'Apartamento espaçoso com comodidades premium e ambiente sofisticado.',
            price: 380,
            features: ['Frigobar', 'TV', 'Ar Condicionado', 'Mesa de Trabalho', 'Internet Banda Larga', 'Wi-Fi', 'Varanda', 'Cofre', 'Serviço de Quarto'],
            capacity: 3
        },
        {
            id: 'suite',
            name: 'Suíte Premium',
            description: 'Nossa suíte mais luxuosa com amplo espaço e vista privilegiada.',
            price: 580,
            features: ['Frigobar', 'TV', 'Ar Condicionado', 'Mesa de Trabalho', 'Internet Banda Larga', 'Wi-Fi', 'Varanda', 'Cofre', 'Banheira', 'Sala de Estar', 'Serviço de Quarto'],
            capacity: 4
        }
    ];

    // Render rooms immediately
    renderRooms();
    
    // Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
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
    const guestAccess = document.querySelector('.guest-access');
    if (guestAccess) {
        guestAccess.addEventListener('click', function(e) {
            e.preventDefault();
            openGuestModal();
        });
    }

    // Admin access
    const adminAccess = document.querySelector('.admin-access');
    if (adminAccess) {
        adminAccess.addEventListener('click', function(e) {
            e.preventDefault();
            openAdminModal();
        });
    }
    
    // Booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const checkinInput = document.getElementById('modal-checkin');
            const checkoutInput = document.getElementById('modal-checkout');
            const guestsInput = document.getElementById('modal-guests');
            const roomTypeInput = document.getElementById('room-type');
            const guestNameInput = document.getElementById('guest-name');
            const guestEmailInput = document.getElementById('guest-email');
            const guestPhoneInput = document.getElementById('guest-phone');
            const guestCpfInput = document.getElementById('guest-cpf');

            if (!checkinInput || !checkoutInput || !guestsInput || !roomTypeInput ||
                !guestNameInput || !guestEmailInput || !guestPhoneInput || !guestCpfInput) {
                showNotification('Erro no formulário de reserva', 'error');
                return;
            }

            const formData = {
                checkin: checkinInput.value,
                checkout: checkoutInput.value,
                guests: guestsInput.value,
                roomType: roomTypeInput.value,
                guestName: guestNameInput.value,
                guestEmail: guestEmailInput.value,
                guestPhone: guestPhoneInput.value,
                guestCpf: guestCpfInput.value
            };

            if (new Date(formData.checkin) >= new Date(formData.checkout)) {
                showNotification('Data de check-out deve ser posterior ao check-in', 'error');
                return;
            }

            processBooking(formData);
        });
    }
    
    // Guest login
    const guestLoginForm = document.getElementById('guestLoginForm');
    if (guestLoginForm) {
        guestLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = document.getElementById('guest-login-email');
            const codeInput = document.getElementById('guest-code');

            if (!emailInput || !codeInput) {
                showNotification('Erro no formulário', 'error');
                return;
            }

            const email = emailInput.value;
            const code = codeInput.value;

            const reservation = authenticateGuest(email, code);
            if (reservation) {
                document.getElementById('guestLoginView').style.display = 'none';
                document.getElementById('guestDashboard').style.display = 'block';
                renderGuestDashboard(reservation);
            } else {
                showNotification('Dados de acesso inválidos', 'error');
            }
        });
    }
    
    // Admin login - Modo demo simplificado
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Modo demo - aceita qualquer senha para demonstração
            const adminLoginView = document.getElementById('adminLoginView');
            const adminDashboard = document.getElementById('adminDashboard');

            if (adminLoginView && adminDashboard) {
                adminLoginView.style.display = 'none';
                adminDashboard.style.display = 'block';
                renderAdminDashboard();
                showNotification('Acesso administrativo liberado! (Modo Demo)', 'success');
            }
        });
    }
    
    // Booking form updates
    ['modal-checkin', 'modal-checkout', 'room-type'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateBookingSummary);
        }
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
    if (checkinInputs.length > 0) {
        checkinInputs.forEach(input => {
            if (input) {
                input.min = today;
            }
        });
    }
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
