const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    console.log('✅ Supabase client initialized connected to:', supabaseUrl);
  } catch (e) {
    console.warn('⚠️ Supabase initialization failed:', e.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not set in .env yet. Running in local/mock database mode.');
}

// In-memory / local fallback store if Supabase credentials are not yet populated
const localStore = {
  users: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      _id: '00000000-0000-0000-0000-000000000001',
      name: 'Admin User',
      email: 'admin@delulucrafts.com',
      password: '', // will be hashed in init
      role: 'admin',
      avatar: '',
      phone: '+91 9876543210',
      addresses: [],
      created_at: new Date().toISOString()
    }
  ],
  products: [
    {
      id: '00000000-0000-0000-0000-000000000201',
      _id: '00000000-0000-0000-0000-000000000201',
      name: 'Deluxe Rose & Sunflower Satin Bouquet',
      brand: 'Delulu Crafts',
      description: 'Handcrafted satin ribbon flower arrangement featuring vibrant golden sunflowers, romantic blush pink roses, white lilies, and chamomile daisies wrapped in delicate tulle with a satin bow and "for someone special" gift tag.',
      price: 2499,
      discountPrice: 1899,
      category: 'Handmade Bouquets',
      images: ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'],
      stock: 40,
      sold: 86,
      ratings: 5.0,
      numReviews: 42,
      reviews: [],
      specifications: [
        { key: 'Flowers Included', value: 'Sunflowers, Pink Roses, Lilies, Chamomile' },
        { key: 'Material', value: 'Premium Silk Satin Ribbon + Layered Tulle' },
        { key: 'Packaging', value: 'Deluxe Gift Box + Gift Tag' },
        { key: 'Lifespan', value: 'Everlasting (Never withers)' }
      ],
      tags: ['bouquet', 'handmade', 'sunflower', 'satin flowers', 'roses', 'gift'],
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000202',
      _id: '00000000-0000-0000-0000-000000000202',
      name: 'Blush Pink Satin Tulip & Lily Arrangement',
      brand: 'Delulu Crafts',
      description: 'Soft pastel pink satin tulips combined with ivory lilies and delicate baby\'s breath. Beautifully wrapped in blush crepe paper and tied with a wide silk ribbon.',
      price: 1999,
      discountPrice: 1499,
      category: 'Ribbon & Satin Flowers',
      images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80'],
      stock: 35,
      sold: 52,
      ratings: 4.9,
      numReviews: 28,
      reviews: [],
      specifications: [
        { key: 'Flower Count', value: '9 Stems' },
        { key: 'Material', value: 'Korean Satin Ribbon' },
        { key: 'Theme', value: 'Romantic Pastel Pink' }
      ],
      tags: ['tulips', 'pink flowers', 'romantic', 'handmade'],
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000203',
      _id: '00000000-0000-0000-0000-000000000203',
      name: '"For Someone Special" Deluxe Gift Hamper',
      brand: 'Delulu Crafts',
      description: 'The ultimate handcrafted gift box. Contains a mini satin rose bouquet, pure soy lavender & rose candle, handcrafted ribbon hair bows, and a handwritten calligraphy letter.',
      price: 3499,
      discountPrice: 2799,
      category: 'Gift Hampers & Boxes',
      images: ['https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80'],
      stock: 25,
      sold: 64,
      ratings: 5.0,
      numReviews: 35,
      reviews: [],
      specifications: [
        { key: 'Contents', value: 'Mini Bouquet + Candle + 2 Bows + Custom Card' },
        { key: 'Box Type', value: 'Rigid Keepsake Box with Ribbon Bow' }
      ],
      tags: ['gift hamper', 'gift box', 'for someone special', 'birthday gift'],
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000204',
      _id: '00000000-0000-0000-0000-000000000204',
      name: 'Handcrafted Crochet Chamomile Daisy Pot',
      brand: 'Delulu Crafts',
      description: 'Delicate hand-crocheted white daisies and sunflower desk pot. Adds warmth and charm to any desk or bedroom vanity.',
      price: 899,
      discountPrice: 699,
      category: 'Crochet Floral',
      images: ['https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80'],
      stock: 50,
      sold: 41,
      ratings: 4.8,
      numReviews: 19,
      reviews: [],
      specifications: [
        { key: 'Material', value: '100% Milk Cotton Yarn' },
        { key: 'Base', value: 'Ceramic Pot' }
      ],
      tags: ['crochet', 'daisy', 'handmade', 'desk decor'],
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000205',
      _id: '00000000-0000-0000-0000-000000000205',
      name: 'Handmade Coquette Satin Ribbon Bow Set (4 pcs)',
      brand: 'Delulu Crafts',
      description: 'Set of 4 handcrafted French barrette ribbon bows in blush pink, cream white, rose, and dusty rose. Perfect coquette hair accessories.',
      price: 599,
      discountPrice: 399,
      category: 'Hair Accessories',
      images: ['https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&auto=format&fit=crop&q=80'],
      stock: 60,
      sold: 78,
      ratings: 4.9,
      numReviews: 24,
      reviews: [],
      specifications: [
        { key: 'Pieces', value: '4 Hair Bows' },
        { key: 'Clip Type', value: 'Alligator Clip' }
      ],
      tags: ['hair bow', 'coquette', 'satin ribbon', 'accessories'],
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000101',
      _id: '00000000-0000-0000-0000-000000000101',
      name: 'Samsung Galaxy S24 Ultra 5G',
      brand: 'Samsung',
      description: 'The Galaxy S24 Ultra is Samsung\'s most powerful phone yet, featuring a built-in S Pen, 200MP camera, and the Snapdragon 8 Gen 3 processor with Galaxy AI.',
      price: 134999,
      discountPrice: 109999,
      category: 'Electronics',
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'],
      stock: 50,
      sold: 12,
      ratings: 4.8,
      numReviews: 24,
      reviews: [],
      specifications: [
        { key: 'Display', value: '6.8" QHD+ Dynamic AMOLED' },
        { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
        { key: 'RAM', value: '12 GB' },
        { key: 'Storage', value: '256 GB' }
      ],
      tags: ['smartphone', '5G', 'Android', 'flagship'],
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      _id: '00000000-0000-0000-0000-000000000102',
      name: 'Apple iPhone 16 Pro Max',
      brand: 'Apple',
      description: 'iPhone 16 Pro Max with titanium design, A18 Pro chip, 48MP Ultra Wide camera with autofocus, and custom Camera Control button.',
      price: 179900,
      discountPrice: 159900,
      category: 'Electronics',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'],
      stock: 30,
      sold: 19,
      ratings: 4.9,
      numReviews: 45,
      reviews: [],
      specifications: [
        { key: 'Display', value: '6.9" Super Retina XDR OLED' },
        { key: 'Chip', value: 'A18 Pro' },
        { key: 'Storage', value: '256 GB' }
      ],
      tags: ['iphone', 'apple', 'iOS', 'flagship'],
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      _id: '00000000-0000-0000-0000-000000000103',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony',
      description: 'Industry-leading noise canceling with two processors and eight microphones. Exceptional hi-res sound quality with 30mm precision drivers.',
      price: 34990,
      discountPrice: 26990,
      category: 'Electronics',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
      stock: 75,
      sold: 38,
      ratings: 4.7,
      numReviews: 56,
      reviews: [],
      specifications: [
        { key: 'Type', value: 'Over-ear Wireless' },
        { key: 'Battery', value: '30 hours' },
        { key: 'ANC', value: 'Dual Processor ANC' }
      ],
      tags: ['headphones', 'wireless', 'ANC', 'audio'],
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000104',
      _id: '00000000-0000-0000-0000-000000000104',
      name: 'MacBook Air 15" M3',
      brand: 'Apple',
      description: 'MacBook Air with M3 chip delivers serious performance in a thin, fanless unibody design. 18-hour battery and Liquid Retina display.',
      price: 134900,
      discountPrice: 124900,
      category: 'Electronics',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
      stock: 25,
      sold: 8,
      ratings: 4.9,
      numReviews: 18,
      reviews: [],
      specifications: [
        { key: 'Chip', value: 'Apple M3' },
        { key: 'RAM', value: '8 GB' },
        { key: 'Storage', value: '256 GB SSD' }
      ],
      tags: ['laptop', 'apple', 'macbook', 'M3'],
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000105',
      _id: '00000000-0000-0000-0000-000000000105',
      name: 'Nike Air Max 270 React',
      brand: 'Nike',
      description: 'The Nike Air Max 270 React combines Nike\'s innovative cushioning technologies for an ultra-soft and resilient stride.',
      price: 12995,
      discountPrice: 8995,
      category: 'Fashion',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'],
      stock: 120,
      sold: 45,
      ratings: 4.6,
      numReviews: 32,
      reviews: [],
      specifications: [
        { key: 'Material', value: 'Mesh + Synthetic' },
        { key: 'Sole', value: 'React foam + Air Max' }
      ],
      tags: ['shoes', 'sneakers', 'running', 'Nike'],
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000106',
      _id: '00000000-0000-0000-0000-000000000106',
      name: 'Minimalist Ceramic Dinner Set (16 Piece)',
      brand: 'Artisan Clay',
      description: 'Handcrafted matte ceramic dinner set with natural stone speckles, food-safe glaze, microwave and dishwasher safe.',
      price: 7499,
      discountPrice: 4999,
      category: 'Home & Kitchen',
      images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80'],
      stock: 40,
      sold: 14,
      ratings: 4.7,
      numReviews: 12,
      reviews: [],
      specifications: [
        { key: 'Pieces', value: '16' },
        { key: 'Material', value: 'Stoneware Ceramic' }
      ],
      tags: ['ceramic', 'kitchen', 'dining', 'home'],
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000107',
      _id: '00000000-0000-0000-0000-000000000107',
      name: 'The Psychology of Money — Morgan Housel',
      brand: 'Harriman House',
      description: 'Timeless lessons on wealth, greed, and happiness. Doing well with money isn\'t necessarily about what you know. It\'s about how you behave.',
      price: 499,
      discountPrice: 349,
      category: 'Books',
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'],
      stock: 200,
      sold: 89,
      ratings: 4.9,
      numReviews: 140,
      reviews: [],
      specifications: [
        { key: 'Author', value: 'Morgan Housel' },
        { key: 'Format', value: 'Paperback' }
      ],
      tags: ['book', 'finance', 'bestseller'],
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000108',
      _id: '00000000-0000-0000-0000-000000000108',
      name: 'Pure Botanical Facial Serum (50ml)',
      brand: 'Lumiere Botanics',
      description: 'Cold-pressed botanical oils enriched with squalane, rosehip, and Vitamin C for deeply nourished, radiant skin.',
      price: 2499,
      discountPrice: 1799,
      category: 'Beauty',
      images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'],
      stock: 90,
      sold: 34,
      ratings: 4.8,
      numReviews: 29,
      reviews: [],
      specifications: [
        { key: 'Volume', value: '50ml' },
        { key: 'Skin Type', value: 'All Skin Types' }
      ],
      tags: ['skincare', 'serum', 'organic', 'beauty'],
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ],
  cart: {}, // userId -> [ { product, quantity } ]
  wishlist: {}, // userId -> [ productId ]
  orders: []
};

// Initialize admin password hash
(async () => {
  const salt = await bcrypt.genSalt(10);
  localStore.users[0].password = await bcrypt.hash('admin123', salt);
})();

// Helper to map DB snake_case product row to camelCase format
function mapProduct(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    brand: row.brand,
    description: row.description,
    price: Number(row.price),
    discountPrice: Number(row.discount_price || 0),
    category: row.category,
    images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? JSON.parse(row.images) : []),
    stock: Number(row.stock || 0),
    sold: Number(row.sold || 0),
    ratings: Number(row.ratings || 0),
    numReviews: Number(row.num_reviews || 0),
    specifications: Array.isArray(row.specifications) ? row.specifications : (typeof row.specifications === 'string' ? JSON.parse(row.specifications) : []),
    tags: Array.isArray(row.tags) ? row.tags : (typeof row.tags === 'string' ? JSON.parse(row.tags) : []),
    isFeatured: Boolean(row.is_featured),
    isActive: Boolean(row.is_active !== false),
    createdAt: row.created_at || new Date().toISOString(),
    reviews: row.reviews || []
  };
}

// ----------------------------------------------------
// DATABASE SERVICE (SUPABASE WITH FALLBACK)
// ----------------------------------------------------
const db = {
  isSupabaseConfigured() {
    return !!supabase;
  },
  getSupabaseClient() {
    return supabase;
  },

  // === USERS ===
  users: {
    async findByEmail(email) {
      if (supabase) {
        const { data, error } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).single();
        if (error || !data) return null;
        return { ...data, _id: data.id };
      }
      const u = localStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      return u ? { ...u } : null;
    },

    async findById(id) {
      if (supabase) {
        const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
        if (error || !data) return null;
        return { ...data, _id: data.id };
      }
      const u = localStore.users.find(u => u.id === id || u._id === id);
      return u ? { ...u } : null;
    },

    async create({ name, email, password, phone }) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      if (supabase) {
        const { data, error } = await supabase.from('users').insert([{
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          phone: phone || '',
          role: 'user',
          addresses: []
        }]).select();
        if (error && !error.message.includes('JSON')) throw new Error(error.message);
        if (data && data[0]) return { ...data[0], _id: data[0].id };
        const found = await this.findByEmail(email);
        if (found) return found;
        return { name, email, role: 'user', _id: 'usr_' + Date.now() };
      }
      const newUser = {
        id: 'usr_' + Date.now(),
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role: 'user',
        addresses: [],
        createdAt: new Date().toISOString()
      };
      localStore.users.push(newUser);
      return { ...newUser };
    },

    async update(id, updates) {
      if (supabase) {
        const payload = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.phone !== undefined) payload.phone = updates.phone;
        if (updates.avatar !== undefined) payload.avatar = updates.avatar;
        if (updates.role !== undefined) payload.role = updates.role;
        if (updates.addresses !== undefined) payload.addresses = updates.addresses;
        if (updates.password) {
          const salt = await bcrypt.genSalt(10);
          payload.password = await bcrypt.hash(updates.password, salt);
        }
        const { data, error } = await supabase.from('users').update(payload).eq('id', id).select();
        if (error && !error.message.includes('JSON')) throw new Error(error.message);
        if (data && data[0]) return { ...data[0], _id: data[0].id };
        const found = await this.findById(id);
        return found || { id, _id: id, ...payload };
      }
      const u = localStore.users.find(u => u.id === id || u._id === id);
      if (!u) throw new Error('User not found');
      if (updates.name !== undefined) u.name = updates.name;
      if (updates.phone !== undefined) u.phone = updates.phone;
      if (updates.avatar !== undefined) u.avatar = updates.avatar;
      if (updates.addresses !== undefined) u.addresses = updates.addresses;
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        u.password = await bcrypt.hash(updates.password, salt);
      }
      return { ...u };
    },

    async findAll() {
      if (supabase) {
        const { data, error } = await supabase.from('users').select('id, name, email, role, phone, avatar, created_at').order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return data.map(d => ({ ...d, _id: d.id }));
      }
      return localStore.users.map(({ password, ...rest }) => rest);
    },

    async count(role) {
      if (supabase) {
        let q = supabase.from('users').select('*', { count: 'exact', head: true });
        if (role) q = q.eq('role', role);
        const { count, error } = await q;
        if (error) throw new Error(error.message);
        return count || 0;
      }
      return role ? localStore.users.filter(u => u.role === role).length : localStore.users.length;
    }
  },

  // === PRODUCTS ===
  products: {
    async find({ keyword, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12, featured, allStatus = false }) {
      if (supabase) {
        let q = supabase.from('products').select('*', { count: 'exact' });
        if (!allStatus) q = q.eq('is_active', true);
        if (category) q = q.eq('category', category);
        if (brand) q = q.ilike('brand', `%${brand}%`);
        if (keyword) q = q.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`);
        if (featured === 'true' || featured === true) q = q.eq('is_featured', true);
        if (minPrice) q = q.gte('price', Number(minPrice));
        if (maxPrice) q = q.lte('price', Number(maxPrice));

        if (sort === 'price_asc') q = q.order('discount_price', { ascending: true }).order('price', { ascending: true });
        else if (sort === 'price_desc') q = q.order('discount_price', { ascending: false }).order('price', { ascending: false });
        else if (sort === 'rating') q = q.order('ratings', { ascending: false });
        else if (sort === 'popular') q = q.order('sold', { ascending: false });
        else q = q.order('created_at', { ascending: false });

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        q = q.range(from, to);

        const { data, count, error } = await q;
        if (error) throw new Error(error.message);
        const products = (data || []).map(mapProduct);
        return { products, total: count || 0, pages: Math.ceil((count || 0) / limit), page: Number(page) };
      }

      let list = localStore.products.filter(p => allStatus || p.isActive);
      if (category) list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      if (brand) list = list.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
      if (keyword) {
        const k = keyword.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(k) || p.description.toLowerCase().includes(k));
      }
      if (featured === 'true' || featured === true) list = list.filter(p => p.isFeatured);
      if (minPrice) list = list.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
      if (maxPrice) list = list.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));

      if (sort === 'price_asc') list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      else if (sort === 'price_desc') list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      else if (sort === 'rating') list.sort((a, b) => b.ratings - a.ratings);
      else if (sort === 'popular') list.sort((a, b) => b.sold - a.sold);
      else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = list.length;
      const start = (page - 1) * limit;
      const products = list.slice(start, start + limit);
      return { products, total, pages: Math.ceil(total / limit), page: Number(page) };
    },

    async findById(id) {
      if (supabase) {
        const { data: p, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error || !p) return null;
        // Fetch reviews
        const { data: revs } = await supabase.from('reviews').select('*').eq('product_id', id).order('created_at', { ascending: false });
        const prod = mapProduct(p);
        prod.reviews = revs || [];
        return prod;
      }
      return localStore.products.find(p => p.id === id || p._id === id) || null;
    },

    async getCategories() {
      if (supabase) {
        const { data, error } = await supabase.from('products').select('category').eq('is_active', true);
        if (error) throw new Error(error.message);
        return [...new Set(data.map(d => d.category))];
      }
      return [...new Set(localStore.products.filter(p => p.isActive).map(p => p.category))];
    },

    async create(productData) {
      if (supabase) {
        const row = {
          name: productData.name,
          brand: productData.brand,
          description: productData.description,
          price: Number(productData.price),
          discount_price: Number(productData.discountPrice || 0),
          category: productData.category,
          images: productData.images || [],
          stock: Number(productData.stock || 0),
          specifications: productData.specifications || [],
          tags: productData.tags || [],
          is_featured: Boolean(productData.isFeatured)
        };
        const { data, error } = await supabase.from('products').insert([row]).select().single();
        if (error) throw new Error(error.message);
        return mapProduct(data);
      }
      const newProd = {
        id: 'prod_' + Date.now(),
        _id: 'prod_' + Date.now(),
        ...productData,
        sold: 0,
        ratings: 0,
        numReviews: 0,
        reviews: [],
        isActive: true,
        createdAt: new Date().toISOString()
      };
      localStore.products.unshift(newProd);
      return newProd;
    },

    async update(id, updates) {
      if (supabase) {
        const payload = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.brand !== undefined) payload.brand = updates.brand;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.price !== undefined) payload.price = Number(updates.price);
        if (updates.discountPrice !== undefined) payload.discount_price = Number(updates.discountPrice);
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.images !== undefined) payload.images = updates.images;
        if (updates.stock !== undefined) payload.stock = Number(updates.stock);
        if (updates.sold !== undefined) payload.sold = Number(updates.sold);
        if (updates.isFeatured !== undefined) payload.is_featured = Boolean(updates.isFeatured);
        if (updates.isActive !== undefined) payload.is_active = Boolean(updates.isActive);
        if (updates.specifications !== undefined) payload.specifications = updates.specifications;
        if (updates.tags !== undefined) payload.tags = updates.tags;

        const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return mapProduct(data);
      }
      const p = localStore.products.find(p => p.id === id || p._id === id);
      if (!p) throw new Error('Product not found');
      Object.assign(p, updates);
      return p;
    },

    async delete(id) {
      if (supabase) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return true;
      }
      const idx = localStore.products.findIndex(p => p.id === id || p._id === id);
      if (idx > -1) localStore.products.splice(idx, 1);
      return true;
    },

    async count() {
      if (supabase) {
        const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
        if (error) throw new Error(error.message);
        return count || 0;
      }
      return localStore.products.length;
    },

    async addReview(productId, { userId, userName, rating, comment }) {
      if (supabase) {
        const { data: rev, error } = await supabase.from('reviews').insert([{
          product_id: productId,
          user_id: userId,
          user_name: userName,
          rating: Number(rating),
          comment
        }]).select().single();
        if (error) throw new Error(error.message);

        // recalculate ratings
        const { data: revs } = await supabase.from('reviews').select('rating').eq('product_id', productId);
        if (revs && revs.length > 0) {
          const avg = Math.round((revs.reduce((a, b) => a + b.rating, 0) / revs.length) * 10) / 10;
          await supabase.from('products').update({ ratings: avg, num_reviews: revs.length }).eq('id', productId);
        }
        return rev;
      }
      const p = localStore.products.find(p => p.id === productId || p._id === productId);
      if (!p) throw new Error('Product not found');
      if (!p.reviews) p.reviews = [];
      p.reviews.push({ user: userId, name: userName, rating: Number(rating), comment, createdAt: new Date() });
      const total = p.reviews.reduce((acc, r) => acc + r.rating, 0);
      p.ratings = Math.round((total / p.reviews.length) * 10) / 10;
      p.numReviews = p.reviews.length;
      return p;
    }
  },

  // === CART ===
  cart: {
    async getByUserId(userId) {
      if (supabase) {
        const { data, error } = await supabase.from('cart').select('id, quantity, product_id, products (*)').eq('user_id', userId);
        if (error) throw new Error(error.message);
        return (data || []).map(item => ({
          _id: item.id,
          id: item.id,
          quantity: item.quantity,
          product: mapProduct(item.products)
        }));
      }
      const items = localStore.cart[userId] || [];
      return items.map(i => {
        const p = localStore.products.find(prod => prod.id === i.productId || prod._id === i.productId);
        return {
          _id: i.productId,
          product: p,
          quantity: i.quantity
        };
      }).filter(i => !!i.product);
    },

    async addItem(userId, productId, quantity = 1) {
      if (supabase) {
        const { data: existing } = await supabase.from('cart').select('*').eq('user_id', userId).eq('product_id', productId).single();
        if (existing) {
          await supabase.from('cart').update({ quantity: existing.quantity + Number(quantity) }).eq('id', existing.id);
        } else {
          await supabase.from('cart').insert([{ user_id: userId, product_id: productId, quantity: Number(quantity) }]);
        }
        return await this.getByUserId(userId);
      }
      if (!localStore.cart[userId]) localStore.cart[userId] = [];
      const idx = localStore.cart[userId].findIndex(i => i.productId === productId);
      if (idx > -1) {
        localStore.cart[userId][idx].quantity += Number(quantity);
      } else {
        localStore.cart[userId].push({ productId, quantity: Number(quantity) });
      }
      return await this.getByUserId(userId);
    },

    async updateQuantity(userId, productId, quantity) {
      if (supabase) {
        if (quantity <= 0) {
          await supabase.from('cart').delete().eq('user_id', userId).eq('product_id', productId);
        } else {
          await supabase.from('cart').update({ quantity: Number(quantity) }).eq('user_id', userId).eq('product_id', productId);
        }
        return await this.getByUserId(userId);
      }
      if (!localStore.cart[userId]) return [];
      const idx = localStore.cart[userId].findIndex(i => i.productId === productId);
      if (idx > -1) {
        if (quantity <= 0) localStore.cart[userId].splice(idx, 1);
        else localStore.cart[userId][idx].quantity = Number(quantity);
      }
      return await this.getByUserId(userId);
    },

    async removeItem(userId, productId) {
      if (supabase) {
        await supabase.from('cart').delete().eq('user_id', userId).eq('product_id', productId);
        return await this.getByUserId(userId);
      }
      if (localStore.cart[userId]) {
        localStore.cart[userId] = localStore.cart[userId].filter(i => i.productId !== productId);
      }
      return await this.getByUserId(userId);
    },

    async clear(userId) {
      if (supabase) {
        await supabase.from('cart').delete().eq('user_id', userId);
        return [];
      }
      localStore.cart[userId] = [];
      return [];
    }
  },

  // === WISHLIST ===
  wishlist: {
    async getByUserId(userId) {
      if (supabase) {
        const { data, error } = await supabase.from('wishlist').select('product_id, products (*)').eq('user_id', userId);
        if (error) throw new Error(error.message);
        return (data || []).map(item => mapProduct(item.products)).filter(Boolean);
      }
      const ids = localStore.wishlist[userId] || [];
      return ids.map(id => localStore.products.find(p => p.id === id || p._id === id)).filter(Boolean);
    },

    async toggle(userId, productId) {
      if (supabase) {
        const { data: existing } = await supabase.from('wishlist').select('id').eq('user_id', userId).eq('product_id', productId).single();
        let action = '';
        if (existing) {
          await supabase.from('wishlist').delete().eq('id', existing.id);
          action = 'removed';
        } else {
          await supabase.from('wishlist').insert([{ user_id: userId, product_id: productId }]);
          action = 'added';
        }
        const updated = await this.getByUserId(userId);
        return { wishlist: updated, action };
      }
      if (!localStore.wishlist[userId]) localStore.wishlist[userId] = [];
      const idx = localStore.wishlist[userId].indexOf(productId);
      let action = '';
      if (idx > -1) {
        localStore.wishlist[userId].splice(idx, 1);
        action = 'removed';
      } else {
        localStore.wishlist[userId].push(productId);
        action = 'added';
      }
      const updated = await this.getByUserId(userId);
      return { wishlist: updated, action };
    }
  },

  // === ORDERS ===
  orders: {
    async create(orderData) {
      if (supabase) {
        const row = {
          user_id: orderData.userId,
          items: orderData.items,
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod || 'COD',
          payment_status: orderData.paymentStatus || 'Pending',
          order_status: orderData.orderStatus || 'Processing',
          items_price: Number(orderData.itemsPrice),
          shipping_price: Number(orderData.shippingPrice || 0),
          total_amount: Number(orderData.totalAmount)
        };
        const { data, error } = await supabase.from('orders').insert([row]).select().single();
        if (error) throw new Error(error.message);
        return { ...data, _id: data.id };
      }
      const newOrder = {
        id: 'ord_' + Date.now(),
        _id: 'ord_' + Date.now(),
        user: orderData.userId,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod || 'COD',
        paymentStatus: orderData.paymentStatus || 'Pending',
        orderStatus: orderData.orderStatus || 'Processing',
        itemsPrice: Number(orderData.itemsPrice),
        shippingPrice: Number(orderData.shippingPrice || 0),
        totalAmount: Number(orderData.totalAmount),
        createdAt: new Date().toISOString()
      };
      localStore.orders.unshift(newOrder);
      return newOrder;
    },

    async getByUserId(userId) {
      if (supabase) {
        const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return (data || []).map(d => ({
          ...d,
          _id: d.id,
          orderStatus: d.order_status,
          paymentStatus: d.payment_status,
          paymentMethod: d.payment_method,
          itemsPrice: Number(d.items_price),
          shippingPrice: Number(d.shipping_price),
          totalAmount: Number(d.total_amount),
          shippingAddress: d.shipping_address,
          createdAt: d.created_at
        }));
      }
      return localStore.orders.filter(o => o.user === userId || o.user?._id === userId);
    },

    async getById(id) {
      if (supabase) {
        const { data, error } = await supabase.from('orders').select('*, users (id, name, email)').eq('id', id).single();
        if (error || !data) return null;
        return {
          ...data,
          _id: data.id,
          user: data.users ? { ...data.users, _id: data.users.id } : null,
          orderStatus: data.order_status,
          paymentStatus: data.payment_status,
          paymentMethod: data.payment_method,
          itemsPrice: Number(data.items_price),
          shippingPrice: Number(data.shipping_price),
          totalAmount: Number(data.total_amount),
          shippingAddress: data.shipping_address,
          createdAt: data.created_at
        };
      }
      return localStore.orders.find(o => o.id === id || o._id === id) || null;
    },

    async find({ status, page = 1, limit = 20 }) {
      if (supabase) {
        let q = supabase.from('orders').select('*, users (id, name, email)', { count: 'exact' });
        if (status) q = q.eq('order_status', status);
        q = q.order('created_at', { ascending: false });
        const from = (page - 1) * limit;
        q = q.range(from, from + limit - 1);
        const { data, count, error } = await q;
        if (error) throw new Error(error.message);
        const orders = (data || []).map(d => ({
          ...d,
          _id: d.id,
          user: data.users ? { ...data.users, _id: data.users.id } : d.user,
          orderStatus: d.order_status,
          paymentStatus: d.payment_status,
          paymentMethod: d.payment_method,
          itemsPrice: Number(d.items_price),
          shippingPrice: Number(d.shipping_price),
          totalAmount: Number(d.total_amount),
          createdAt: d.created_at
        }));
        return { orders, total: count || 0, pages: Math.ceil((count || 0) / limit) };
      }
      let list = status ? localStore.orders.filter(o => o.orderStatus === status) : localStore.orders;
      const total = list.length;
      const start = (page - 1) * limit;
      return { orders: list.slice(start, start + limit), total, pages: Math.ceil(total / limit) };
    },

    async updateStatus(id, { orderStatus, paymentStatus }) {
      if (supabase) {
        const payload = { updated_at: new Date() };
        if (orderStatus) payload.order_status = orderStatus;
        if (paymentStatus) payload.payment_status = paymentStatus;
        if (orderStatus === 'Delivered') payload.delivered_at = new Date();
        const { data, error } = await supabase.from('orders').update(payload).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return { ...data, _id: data.id };
      }
      const o = localStore.orders.find(o => o.id === id || o._id === id);
      if (!o) throw new Error('Order not found');
      if (orderStatus) o.orderStatus = orderStatus;
      if (paymentStatus) o.paymentStatus = paymentStatus;
      if (orderStatus === 'Delivered') o.deliveredAt = new Date();
      return o;
    },

    async getStats() {
      if (supabase) {
        const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user');
        const { data: paidOrders } = await supabase.from('orders').select('total_amount').eq('payment_status', 'Paid');
        const totalRevenue = (paidOrders || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        const { data: recentOrders } = await supabase.from('orders').select('*, users (name)').order('created_at', { ascending: false }).limit(5);

        return {
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          totalUsers: totalUsers || 0,
          totalRevenue,
          recentOrders: (recentOrders || []).map(r => ({
            ...r,
            _id: r.id,
            user: { name: r.users?.name || 'Customer' },
            totalAmount: Number(r.total_amount),
            orderStatus: r.order_status,
            createdAt: r.created_at
          }))
        };
      }
      const totalProducts = localStore.products.length;
      const totalOrders = localStore.orders.length;
      const totalUsers = localStore.users.filter(u => u.role === 'user').length;
      const totalRevenue = localStore.orders
        .filter(o => o.paymentStatus === 'Paid')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const recentOrders = localStore.orders.slice(0, 5);
      return { totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders };
    }
  }
};

module.exports = db;

