// Sell Form Handler
class SellFormHandler {
    constructor() {
        this.submissions = this.loadSubmissions();
        this.init();
    }

    init() {
        const form = document.getElementById('sellForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        const fileInput = document.getElementById('cardImage');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e);
            });
        }
    }

    handleFileSelect(event) {
        const fileNameSpan = document.getElementById('fileName');
        if (event.target.files.length > 0) {
            fileNameSpan.textContent = event.target.files[0].name;
        } else {
            fileNameSpan.textContent = 'Choose file or drag here';
        }
    }

    handleSubmit() {
        const formData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            sellerName: document.getElementById('sellerName').value,
            sellerEmail: document.getElementById('sellerEmail').value,
            cardName: document.getElementById('cardName').value,
            cardSeries: document.getElementById('cardSeries').value,
            cardCondition: document.getElementById('cardCondition').value,
            cardRarity: document.getElementById('cardRarity').value,
            askingPrice: parseFloat(document.getElementById('askingPrice').value),
            additionalInfo: document.getElementById('additionalInfo').value,
            hasImage: document.getElementById('cardImage').files.length > 0,
            imageName: document.getElementById('cardImage').files.length > 0 ? 
                       document.getElementById('cardImage').files[0].name : null
        };

        this.submissions.push(formData);
        this.saveSubmissions();
        this.showThankYou(formData.sellerEmail);
        document.getElementById('sellForm').reset();
        document.getElementById('fileName').textContent = 'Choose file or drag here';
    }

    showThankYou(email) {
        // Redirect to thank you page with email parameter
        window.location.href = `thank-you.html?email=£{encodeURIComponent(email)}`;
    }

    loadSubmissions() {
        const saved = localStorage.getItem('cloudAndCards_sellSubmissions');
        return saved ? JSON.parse(saved) : [];
    }

    saveSubmissions() {
        localStorage.setItem('cloudAndCards_sellSubmissions', JSON.stringify(this.submissions));
    }
}

function submitAnother() {
    document.getElementById('thankYouSection').classList.add('hidden');
    document.getElementById('formSection').classList.remove('hidden');
    window.scrollTo({ top: document.getElementById('formSection').offsetTop - 100, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    new SellFormHandler();
});

