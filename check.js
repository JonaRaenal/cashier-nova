const fs = require('fs');
let text = fs.readFileSync('c:/Users/nagam/Documents/GitHub/cashier-nova/frontend/public/home/index.html', 'utf8');

const match = text.match(/<div class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">[\s\S]*?<\/section>/);
console.log('Did it match product grid?', !!match);

const cartMatch = text.match(/<ul class="list-group mb-3">[\s\S]*?Continue to checkout<\/button>/);
console.log('Did it match cart?', !!cartMatch);

const badgeMatch = text.match(/<span class="badge bg-primary rounded-pill">3<\/span>/g);
console.log('Did it match badge?', !!badgeMatch);
