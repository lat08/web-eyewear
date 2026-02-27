/**
 * Seed script for web-eyewear SQLite database
 * Uses better-sqlite3 directly
 * Run: node prisma/seed.js
 */

const Database = require('better-sqlite3');
const path = require('path');

// Prisma stores the DB in root dev.db
const DB_PATH = path.resolve(__dirname, '..', 'dev.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

console.log('🌱 Starting seed...');
console.log(`📁 DB: ${DB_PATH}`);

// ---------------------------------------------------------------------------
// CLEAR existing data (child tables first)
// ---------------------------------------------------------------------------
db.exec(`
  PRAGMA foreign_keys = OFF;
  DELETE FROM ProductTag;
  DELETE FROM ProductAttribute;
  DELETE FROM ProductImage;
  DELETE FROM OrderItem;
  DELETE FROM Review;
  DELETE FROM "Order";
  DELETE FROM Product;
  DELETE FROM Tag;
  DELETE FROM Category;
  DELETE FROM Collection;
  DELETE FROM User;
  PRAGMA foreign_keys = ON;
`);
console.log('🗑  Cleared existing data');

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function priceToFloat(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
}

// ---------------------------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------------------------
const insertCategory = db.prepare(`
  INSERT INTO Category (name, slug, description, image, createdAt, updatedAt)
  VALUES (@name, @slug, @description, @image, datetime('now'), datetime('now'))
`);

const categories = [
  { name: 'Lens 1 ngày',  slug: 'lens-1-ngay',  description: 'Kính áp tròng dùng 1 lần, tiện lợi và vệ sinh', image: '/images/categories/lens-1-ngay.jpg' },
  { name: 'Lens 1 tháng', slug: 'lens-1-thang',  description: 'Kính áp tròng sử dụng lên đến 1 tháng', image: '/images/categories/lens-1-thang.jpg' },
  { name: 'Lens 6 tháng', slug: 'lens-6-thang',  description: 'Kính áp tròng chất lượng cao dùng đến 6 tháng', image: '/images/categories/lens-6-thang.jpg' },
  { name: 'Phụ kiện',     slug: 'phu-kien',       description: 'Dung dịch ngâm kính, hộp đựng và phụ kiện chăm sóc mắt', image: '/images/categories/phu-kien.jpg' },
];

const catMap = {};
for (const cat of categories) {
  const info = insertCategory.run(cat);
  catMap[cat.slug] = info.lastInsertRowid;
}
console.log('✅  Inserted categories');

// ---------------------------------------------------------------------------
// COLLECTIONS
// ---------------------------------------------------------------------------
const insertCollection = db.prepare(`
  INSERT INTO Collection (name, slug, description, image, createdAt, updatedAt)
  VALUES (@name, @slug, @description, @image, datetime('now'), datetime('now'))
`);

const collectionsList = [
  "Eye Colors Player", "The Player", "Coco Yay!", "Planet", "Virtual Sweetheart", 
  "Feeling Fruity!", "Film Star", "The AI Girls", "Yay", "Spirited Heart", 
  "A Little Tipsy", "AI Girls"
];

const colMap = {};
for (const cName of collectionsList) {
  // Adding a dummy image for now; we'll fetch them from products later if needed
  const info = insertCollection.run({ 
    name: cName, 
    slug: slugify(cName), 
    description: `Bộ sưu tập ${cName} chính hãng`, 
    image: `/images/collections/${slugify(cName)}.jpg` 
  });
  colMap[cName] = info.lastInsertRowid;
}
// Map aliases
colMap["AI Girls"] = colMap["The AI Girls"]; // Treating them as one collection "The AI Girls" maybe, but kept separate for exact match
console.log('✅  Inserted collections');

// ---------------------------------------------------------------------------
// TAGS
// ---------------------------------------------------------------------------
const insertTag = db.prepare(`INSERT INTO Tag (name, slug) VALUES (@name, @slug)`);

const tagDefs = [
  { name: 'Nâu',           slug: 'nau' },
  { name: 'Xám',           slug: 'xam' },
  { name: 'Xanh da trời',  slug: 'xanh-da-troi' },
  { name: 'Xanh lá cây',   slug: 'xanh-la-cay' },
  { name: 'Tím',           slug: 'tim' },
  { name: 'Hồng',          slug: 'hong' },
  { name: 'Đen',           slug: 'den' },
  { name: 'Best Sellers',  slug: 'best-sellers' },
  { name: 'New Arrivals',  slug: 'new-arrivals' },
];

const tagMap = {};
for (const t of tagDefs) {
  const info = insertTag.run(t);
  tagMap[t.name] = info.lastInsertRowid;
}
console.log('✅  Inserted tags');

// ---------------------------------------------------------------------------
// USERS
// ---------------------------------------------------------------------------
const insertUser = db.prepare(`
  INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
  VALUES (@id, @name, @email, @password, @role, datetime('now'), datetime('now'))
`);
insertUser.run({ id: 'admin-001', name: 'Admin', email: 'admin@lensshop.vn', password: 'hashed_password_here', role: 'ADMIN' });
insertUser.run({ id: 'user-001',  name: 'Nguyễn Thị Lan', email: 'lan@gmail.com', password: 'hashed_password_here', role: 'USER' });
console.log('✅  Inserted users');


function getCategoryId(name, usageTimeText) {
  const n = (name + ' ' + usageTimeText).toLowerCase();
  if (n.includes('1 ngày') || n.includes('1 ngay') || n.includes('hộp 10') || n.includes('1 lần')) return catMap['lens-1-ngay'];
  if (n.includes('1 tháng') || n.includes('1 thang')) return catMap['lens-1-thang'];
  if (n.includes('6 tháng') || n.includes('6 thang')) return catMap['lens-6-thang'];
  return catMap['lens-6-thang'];
}

// ---------------------------------------------------------------------------
// PRODUCTS (all 40 - mapping collection to Collection model)
// ---------------------------------------------------------------------------
const productsData = [
  {
    id: 1, price: '600.000', tags: ['Nâu', 'Best Sellers'],
    name: 'Kính áp tròng Yay màu Nâu Beacon | Dòng 1 tháng',
    collection: 'Eye Colors Player', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.3mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 2, price: '450.000', tags: ['Nâu', 'Best Sellers'],
    name: 'Kính áp tròng màu Nâu Ebony | Dòng 1 ngày, Hộp 10 chiếc',
    collection: null, productLine: 'Hyaluronic Acid (Cấp ẩm sâu)',
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '42%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.6mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 10 chiếc (Tương đương 5 cặp)', 'Chất liệu': 'Non-Ionic (Chống đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 3, price: '600.000', tags: ['Nâu', 'New Arrivals'],
    name: 'Kính áp tròng màu Nâu Oolong | Dòng 1 ngày, Hộp 10 chiếc',
    collection: null, productLine: 'Hyaluronic Acid (Cấp ẩm sâu)',
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '42%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.6mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 10 chiếc (Tương đương 5 cặp)', 'Chất liệu': 'Non-Ionic (Chống đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 4, price: '450.000', tags: ['Nâu'],
    name: 'Kính áp tròng màu Nâu Muse | Dòng 6 tháng',
    collection: 'The Player', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.5mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (hPa)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 5, price: '600.000', tags: ['Nâu'],
    name: 'Kính áp tròng màu Nâu Wind Yay | Dòng 6 tháng',
    collection: 'Coco Yay!', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.4mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 6, price: '450.000', tags: ['Nâu'],
    name: 'Kính áp tròng màu Nâu Uranus | Dòng 1 ngày, Hộp 10 chiếc',
    collection: 'Planet', productLine: null,
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.0mm', 'Đường kính tròng màu (G.DIA)': '13.4mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 10 chiếc (Tương đương 5 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 7, price: '600.000', tags: ['Xám', 'Best Sellers'],
    name: 'Kính áp tròng màu Xám Graphite Gleam | Dòng 1 ngày, Hộp 10 chiếc',
    collection: null, productLine: 'Hyaluronic Acid (Cấp ẩm sâu)',
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '42%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.6mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 10 chiếc (Tương đương 5 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 8, price: '450.000', tags: ['Xám', 'Best Sellers'],
    name: 'Kính áp tròng màu Xám Foggy | Dòng 1 ngày, Hộp 10 chiếc',
    collection: null, productLine: 'Hyaluronic Acid (Cấp ẩm sâu)',
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '42%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.5mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 10 chiếc (Tương đương 5 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 9, price: '600.000', tags: ['Xám', 'New Arrivals'],
    name: 'Kính áp tròng màu Xám Galactic Rhythm | Dòng 6 tháng',
    collection: 'Virtual Sweetheart', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.5mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 10, price: '550.000', tags: ['Xám'],
    name: 'Kính áp tròng màu Xám Breezy Hill | Dòng 6 tháng',
    collection: 'Coco Yay!', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 11, price: '600.000', tags: ['Xám'],
    name: 'Kính áp tròng màu Xám Lychee | Dòng 6 tháng',
    collection: 'Feeling Fruity!', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 12, price: '750.000', tags: ['Xám'],
    name: 'Kính áp tròng màu Xám Jelly | Dòng 6 tháng',
    collection: null, productLine: 'Gummy Bear',
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.5mm', 'Đường kính tròng màu (G.DIA)': '13.66mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 13, price: '600.000', tags: ['Xanh da trời', 'Best Sellers'],
    name: 'Kính áp tròng màu Xanh Valor | Dòng 1 ngày, Hộp 2 chiếc',
    collection: 'Film Star', productLine: null,
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.4mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '11.13 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 14, price: '550.000', tags: ['Xanh da trời', 'Best Sellers'],
    name: 'Kính áp tròng màu Xanh Future | Dòng 6 tháng',
    collection: 'Virtual Sweetheart', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 15, price: '600.000', tags: ['Xanh da trời', 'New Arrivals'],
    name: 'Kính áp tròng màu Xanh Starlight Signal | Dòng 6 tháng',
    collection: 'Virtual Sweetheart', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.5mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 16, price: '650.000', tags: ['Xanh da trời'],
    name: 'Kính áp tròng màu Xanh Peach | Dòng 6 tháng',
    collection: 'The Player', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 17, price: '600.000', tags: ['Xanh da trời'],
    name: 'Kính áp tròng màu Xanh Pandora | Dòng 6 tháng',
    collection: 'The AI Girls', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 18, price: '550.000', tags: ['Xanh da trời'],
    name: 'Kính áp tròng màu Xanh Ice | Dòng 1 ngày, Hộp 10 chiếc',
    collection: null, productLine: 'Hyaluronic Acid (Cấp ẩm sâu)',
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '42%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.6mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 10 chiếc (Tương đương 5 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 19, price: '600.000', tags: ['Xanh lá cây', 'Best Sellers'],
    name: 'Kính áp tròng màu Xanh Lá Lucky Yay | Dòng 1 tháng',
    collection: 'Yay', productLine: null,
    attrs: { 'Thời gian sử dụng': '1 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 20, price: '560.000', tags: ['Xanh lá cây', 'Best Sellers'],
    name: 'Kính áp tròng màu Xanh Matcha | Dòng 6 tháng',
    collection: 'The Player', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.53mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (hPa)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 21, price: '600.000', tags: ['Xanh lá cây', 'Best Sellers'],
    name: 'Kính áp tròng màu Xanh Forest | Dòng 1 ngày, Hộp 10 chiếc',
    collection: null, productLine: 'Hyaluronic Acid (Cấp ẩm sâu)',
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '42%', 'Đường kính kính (DIA)': '14.5mm', 'Đường kính tròng màu (G.DIA)': '13.8mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 10 chiếc (Tương đương 5 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 22, price: '770.000', tags: ['Xanh lá cây', 'New Arrivals'],
    name: 'Kính áp tròng màu Xanh Avocado | Dòng 6 tháng',
    collection: 'The Player', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.5mm', 'Đường kính tròng màu (G.DIA)': '13.78mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (hPa)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 23, price: '650.000', tags: ['Xanh lá cây'],
    name: 'Kính áp tròng màu Xanh Vintage | Dòng 6 tháng',
    collection: 'The Player', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.64mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (hPa)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 24, price: '650.000', tags: ['Xanh lá cây'],
    name: 'Kính áp tròng màu Xanh Tipsy Mint | Dòng 6 tháng',
    collection: 'Eye Colors Player', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.0mm', 'Đường kính tròng màu (G.DIA)': '12.15mm', 'Độ cong (B.C)': '8.5mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 25, price: '600.000', tags: ['Tím', 'Best Sellers'],
    name: 'Kính áp tròng màu Tím Hồng KOKO | Dòng 1 tháng',
    collection: null, productLine: 'Colourful Blocks',
    attrs: { 'Thời gian sử dụng': '1 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.2mm', 'Độ cong (B.C)': '8.8mm', 'Độ thẩm thấu oxy': '5.3 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 26, price: '570.000', tags: ['Tím', 'Best Sellers'],
    name: 'Kính áp tròng màu Tím Tequila | Dòng 6 tháng',
    collection: 'The Player', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.2mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 27, price: '700.000', tags: ['Tím', 'New Arrivals'],
    name: 'Kính áp tròng màu Tím Hồng Camellia | Dòng 6 tháng',
    collection: 'Feeling Fruity!', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.0mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 28, price: '600.000', tags: ['Tím'],
    name: 'Kính áp tròng màu Nâu Tím Pearl | Dòng 6 tháng',
    collection: 'Feeling Fruity!', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.5mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 29, price: '500.000', tags: ['Hồng', 'Best Sellers'],
    name: 'Kính áp tròng màu Hồng Fireworks | Dòng 6 tháng',
    collection: 'Coco Yay!', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.5mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 30, price: '590.000', tags: ['Hồng', 'Best Sellers'],
    name: 'Kính áp tròng màu Hồng Rice Wine | Dòng 6 tháng',
    collection: 'Eye Colors Player', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.35mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 31, price: '590.000', tags: ['Hồng', 'New Arrivals'],
    name: 'Kính áp tròng màu Hồng Mauve | Dòng 1 ngày, Hộp 10 chiếc',
    collection: null, productLine: 'Hyaluronic Acid (Cấp ẩm sâu)',
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '42%', 'Đường kính kính (DIA)': '14.0mm', 'Đường kính tròng màu (G.DIA)': '13.4mm', 'Độ cong (B.C)': '8.6mm', 'Độ thẩm thấu oxy': '8.63 (DK/T)', 'Quy cách đóng gói': '1 hộp / 10 chiếc (Tương đương 5 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 32, price: '670.000', tags: ['Hồng'],
    name: 'Kính áp tròng màu Hồng Tím KOKO | Dòng 1 tháng',
    collection: null, productLine: 'Colourful Blocks',
    attrs: { 'Thời gian sử dụng': '1 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.2mm', 'Độ cong (B.C)': '8.8mm', 'Độ thẩm thấu oxy': '5.3 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 33, price: '630.000', tags: ['Hồng'],
    name: 'Kính áp tròng màu Hồng Xanh Aqua Fantasy | Dòng 1 tháng',
    collection: null, productLine: 'Colourful Blocks',
    attrs: { 'Thời gian sử dụng': '1 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.6mm', 'Độ cong (B.C)': '8.8mm', 'Độ thẩm thấu oxy': '5.3 (DK/T)', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 34, price: '680.000', tags: ['Hồng'],
    name: 'Kính áp tròng màu Hồng Shyness | Dòng 1 ngày, Hộp 10 chiếc',
    collection: 'Spirited Heart', productLine: null,
    attrs: { 'Thời gian sử dụng': '1 Ngày (Dùng 1 lần)', 'Độ ngậm nước': '58%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.6mm', 'Độ cong (B.C)': '8.5mm', 'Độ thẩm thấu oxy': '18.5 (DK/T)', 'Quy cách đóng gói': '1 hộp / 10 chiếc (Tương đương 5 cặp)', 'Chất liệu': 'Non-Ionic (Chống bám đọng protein)', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 35, price: '590.000', tags: ['Đen', 'Best Sellers'],
    name: 'Kính áp tròng màu Đen Sesame | Dòng 6 tháng',
    collection: 'A Little Tipsy', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.5mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 36, price: '560.000', tags: ['Đen', 'Best Sellers'],
    name: 'Kính áp tròng màu Đen Illusion | Dòng 6 tháng',
    collection: 'Virtual Sweetheart', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 37, price: '700.000', tags: ['Đen', 'New Arrivals'],
    name: 'Kính áp tròng màu Đen Focus | Dòng 1 tháng',
    collection: 'Film Star', productLine: null,
    attrs: { 'Thời gian sử dụng': '1 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.0mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
  {
    id: 38, price: '690.000', tags: ['Đen'],
    name: 'Kính áp tròng màu Đen Flash Midnight | Dòng 6 tháng',
    collection: 'Virtual Sweetheart', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 39, price: '610.000', tags: ['Đen'],
    name: 'Kính áp tròng màu Đen Photon | Dòng 6 tháng',
    collection: 'AI Girls', productLine: null,
    attrs: { 'Thời gian sử dụng': '6 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.5mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -10.00 Diop' },
  },
  {
    id: 40, price: '660.000', tags: ['Đen'],
    name: 'Kính áp tròng màu Đen Carefree Yay | Dòng 1 tháng',
    collection: 'Yay', productLine: null,
    attrs: { 'Thời gian sử dụng': '1 tháng (kể từ ngày mở nắp)', 'Độ ngậm nước': '38%', 'Đường kính kính (DIA)': '14.2mm', 'Đường kính tròng màu (G.DIA)': '13.3mm', 'Độ cong (B.C)': '8.6mm', 'Quy cách đóng gói': '1 hộp / 2 chiếc (1 cặp)', 'Chất liệu': 'Polymacon', 'Độ cận': '0.00 đến -8.00 Diop' },
  },
];

const insertProduct = db.prepare(`
  INSERT INTO Product (name, slug, price, originalPrice, stock, description, collectionId, productLine, isFeatured, categoryId, createdAt, updatedAt)
  VALUES (@name, @slug, @price, @originalPrice, @stock, @description, @collectionId, @productLine, @isFeatured, @categoryId, datetime('now'), datetime('now'))
`);
const insertImage = db.prepare(`INSERT INTO ProductImage (url, isMain, productId) VALUES (@url, @isMain, @productId)`);
const insertAttr  = db.prepare(`INSERT INTO ProductAttribute (name, value, productId) VALUES (@name, @value, @productId)`);
const insertProductTag = db.prepare(`INSERT OR IGNORE INTO ProductTag (productId, tagId) VALUES (@productId, @tagId)`);

const usedSlugs = new Set();

const seedProducts = db.transaction(() => {
  for (const p of productsData) {
    const price = priceToFloat(p.price);
    const catId = getCategoryId(p.name, p.attrs['Thời gian sử dụng'] || '');
    const isFeatured = p.tags.some(t => t.toLowerCase().includes('best')) ? 1 : 0;
    
    // Find collection mapping
    let collectionId = null;
    if (p.collection && colMap[p.collection]) {
      collectionId = colMap[p.collection];
    }

    let slug = slugify(p.name);
    if (usedSlugs.has(slug)) slug = `${slug}-${p.id}`;
    usedSlugs.add(slug);

    const descStr = Object.entries(p.attrs).map(([k, v]) => `${k}: ${v}`).join(' | ');

    const result = insertProduct.run({
      name: p.name,
      slug,
      price,
      originalPrice: null,
      stock: 50,
      description: descStr,
      collectionId,
      productLine: p.productLine || null,
      isFeatured,
      categoryId: catId,
    });
    const productId = result.lastInsertRowid;

    insertImage.run({ url: `/images/products/${p.id}.1.webp`, isMain: 1, productId });
    insertImage.run({ url: `/images/products/${p.id}.2.webp`, isMain: 0, productId });

    for (const [name, value] of Object.entries(p.attrs)) {
      insertAttr.run({ name, value, productId });
    }

    for (const rawTag of p.tags) {
      const normalized = rawTag.trim();
      let tagId = tagMap[normalized];
      if (!tagId) {
        const found = Object.entries(tagMap).find(([k]) => k.toLowerCase() === normalized.toLowerCase());
        tagId = found ? found[1] : null;
      }
      if (tagId) insertProductTag.run({ productId, tagId });
    }
  }
});

seedProducts();
console.log(`✅  Inserted ${productsData.length} products`);

// ---------------------------------------------------------------------------
// SAMPLE ORDER & REVIEWS
// ---------------------------------------------------------------------------
const prod1 = db.prepare(`SELECT id FROM Product WHERE slug LIKE 'kinh-ap-trong-yay%' LIMIT 1`).get();
const prod2 = db.prepare(`SELECT id FROM Product WHERE slug LIKE 'kinh-ap-trong-mau-nau-ebony%' LIMIT 1`).get();
db.prepare(`
  INSERT INTO "Order" (id, orderNumber, totalAmount, status, paymentMethod, paymentStatus,
    shippingName, shippingPhone, shippingAddress, shippingCity, userId, createdAt, updatedAt)
  VALUES ('order-sample-001','ORD-2026-0001',1050000,'DELIVERED','COD','PAID',
    'Nguyễn Thị Lan','0901234567','123 Nguyễn Huệ','Hồ Chí Minh','user-001', datetime('now'), datetime('now'))
`).run();
if (prod1) db.prepare(`INSERT INTO OrderItem (quantity, price, orderId, productId) VALUES (1, 600000, 'order-sample-001', ${prod1.id})`).run();
if (prod2) db.prepare(`INSERT INTO OrderItem (quantity, price, orderId, productId) VALUES (1, 450000, 'order-sample-001', ${prod2.id})`).run();

const reviewStmt = db.prepare(`
  INSERT INTO Review (rating, comment, productId, userId, createdAt)
  VALUES (@rating, @comment, @productId, @userId, datetime('now'))
`);
const rp1 = db.prepare(`SELECT id FROM Product WHERE slug LIKE 'kinh-ap-trong-yay%' LIMIT 1`).get();
const rp7 = db.prepare(`SELECT id FROM Product WHERE slug LIKE 'kinh-ap-trong-mau-xam-graphite%' LIMIT 1`).get();
const rp13 = db.prepare(`SELECT id FROM Product WHERE slug LIKE 'kinh-ap-trong-mau-xanh-valor%' LIMIT 1`).get();
if (rp1)  reviewStmt.run({ rating: 5, comment: 'Màu đẹp lắm, đeo rất thoải mái, mắt không bị khô!', productId: rp1.id, userId: 'user-001' });
if (rp7)  reviewStmt.run({ rating: 5, comment: 'Giao hàng nhanh, hàng đúng mô tả. Sẽ mua tiếp!', productId: rp7.id, userId: 'user-001' });
if (rp13) reviewStmt.run({ rating: 4, comment: 'Lens đẹp tự nhiên, độ ẩm tốt, đeo cả ngày không khó chịu.', productId: rp13.id, userId: 'user-001' });

db.close();
console.log('\n🎉 Seed completed!');
