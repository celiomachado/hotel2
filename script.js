// Hotel Serra do Roncador - Modern JavaScript with Animations

// Global Variables
let currentSlideIndex = 0;
let slides = [];
let indicators = [];
let totalSlides = 0;
let carouselInterval;

// Gallery Variables
let currentGalleryIndex = 0;
let gallerySlides = [];
let galleryDots = [];
let totalGallerySlides = 0;

// Background Animation Variables
let currentBgIndex = 0;
let bgImages = [];
let bgInterval;

// Animation and Scroll Reveal
let observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCarousel();
    initializeGalleryCarousel();
    initializeBackgroundAnimation();
    initializeParticles();
    initializeScrollReveal();
    initializeNavigation();
    initializeBookingSystem();
    initializeMobileOptimizations();
    renderRooms();
    
    // Start animations
    setTimeout(() => {
        startCarousel();
        startBackgroundAnimation();
    }, 1000);
});

// ========== ANIMATION SYSTEM ==========

function initializeAnimations() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize entrance animations
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .feature, .room-card, .nav-link');
    interactiveElements.forEach(addHoverEffects);
    
    // Initialize loading animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
}

function addHoverEffects(element) {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

// ========== BACKGROUND ANIMATION ==========

function initializeBackgroundAnimation() {
    bgImages = document.querySelectorAll('.hero-bg-image');
    if (bgImages.length === 0) return;
    
    currentBgIndex = 0;
    showBackgroundImage(currentBgIndex);
}

function startBackgroundAnimation() {
    if (bgImages.length <= 1) return;
    
    bgInterval = setInterval(() => {
        bgImages[currentBgIndex].classList.remove('active');
        currentBgIndex = (currentBgIndex + 1) % bgImages.length;
        bgImages[currentBgIndex].classList.add('active');
    }, 6000);
}

function showBackgroundImage(index) {
    bgImages.forEach(img => img.classList.remove('active'));
    if (bgImages[index]) {
        bgImages[index].classList.add('active');
    }
}

// ========== PARTICLES SYSTEM ==========

function initializeParticles() {
    const particlesContainer = document.getElementById('heroParticles');
    if (!particlesContainer) return;
    
    const particleCount = window.innerWidth > 768 ? 12 : 6;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning and timing
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
            createParticle(container, index);
        }
    }, 25000);
}

// ========== HERO CAROUSEL ==========

function initializeCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    indicators = document.querySelectorAll('.indicator');
    totalSlides = slides.length;

    if (totalSlides > 0) {
        showSlide(0);
        initCarouselEvents();
    }
}

function initCarouselEvents() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;

    // Pause on hover
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopCarousel();
    }, { passive: true });

    carouselContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startCarousel();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                previousSlide();
            } else {
                nextSlide();
            }
        }
    }
}

function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    // Remove active classes
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active classes with animation
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentSlideIndex = index;
}

function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(nextIndex);
}

function previousSlide() {
    const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(prevIndex);
}

function currentSlide(index) {
    showSlide(index - 1);
}

function startCarousel() {
    if (totalSlides <= 1) return;
    carouselInterval = setInterval(nextSlide, 5000);
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// ========== GALLERY CAROUSEL ==========

function initializeGalleryCarousel() {
    gallerySlides = document.querySelectorAll('.gallery-slide');
    galleryDots = document.querySelectorAll('.gallery-dot');
    totalGallerySlides = gallerySlides.length;
    
    if (totalGallerySlides > 0) {
        showGallerySlide(0);
        initGalleryEvents();
    }
}

function initGalleryEvents() {
    const galleryContainer = document.querySelector('.gallery-carousel');
    if (!galleryContainer) return;

    // Auto-play gallery
    let galleryInterval = setInterval(nextGallerySlide, 7000);

    // Pause on hover
    galleryContainer.addEventListener('mouseenter', () => clearInterval(galleryInterval));
    galleryContainer.addEventListener('mouseleave', () => {
        galleryInterval = setInterval(nextGallerySlide, 7000);
    });

    // Touch support for gallery
    let touchStartX = 0;
    let touchEndX = 0;

    galleryContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(galleryInterval);
    }, { passive: true });

    galleryContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleGallerySwipe();
        galleryInterval = setInterval(nextGallerySlide, 7000);
    }, { passive: true });

    function handleGallerySwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                previousGallerySlide();
            } else {
                nextGallerySlide();
            }
        }
    }
}

function showGallerySlide(index) {
    if (index < 0 || index >= totalGallerySlides) return;
    
    const slidesContainer = document.getElementById('gallerySlides');
    if (!slidesContainer) return;
    
    // Animate slide transition
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots
    galleryDots.forEach(dot => dot.classList.remove('active'));
    if (galleryDots[index]) {
        galleryDots[index].classList.add('active');
    }
    
    currentGalleryIndex = index;
}

function nextGallerySlide() {
    const nextIndex = (currentGalleryIndex + 1) % totalGallerySlides;
    showGallerySlide(nextIndex);
}

function previousGallerySlide() {
    const prevIndex = (currentGalleryIndex - 1 + totalGallerySlides) % totalGallerySlides;
    showGallerySlide(prevIndex);
}

function currentGallerySlide(index) {
    showGallerySlide(index);
}

// ========== SCROLL REVEAL ANIMATIONS ==========

function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ========== NAVIGATION ==========

function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== UTILITY FUNCTIONS ==========

function scrollToGallery() {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        gallerySection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-small);
        box-shadow: var(--shadow-medium);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ========== BOOKING SYSTEM ==========

function initializeBookingSystem() {
    const bookingForm = document.getElementById('bookingForm');
    const guestLoginForm = document.getElementById('guestLoginForm');
    
    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input) input.min = today;
    });
    
    // Booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }
    
    // Guest login
    if (guestLoginForm) {
        guestLoginForm.addEventListener('submit', handleGuestLogin);
    }
    
    // Update booking summary on changes
    ['modal-checkin', 'modal-checkout', 'room-type'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateBookingSummary);
        }
    });
}

function handleBookingSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const booking = Object.fromEntries(formData.entries());
    
    // Validate dates
    if (new Date(booking.checkin) >= new Date(booking.checkout)) {
        showNotification('Data de check-out deve ser posterior ao check-in', 'error');
        return;
    }
    
    // Simulate booking process
    showNotification('Processando reserva...', 'info');
    
    setTimeout(() => {
        const reservationCode = generateReservationCode();
        showNotification(`Reserva confirmada! Código: ${reservationCode}`, 'success');
        closeBookingModal();
        e.target.reset();
    }, 2000);
}

function handleGuestLogin(e) {
    e.preventDefault();
    
    showNotification('Entrando na área do hóspede...', 'info');
    
    setTimeout(() => {
        document.getElementById('guestLoginView').style.display = 'none';
        document.getElementById('guestDashboard').style.display = 'block';
        renderGuestDashboard();
        showNotification('Acesso liberado! (Modo Demo)', 'success');
    }, 1500);
}

function updateBookingSummary() {
    const checkin = document.getElementById('modal-checkin')?.value;
    const checkout = document.getElementById('modal-checkout')?.value;
    const roomType = document.getElementById('room-type')?.value;
    
    if (!checkin || !checkout || !roomType) return;
    
    const nights = calculateNights(checkin, checkout);
    const room = hotelData.rooms.find(r => r.id === roomType);
    
    if (!room || nights <= 0) return;
    
    const total = nights * room.price;
    
    const summaryElements = {
        period: document.getElementById('summary-period'),
        nights: document.getElementById('summary-nights'),
        room: document.getElementById('summary-room'),
        total: document.getElementById('summary-total')
    };
    
    if (summaryElements.period) summaryElements.period.textContent = `${formatDate(checkin)} - ${formatDate(checkout)}`;
    if (summaryElements.nights) summaryElements.nights.textContent = `${nights} noite${nights > 1 ? 's' : ''}`;
    if (summaryElements.room) summaryElements.room.textContent = room.name;
    if (summaryElements.total) summaryElements.total.textContent = formatCurrency(total);
}

// ========== MODAL FUNCTIONS ==========

function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animate modal entrance
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    }
}

function openGuestModal() {
    const modal = document.getElementById('guestModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeGuestModal() {
    const modal = document.getElementById('guestModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset modal state
        document.getElementById('guestLoginView').style.display = 'block';
        document.getElementById('guestDashboard').style.display = 'none';
    }
}

// ========== MOBILE OPTIMIZATIONS ==========

function initializeMobileOptimizations() {
    // Optimize for mobile performance
    if ('IntersectionObserver' in window) {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Reduce animations on mobile for better performance
    if (window.innerWidth <= 768) {
        document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
        
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 3) particle.style.display = 'none';
        });
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Recalculate heights and positions
            const heroHeight = window.innerHeight;
            document.querySelector('.hero').style.minHeight = heroHeight + 'px';
        }, 100);
    });
}

// ========== UTILITY FUNCTIONS ==========

function generateReservationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'RSR-';
    for (let i = 0; i < 6; i++) {
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

// ========== HOTEL DATA ==========

const hotelData = {
    rooms: [
        {
            id: 'standard',
            name: 'Apartamento Standard',
            description: 'Apartamento moderno e confortável equipado com todas as comodidades essenciais para uma estadia perfeita.',
            price: 280,
            features: ['Frigobar', 'TV Smart', 'Ar Condicionado', 'Mesa de Trabalho', 'Internet Banda Larga', 'Wi-Fi Gratuito', 'Serviço de Quarto'],
            capacity: 2
        },
        {
            id: 'deluxe',
            name: 'Apartamento Deluxe',
            description: 'Apartamento espaçoso com comodidades premium e ambiente sofisticado para maior conforto.',
            price: 380,
            features: ['Frigobar', 'TV Smart 50"', 'Ar Condicionado', 'Mesa de Trabalho', 'Internet Banda Larga', 'Wi-Fi Gratuito', 'Varanda', 'Cofre', 'Serviço de Quarto'],
            capacity: 3
        },
        {
            id: 'suite',
            name: 'Suíte Premium',
            description: 'Nossa suíte mais luxuosa com amplo espaço, vista privilegiada e acabamentos de primeira linha.',
            price: 580,
            features: ['Frigobar', 'TV Smart 55"', 'Ar Condicionado', 'Mesa de Trabalho', 'Internet Banda Larga', 'Wi-Fi Gratuito', 'Varanda Premium', 'Cofre', 'Banheira', 'Sala de Estar', 'Serviço de Quarto 24h'],
            capacity: 4
        }
    ]
};

// ========== ROOMS RENDERING ==========

function renderRooms() {
    const roomsGrid = document.getElementById('roomsGrid');
    if (!roomsGrid) return;
    
    roomsGrid.innerHTML = '';
    
    hotelData.rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card hover-lift scroll-reveal';

        const roomIcons = {
            'standard': 'fas fa-bed',
            'deluxe': 'fas fa-star',
            'suite': 'fas fa-crown'
        };

        roomCard.innerHTML = `
            <div class="room-image ${room.id}">
                <i class="${roomIcons[room.id]}"></i>
                <span>${room.name}</span>
                <div class="image-overlay">
                    <i class="fas fa-search-plus"></i>
                    <span>Ver detalhes</span>
                </div>
            </div>
            <div class="room-content">
                <h3 class="room-title">${room.name}</h3>
                <p class="room-description">${room.description}</p>
                <div class="room-features">
                    ${room.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="room-capacity">
                    <i class="fas fa-users"></i>
                    <span>Até ${room.capacity} pessoa${room.capacity > 1 ? 's' : ''}</span>
                </div>
                <div class="room-price">
                    <div>
                        <span class="price">${formatCurrency(room.price)}</span>
                        <span class="price-unit">/ noite</span>
                    </div>
                    <button class="btn btn-primary" onclick="selectRoom('${room.id}')">
                        <i class="fas fa-calendar-plus"></i>
                        Reservar
                    </button>
                </div>
            </div>
        `;
        
        roomsGrid.appendChild(roomCard);
    });
    
    // Re-initialize scroll reveal for new elements
    setTimeout(() => {
        const newElements = roomsGrid.querySelectorAll('.scroll-reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        newElements.forEach(element => {
            observer.observe(element);
        });
    }, 100);
}

function selectRoom(roomId) {
    const roomSelect = document.getElementById('room-type');
    if (roomSelect) {
        roomSelect.value = roomId;
        openBookingModal();
        updateBookingSummary();
    }
}

function renderGuestDashboard() {
    const dashboard = document.getElementById('guestDashboard');
    if (!dashboard) return;
    
    dashboard.innerHTML = `
        <h2>Bem-vindo, João!</h2>
        <div class="guest-info">
            <div class="reservation-card">
                <h3>Sua Reserva</h3>
                <p><strong>Código:</strong> DEMO-001</p>
                <p><strong>Período:</strong> Hoje - 3 dias</p>
                <p><strong>Quarto:</strong> Apartamento Deluxe</p>
                <p><strong>Status:</strong> <span class="status confirmed">Ativa</span></p>
            </div>
            <div class="demo-services">
                <h3>Serviços Disponíveis (Demo)</h3>
                <div class="services-grid">
                    <div class="service-item">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Produtos do Frigobar</span>
                    </div>
                    <div class="service-item">
                        <i class="fas fa-tshirt"></i>
                        <span>Serviços de Lavanderia</span>
                    </div>
                    <div class="service-item">
                        <i class="fas fa-concierge-bell"></i>
                        <span>Serviço de Quarto</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========== EVENT LISTENERS ==========

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            if (modal.id === 'bookingModal') {
                closeBookingModal();
            } else if (modal.id === 'guestModal') {
                closeGuestModal();
            }
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'Escape':
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => {
                if (modal.id === 'bookingModal') {
                    closeBookingModal();
                } else if (modal.id === 'guestModal') {
                    closeGuestModal();
                }
            });
            break;
        case 'ArrowLeft':
            if (document.querySelector('.carousel-container:hover')) {
                e.preventDefault();
                previousSlide();
            }
            break;
        case 'ArrowRight':
            if (document.querySelector('.carousel-container:hover')) {
                e.preventDefault();
                nextSlide();
            }
            break;
    }
});

// Performance optimization: debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Scroll-based animations can be added here
    }, 16); // ~60fps
});

// ========== CSS ANIMATIONS ==========

// Add additional CSS for animations
const animationStyles = `
<style>
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: scale(0.8) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes modalSlideOut {
    from {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
    to {
        opacity: 0;
        transform: scale(0.8) translateY(-20px);
    }
}

.scroll-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
}

.room-capacity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
    color: var(--text-light);
    font-size: 0.95rem;
}

.room-capacity i {
    color: var(--primary-color);
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.service-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--text-white);
    border-radius: var(--border-radius-small);
    box-shadow: var(--shadow-soft);
    transition: var(--transition);
}

.service-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
}

.service-item i {
    color: var(--primary-color);
    font-size: 1.25rem;
}

.demo-services {
    background: rgba(0, 200, 81, 0.05);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid rgba(0, 200, 81, 0.1);
}

.contact {
    padding: 5rem 0;
    background: var(--text-white);
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
}

.contact-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.contact-item i {
    color: var(--primary-color);
    font-size: 1.5rem;
    margin-top: 0.25rem;
    min-width: 24px;
}

.contact-item h4 {
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.contact-form-section {
    background: rgba(0, 200, 81, 0.05);
    padding: 2.5rem;
    border-radius: var(--border-radius);
    border: 1px solid rgba(0, 200, 81, 0.1);
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.contact-form textarea {
    resize: vertical;
    min-height: 120px;
    font-family: var(--font-primary);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

@media (max-width: 768px) {
    .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .contact-form-section {
        padding: 1.5rem;
    }
}

.footer {
    background: linear-gradient(135deg, var(--text-color) 0%, #0F1419 100%);
    color: var(--text-white);
    padding: 4rem 0 2rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
    color: var(--text-white);
    margin-bottom: 1.5rem;
}

.footer-section p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.75rem;
    line-height: 1.6;
}

.footer-section i {
    margin-right: 0.75rem;
    color: var(--accent-color);
    width: 20px;
}

.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: var(--text-white);
    transition: var(--transition);
    backdrop-filter: blur(10px);
}

.social-links a:hover {
    background: var(--primary-color);
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--shadow-soft);
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
}

.whatsapp-float {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1500;
}

.whatsapp-float a {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #25D366 0%, #20BA5A 100%);
    color: white;
    border-radius: 50px;
    padding: 16px 20px;
    text-decoration: none;
    box-shadow: var(--shadow-medium);
    transition: var(--transition);
    animation: whatsappPulse 3s infinite;
    gap: 12px;
    font-weight: 600;
    font-size: 1rem;
}

.whatsapp-float a:hover {
    background: linear-gradient(135deg, #20BA5A 0%, #25D366 100%);
    transform: translateY(-4px) scale(1.05);
    box-shadow: var(--shadow-strong);
}

.whatsapp-float i {
    font-size: 1.5rem;
}

.whatsapp-text {
    display: inline;
    white-space: nowrap;
}

@keyframes whatsappPulse {
    0%, 100% {
        box-shadow: var(--shadow-medium);
    }
    50% {
        box-shadow: 0 8px 40px rgba(37, 211, 102, 0.4);
    }
}

@media (max-width: 768px) {
    .whatsapp-text {
        display: none;
    }
    
    .whatsapp-float a {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        padding: 0;
    }
    
    .whatsapp-float {
        bottom: 20px;
        right: 20px;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', animationStyles);

// Guest area access
document.addEventListener('DOMContentLoaded', function() {
    const guestAccess = document.querySelector('.guest-access');
    if (guestAccess) {
        guestAccess.addEventListener('click', function(e) {
            e.preventDefault();
            openGuestModal();
        });
    }
});
