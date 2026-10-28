require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Samsung Galaxy S24 Ultra 5G',
    brand: 'Samsung',
    description: 'The Galaxy S24 Ultra is Samsung\'s most powerful phone yet, featuring a built-in S Pen, 200MP camera, and the new Snapdragon 8 Gen 3 processor. Experience AI-powered features for photography, productivity, and creativity.',
    price: 134999,
    discountPrice: 109999,
    category: 'Electronics',
    images: ['https://picsum.photos/seed/samsung/400/400'],
    stock: 50,
    isFeatured: true,
    specifications: [
      { key: 'Display', value: '6.8" QHD+ Dynamic AMOLED' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'RAM', value: '12 GB' },
      { key: 'Storage', value: '256 GB' },
      { key: 'Camera', value: '200 MP Main + 10MP + 50MP + 12MP' },
      { key: 'Battery', value: '5000 mAh' },
    ],
    tags: ['smartphone', '5G', 'Android', 'flagship']
  },
  {
    name: 'Apple iPhone 16 Pro Max',
    brand: 'Apple',
    description: 'iPhone 16 Pro Max. The most advanced iPhone ever. With titanium design, A18 Pro chip, the most powerful ever in a smartphone, 48MP Ultra Wide Camera with autofocus, and Action Button.',
    price: 179900,
    discountPrice: 159900,
    category: 'Electronics',
    images: ['https://picsum.photos/seed/iphone16/400/400'],
    stock: 30,
    isFeatured: true,
    specifications: [
      { key: 'Display', value: '6.9" Super Retina XDR OLED' },
      { key: 'Chip', value: 'A18 Pro' },
      { key: 'Storage Options', value: '256GB, 512GB, 1TB' },
      { key: 'Main Camera', value: '48 MP Fusion camera' },
      { key: 'Battery', value: 'Up to 33 hours video playback' },
    ],
    tags: ['iphone', 'apple', 'iOS', 'flagship']
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    description: 'Industry-leading noise canceling with two processors and eight microphones. The WH-1000XM5 headphones deliver exceptional sound quality with 30mm drivers.',
    price: 34990,
    discountPrice: 26990,
    category: 'Electronics',
    images: ['https://picsum.photos/seed/sonyheadphones/400/400'],
    stock: 75,
    isFeatured: true,
    specifications: [
      { key: 'Type', value: 'Over-ear Wireless' },
      { key: 'Noise Canceling', value: 'Industry-leading ANC' },
      { key: 'Battery Life', value: '30 hours' },
      { key: 'Connectivity', value: 'Bluetooth 5.2, NFC' },
    ],
    tags: ['headphones', 'wireless', 'ANC', 'audio']
  },
  {
    name: 'Nike Air Max 270 React',
    brand: 'Nike',
    description: 'The Nike Air Max 270 React combines two of Nike\'s most innovative cushioning technologies to create an incredibly soft yet responsive ride.',
    price: 12995,
    discountPrice: 8995,
    category: 'Fashion',
    images: ['https://picsum.photos/seed/nikeshoes/400/400'],
    stock: 120,
    isFeatured: false,
    specifications: [
      { key: 'Material', value: 'Mesh upper with synthetic overlays' },
      { key: 'Sole', value: 'React foam + Air Max unit' },
      { key: 'Closure', value: 'Lace-up' },
    ],
    tags: ['shoes', 'sneakers', 'running', 'Nike']
  },
  {
    name: 'MacBook Air 15" M3',
    brand: 'Apple',
    description: 'MacBook Air with M3 chip delivers serious performance in a strikingly thin, fanless design. 18-hour battery, stunning 15.3-inch Liquid Retina display.',
    price: 134900,
    discountPrice: 124900,
    category: 'Electronics',
    images: ['https://picsum.photos/seed/macbookair/400/400'],
    stock: 25,
    isFeatured: true,
    specifications: [
      { key: 'Chip', value: 'Apple M3' },
      { key: 'RAM', value: '8 GB Unified Memory' },
      { key: 'Storage', value: '256 GB SSD' },
      { key: 'Display', value: '15.3" Liquid Retina' },
      { key: 'Battery', value: 'Up to 18 hours' },
    ],
    tags: ['laptop', 'apple', 'macbook', 'M3']
  },
  {
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    brand: 'Instant Pot',
    description: 'The Instant Pot Duo is a 7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté pan, food warmer, and sterilizer.',
    price: 9999,
    discountPrice: 6499,
    category: 'Home & Kitchen',
    images: ['https://picsum.photos/seed/instantpot/400/400'],
    stock: 200,
    isFeatured: false,
    specifications: [
      { key: 'Capacity', value: '5.7 Liters' },
      { key: 'Functions', value: '7-in-1' },
      { key: 'Power', value: '1000 Watts' },
      { key: 'Safety', value: '10 safety mechanisms' },
    ],
    tags: ['kitchen', 'cooking', 'pressure cooker', 'appliance']
  },
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    brand: 'Levi\'s',
    description: 'The Levi\'s 511 Slim Fit Jeans sit below the waist with a slim fit through the thigh, knee, and leg opening. Made with stretch denim for all-day comfort.',
    price: 4999,
    discountPrice: 2999,
    category: 'Fashion',
    images: ['https://picsum.photos/seed/levisjeans/400/400'],
    stock: 300,
    isFeatured: false,
    specifications: [
      { key: 'Fit', value: 'Slim' },
      { key: 'Material', value: '99% Cotton, 1% Elastane' },
      { key: 'Rise', value: 'Mid Rise' },
      { key: 'Closure', value: 'Zipper' },
    ],
    tags: ['jeans', 'denim', 'fashion', 'Levi\'s']
  },
  {
    name: 'Adidas Ultraboost 23 Running Shoes',
    brand: 'Adidas',
    description: 'Ultraboost 23 shoes feature a Primeknit upper and BOOST midsole for incredible energy return in every stride. Built for speed and comfort.',
    price: 16999,
    discountPrice: 12999,
    category: 'Sports',
    images: ['https://picsum.photos/seed/adidas/400/400'],
    stock: 80,
    isFeatured: false,
    specifications: [
      { key: 'Technology', value: 'BOOST midsole' },
      { key: 'Upper', value: 'Primeknit+' },
      { key: 'Use', value: 'Running' },
    ],
    tags: ['running shoes', 'adidas', 'sports', 'boost']
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Connected to MongoDB');

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@shopkart.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: 'admin@shopkart.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91 9000000000'
      });
      console.log('✅ Admin created: admin@shopkart.com / admin123');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Seed products
    const existingCount = await Product.countDocuments();
    if (existingCount === 0) {
      await Product.insertMany(sampleProducts);
      console.log(`✅ ${sampleProducts.length} sample products added`);
    } else {
      console.log(`ℹ️  ${existingCount} products already exist, skipping seed`);
    }

    console.log('\n🚀 Database seeded successfully!');
    console.log('📋 Credentials: admin@shopkart.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
