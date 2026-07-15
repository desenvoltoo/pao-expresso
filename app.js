const products = [
  { id: 'frances', name: 'Pão francês', description: 'Crocante por fora e macio por dentro.', price: 1.2, emoji: '🥖' },
  { id: 'croissant', name: 'Croissant', description: 'Massa folhada leve e amanteigada.', price: 6.5, emoji: '🥐' },
  { id: 'integral', name: 'Pão integral', description: 'Nutritivo, macio e cheio de fibras.', price: 12.9, emoji: '🍞' },
  { id: 'queijo', name: 'Pão de queijo', description: 'Assado na hora e muito saboroso.', price: 2.5, emoji: '🧀' }
];

const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const toast = document.getElementById('toast');
const productGrid = document.getElementById('productGrid');

const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function save(key, data) {
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  current.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(current));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function openModal(type) {
  const templates = { cadastro, login, pedido, agendamento };
  modalContent.innerHTML = templates[type]();
  modalBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  bindModal(type);
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = '';
}

function cadastro() {
  return `
    <h2>Crie sua conta</h2>
    <p class="modal-intro">Cadastre seus dados para fazer pedidos e agendar entregas.</p>
    <form id="cadastroForm">
      <div class="form-grid">
        <div class="form-group full"><label>Nome completo</label><input name="nome" required placeholder="Seu nome" /></div>
        <div class="form-group"><label>WhatsApp</label><input name="telefone" required type="tel" placeholder="(11) 99999-9999" /></div>
        <div class="form-group"><label>E-mail</label><input name="email" required type="email" placeholder="voce@email.com" /></div>
        <div class="form-group full"><label>Endereço</label><input name="endereco" required placeholder="Rua, número e complemento" /></div>
        <div class="form-group"><label>Bairro</label><input name="bairro" required /></div>
        <div class="form-group"><label>CEP</label><input name="cep" required placeholder="00000-000" /></div>
        <div class="form-group full"><label>Senha</label><input name="senha" required type="password" minlength="6" placeholder="Mínimo de 6 caracteres" /></div>
      </div>
      <button class="btn form-submit">Finalizar cadastro</button>
    </form>`;
}

function login() {
  return `
    <h2>Entrar</h2>
    <p class="modal-intro">Acesse sua conta para acompanhar pedidos e agendamentos.</p>
    <form id="loginForm">
      <div class="form-grid">
        <div class="form-group full"><label>E-mail</label><input name="email" required type="email" /></div>
        <div class="form-group full"><label>Senha</label><input name="senha" required type="password" /></div>
      </div>
      <button class="btn form-submit">Entrar</button>
    </form>`;
}

function productPicker() {
  return `<div class="product-picker">${products.map(product => `
    <div class="picker-row">
      <label>${product.emoji} ${product.name}<br><small>${money(product.price)} cada</small></label>
      <input class="qty-input" data-price="${product.price}" name="${product.id}" type="number" min="0" value="0" aria-label="Quantidade de ${product.name}" />
    </div>`).join('')}</div><div class="summary-box"><span>Total estimado</span><span id="orderTotal">R$ 0,00</span></div>`;
}

function pedido() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  return `
    <h2>Pedido avulso</h2>
    <p class="modal-intro">Escolha os produtos e receba em uma data específica.</p>
    <form id="pedidoForm">
      ${productPicker()}
      <div class="form-grid">
        <div class="form-group"><label>Data da entrega</label><input name="data" type="date" min="${minDate}" required /></div>
        <div class="form-group"><label>Horário</label><select name="horario" required><option value="">Selecione</option><option>06:00 - 07:00</option><option>07:00 - 08:00</option><option>08:00 - 09:00</option><option>09:00 - 10:00</option></select></div>
        <div class="form-group full"><label>Observações</label><textarea name="observacoes" rows="3" placeholder="Ex.: deixar na portaria"></textarea></div>
      </div>
      <button class="btn form-submit">Confirmar pedido avulso</button>
    </form>`;
}

function agendamento() {
  return `
    <h2>Agendar entregas</h2>
    <p class="modal-intro">Monte sua cesta e escolha os dias em que deseja receber.</p>
    <form id="agendamentoForm">
      ${productPicker()}
      <div class="form-grid">
        <div class="form-group full"><label>Dias da semana</label><div class="days-options">
          ${['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'].map(day => `<label style="display:inline-flex;align-items:center;gap:6px;margin:6px 12px 6px 0"><input type="checkbox" name="dias" value="${day}">${day}</label>`).join('')}
        </div></div>
        <div class="form-group"><label>Horário</label><select name="horario" required><option value="">Selecione</option><option>06:00 - 07:00</option><option>07:00 - 08:00</option><option>08:00 - 09:00</option><option>09:00 - 10:00</option></select></div>
        <div class="form-group"><label>Início</label><input name="inicio" type="date" required /></div>
        <div class="form-group full"><label>Forma de pagamento</label><select name="pagamento" required><option value="">Selecione</option><option>Pix semanal</option><option>Pix mensal</option><option>Pagamento na entrega</option></select></div>
      </div>
      <button class="btn form-submit">Criar agendamento</button>
    </form>`;
}

function quantities(form) {
  return products.map(product => ({ ...product, quantity: Number(form.elements[product.id]?.value || 0) })).filter(item => item.quantity > 0);
}

function totalOrder(form) {
  return quantities(form).reduce((total, item) => total + item.price * item.quantity, 0);
}

function bindModal(type) {
  document.querySelectorAll('.qty-input').forEach(input => input.addEventListener('input', event => {
    const form = event.target.closest('form');
    const total = form.querySelector('#orderTotal');
    if (total) total.textContent = money(totalOrder(form));
  }));

  const form = modalContent.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    if (type === 'cadastro') {
      const users = JSON.parse(localStorage.getItem('paoExpressoUsers') || '[]');
      if (users.some(user => user.email === data.email)) return showToast('Este e-mail já está cadastrado.');
      save('paoExpressoUsers', data);
      localStorage.setItem('paoExpressoCurrentUser', JSON.stringify({ nome: data.nome, email: data.email }));
      closeModal();
      return showToast('Cadastro realizado com sucesso!');
    }

    if (type === 'login') {
      const users = JSON.parse(localStorage.getItem('paoExpressoUsers') || '[]');
      const user = users.find(item => item.email === data.email && item.senha === data.senha);
      if (!user) return showToast('E-mail ou senha inválidos.');
      localStorage.setItem('paoExpressoCurrentUser', JSON.stringify({ nome: user.nome, email: user.email }));
      closeModal();
      return showToast(`Bem-vindo, ${user.nome.split(' ')[0]}!`);
    }

    const items = quantities(form);
    if (!items.length) return showToast('Selecione pelo menos um produto.');

    if (type === 'agendamento') {
      const days = [...form.querySelectorAll('input[name="dias"]:checked')].map(item => item.value);
      if (!days.length) return showToast('Selecione pelo menos um dia da semana.');
      save('paoExpressoSchedules', { ...data, dias: days, items, totalPorEntrega: totalOrder(form) });
      closeModal();
      return showToast('Agendamento criado com sucesso!');
    }

    save('paoExpressoOrders', { ...data, items, total: totalOrder(form), status: 'Confirmado' });
    closeModal();
    showToast('Pedido avulso confirmado!');
  });
}

productGrid.innerHTML = products.map(product => `
  <article class="product-card">
    <div class="product-emoji">${product.emoji}</div>
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <div class="product-footer"><span class="product-price">${money(product.price)}</span><button class="add-product" data-open="pedido" aria-label="Pedir ${product.name}">+</button></div>
  </article>`).join('');

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-open]');
  if (trigger) openModal(trigger.dataset.open);
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
document.getElementById('menuButton').addEventListener('click', () => document.querySelector('.nav').classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => document.querySelector('.nav').classList.remove('open')));