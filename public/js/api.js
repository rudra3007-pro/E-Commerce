// ============================================
// API HELPER
// ============================================
const API_BASE = '/api';

const getToken = () => localStorage.getItem('token');
const getUser  = () => JSON.parse(localStorage.getItem('user') || 'null');
const isAdmin  = () => getUser()?.role === 'admin';

const api = {
  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res  = await fetch(`${API_BASE}${path}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },
  get:    (path)       => api.request('GET',    path),
  post:   (path, body) => api.request('POST',   path, body),
  put:    (path, body) => api.request('PUT',    path, body),
  delete: (path)       => api.request('DELETE', path),
};

// ============================================
// TOAST
// ============================================
function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: '○', warning: '!' };
  const toast  = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ============================================
// FORMATTERS
// ============================================
const formatPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
function renderStars(rating, max = 5) {
  return Array.from({ length: max }, (_, i) =>
    `<span class="star ${i < Math.round(rating) ? '' : 'empty'}">★</span>`
  ).join('');
}

// ============================================
// NAVIGATION
// ============================================
function viewProduct(id) { window.location.href = `/product.html?id=${id}`; }
function goTo(page, params = '') { window.location.href = `/${page}${params}`; }

// ============================================
// CART HELPERS
// ============================================
async function addToCart(e, productId, qty = 1) {
  if (e) e.stopPropagation();
  if (!getToken()) { showToast('Please sign in to add items', 'warning'); return goTo('login.html'); }
  try {
    await api.post('/cart', { productId, quantity: qty });
    showToast('Added to cart', 'success');
    updateCartCount();
  } catch (err) { showToast(err.message, 'error'); }
}

async function buyNow(e, productId) {
  if (e) e.stopPropagation();
  await addToCart(null, productId);
  goTo('cart.html');
}

async function updateCartCount() {
  if (!getToken()) return;
  try {
    const cart  = await api.get('/cart');
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  } catch {}
}

// ============================================
// WISHLIST
// ============================================
async function toggleWishlist(e, productId, btn) {
  if (e) e.stopPropagation();
  if (!getToken()) { showToast('Please sign in to save items', 'warning'); return goTo('login.html'); }
  try {
    const data  = await api.post(`/wishlist/${productId}`, {});
    const added = data.action === 'added';
    if (btn) {
      btn.textContent = added ? '♥' : '♡';
      btn.classList.toggle('active', added);
    }
    showToast(added ? 'Saved to wishlist' : 'Removed from wishlist', 'success');
  } catch (err) { showToast(err.message, 'error'); }
}

// ============================================
// PRODUCT CARD
// ============================================
function buildProductCard(p) {
  const user       = getUser();
  const isWished   = user?.wishlist?.includes(p._id);
  const finalPrice = p.discountPrice > 0 ? p.discountPrice : p.price;
  const discPct    = p.discountPrice > 0 ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : (p.discountPercent || 0);

  return `
    <div class="product-card" data-id="${p._id}" onclick="viewProduct('${p._id}')">
      <div class="product-img-wrap">
        ${p.images?.[0]
          ? `<img src="${p.images[0]}" alt="${p.name}" class="product-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : ''}
        <div class="product-img-placeholder" ${p.images?.[0] ? 'style="display:none"' : ''}>📦</div>
        ${discPct > 0 ? `<span class="product-badge">−${discPct}%</span>` : ''}
        <button class="wishlist-btn ${isWished ? 'active' : ''}"
          onclick="toggleWishlist(event,'${p._id}',this)"
          title="${isWished ? 'Remove from wishlist' : 'Save to wishlist'}">
          ${isWished ? '♥' : '♡'}
        </button>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating-row">
          <span class="r-badge"><span class="star">★</span> ${p.ratings || 0}</span>
          <span class="r-count">(${p.numReviews || 0})</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(finalPrice)}</span>
          ${discPct > 0 ? `<span class="product-original">${formatPrice(p.price)}</span><span class="product-off">${discPct}% off</span>` : ''}
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-add-cart" onclick="addToCart(event,'${p._id}')">Add to Cart</button>
        <button class="btn-buy-now" onclick="buyNow(event,'${p._id}')">Buy Now</button>
      </div>
    </div>
  `;
}

// ============================================
// CATEGORIES DATA
// ============================================
const CATEGORIES = [
  { icon: '📱', name: 'Electronics' },
  { icon: '👗', name: 'Fashion' },
  { icon: '🏠', name: 'Home & Kitchen' },
  { icon: '📚', name: 'Books' },
  { icon: '⚽', name: 'Sports' },
  { icon: '✨', name: 'Beauty' },
  { icon: '🧸', name: 'Toys' },
  { icon: '🚗', name: 'Automotive' },
  { icon: '🛒', name: 'Grocery' },
  { icon: '📦', name: 'Other' },
];

// ============================================
// HEADER BUILDER
// ============================================
function buildHeader(activePage = '') {
  const user = getUser();
  return `
    <header class="header">
      <div class="header-inner">
        <a href="/" class="logo">
          <div class="logo-main">ShopKart</div>
          <div class="logo-sub">Premium Marketplace</div>
        </a>
        <div class="search-wrap">
          <input type="text" id="globalSearch" placeholder="Search products, brands…"
            onkeydown="if(event.key==='Enter')doSearch()">
          <button onclick="doSearch()">🔍</button>
        </div>
        <nav class="header-nav">
          ${user ? `
            <button class="h-btn" onclick="goTo('orders.html')">
              <span class="ico">📦</span><span>Orders</span>
            </button>
            ${user.role === 'admin' ? `<button class="h-btn" onclick="goTo('admin.html')"><span class="ico">⚙️</span><span>Admin</span></button>` : ''}
            <button class="h-btn" onclick="goTo('wishlist.html')"><span class="ico">♡</span><span>Saved</span></button>
            <button class="h-btn" id="userMenuTrigger" onclick="toggleUserMenu()">
              <span style="width:28px;height:28px;border-radius:50%;background:var(--gold);color:var(--dark);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px">
                ${user.name.charAt(0).toUpperCase()}
              </span>
              <span>${user.name.split(' ')[0]}</span>
            </button>
          ` : `
            <a href="/login.html" class="h-btn"><span class="ico">👤</span><span>Sign in</span></a>
          `}
          <button class="h-btn" onclick="goTo('cart.html')">
            <span class="ico" style="position:relative">🛒<span class="cart-bubble cart-count">0</span></span>
            <span>Cart</span>
          </button>
        </nav>
      </div>
    </header>
    ${user ? `
    <div class="user-menu" id="userMenu">
      <div class="user-menu-head">
        <div class="user-menu-name">${user.name}</div>
        <div class="user-menu-email">${user.email}</div>
      </div>
      <div class="user-menu-item" onclick="goTo('orders.html');closeUserMenu()">📦 My Orders</div>
      <div class="user-menu-item" onclick="goTo('wishlist.html');closeUserMenu()">♡ Saved Items</div>
      ${user.role === 'admin' ? `<div class="user-menu-item" onclick="goTo('admin.html')">⚙️ Admin Panel</div>` : ''}
      <div class="user-menu-item danger" onclick="logout()">Sign Out</div>
    </div>` : ''}
  `;
}

function toggleUserMenu() {
  const m = document.getElementById('userMenu');
  if (m) m.classList.toggle('open');
}
function closeUserMenu() {
  const m = document.getElementById('userMenu');
  if (m) m.classList.remove('open');
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('#userMenuTrigger') && !e.target.closest('#userMenu')) closeUserMenu();
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showToast('Signed out successfully', 'info');
  setTimeout(() => goTo('login.html'), 600);
}

function doSearch() {
  const q = document.getElementById('globalSearch')?.value?.trim();
  if (q) window.location.href = `/shop.html?keyword=${encodeURIComponent(q)}`;
}

// ============================================
// CATEGORY NAV
// ============================================
function buildCategoryNav(active = '') {
  return `
    <nav class="cat-strip">
      <div class="cat-strip-inner">
        <button class="cat-pill ${!active ? 'active' : ''}" onclick="window.location.href='/shop.html'">
          All
        </button>
        ${CATEGORIES.map(c => `
          <button class="cat-pill ${active === c.name ? 'active' : ''}"
            onclick="window.location.href='/shop.html?category=${encodeURIComponent(c.name)}'">
            <span class="c-ico">${c.icon}</span>${c.name}
          </button>
        `).join('')}
      </div>
    </nav>
  `;
}

// ============================================
// FOOTER
// ============================================
function buildFooter() {
  return `
    <footer class="footer">
      <div class="footer-top">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand-area">
              <div class="footer-brand">ShopKart</div>
              <div class="footer-brand-sub">India's premium online marketplace — curated for quality, designed for you.</div>
            </div>
            <div>
              <div class="footer-col-title">Company</div>
              <a class="footer-link">About Us</a>
              <a class="footer-link">Careers</a>
              <a class="footer-link">Press</a>
              <a class="footer-link">Blog</a>
            </div>
            <div>
              <div class="footer-col-title">Support</div>
              <a class="footer-link">Help Centre</a>
              <a class="footer-link">Track Order</a>
              <a class="footer-link">Returns</a>
              <a class="footer-link">Contact Us</a>
            </div>
            <div>
              <div class="footer-col-title">Follow Us</div>
              <a class="footer-link">Instagram</a>
              <a class="footer-link">Twitter / X</a>
              <a class="footer-link">YouTube</a>
              <a class="footer-link">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container flex-between" style="width:100%">
          <div style="font-size:14px;font-weight:700;background:linear-gradient(135deg,#fff,var(--gold-lt));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">ShopKart</div>
          <div class="footer-copy">© 2024 ShopKart. All rights reserved.</div>
        </div>
      </div>
    </footer>
  `;
}
