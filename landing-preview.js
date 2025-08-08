// Sistema de preview em tempo real da landing page
class LandingPagePreview {
    constructor() {
        this.sections = [];
        this.siteConfig = {};
        this.init();
    }

    async init() {
        await this.loadSections();
        await this.loadSiteConfig();
        this.renderLandingPage();
        this.setupRealTimeUpdates();
    }

    async loadSections() {
        try {
            const client = await waitForSupabase();
            const { data: sections, error } = await client
                .from('landing_sections')
                .select('*')
                .eq('is_active', true)
                .order('order_position');

            if (error) {
                console.error('Erro do Supabase ao carregar seções:', error);
                throw error;
            }
            this.sections = sections || [];
            console.log('Seções carregadas:', this.sections.length);
        } catch (error) {
            console.error('Erro ao carregar seções:', error);
            this.sections = this.getDefaultSections();
            console.log('Usando seções padrão');
        }
    }

    async loadSiteConfig() {
        try {
            const client = await waitForSupabase();
            const { data: configs, error } = await client
                .from('site_config')
                .select('*');

            if (error) {
                console.error('Erro do Supabase ao carregar configurações:', error);
                throw error;
            }

            this.siteConfig = {};
            configs?.forEach(config => {
                this.siteConfig[config.config_key] = config.config_value;
            });
            console.log('Configurações carregadas:', Object.keys(this.siteConfig));
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            this.siteConfig = this.getDefaultConfig();
            console.log('Usando configurações padrão');
        }
    }

    renderLandingPage() {
        this.updateTitle();
        this.updateColors();
        this.updateSections();
        this.updateContactInfo();
    }

    updateTitle() {
        const hotelName = this.siteConfig.hotel_name || 'Hotel Serra do Roncador';
        document.title = `${hotelName} - Hospede-se no coração da natureza`;

        // Atualizar logos/nomes na página
        const logoElements = document.querySelectorAll('.nav-brand h1, .footer-section h3');
        logoElements.forEach(el => {
            if (el.textContent.includes('Hotel') || el.textContent.includes('Paradise')) {
                el.textContent = hotelName;
            }
        });
    }

    updateColors() {
        const primaryColor = this.siteConfig.primary_color || '#4F46E5';
        const secondaryColor = this.siteConfig.secondary_color || '#059669';

        // Criar variáveis CSS customizadas
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --primary-color: ${primaryColor};
                --secondary-color: ${secondaryColor};
            }
            
            .btn-primary {
                background: var(--primary-color) !important;
            }
            
            .btn-primary:hover {
                background: color-mix(in srgb, var(--primary-color) 85%, black) !important;
            }
            
            .nav-link.active,
            .filter-btn.active {
                color: var(--primary-color) !important;
                border-color: var(--primary-color) !important;
            }
            
            .section-title {
                color: var(--primary-color) !important;
            }
            
            .feature-icon,
            .facility-icon {
                background: var(--primary-color) !important;
            }
            
            .btn-secondary {
                background: var(--secondary-color) !important;
            }
            
            .btn-secondary:hover {
                background: color-mix(in srgb, var(--secondary-color) 85%, black) !important;
            }
        `;
        
        // Remover style anterior se existir
        const existingStyle = document.getElementById('dynamic-colors');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'dynamic-colors';
        document.head.appendChild(style);
    }

    updateSections() {
        this.sections.forEach(section => {
            this.updateSection(section);
        });
    }

    updateSection(section) {
        switch(section.section_key) {
            case 'hero':
                this.updateHeroSection(section);
                break;
            case 'about':
                this.updateAboutSection(section);
                break;
            case 'rooms':
                this.updateRoomsSection(section);
                break;
            case 'amenities':
                this.updateAmenitiesSection(section);
                break;
            case 'contact':
                this.updateContactSection(section);
                break;
            default:
                this.updateCustomSection(section);
                break;
        }
    }

    updateHeroSection(section) {
        // Atualizar títulos do hero
        const heroTitles = document.querySelectorAll('.hero-title');
        heroTitles.forEach((title, index) => {
            if (index === 0) { // Primeiro slide usa o título da seção
                title.textContent = section.title || 'Bem-vindo ao Hotel Paradise';
            }
        });

        // Atualizar subtítulos do hero
        const heroSubtitles = document.querySelectorAll('.hero-subtitle');
        heroSubtitles.forEach((subtitle, index) => {
            if (index === 0) { // Primeiro slide usa o subtítulo da seção
                subtitle.textContent = section.subtitle || 'Sua experiência única nos aguarda';
            }
        });

        // Atualizar imagem se fornecida
        if (section.image_url) {
            const heroImages = document.querySelectorAll('.hero-slide img');
            if (heroImages[0]) {
                heroImages[0].src = section.image_url;
            }
        }
    }

    updateAboutSection(section) {
        const aboutSection = document.getElementById('hotel');
        if (!aboutSection) return;

        const sectionTitle = aboutSection.querySelector('.section-title');
        const sectionSubtitle = aboutSection.querySelector('.section-subtitle');
        
        if (sectionTitle) {
            sectionTitle.textContent = section.title || 'O Hotel Serra do Roncador';
        }
        
        if (sectionSubtitle) {
            sectionSubtitle.textContent = section.subtitle || 'Uma experiência única de hospedagem';
        }

        // Atualizar conteúdo principal se fornecido
        if (section.content) {
            const aboutText = aboutSection.querySelector('.about-text .text-block p');
            if (aboutText) {
                aboutText.textContent = section.content;
            }
        }

        // Atualizar imagem se fornecida
        if (section.image_url) {
            const aboutImage = aboutSection.querySelector('.about-image img');
            if (aboutImage) {
                aboutImage.src = section.image_url;
            }
        }
    }

    updateRoomsSection(section) {
        const roomsSection = document.getElementById('acomodacoes');
        if (!roomsSection) return;

        const sectionTitle = roomsSection.querySelector('.section-title');
        const sectionSubtitle = roomsSection.querySelector('.section-subtitle');
        
        if (sectionTitle) {
            sectionTitle.textContent = section.title || 'Nossas Acomodações';
        }
        
        if (sectionSubtitle) {
            sectionSubtitle.textContent = section.subtitle || 'Escolha o apartamento ideal para sua estadia';
        }
    }

    updateAmenitiesSection(section) {
        const amenitiesSection = document.getElementById('estrutura');
        if (!amenitiesSection) return;

        const sectionTitle = amenitiesSection.querySelector('.section-title');
        const sectionSubtitle = amenitiesSection.querySelector('.section-subtitle');
        
        if (sectionTitle) {
            sectionTitle.textContent = section.title || 'Nossa Estrutura';
        }
        
        if (sectionSubtitle) {
            sectionSubtitle.textContent = section.subtitle || 'Comodidades e serviços para tornar sua estadia perfeita';
        }
    }

    updateContactSection(section) {
        const contactSection = document.getElementById('contato');
        if (!contactSection) return;

        const sectionTitle = contactSection.querySelector('.section-title');
        const sectionSubtitle = contactSection.querySelector('.section-subtitle');
        
        if (sectionTitle) {
            sectionTitle.textContent = section.title || 'Entre em Contato';
        }
        
        if (sectionSubtitle) {
            sectionSubtitle.textContent = section.subtitle || 'Estamos prontos para atendê-lo';
        }
    }

    updateCustomSection(section) {
        // Criar ou atualizar seção customizada
        let customSection = document.getElementById(`custom-${section.section_key}`);
        
        if (!customSection) {
            customSection = this.createCustomSection(section);
            
            // Inserir antes da seção de contato
            const contactSection = document.getElementById('contato');
            if (contactSection) {
                contactSection.parentNode.insertBefore(customSection, contactSection);
            } else {
                document.body.appendChild(customSection);
            }
        } else {
            this.updateCustomSectionContent(customSection, section);
        }
    }

    createCustomSection(section) {
        const sectionElement = document.createElement('section');
        sectionElement.id = `custom-${section.section_key}`;
        sectionElement.className = 'custom-section';
        sectionElement.style.cssText = `
            padding: 4rem 0;
            background: #f8fafc;
        `;

        sectionElement.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">${section.title || 'Título da Seção'}</h2>
                    <p class="section-subtitle">${section.subtitle || 'Subtítulo da seção'}</p>
                </div>
                <div class="custom-section-content">
                    ${section.image_url ? `<img src="${section.image_url}" alt="${section.title}" style="max-width: 100%; border-radius: 0.75rem; margin: 2rem 0;">` : ''}
                    <div class="custom-content">
                        <p>${section.content || 'Conteúdo da seção customizada.'}</p>
                        ${section.button_text ? `
                            <a href="${section.button_link || '#'}" class="btn-primary" style="margin-top: 1rem; display: inline-block;">
                                ${section.button_text}
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return sectionElement;
    }

    updateCustomSectionContent(sectionElement, section) {
        const title = sectionElement.querySelector('.section-title');
        const subtitle = sectionElement.querySelector('.section-subtitle');
        const content = sectionElement.querySelector('.custom-content p');
        const button = sectionElement.querySelector('.btn-primary');
        const image = sectionElement.querySelector('img');

        if (title) title.textContent = section.title || 'Título da Seção';
        if (subtitle) subtitle.textContent = section.subtitle || 'Subtítulo da seção';
        if (content) content.textContent = section.content || 'Conteúdo da seção customizada.';
        
        if (button && section.button_text) {
            button.textContent = section.button_text;
            button.href = section.button_link || '#';
            button.style.display = 'inline-block';
        } else if (button) {
            button.style.display = 'none';
        }

        if (image && section.image_url) {
            image.src = section.image_url;
            image.alt = section.title || 'Imagem da seção';
        }
    }

    updateContactInfo() {
        const phone = this.siteConfig.hotel_phone || '(66) 3468-2001';
        const email = this.siteConfig.hotel_email || 'reservas@serradoncador.com.br';
        const address = this.siteConfig.hotel_address || 'BR 158 - Água Boa, MT';

        // Atualizar telefone no header
        const headerPhone = document.querySelector('.contact-info span');
        if (headerPhone) {
            headerPhone.textContent = phone;
        }

        // Atualizar telefones na página
        const phoneElements = document.querySelectorAll('.footer-contact p, .contact-details p');
        phoneElements.forEach(el => {
            if (el.textContent.includes('(') && el.textContent.includes(')')) {
                const iconMatch = el.innerHTML.match(/<i[^>]*><\/i>/);
                const icon = iconMatch ? iconMatch[0] : '';
                if (el.textContent.includes('Telefone') || el.innerHTML.includes('fa-phone')) {
                    el.innerHTML = `${icon} ${phone}<br>Recepção 24 horas`;
                }
            }
        });

        // Atualizar emails
        const emailElements = document.querySelectorAll('.footer-contact p, .contact-details p');
        emailElements.forEach(el => {
            if (el.textContent.includes('@') && (el.textContent.includes('E-mail') || el.innerHTML.includes('fa-envelope'))) {
                const iconMatch = el.innerHTML.match(/<i[^>]*><\/i>/);
                const icon = iconMatch ? iconMatch[0] : '';
                el.innerHTML = `${icon} ${email}<br>contato@serradoncador.com.br`;
            }
        });

        // Atualizar endereços
        const addressElements = document.querySelectorAll('.footer-contact p, .contact-details p');
        addressElements.forEach(el => {
            if ((el.textContent.includes('BR') || el.textContent.includes('Localização')) && (el.innerHTML.includes('fa-map') || el.textContent.includes('Água Boa'))) {
                const iconMatch = el.innerHTML.match(/<i[^>]*><\/i>/);
                const icon = iconMatch ? iconMatch[0] : '';
                el.innerHTML = `${icon} ${address}<br>A 1000m do centro da cidade`;
            }
        });
    }

    setupRealTimeUpdates() {
        // Configurar listening para mudanças em tempo real no Supabase
        try {
            // Escutar mudanças nas seções
            supabaseClient
                .channel('landing-sections-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'landing_sections'
                }, (payload) => {
                    console.log('Seção atualizada:', payload);
                    this.handleSectionChange(payload);
                })
                .subscribe();

            // Escutar mudanças nas configurações
            supabaseClient
                .channel('site-config-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'site_config'
                }, (payload) => {
                    console.log('Configuração atualizada:', payload);
                    this.handleConfigChange(payload);
                })
                .subscribe();

        } catch (error) {
            console.error('Erro ao configurar real-time updates:', error);
        }
    }

    async handleSectionChange(payload) {
        // Recarregar seções e atualizar preview
        await this.loadSections();
        
        if (payload.eventType === 'DELETE') {
            // Remover seção deletada
            const sectionToRemove = document.getElementById(`custom-${payload.old.section_key}`);
            if (sectionToRemove) {
                sectionToRemove.remove();
            }
        } else {
            // Atualizar ou criar seção
            const updatedSection = payload.new;
            if (updatedSection && updatedSection.is_active) {
                this.updateSection(updatedSection);
            }
        }
    }

    async handleConfigChange(payload) {
        // Recarregar configurações e atualizar preview
        await this.loadSiteConfig();
        this.updateTitle();
        this.updateColors();
        this.updateContactInfo();
    }

    // Dados padrão caso não consiga carregar do Supabase
    getDefaultSections() {
        return [
            {
                section_key: 'hero',
                title: 'Hospede-se no coração da natureza',
                subtitle: 'Descubra a perfeita harmonia entre conforto e natureza no Hotel Serra do Roncador',
                content: 'Uma experiência única de hospedagem no coração do Mato Grosso.',
                order_position: 1,
                is_active: true
            },
            {
                section_key: 'about',
                title: 'O Hotel Serra do Roncador',
                subtitle: 'Uma experiência única de hospedagem no coração do Mato Grosso',
                content: 'Localizado estrategicamente à margem da BR 158, a apenas 1000 metros do centro de Água Boa - MT, oferecemos a perfeita combinação entre acessibilidade e tranquilidade da natureza.',
                order_position: 2,
                is_active: true
            }
        ];
    }

    getDefaultConfig() {
        return {
            hotel_name: 'Hotel Serra do Roncador',
            hotel_phone: '(66) 3468-2001',
            hotel_email: 'reservas@serradoncador.com.br',
            hotel_address: 'BR 158 - Água Boa, MT',
            primary_color: '#B8341C',
            secondary_color: '#D4581F'
        };
    }
}

// Inicializar preview quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Aguardar inicialização do Supabase
        await waitForSupabase();
        console.log('Iniciando sistema de preview da landing page');
        window.landingPreview = new LandingPagePreview();
    } catch (error) {
        console.error('Erro ao inicializar preview da landing page:', error);
        // Tentar inicializar com dados padrão após um delay
        setTimeout(() => {
            console.log('Tentando inicializar preview com dados padrão');
            window.landingPreview = new LandingPagePreview();
        }, 2000);
    }
});
