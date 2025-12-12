# Cloud & Cards

A modern, responsive e-commerce website for premium vapes and trading card collectibles.

## Features

- 🎨 Clean, modern design with blue gradient theme
- 📱 Fully responsive (mobile, tablet, desktop)
- 🛒 Shopping cart with localStorage persistence
- 💳 Demo checkout functionality
- 🎴 6 sample vape products + 6 TCG card products
- ⚡ Fast, static HTML/CSS/JS (no build process needed)

## Pages

1. **Home Page** (`index.html`) - Hero section with navigation to product pages
2. **Vapes Page** (`vapes.html`) - Grid of 6 vape products
3. **TCG Cards Page** (`tcg.html`) - Grid of 6 trading card products
4. **Admin Panel** (`admin.html`) - Password-protected product management

## Technologies Used

- HTML5
- CSS3 (with CSS Grid & Flexbox)
- Vanilla JavaScript (ES6+)
- Google Fonts (Poppins)
- SVG graphics for product placeholders

## Deployment to Netlify

### Option 1: Drag & Drop
1. Zip all files in this folder
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the zip file onto Netlify's deployment zone

### Option 2: Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Navigate to project folder
cd cloud-and-cards

# Deploy
netlify deploy --prod
```

### Option 3: Git Integration
1. Push this folder to a GitHub/GitLab repository
2. Connect the repository to Netlify
3. Netlify will auto-deploy on every commit

## File Structure

```
cloud-and-cards/
├── index.html          # Home page
├── vapes.html          # Vapes product page
├── tcg.html            # TCG cards product page
├── admin.html          # Admin panel
├── admin.js            # Admin logic
├── style.css           # All styles
├── script.js           # Shopping cart logic
├── logo.png            # Site logo (add your own)
├── README.md           # This file
└── netlify.toml        # Netlify configuration
```

## Shopping Cart Features

- Add products to cart
- View cart contents in modal
- Remove items from cart
- Persistent storage using localStorage
- Cart count badge in navigation
- Total price calculation
- Smooth animations and notifications

## Admin Panel

**Access:** Go to `yourdomain.com/admin.html`

**Default Password:** `admin123` (change this in `admin.js` line 2)

**Features:**
- Add new vape products with name, price, and description
- Add new TCG cards with name, price, rarity, and description
- Delete existing products
- Products persist in localStorage
- Separate tabs for vapes and TCG cards
- Session-based login (logout when done)

**Important:** Change the default password in `admin.js` before deploying:
```javascript
const ADMIN_PASSWORD = 'your-secure-password';
```

## Color Palette

- Primary Blue: `#4A90E2`
- Secondary Blue: `#67B5FF`
- Dark Blue: `#2C5AA0`
- Light Blue: `#89CFF0`
- Background: `#F5F9FC`
- White: `#FFFFFF`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This is a demo project. All product names are fictional and for demonstration purposes only.

## Contact

For questions or customization, visit the footer contact section.


## Firebase Integration

This site now supports Firebase for shared products across all users!

See FIREBASE-SETUP.md for setup instructions.

Once Firebase is configured, products added in admin will be visible to everyone.

