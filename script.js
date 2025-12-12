// Shopping Cart Management with localStorage
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('cloudAndCardsCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cloudAndCardsCart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(name, price, type) {
        const existingItem = this.items.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name: name,
                price: parseFloat(price),
                type: type,
                quantity: 1,
                id: Date.now()
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`£{name} added to cart!`);
    }

    // Remove item from cart
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartDisplay();
    }

    // Get total price
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Get total items count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Update cart count badge
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    }

    // Update cart display in modal
    updateCartDisplay() {
        this.updateCartCount();
        
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItemsContainer || !cartTotal) return;

        // Clear current display
        cartItemsContainer.innerHTML = '';

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotal.textContent = '0.00';
            return;
        }

        // Display each item
        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>£{item.name}</h4>
                    <p>£{item.type === 'vape' ? 'Vape Product' : 'TCG Card'} - Quantity: £{item.quantity}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span class="cart-item-price">££{(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item" data-id="£{item.id}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Update total
        cartTotal.textContent = this.getTotal().toFixed(2);

        // Add remove button listeners
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.removeItem(id);
            });
        });
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #4A90E2, #67B5FF);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;
        notification.textContent = message;

        // Add slide in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Initialize event listeners
    init() {
        // Update cart count on page load
        this.updateCartCount();

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                const price = e.target.dataset.price;
                const type = e.target.dataset.type;
                this.addItem(name, price, type);
            });
        });

        // Cart modal
        const modal = document.getElementById('cartModal');
        const cartBtn = document.getElementById('cartBtn');
        const closeBtn = document.querySelector('.close');

        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'block';
                this.updateCartDisplay();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Checkout button (demo only)
        const checkoutBtn = modal?.querySelector('.btn-primary');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length > 0) {
                    alert('This is a demo checkout. In a real application, this would process your payment.\n\nTotal: £' + this.getTotal().toFixed(2));
                } else {
                    alert('Your cart is empty!');
                }
            });
        }
    }
}

// Initialize cart when DOM is loaded
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
    window.cart = cart; // Make cart accessible globally
});


