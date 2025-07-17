// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
    });
});

// Modal functionality
const productModal = document.getElementById('productModal');
const closeModal = document.querySelector('.close-modal');
const productForm = document.getElementById('productForm');

function openProductModal(productName, productPrice) {
    document.getElementById('modalTitle').textContent = `Contratar Plano ${productName}`;
    document.getElementById('selectedProduct').value = productName;
    document.getElementById('selectedPrice').value = productPrice;
    productModal.style.display = 'flex';
}

closeModal.addEventListener('click', function() {
    productModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Função para mostrar notificação
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    // Reset animation by briefly hiding and showing again
    setTimeout(() => {
        notification.style.display = 'none';
        setTimeout(() => {
            notification.style.display = 'block';
        }, 10);
    }, 3000);
}

// Validação reforçada
function isValidDiscordInput(input) {
    return /^\d{17,20}$/.test(input) || /^.{2,32}#\d{4}$/.test(input);
}

// Enviar formulário de produto
productForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const productName = document.getElementById('selectedProduct').value;
    const productPrice = document.getElementById('selectedPrice').value;
    const discordUsername = document.getElementById('discordUsername').value;
    const discordId = document.getElementById('discordId').value;

    if (!discordUsername || !discordId) {
        showNotification('Por favor, preencha todos os campos.');
        return;
    }

    if (!isValidDiscordInput(discordId)) {
        showNotification('⚠️ ID inválido! Use formato 123456789012345678 ou Usuário#0000');
        return;
    }

    sendProductWebhook(productName, productPrice, discordUsername, discordId);
    productModal.style.display = 'none';
    productForm.reset();
});

// Função para enviar webhook de produto
function sendProductWebhook(productName, productPrice, discordUsername, discordId) {
    const webhooks = {
        'Básico': 'https://discord.com/api/webhooks/1395507526484758599/YqUqFTgw3ceV-K6RdslrSJyR4XB1U68tgARWnw8uFiNSs1gJ-dPeNkXlDnQMpnWhmVpP',
        'Profissional': 'https://discord.com/api/webhooks/1395507773252571247/XfMYtLf58dRx-I1pEiL7A02voTf8a0IDq88P69b8WJnT1piJIxzcZ47B9Dv1DaX_jjqg',
        'Premium': 'https://discord.com/api/webhooks/1395507730789175296/SPD0ruTofLgs6_xlHmkuGyQW66_9MwnK37MpQ0hk2qdHqkCmUMsvM8g3guQkL8igiEgq'
    };

    const webhookURL = webhooks[productName];

    if (!webhookURL) {
        showNotification('Webhook não configurado para este produto.');
        return;
    }

    const embed = {
        title: `🎉 Novo pedido do plano ${productName}`,
        color: 0xE50914,
        fields: [
            {
                name: '👤 Usuário',
                value: `${discordUsername} (<@${discordId}>)`,
                inline: true
            },
            {
                name: '🆔 ID do Discord',
                value: discordId,
                inline: true
            },
            {
                name: '📦 Plano',
                value: productName,
                inline: true
            },
            {
                name: '💰 Preço',
                value: productPrice,
                inline: true
            },
            {
                name: '📅 Data',
                value: new Date().toLocaleString('pt-BR'),
                inline: false
            }
        ],
        timestamp: new Date().toISOString()
    };

    const data = {
        content: `🎉 **Novo pedido recebido!** - ${productName} (${productPrice})\nUsuário: ${discordUsername} (<@${discordId}>)`,
        embeds: [embed]
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            showNotification(`Pedido do plano ${productName} enviado com sucesso! Entraremos em contato em breve.`);
        } else {
            showNotification('Erro ao enviar pedido. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Erro ao enviar pedido. Tente novamente.');
    });
}

// Formulário de pedido personalizado
document.getElementById('customOrderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const discordUsername = document.getElementById('customDiscordUsername').value;
    const discordId = document.getElementById('customDiscordId').value;
    const botType = document.getElementById('botType').value;
    const orderDetails = document.getElementById('customOrderDetails').value;

    // Validação do ID do Discord
    if (!/^\d{17,20}$/.test(discordId) && !/^.{2,32}#\d{4}$/.test(discordUsername)) {
        showNotification('⚠️ Por favor, insira um ID ou nome de usuário do Discord válido!\nFormato do ID: 123456789012345678\nFormato do usuário: Nome#0000');
        return;
    }

    if (orderDetails.length < 10) {
        showNotification('⚠️ Por favor, descreva seu pedido com mais detalhes!');
        return;
    }

    // Envia para o webhook
    const webhookURL = 'https://discord.com/api/webhooks/1395508025904861284/Yna4LvRGNLLdc35ZAv7eVBKFXYMNN-qhPXAOwbUILale6uxA_8AE-BosVhkqaX0OSNlg';

    const embed = {
        title: '📩 Novo pedido personalizado',
        color: 0xE50914,
        fields: [
            {
                name: '👤 Usuário',
                value: `${discordUsername} (<@${discordId}>)`,
                inline: true
            },
            {
                name: '🆔 ID do Discord',
                value: discordId,
                inline: true
            },
            {
                name: '🤖 Tipo de Bot',
                value: botType,
                inline: true
            },
            {
                name: '📅 Data',
                value: new Date().toLocaleString('pt-BR'),
                inline: false
            },
            {
                name: '📝 Detalhes do Pedido',
                value: orderDetails.length > 1000 ? orderDetails.substring(0, 1000) + '...' : orderDetails,
                inline: false
            }
        ],
        timestamp: new Date().toISOString()
    };

    const data = {
        content: `📩 **Novo pedido personalizado recebido!**\nUsuário: ${discordUsername} (<@${discordId}>)`,
        embeds: [embed]
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            showNotification('✅ Pedido personalizado enviado com sucesso! Entraremos em contato em breve.');
            document.getElementById('customOrderForm').reset();
        } else {
            showNotification('⚠️ Erro ao enviar pedido. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('⚠️ Erro ao enviar pedido. Tente novamente.');
    });
});