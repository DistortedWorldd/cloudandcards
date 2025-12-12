// Dynamic Product Display with Firebase
class ProductDisplay {
    constructor() {
        this.vapeProducts = [];
        this.tcgProducts = [];
        this.loadProductsFromFirebase();
    }

    async loadProductsFromFirebase() {
        // Wait for Firebase to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Load vapes
            const vapesSnapshot = await db.collection('products').doc('vapes').get();
            if (vapesSnapshot.exists) {
                this.vapeProducts = vapesSnapshot.data().items || this.getDefaultProducts('vapes');
            } else {
                this.vapeProducts = this.getDefaultProducts('vapes');
            }

            // Load TCG cards
            const tcgSnapshot = await db.collection('products').doc('tcg').get();
            if (tcgSnapshot.exists) {
                this.tcgProducts = tcgSnapshot.data().items || this.getDefaultProducts('tcg');
            } else {
                this.tcgProducts = this.getDefaultProducts('tcg');
            }

            // Render based on current page
            const path = window.location.pathname;
            if (path.includes('vapes.html')) {
                this.renderVapes();
            } else if (path.includes('tcg.html')) {
                this.renderTCG();
            }
        } catch (error) {
            console.error('Error loading products from Firebase:', error);
            // Fallback to default products
            this.vapeProducts = this.getDefaultProducts('vapes');
            this.tcgProducts = this.getDefaultProducts('tcg');
            const path = window.location.pathname;
            if (path.includes('vapes.html')) {
                this.renderVapes();
            } else if (path.includes('tcg.html')) {
                this.renderTCG();
            }
        }
    }

    getDefaultProducts(type) {
        if (type === 'vapes') {
            return [
                { id: 1, name: 'CloudStick Pro', price: 34.99, description: 'Premium rechargeable device with long-lasting battery and smooth vapor production.', imageUrl: null },
                { id: 2, name: 'VaporMax Ultra', price: 29.99, description: 'Ultra-portable design with enhanced airflow system for optimal flavor delivery.', imageUrl: null },
                { id: 3, name: 'MistMaster 3000', price: 44.99, description: 'Advanced temperature control with LED display and multiple power settings.', imageUrl: null },
                { id: 4, name: 'AeroFlow Lite', price: 24.99, description: 'Lightweight and discreet with exceptional flavor quality and easy maintenance.', imageUrl: null },
                { id: 5, name: 'CloudChaser Elite', price: 54.99, description: 'Professional-grade device with adjustable wattage and precision coil technology.', imageUrl: null },
                { id: 6, name: 'PureVapor Mini', price: 19.99, description: 'Compact pod system with magnetic connection and leak-resistant design.', imageUrl: null }
            ];
        } else {
            return [
                { id: 1, name: 'Azure Dragon Holographic', price: 89.99, rarity: 'rare', description: 'Legendary holographic card featuring the mythical Azure Dragon. Limited edition with stunning foil finish.', imageUrl: null },
                { id: 2, name: 'Crystal Guardian', price: 24.99, rarity: 'uncommon', description: 'Protective guardian card with crystal armor. Great addition to any defensive strategy deck.', imageUrl: null },
                { id: 3, name: 'Frost Sprite', price: 4.99, rarity: 'common', description: 'Basic frost-element creature card. Perfect for beginner players starting their collection.', imageUrl: null },
                { id: 4, name: 'Storm Elemental Prime', price: 64.99, rarity: 'rare', description: 'Powerful storm elemental with chain lightning ability. Highly sought after by competitive players.', imageUrl: null },
                { id: 5, name: 'Tidal Wave Spell', price: 18.99, rarity: 'uncommon', description: 'Powerful water-based spell card. Deals area damage to multiple targets on the field.', imageUrl: null },
                { id: 6, name: 'Bubble Shield', price: 3.99, rarity: 'common', description: 'Basic defensive card that absorbs incoming damage. Essential for starter decks.', imageUrl: null }
            ];
        }
    }

    generateVapeSVG(index) {
        const gradients = [
            { id: `vapeGrad${index}`, start: '#4A90E2', end: '#2C5AA0' },
            { id: `vapeGrad${index}`, start: '#67B5FF', end: '#4A90E2' },
            { id: `vapeGrad${index}`, start: '#89CFF0', end: '#67B5FF' },
            { id: `vapeGrad${index}`, start: '#5DADE2', end: '#3498DB' },
            { id: `vapeGrad${index}`, start: '#2E86DE', end: '#54A0FF' },
            { id: `vapeGrad${index}`, start: '#74B9FF', end: '#0984E3' }
        ];
        const grad = gradients[index % gradients.length];
        
        return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="70" y="40" width="60" height="120" rx="30" fill="url(#${grad.id})"/>
            <circle cx="100" cy="60" r="8" fill="white" opacity="0.3"/>
            <defs>
                <linearGradient id="${grad.id}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:${grad.start}"/>
                    <stop offset="100%" style="stop-color:${grad.end}"/>
                </linearGradient>
            </defs>
        </svg>`;
    }

    generateTCGSVG(index, rarity) {
        const gradients = [
            { id: `tcgGrad${index}`, start: '#4A90E2', end: '#67B5FF', stroke: '#2C5AA0' },
            { id: `tcgGrad${index}`, start: '#67B5FF', end: '#89CFF0', stroke: '#4A90E2' },
            { id: `tcgGrad${index}`, start: '#89CFF0', end: '#B3E5FC', stroke: '#89CFF0' },
            { id: `tcgGrad${index}`, start: '#2C5AA0', end: '#4A90E2', stroke: '#1E3A5F' },
            { id: `tcgGrad${index}`, start: '#5DADE2', end: '#85C1E9', stroke: '#5DADE2' },
            { id: `tcgGrad${index}`, start: '#AED6F1', end: '#D6EAF8', stroke: '#AED6F1' }
        ];
        const grad = gradients[index % gradients.length];
        const symbols = ['?', '?', '?', '??', '?', '?'];
        const symbol = symbols[index % symbols.length];
        
        return `<svg width="200" height="280" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="180" height="260" rx="10" fill="url(#${grad.id})" stroke="${grad.stroke}" stroke-width="3"/>
            <text x="100" y="140" text-anchor="middle" fill="white" font-size="48" font-weight="bold">${symbol}</text>
            <rect x="20" y="190" width="160" height="60" rx="5" fill="rgba(255,255,255,0.9)"/>
            <text x="100" y="220" text-anchor="middle" fill="${grad.stroke}" font-size="16" font-weight="bold">${rarity.toUpperCase()}</text>
            <defs>
                <linearGradient id="${grad.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${grad.start}"/>
                    <stop offset="100%" style="stop-color:${grad.end}"/>
                </linearGradient>
            </defs>
        </svg>`;
    }

    renderVapes() {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        container.innerHTML = this.vapeProducts.map((product, index) => `
            <div class="product-card">
                <div class="product-image">
                    ${product.imageUrl ? 
                        `<img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; max-height: 200px; object-fit: contain;">` : 
                        this.generateVapeSVG(index)
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">£${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary add-to-cart" 
                            data-name="${product.name}" 
                            data-price="${product.price}" 
                            data-type="vape">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

        this.initCartButtons();
    }

    renderTCG() {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        container.innerHTML = this.tcgProducts.map((product, index) => `
            <div class="product-card">
                <div class="product-image tcg-card">
                    ${product.imageUrl ? 
                        `<img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; max-height: 280px; object-fit: contain;">` : 
                        this.generateTCGSVG(index, product.rarity)
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="rarity-badge ${product.rarity}">${product.rarity.charAt(0).toUpperCase() + product.rarity.slice(1)}</span>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">£${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary add-to-cart" 
                            data-name="${product.name}" 
                            data-price="${product.price}" 
                            data-type="tcg">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

        this.initCartButtons();
    }

    initCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                const price = e.target.dataset.price;
                const type = e.target.dataset.type;
                
                if (window.cart) {
                    window.cart.addItem(name, price, type);
                }
            });
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new ProductDisplay();
});
