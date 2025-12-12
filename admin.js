// Admin Panel Management with Firebase
const ADMIN_PASSWORD = 'admin123'; // Change this password

class AdminPanel {
    constructor() {
        this.isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        this.vapeProducts = [];
        this.tcgProducts = [];
        this.setupEventListeners();
        
        if (this.isLoggedIn) {
            this.showAdminPanel();
            this.waitForFirebaseAndLoad();
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin();
                return false;
            };
        }

        const vapeForm = document.getElementById('addVapeForm');
        if (vapeForm) {
            vapeForm.onsubmit = (e) => {
                e.preventDefault();
                this.addVapeProduct();
                return false;
            };
        }

        const tcgForm = document.getElementById('addTCGForm');
        if (tcgForm) {
            tcgForm.onsubmit = (e) => {
                e.preventDefault();
                this.addTCGProduct();
                return false;
            };
        }
    }

    handleLogin() {
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            this.isLoggedIn = true;
            this.showAdminPanel();
            this.waitForFirebaseAndLoad();
        } else {
            errorDiv.textContent = 'Incorrect password';
            errorDiv.classList.remove('hidden');
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 3000);
        }
    }

    showLogin() {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
    }

    showAdminPanel() {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
    }

    waitForFirebaseAndLoad() {
        if (typeof db !== 'undefined' && db) {
            this.loadProductsFromFirebase();
        } else {
            setTimeout(() => this.waitForFirebaseAndLoad(), 500);
        }
    }

    async loadProductsFromFirebase() {
        try {
            const vapesSnapshot = await db.collection('products').doc('vapes').get();
            if (vapesSnapshot.exists) {
                this.vapeProducts = vapesSnapshot.data().items || [];
            }

            const tcgSnapshot = await db.collection('products').doc('tcg').get();
            if (tcgSnapshot.exists) {
                this.tcgProducts = tcgSnapshot.data().items || [];
            }

            this.displayProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showSuccess('Error loading products: ' + error.message);
        }
    }

    async saveProductsToFirebase(type, products) {
        try {
            await db.collection('products').doc(type).set({ items: products });
            console.log(`${type} saved to Firebase`);
        } catch (error) {
            console.error('Error saving products:', error);
            this.showSuccess('Error saving: ' + error.message);
        }
    }

    async addVapeProduct() {
        const name = document.getElementById('vapeName').value;
        const price = parseFloat(document.getElementById('vapePrice').value);
        const description = document.getElementById('vapeDescription').value;
        const imageUrl = document.getElementById('vapeImage').value;

        const newProduct = {
            id: Date.now(),
            name: name,
            price: price,
            description: description,
            imageUrl: imageUrl || null
        };

        this.vapeProducts.push(newProduct);
        await this.saveProductsToFirebase('vapes', this.vapeProducts);
        this.displayProducts();
        this.showSuccess('Vape product added successfully!');
        document.getElementById('addVapeForm').reset();
    }

    async addTCGProduct() {
        const name = document.getElementById('tcgName').value;
        const price = parseFloat(document.getElementById('tcgPrice').value);
        const rarity = document.getElementById('tcgRarity').value;
        const description = document.getElementById('tcgDescription').value;
        const imageUrl = document.getElementById('tcgImage').value;

        const newProduct = {
            id: Date.now(),
            name: name,
            price: price,
            rarity: rarity,
            description: description,
            imageUrl: imageUrl || null
        };

        this.tcgProducts.push(newProduct);
        await this.saveProductsToFirebase('tcg', this.tcgProducts);
        this.displayProducts();
        this.showSuccess('TCG card added successfully!');
        document.getElementById('addTCGForm').reset();
    }

    async deleteProduct(type, id) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        if (type === 'vapes') {
            this.vapeProducts = this.vapeProducts.filter(p => p.id !== id);
            await this.saveProductsToFirebase('vapes', this.vapeProducts);
        } else {
            this.tcgProducts = this.tcgProducts.filter(p => p.id !== id);
            await this.saveProductsToFirebase('tcg', this.tcgProducts);
        }

        this.displayProducts();
        this.showSuccess('Product deleted successfully!');
    }

    displayProducts() {
        const vapesList = document.getElementById('vapesList');
        if (vapesList) {
            vapesList.innerHTML = this.vapeProducts.map(product => `
                <div class="product-item">
                    <div class="product-item-info">
                        <h4>${product.name}</h4>
                        <p><strong>Price:</strong> £${product.price.toFixed(2)}</p>
                        ${product.imageUrl ? `<p><strong>Image:</strong> <a href="${product.imageUrl}" target="_blank">View</a></p>` : ''}
                        <p>${product.description}</p>
                    </div>
                    <div class="product-item-actions">
                        <button class="delete-btn" onclick="admin.deleteProduct('vapes', ${product.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        const tcgList = document.getElementById('tcgList');
        if (tcgList) {
            tcgList.innerHTML = this.tcgProducts.map(product => `
                <div class="product-item">
                    <div class="product-item-info">
                        <h4>${product.name}</h4>
                        <p><strong>Rarity:</strong> ${product.rarity.charAt(0).toUpperCase() + product.rarity.slice(1)} | <strong>Price:</strong> £${product.price.toFixed(2)}</p>
                        ${product.imageUrl ? `<p><strong>Image:</strong> <a href="${product.imageUrl}" target="_blank">View</a></p>` : ''}
                        <p>${product.description}</p>
                    </div>
                    <div class="product-item-actions">
                        <button class="delete-btn" onclick="admin.deleteProduct('tcg', ${product.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 3000);
    }
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
}

let admin;
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new AdminPanel();
});
