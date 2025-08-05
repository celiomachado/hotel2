// Hotel Serra do Roncador - JavaScript Moderno

// Variáveis globais
let currentHeroSlide = 0;
let heroSlides = [];
let heroInterval;
let currentGalleryImage = 0;

// Dados das imagens da galeria
const galleryImages = [
    {
        src: "https://cdn.builder.io/api/v1/image/assets%2F1762ab1c919245729991c11ce81cbf92%2F2527191ae3454c8f85288dd6459e6cd8?format=webp&width=1200",
        alt: "Fachada Principal do Hotel"
    },
    {
        src: "https://cdn.builder.io/api/v1/image/assets%2F1762ab1c919245729991c11ce81cbf92%2F633454aca8f64200ad9a4ac796b01b8a?format=webp&width=1200",
        alt: "Área da Piscina"
    },
    {
        src: "https://cdn.builder.io/api/v1/image/assets%2Fa53abce3361241f699f719346ad0e3df%2F316fe399b61a4428945622d3450b69a2?format=webp&width=1200",
        alt: "Jardim e Paisagismo"
    },
    {
        src: "https://cdn.builder.io/api/v1/image/assets%2Fa53abce3361241f699f719346ad0e3df%2Ff3d2ef19a657470183f2b6f40c843758?format=webp&width=1200",
        alt: "Apartamentos Confortáveis"
    },
    {
        src: "https://cdn.builder.io/api/v1/image/assets%2F1762ab1c919245729991c11ce81cbf92%2F633454aca8f64200ad9a4ac796b01b8a?format=webp&width=1200",
        alt: "Área de Lazer Completa"
    },
    {
        src: "https://cdn.builder.io/api/v1/image/assets%2Fa53abce3361241f699f719346ad0e3df%2F316fe399b61a4428945622d3450b69a2?format=webp&width=1200",
        alt: "Vista Externa do Hotel"
    }
];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeNavigation();
        initializeHeroSlider();
        initializeScrollAnimations();
        initializeParallax();
        initializeMicroInteractions();
        initializeForms();
        initializeMobileMenu();
        setMinDate();

        // Inicia o slider automaticamente após breve delay
        setTimeout(() => {
            if (heroSlides && heroSlides.length > 1) {
                startHeroSlider();
            }
        }, 1000);
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
});

// ========== NAVEGAÇÃO ==========

function initializeNavigation() {
    // Efeito de scroll no header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 248, 240, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(184, 52, 28, 0.1)';
        } else {
            header.style.background = 'rgba(255, 248, 240, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(184, 52, 28, 0.1)';
        }
    });

    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                const mobileMenu = document.getElementById('navMenu');
                const mobileToggle = document.getElementById('mobileToggle');
                if (mobileMenu && mobileToggle && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });
}

function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (mobileToggle && navMenu && !mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

// ========== HERO SLIDER ==========

function initializeHeroSlider() {
    heroSlides = document.querySelectorAll('.hero-slide');
    console.log('Hero slides encontrados:', heroSlides.length);
    if (heroSlides.length > 0) {
        // Limpar qualquer estilo incorreto das imagens
        heroSlides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.0)';
                img.style.animation = 'none';
            }
        });
        showHeroSlide(0);
    }
}

function showHeroSlide(index) {
    if (heroSlides && heroSlides.length > 0) {
        // Remover active de todos os slides
        heroSlides.forEach(slide => {
            slide.classList.remove('active');
            const img = slide.querySelector('img');
            if (img) {
                img.style.animation = 'none';
            }
        });

        // Remover active de todos os indicadores
        document.querySelectorAll('.hero-indicators .indicator').forEach(indicator =>
            indicator.classList.remove('active')
        );

        if (heroSlides[index]) {
            // Ativar slide atual
            heroSlides[index].classList.add('active');
            const indicators = document.querySelectorAll('.hero-indicators .indicator');
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
            currentHeroSlide = index;

            // Iniciar animação contínua da imagem
            const activeImg = heroSlides[index].querySelector('img');
            if (activeImg) {
                setTimeout(() => {
                    activeImg.style.animation = 'heroVideoEffect 20s ease-in-out infinite';
                }, 100);
            }
        }
    }
}

// Garantir que as funções estejam no escopo global
window.nextHeroSlide = function() {
    if (heroSlides && heroSlides.length > 0) {
        const next = (currentHeroSlide + 1) % heroSlides.length;
        showHeroSlide(next);
    }
};

window.previousHeroSlide = function() {
    const prev = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
    showHeroSlide(prev);
};

window.currentHeroSlide = function(index) {
    showHeroSlide(index);
    stopHeroSlider();
    startHeroSlider();
};

function startHeroSlider() {
    if (heroSlides && heroSlides.length > 1) {
        console.log('Iniciando slider com', heroSlides.length, 'slides');
        clearInterval(heroInterval); // Limpar intervalo anterior
        heroInterval = setInterval(() => {
            console.log('Trocando slide...');
            nextHeroSlide();
        }, 12000);
    } else {
        console.log('Slider não iniciado - slides:', heroSlides?.length);
    }
}

function stopHeroSlider() {
    clearInterval(heroInterval);
}

// Pausar slider ao passar mouse
document.querySelector('.hero-section')?.addEventListener('mouseenter', stopHeroSlider);
document.querySelector('.hero-section')?.addEventListener('mouseleave', startHeroSlider);

// ========== SISTEMA AVANÇADO DE ANIMAÇÕES ==========

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animações em cascata para cards
                if (entry.target.classList.contains('stagger-container')) {
                    const items = entry.target.querySelectorAll('.stagger-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);

    // Aplicar animações específicas para cada seção

    // Seção Sobre - slide from sides
    document.querySelectorAll('.about-text').forEach(el => {
        el.classList.add('slide-in-left');
        observer.observe(el);
    });

    document.querySelectorAll('.about-image').forEach(el => {
        el.classList.add('slide-in-right');
        observer.observe(el);
    });

    // Features - bounce in
    document.querySelectorAll('.feature-item').forEach((el, index) => {
        el.classList.add('bounce-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Quartos - scale in com stagger
    const roomsGrid = document.querySelector('.rooms-grid');
    if (roomsGrid) {
        roomsGrid.classList.add('stagger-container');
        document.querySelectorAll('.room-card').forEach(el => {
            el.classList.add('stagger-item', 'scale-in');
        });
        observer.observe(roomsGrid);
    }

    // Estrutura - rotate in
    document.querySelectorAll('.facility-item').forEach((el, index) => {
        el.classList.add('rotate-in');
        el.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(el);
    });

    // Galeria - animação em cascata avançada
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    const items = entry.target.querySelectorAll('.gallery-item');

                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate-in');

                            // Adicionar efeito de brilho após a animação
                            setTimeout(() => {
                                item.style.boxShadow = '0 0 30px rgba(184, 52, 28, 0.3)';
                                setTimeout(() => {
                                    item.style.boxShadow = '';
                                }, 800);
                            }, 300);
                        }, index * 200); // Delay escalonado
                    });

                    galleryObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        galleryObserver.observe(galleryGrid);
    }

    // Contato - slide up
    document.querySelectorAll('.contact-item, .contact-form').forEach(el => {
        el.classList.add('slide-in-up');
        observer.observe(el);
    });

    // Títulos das seções - fade in especial
    document.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Subtítulos - fade in com delay
    document.querySelectorAll('.section-subtitle').forEach(el => {
        el.classList.add('fade-in', 'delay-200');
        observer.observe(el);
    });
}

// Parallax scrolling para elementos especiais (exceto hero)
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;

        parallaxElements.forEach(el => {
            // Não aplicar parallax se o elemento estiver dentro do hero
            const isHeroElement = el.closest('.hero-section');
            if (isHeroElement) return;

            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Sistema avançado de micro-interações
function initializeMicroInteractions() {
    // Removido configuração de delays dos botões do hero para evitar animação de "pular"
    // Efeito ripple nos botões
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Hover effects avançados para cards
    document.querySelectorAll('.room-card, .facility-item').forEach(card => {
        card.classList.add('hover-lift');

        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) rotateY(3deg) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(184, 52, 28, 0.25)';
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
            this.style.boxShadow = '';
            this.style.zIndex = '';
        });
    });

    // Animação de digitação para títulos
    initializeTypingAnimation();

    // Partículas flutuantes
    initializeFloatingParticles();

    // Efeito glow nos botões principais
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.classList.add('hover-glow');

        // Efeito de magnetismo do mouse
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translateY(-6px) scale(1.05) rotateX(${y / 10}deg) rotateY(${x / 10}deg)`;
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Animação de digitação para títulos especiais
function initializeTypingAnimation() {
    const heroTitles = document.querySelectorAll('.hero-title');

    heroTitles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid white';

        let i = 0;
        const typeInterval = setInterval(() => {
            title.textContent += text.charAt(i);
            i++;

            if (i >= text.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    title.style.borderRight = 'none';
                }, 1000);
            }
        }, 80);
    });
}

// Sistema de partículas flutuantes
function initializeFloatingParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
    `;

    heroSection.appendChild(particlesContainer);

    // Criar partículas
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        animation: floatParticle ${15 + Math.random() * 10}s linear infinite;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 5}s;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    `;

    container.appendChild(particle);
}

// ========== GALERIA ==========

window.openGalleryModal = function(index) {
    currentGalleryImage = index;
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('galleryModalImage');

    if (modal && modalImage && galleryImages[index]) {
        modalImage.src = galleryImages[index].src;
        modalImage.alt = galleryImages[index].alt;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};

window.closeGalleryModal = function() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.nextGalleryImage = function() {
    currentGalleryImage = (currentGalleryImage + 1) % galleryImages.length;
    const modalImage = document.getElementById('galleryModalImage');
    if (modalImage && galleryImages[currentGalleryImage]) {
        modalImage.src = galleryImages[currentGalleryImage].src;
        modalImage.alt = galleryImages[currentGalleryImage].alt;
    }
};

window.prevGalleryImage = function() {
    currentGalleryImage = (currentGalleryImage - 1 + galleryImages.length) % galleryImages.length;
    const modalImage = document.getElementById('galleryModalImage');
    if (modalImage && galleryImages[currentGalleryImage]) {
        modalImage.src = galleryImages[currentGalleryImage].src;
        modalImage.alt = galleryImages[currentGalleryImage].alt;
    }
};

// ========== RESERVAS ==========

window.openReservationModal = function(roomType) {
    const modal = document.getElementById('reservationModal');
    const roomSelect = document.getElementById('tipoQuarto');

    if (modal && roomSelect) {
        // Pré-selecionar o tipo de quarto
        roomSelect.value = roomType;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};

window.closeReservationModal = function() {
    const modal = document.getElementById('reservationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// ========== FORMULÁRIOS ==========

function initializeForms() {
    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Formulário de reserva
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationSubmit);
    }
    
    // Máscara para telefone
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d+)/, '($1) $2');
            }
            e.target.value = value;
        });
    });
    
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            e.target.value = value;
        });
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validação básica
    if (!data.nome || !data.email || !data.telefone || !data.mensagem) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Simular envio
    showNotification('Enviando mensagem...', 'info');
    
    setTimeout(() => {
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        e.target.reset();
    }, 2000);
}

function handleReservationSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validação básica
    if (!data.checkin || !data.checkout || !data.hospedes || !data.tipoQuarto || 
        !data.nomeCompleto || !data.emailReserva || !data.telefoneReserva || !data.cpf) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Validar datas
    const checkinDate = new Date(data.checkin);
    const checkoutDate = new Date(data.checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkinDate < today) {
        showNotification('A data de check-in não pode ser anterior a hoje.', 'error');
        return;
    }
    
    if (checkoutDate <= checkinDate) {
        showNotification('A data de check-out deve ser posterior ao check-in.', 'error');
        return;
    }
    
    // Simular processamento da reserva
    showNotification('Processando sua reserva...', 'info');
    
    setTimeout(() => {
        const reservationCode = generateReservationCode();
        showNotification(`Reserva confirmada! Código: ${reservationCode}`, 'success');
        closeReservationModal();
        e.target.reset();
        
        // Redirecionar para WhatsApp com dados da reserva
        const message = `Olá! Acabo de fazer uma reserva pelo site. Código: ${reservationCode}. Dados: Check-in: ${data.checkin}, Check-out: ${data.checkout}, Quarto: ${data.tipoQuarto}, Hóspedes: ${data.hospedes}`;
        const whatsappUrl = `https://wa.me/5566346820014?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }, 3000);
}

// ========== UTILITÁRIOS ==========

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
    });
}

function generateReservationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'HSR-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    const color = type === 'success' ? '#28a745' : 
                  type === 'error' ? '#dc3545' : '#17a2b8';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 350px;
        font-size: 0.95rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ========== EVENT LISTENERS GLOBAIS ==========

// Fechar modais com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGalleryModal();
        closeReservationModal();
    }
});

// Fechar modais clicando fora
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('modal')) {
        if (e.target.id === 'galleryModal') {
            closeGalleryModal();
        } else if (e.target.id === 'reservationModal') {
            closeReservationModal();
        }
    }
});

// Navegação da galeria com teclado
document.addEventListener('keydown', function(e) {
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            prevGalleryImage();
        } else if (e.key === 'ArrowRight') {
            nextGalleryImage();
        }
    }
});

// Navegação do hero slider com teclado (quando hero estiver em foco)
document.querySelector('.hero-section')?.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        previousHeroSlide();
        stopHeroSlider();
        startHeroSlider();
    } else if (e.key === 'ArrowRight') {
        nextHeroSlide();
        stopHeroSlider();
        startHeroSlider();
    }
});

// Touch/Swipe support para mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    // Hero slider swipe
    if (e.target.closest('.hero-section') && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
            previousHeroSlide();
        } else {
            nextHeroSlide();
        }
        stopHeroSlider();
        startHeroSlider();
    }
    
    // Gallery modal swipe
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal && galleryModal.style.display === 'block' && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
            prevGalleryImage();
        } else {
            nextGalleryImage();
        }
    }
}, { passive: true });

// Otimizações de performance
window.addEventListener('resize', debounce(function() {
    // Recalcular posições se necessário
}, 250));

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading para imagens (se necessário)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// CSS adicional para animações via JavaScript
const additionalStyles = `
<style>
@keyframes floatParticle {
    0% {
        transform: translateY(100vh) translateX(0px) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
        opacity: 0;
    }
}

@keyframes textGlow {
    0%, 100% {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    50% {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.5);
    }
}
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notification {
    pointer-events: auto;
    cursor: pointer;
}

.notification:hover {
    transform: translateX(-5px);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Analíticas simples (opcional)
function trackEvent(eventName, eventData = {}) {
    // Aqui você pode integrar com Google Analytics, Facebook Pixel, etc.
    console.log('Event tracked:', eventName, eventData);
}

// Rastrear eventos importantes
document.addEventListener('DOMContentLoaded', () => trackEvent('page_loaded'));
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => trackEvent('cta_clicked', { button: btn.textContent.trim() }));
});
