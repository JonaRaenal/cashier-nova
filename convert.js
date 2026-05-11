const fs = require('fs');

let html = fs.readFileSync('c:/Users/nagam/Documents/GitHub/cashier-nova/frontend/src/pages/LandingTemplate.jsx', 'utf8');

// remove wrapper stuff from LandingTemplate since we will wrap it manually
html = html.split('<>')[1].split('</>')[0];

const topPart = html.split('<div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">')[0];
let bottomPart = html.split('</div>\n        \n        <div className="row">')[2] || html.split('</div>\r\n        \r\n        <div className="row">')[2];

if (!bottomPart) {
    // If we can't split correctly, find the end of the product grid manually
    const parts = html.split('<div className="product-grid');
    bottomPart = '</div>' + parts[1].split('</section>')[1] + '</section>' + parts.slice(2).join('');
}

// Modify the cart offcanvas in the topPart
let modifiedTop = topPart.replace(
  '<span className="badge bg-primary rounded-pill">3</span>',
  '<span className="badge bg-primary rounded-pill">{getCartCount()}</span>'
).replace(
  /<ul className="list-group mb-3">[\s\S]*?<\/ul>/,
  `<ul className="list-group mb-3">
    {cartItems.map(item => (
      <li className="list-group-item d-flex justify-content-between lh-sm" key={item.id}>
        <div>
          <h6 className="my-0">{item.name}</h6>
          <small className="text-body-secondary">{item.quantity} x {formatCurrency(item.price)}</small>
          <div className="mt-2">
             <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn btn-sm btn-outline-secondary me-1">-</button>
             <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn btn-sm btn-outline-secondary me-1">+</button>
             <button onClick={() => removeItem(item.id)} className="btn btn-sm btn-danger">X</button>
          </div>
        </div>
        <span className="text-body-secondary">{formatCurrency(item.price * item.quantity)}</span>
      </li>
    ))}
    <li className="list-group-item d-flex justify-content-between">
      <span>Total</span>
      <strong>{formatCurrency(getCartTotal())}</strong>
    </li>
  </ul>`
).replace(
  '<button className="w-100 btn btn-primary btn-lg" type="submit">Continue to checkout</button>',
  '<button className="w-100 btn btn-primary btn-lg" type="button" onClick={handleCheckout}>Checkout via WhatsApp</button>'
);

const newComponent = `import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useCartStore from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const getCartCount = useCartStore((state) => state.getCartCount);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Load CSS
    const cssPaths = [
      'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css',
      '/css/vendor.css',
      '/style.css'
    ];
    const links = cssPaths.map(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    // Load JS sequentially
    const jsPaths = [
      '/js/jquery-1.11.0.min.js',
      'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js',
      '/js/plugins.js',
      '/js/script.js'
    ];
    
    let loadedScripts = [];
    const loadScripts = async () => {
      for (const src of jsPaths) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          document.body.appendChild(script);
          loadedScripts.push(script);
        });
      }
    };
    loadScripts();

    return () => {
      links.forEach(l => document.head.removeChild(l));
      loadedScripts.forEach(s => document.body.removeChild(s));
    };
  }, []);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    let message = 'Halo, saya ingin memesan:\\n\\n';
    cartItems.forEach((item, index) => {
      message += \`\${index + 1}. \${item.name} (\${item.quantity}x) - \${formatCurrency(item.price * item.quantity)}\\n\`;
    });
    message += \`\\nTotal Belanja: *\${formatCurrency(getCartTotal())}*\\n\\nMohon informasi pembayarannya.\`;
    window.open(\`https://wa.me/6281234567890?text=\${encodeURIComponent(message)}\`, '_blank');
  };

  return (
    <>
${modifiedTop}
<div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">
  {loading ? (
    <div className="col-12 text-center py-5">Loading products...</div>
  ) : products.map(product => (
    <div className="col" key={product.id}>
      <div className="product-item">
        <figure>
          <a href="#" title={product.name}>
            <img src={product.image_url || 'images/product-thumb-1.png'} alt={product.name} className="tab-image" style={{height: '200px', objectFit: 'contain'}} />
          </a>
        </figure>
        <div className="d-flex flex-column text-center">
          <h3 className="fs-6 fw-normal" style={{minHeight: '40px'}}>{product.name}</h3>
          <div>
            <span className="rating">
              <svg width="18" height="18" className="text-warning"><use href="#star-full"></use></svg>
              <svg width="18" height="18" className="text-warning"><use href="#star-full"></use></svg>
              <svg width="18" height="18" className="text-warning"><use href="#star-full"></use></svg>
              <svg width="18" height="18" className="text-warning"><use href="#star-full"></use></svg>
              <svg width="18" height="18" className="text-warning"><use href="#star-half"></use></svg>
            </span>
            <span>({product.stock} left)</span>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <span className="text-dark fw-semibold">{formatCurrency(product.price)}</span>
          </div>
          <div className="button-area p-3 pt-0">
            <div className="row g-1 mt-2">
              <div className="col-12">
                <button onClick={(e) => { e.preventDefault(); addItem(product); }} disabled={product.stock <= 0} className="btn btn-primary rounded-1 p-2 fs-7 btn-cart w-100">
                  <svg width="18" height="18"><use href="#cart"></use></svg> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
${bottomPart}
    </>
  );
};

export default LandingPage;
`;

fs.writeFileSync('c:/Users/nagam/Documents/GitHub/cashier-nova/frontend/src/pages/LandingPage.jsx', newComponent);
console.log('Successfully injected react logic into the template html!');
