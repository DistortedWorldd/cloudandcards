// Products Display with Supabase
class ProductsDisplay {
    constructor(type) {
        this.type = type;
        this.products = [];
        this.init();
    }

    async init() {
        await this.waitForSupabase();
        await this.loadProducts();
        this.displayProducts();
    }

    async waitForSupabase() {
        while (typeof supabase === 'undefined' || !supabase) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async loadProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('type', this.type);
            
            if (error) throw error;
            this.products = data || [];
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }

    displayProducts() {
        const container = document.getElementById('products-grid');
        if (!container) return;

        if (this.products.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No products available yet.</p>';
            return;
        }

        container.innerHTML = this.products.map(product => {
            if (this.type === 'vapes') {
                return this.createVapeCard(product);
            } else {
                return this.createTCGCard(product);
            }
        }).join('');
    }

    createVapeCard(product) {
        const imageHTML = product.image_url 
            ? `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 15px 15px 0 0;">`
            : `<svg viewBox="0 0 100 100" style="width: 100%; height: 200px; background: var(--bg-light); border-radius: 15px 15px 0 0;">
                <rect width="100" height="100" fill="#E8F4FD"/>
                <circle cx="50" cy="50" r="20" fill="#4A90E2" opacity="0.3"/>
                <text x="50" y="55" text-anchor="middle" fill="#4A90E2" font-size="12" font-family="Arial">Vape</text>
               </svg>`;

        return `
            <div class="product-card">
                ${imageHTML}
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">£${product.price.toFixed(2)}</div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, 'vape')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    createTCGCard(product) {
        const imageHTML = product.image_url 
            ? `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 15px 15px 0 0;">`
            : `<svg viewBox="0 0 100 140" style="width: 100%; height: 250px; background: var(--bg-light); border-radius: 15px 15px 0 0;">
                <rect width="100" height="140" fill="#E8F4FD"/>
                <rect x="10" y="20" width="80" height="100" rx="5" fill="white" stroke="#4A90E2" stroke-width="2"/>
                <circle cx="50" cy="70" r="15" fill="#4A90E2" opacity="0.3"/>
                <text x="50" y="75" text-anchor="middle" fill="#4A90E2" font-size="10" font-family="Arial">TCG</text>
               </svg>`;

        return `
            <div class="product-card">
                ${imageHTML}
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">£${product.price.toFixed(2)}</div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, 'tcg')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.body.getAttribute('data-product-type');
    if (pageType) {
        new ProductsDisplay(pageType);
    }
});
