// Admin Panel Management with Supabase
const ADMIN_PASSWORD = 'admin123';

class AdminPanel {
    constructor() {
        this.isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        this.vapeProducts = [];
        this.tcgProducts = [];
        this.setupEventListeners();
        
        if (this.isLoggedIn) {
            this.showAdminPanel();
            this.waitForSupabaseAndLoad();
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
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
            this.waitForSupabaseAndLoad();
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

    waitForSupabaseAndLoad() {
        if (typeof supabase !== 'undefined' && supabase) {
            this.loadProductsFromSupabase();
        } else {
            setTimeout(() => this.waitForSupabaseAndLoad(), 500);
        }
    }

    async loadProductsFromSupabase() {
        try {
            const { data: vapes, error: vapesError } = await supabase
                .from('products')
                .select('*')
                .eq('type', 'vapes');
            
            if (vapesError) throw vapesError;
            this.vapeProducts = vapes || [];

            const { data: tcg, error: tcgError } = await supabase
                .from('products')
                .select('*')
                .eq('type', 'tcg');
            
            if (tcgError) throw tcgError;
            this.tcgProducts = tcg || [];

            this.displayProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showSuccess('Error loading products: ' + error.message);
        }
    }

    async addVapeProduct() {
        const name = document.getElementById('vapeName').value;
        const price = parseFloat(document.getElementById('vapePrice').value);
        const description = document.getElementById('vapeDescription').value;
        const imageUrl = document.getElementById('vapeImage').value;

        const newProduct = {
            type: 'vapes',
            name: name,
            price: price,
            description: description,
            image_url: imageUrl || null
        };

        try {
            const { data, error } = await supabase
                .from('products')
                .insert([newProduct])
                .select();
            
            if (error) throw error;

            await this.loadProductsFromSupabase();
            this.showSuccess('Vape product added successfully!');
            document.getElementById('addVapeForm').reset();
        } catch (error) {
            console.error('Error adding product:', error);
            this.showSuccess('Error: ' + error.message);
        }
    }

    async addTCGProduct() {
        const name = document.getElementById('tcgName').value;
        const price = parseFloat(document.getElementById('tcgPrice').value);
        const description = document.getElementById('tcgDescription').value;
        const imageUrl = document.getElementById('tcgImage').value;

        const newProduct = {
            type: 'tcg',
            name: name,
            price: price,
            description: description,
            image_url: imageUrl || null
        };

        try {
            const { data, error } = await supabase
                .from('products')
                .insert([newProduct])
                .select();
            
            if (error) throw error;

            await this.loadProductsFromSupabase();
            this.showSuccess('TCG card added successfully!');
            document.getElementById('addTCGForm').reset();
        } catch (error) {
            console.error('Error adding product:', error);
            this.showSuccess('Error: ' + error.message);
        }
    }

    async deleteProduct(type, id) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            
            if (error) throw error;

            await this.loadProductsFromSupabase();
            this.showSuccess('Product deleted successfully!');
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showSuccess('Error: ' + error.message);
        }
    }

    displayProducts() {
        const vapesList = document.getElementById('vapesList');
        if (vapesList) {
            vapesList.innerHTML = this.vapeProducts.map(product => `
                <div class="product-item">
                    <div class="product-item-info">
                        <h4>${product.name}</h4>
                        <p><strong>Price:</strong> £${product.price.toFixed(2)}</p>
                        ${product.image_url ? `<p><strong>Image:</strong> <a href="${product.image_url}" target="_blank">View</a></p>` : ''}
                        <p>${product.description}</p>
                    </div>
                    <div class="product-item-actions">
                        <button class="delete-btn" onclick="window.admin.deleteProduct('vapes', ${product.id})">Delete</button>
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
                        <p><strong>Price:</strong> £${product.price.toFixed(2)}</p>
                        ${product.image_url ? `<p><strong>Image:</strong> <a href="${product.image_url}" target="_blank">View</a></p>` : ''}
                        <p>${product.description}</p>
                    </div>
                    <div class="product-item-actions">
                        <button class="delete-btn" onclick="window.admin.deleteProduct('tcg', ${product.id})">Delete</button>
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

document.addEventListener('DOMContentLoaded', () => {
    window.admin = new AdminPanel();
});
