// Admin Panel JavaScript
let currentAdminSection = 'dashboard';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    showAdminSection('dashboard');
});

// Show admin section
function showAdminSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(`admin-${sectionName}`);
    if (section) {
        section.classList.add('active');
    }
    
    // Mark sidebar link as active
    const activeLink = document.querySelector(`.sidebar-link[onclick="showAdminSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    currentAdminSection = sectionName;
    
    // Load section content
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'reservations':
            loadReservationsData();
            break;
        case 'orders':
            loadOrdersData();
            break;
        case 'products':
            loadProductsData();
            break;
        case 'content':
            loadContentEditor();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// Load admin data
function loadAdminData() {
    // Load data from localStorage or use defaults
    if (!hotelData) {
        hotelData = {
            reservations: JSON.parse(localStorage.getItem('hotelReservations') || '[]'),
            purchases: JSON.parse(localStorage.getItem('hotelPurchases') || '[]')
        };
    }
}

// Dashboard functions
function loadDashboardData() {
    const totalReservations = hotelData.reservations?.length || 0;
    const activeGuests = hotelData.reservations?.filter(r => isActiveReservation(r)).length || 0;
    
    const today = new Date().toDateString();
    const todayOrders = hotelData.purchases?.filter(p => {
        const purchaseDate = new Date(p.timestamp).toDateString();
        return today === purchaseDate;
    }).length || 0;
    
    const todayRevenue = hotelData.purchases?.filter(p => {
        const purchaseDate = new Date(p.timestamp).toDateString();
        return today === purchaseDate;
    }).reduce((sum, p) => sum + p.price, 0) || 0;
    
    // Update stats
    document.getElementById('totalReservations').textContent = totalReservations;
    document.getElementById('activeGuests').textContent = activeGuests;
    document.getElementById('todayOrders').textContent = todayOrders;
    document.getElementById('todayRevenue').textContent = formatCurrency(todayRevenue);
    
    // Load recent reservations
    loadRecentReservations();
    loadPendingOrders();
}

function loadRecentReservations() {
    const container = document.getElementById('recentReservations');
    const recentReservations = hotelData.reservations?.slice(-3).reverse() || [];
    
    if (recentReservations.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhuma reserva encontrada</p>';
        return;
    }
    
    container.innerHTML = recentReservations.map(reservation => `
        <div class="mini-card">
            <div class="mini-card-header">
                <strong>${reservation.guestName}</strong>
                <span class="reservation-code">${reservation.id}</span>
            </div>
            <p>${formatDate(reservation.checkin)} - ${formatDate(reservation.checkout)}</p>
            <span class="status ${reservation.status}">${reservation.status === 'confirmed' ? 'Confirmada' : reservation.status}</span>
        </div>
    `).join('');
}

function loadPendingOrders() {
    const container = document.getElementById('pendingOrders');
    const pendingOrders = hotelData.purchases?.filter(p => p.status === 'pending').slice(-3) || [];
    
    if (pendingOrders.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum pedido pendente</p>';
        return;
    }
    
    container.innerHTML = pendingOrders.map(order => `
        <div class="mini-card">
            <div class="mini-card-header">
                <strong>${order.productName}</strong>
                <span class="price">${formatCurrency(order.price)}</span>
            </div>
            <p>Reserva: ${order.reservationId}</p>
            <span class="status pending">Pendente</span>
        </div>
    `).join('');
}

// Reservations functions
function loadReservationsData() {
    const container = document.getElementById('reservationsContent');
    const reservations = hotelData.reservations || [];
    
    container.innerHTML = `
        <div class="data-table-container">
            <div class="table-header">
                <h3>Todas as Reservas (${reservations.length})</h3>
                <div class="table-actions">
                    <button class="btn btn-secondary btn-small" onclick="exportReservations()">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
            </div>
            <div class="data-table">
                ${reservations.length === 0 ? '<p class="no-data">Nenhuma reserva encontrada</p>' : `
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Hóspede</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Quarto</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reservations.map(reservation => `
                            <tr>
                                <td><span class="reservation-code">${reservation.id}</span></td>
                                <td>
                                    <div class="guest-info">
                                        <strong>${reservation.guestName}</strong>
                                        <small>${reservation.guestEmail}</small>
                                    </div>
                                </td>
                                <td>${formatDate(reservation.checkin)}</td>
                                <td>${formatDate(reservation.checkout)}</td>
                                <td>${reservation.roomType}</td>
                                <td><strong>${formatCurrency(reservation.total)}</strong></td>
                                <td><span class="status ${reservation.status}">${reservation.status === 'confirmed' ? 'Confirmada' : reservation.status}</span></td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn-icon" onclick="viewReservation('${reservation.id}')" title="Ver detalhes">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon" onclick="editReservation('${reservation.id}')" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                `}
            </div>
        </div>
    `;
}

// Orders functions
function loadOrdersData() {
    const container = document.getElementById('ordersContent');
    const orders = hotelData.purchases || [];
    
    container.innerHTML = `
        <div class="data-table-container">
            <div class="table-header">
                <h3>Todos os Pedidos (${orders.length})</h3>
                <div class="filter-tabs">
                    <button class="filter-tab active" onclick="filterOrdersTable('all')">Todos</button>
                    <button class="filter-tab" onclick="filterOrdersTable('pending')">Pendentes</button>
                    <button class="filter-tab" onclick="filterOrdersTable('completed')">Concluídos</button>
                </div>
            </div>
            <div class="data-table">
                ${orders.length === 0 ? '<p class="no-data">Nenhum pedido encontrado</p>' : `
                <table id="ordersTable">
                    <thead>
                        <tr>
                            <th>Produto/Serviço</th>
                            <th>Reserva</th>
                            <th>Preço</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(order => `
                            <tr data-status="${order.status}">
                                <td>
                                    <div class="product-info">
                                        <strong>${order.productName}</strong>
                                        <small>${order.type === 'laundry' ? 'Lavanderia' : 'Produto'}</small>
                                    </div>
                                </td>
                                <td>${order.reservationId}</td>
                                <td><strong>${formatCurrency(order.price)}</strong></td>
                                <td>${new Date(order.timestamp).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select">
                                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendente</option>
                                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processando</option>
                                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Concluído</option>
                                    </select>
                                </td>
                                <td>
                                    <button class="btn-icon" onclick="deleteOrder('${order.id}')" title="Excluir">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                `}
            </div>
        </div>
    `;
}

// Products functions
function loadProductsData() {
    const container = document.getElementById('productsContent');
    
    container.innerHTML = `
        <div class="products-manager">
            <div class="manager-header">
                <h3>Gerenciar Produtos e Serviços</h3>
                <button class="btn btn-primary" onclick="openAddProductModal()">
                    <i class="fas fa-plus"></i> Adicionar Item
                </button>
            </div>
            
            <div class="product-categories">
                <div class="category-section">
                    <h4>Produtos do Frigobar</h4>
                    <div class="products-grid">
                        ${hotelData.products?.map(product => `
                            <div class="product-management-card">
                                <div class="product-header">
                                    <h5>${product.name}</h5>
                                    <span class="category-tag">${product.category}</span>
                                </div>
                                <p class="product-description">${product.description}</p>
                                <div class="product-footer">
                                    <span class="price">${formatCurrency(product.price)}</span>
                                    <div class="item-actions">
                                        <button class="btn-icon" onclick="editProduct('${product.id}')" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon danger" onclick="deleteProduct('${product.id}')" title="Excluir">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('') || '<p class="no-data">Nenhum produto cadastrado</p>'}
                    </div>
                </div>
                
                <div class="category-section">
                    <h4>Serviços de Lavanderia</h4>
                    <div class="products-grid">
                        ${hotelData.laundryServices?.map(service => `
                            <div class="product-management-card">
                                <div class="product-header">
                                    <h5>${service.name}</h5>
                                    <span class="category-tag">${service.category}</span>
                                </div>
                                <p class="product-description">${service.description}</p>
                                <div class="product-footer">
                                    <span class="price">${formatCurrency(service.price)}</span>
                                    <div class="item-actions">
                                        <button class="btn-icon" onclick="editService('${service.id}')" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon danger" onclick="deleteService('${service.id}')" title="Excluir">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('') || '<p class="no-data">Nenhum serviço cadastrado</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Content editor functions
function loadContentEditor() {
    const container = document.getElementById('contentEditor');
    
    container.innerHTML = `
        <div class="content-editor">
            <div class="editor-sections">
                <div class="editor-section">
                    <h4>Informações Principais</h4>
                    <div class="form-group">
                        <label for="hotel-name">Nome do Hotel</label>
                        <input type="text" id="hotel-name" value="Hotel Serra do Roncador">
                    </div>
                    <div class="form-group">
                        <label for="hotel-subtitle">Subtítulo</label>
                        <textarea id="hotel-subtitle">Localizado na BR 158 em Água Boa - MT, oferecemos 50 apartamentos modernos e confortáveis para sua estadia</textarea>
                    </div>
                    <div class="form-group">
                        <label for="hotel-description">Descrição Principal</label>
                        <textarea id="hotel-description" rows="4">O Hotel Serra do Roncador está localizado à margem da BR 158, cerca de 1000 metros do centro da cidade de Água Boa – MT. Possuímos 50 apartamentos modernos e confortáveis...</textarea>
                    </div>
                </div>

                <div class="editor-section">
                    <h4>Preços dos Quartos</h4>
                    <div class="room-prices">
                        <div class="price-item">
                            <label>Standard</label>
                            <input type="number" value="280" id="price-standard">
                        </div>
                        <div class="price-item">
                            <label>Deluxe</label>
                            <input type="number" value="380" id="price-deluxe">
                        </div>
                        <div class="price-item">
                            <label>Suíte Premium</label>
                            <input type="number" value="580" id="price-suite">
                        </div>
                    </div>
                </div>

                <div class="editor-section">
                    <h4>Contato</h4>
                    <div class="form-group">
                        <label for="hotel-phone">Telefone</label>
                        <input type="tel" id="hotel-phone" value="(66) 3468-2001">
                    </div>
                    <div class="form-group">
                        <label for="hotel-email">E-mail</label>
                        <input type="email" id="hotel-email" value="reservas@serradoncador.com.br">
                    </div>
                </div>
            </div>

            <div class="editor-actions">
                <button class="btn btn-primary" onclick="saveContentChanges()">
                    <i class="fas fa-save"></i> Salvar Alterações
                </button>
                <button class="btn btn-secondary" onclick="previewChanges()">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
            </div>
        </div>
    `;
}

// Settings functions
function loadSettingsData() {
    const container = document.getElementById('settingsContent');
    
    container.innerHTML = `
        <div class="settings-manager">
            <div class="settings-sections">
                <div class="settings-section">
                    <h4>Backup e Dados</h4>
                    <div class="settings-actions">
                        <button class="btn btn-secondary" onclick="exportAllData()">
                            <i class="fas fa-download"></i> Exportar Todos os Dados
                        </button>
                        <button class="btn btn-secondary" onclick="clearOldData()">
                            <i class="fas fa-trash"></i> Limpar Dados Antigos
                        </button>
                        <button class="btn btn-warning" onclick="resetToDefaults()">
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
                            <label>Lavanderia - Início</label>
                            <input type="time" value="08:00">
                        </div>
                        <div class="time-item">
                            <label>Lavanderia - Fim</label>
                            <input type="time" value="18:00">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Utility functions
function filterOrdersTable(status) {
    const rows = document.querySelectorAll('#ordersTable tbody tr');
    const tabs = document.querySelectorAll('.filter-tab');
    
    // Update tab styles
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter rows
    rows.forEach(row => {
        if (status === 'all' || row.dataset.status === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updateOrderStatus(orderId, newStatus) {
    const order = hotelData.purchases.find(p => p.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('hotelPurchases', JSON.stringify(hotelData.purchases));
        showNotification(`Status do pedido atualizado para: ${newStatus}`, 'success');
        
        // Refresh dashboard if it's the current section
        if (currentAdminSection === 'dashboard') {
            loadDashboardData();
        }
    }
}

function exportAllData() {
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
    
    showNotification('Dados exportados com sucesso!', 'success');
}

function saveContentChanges() {
    // In a real application, this would save to a backend
    showNotification('Alterações salvas com sucesso!', 'success');
}

function previewChanges() {
    window.open('index.html', '_blank');
}

// Mock functions for demo
function viewReservation(id) {
    showNotification(`Visualizando reserva ${id}`, 'info');
}

function editReservation(id) {
    showNotification(`Editando reserva ${id}`, 'info');
}

function deleteOrder(id) {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        hotelData.purchases = hotelData.purchases.filter(p => p.id !== id);
        localStorage.setItem('hotelPurchases', JSON.stringify(hotelData.purchases));
        showNotification('Pedido excluído com sucesso!', 'success');
        loadOrdersData();
    }
}

function editProduct(id) {
    showNotification(`Editando produto ${id}`, 'info');
}

function deleteProduct(id) {
    showNotification(`Produto ${id} excluído`, 'success');
}

function editService(id) {
    showNotification(`Editando serviço ${id}`, 'info');
}

function deleteService(id) {
    showNotification(`Serviço ${id} excluído`, 'success');
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
        
        showNotification(`Removidos: ${removedReservations} reservas e ${removedPurchases} compras antigas`, 'success');
        loadDashboardData();
    }
}

function resetToDefaults() {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão? Todos os dados serão perdidos.')) {
        localStorage.clear();
        showNotification('Configurações restauradas! Recarregando página...', 'success');
        setTimeout(() => location.reload(), 2000);
    }
}
