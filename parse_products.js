const fs = require('fs');

const input = fs.readFileSync('tmp-products.txt', 'utf-8');

const products = [];
let currentProduct = null;

const lines = input.split('\n').map(l => l.trim());

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;
  
  // Check if it's a new product ID
  const idMatch = line.match(/^(\d+)\.$/);
  if (idMatch) {
    if (currentProduct) {
       products.push(currentProduct);
    }
    const id = parseInt(idMatch[1]);
    currentProduct = {
       id: id,
       price: '',
       tags: [],
       name: '',
       category: 'Kính áp tròng',
       images: [`/images/products/${id}.1.webp`, `/images/products/${id}.2.webp`],
       description: {} // Will store collection, water content, etc.
    };
    continue;
  }
  
  if (!currentProduct) continue;
  
  // Parse fields
  if (line.toLowerCase().startsWith('giá:')) {
    currentProduct.price = line.replace(/giá:/i, '').trim();
  }
  else if (line.toLowerCase().startsWith('tag:')) {
    currentProduct.tags = line.replace(/tag:/i, '').split(',').map(t => t.trim());
  }
  else if (line.toLowerCase().startsWith('tên sản phẩm:')) {
    currentProduct.name = line.replace(/tên sản phẩm:/i, '').trim();
  }
  else if (line.startsWith('MÔ TẢ')) {
    // skip
  }
  else if (line.includes(':')) {
    // Description attributes
    const [key, ...vals] = line.split(':');
    const value = vals.join(':').trim();
    const k = key.trim();
    if (k && value) {
      currentProduct.description[k] = value;
    }
  }
}

if (currentProduct) {
  products.push(currentProduct);
}

// Write to products_data.txt in a nice readable format or JSON
const outputText = JSON.stringify(products, null, 2);
fs.writeFileSync('products_data.txt', outputText);
console.log('Done parsing ' + products.length + ' products.');
